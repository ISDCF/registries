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

const { basename, join } = require('path')
const { readFile } = require('fs').promises;
const ajv = require('ajv');
const validator_factory = new ajv();

const registries = [
  {
    name: 'facilities',
    dataFile: 'data/facilities.json',
    schemaFile: 'schemas/facilities.schema.json',
    validationFile: 'validate/facilities.validate.js',
  },
  {
    name: 'studios',
    dataFile: 'data/studios.json',
    schemaFile: 'schemas/studios.schema.json',
    validationFile: 'validate/studios.validate.js',
  },
  {
    name: 'languages',
    dataFile: 'data/languages.json',
    schemaFile: 'schemas/languages.schema.json',
    validationFile: 'validate/languages.validate.js',
  },
]

module.exports.registries = async function () {

  return await registries.reduce(async (aProm, { name, dataFile, schemaFile, validationFile }) => {
    const a = await aProm
    const schema = JSON.parse(await readFile(join(__dirname, schemaFile)))
    const schemaVersion = basename(schema.$id)
    const schemaValidate = validator_factory.compile(schema)
    const data = JSON.parse(await readFile(join(__dirname, dataFile)))
    const additionalChecks = validationFile ? require(join(__dirname, validationFile)) : () => {}

    const validate = (registry = data) => {
      /* first check schema */
      if (!schemaValidate(registry))
        throw `${name} registry fails schema validation`

      /* then invoke any additional checks not covered by JSON schema: */
      additionalChecks(registry, name)
    }

    return { ...a, [name]: { schemaVersion, validate, data, name }}
  }, {})
}
