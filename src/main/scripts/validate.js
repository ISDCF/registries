/*
Copyright (c), InterSociety Digital Cinema Forum (ISDCF) <info@isdcf.com>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following 
conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following 
disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following 
disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const fs = require('fs');
const { basename, join } = require('path')
const { readFile, access, readdir } = require('fs').promises;
const ajv = require('ajv');

const DATA_PATH = "src/main/data/";
const DATA_SCHEMA_PATH = "src/main/schemas/%s.schema.json";
const DATA_VALIDATE_PATH = "src/main/scripts/%s.validate.js"; // additional checks

/* load and validate the registry */

var validator_factory = new ajv();

async function registries() {
  /* create a mapping of schema/data name to validator */
  return await (await readdir(DATA_PATH)).reduce(async (aProm, dataFile) => {
    const a = await aProm
    const name = basename(dataFile, ".json")
    const schemaFile = DATA_SCHEMA_PATH.replace("%s", name)
    const validateFile = DATA_VALIDATE_PATH.replace("%s", name)
    const schema = JSON.parse(await readFile(schemaFile))
    const schemaVersion = basename(schema.$id)
    const schemaValidate = validator_factory.compile(schema)
    const dataFilePath = join(DATA_PATH, dataFile)
    const data = JSON.parse(await readFile(dataFilePath))

    let additionalChecks = () => {}

    /* perform additional checks if applicable */
    try {
      await access(validateFile, fs.constants.F_OK)
      additionalChecks = require("./" + basename(validateFile))
    }
    catch (e) {
      if (e.code !== "ENOENT")
        throw e
    }

    const validate = (registry = data) => {
      /* first check schema */
      if (!schemaValidate(registry))
        throw `${name} registry fails schema validation`

      /* then invoke any additional checks not covered by JSON schema: */
      additionalChecks(registry, name)
    }

    return { ...a, [name]: { schemaVersion, validate, data, name, dataFilePath }}
  }, {})

}

async function validateAll() {
  Object.values(await registries()).map(({ name, validate }) => {
    console.log(`Checking ${name}`)
    validate()
  })
}

module.exports = {
  registries,
  validateAll,
}

// invoke validateAll() if we're run as a script:
if (require.main === module)
  validateAll().catch(console.error)
