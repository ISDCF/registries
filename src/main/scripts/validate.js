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

const path = require('path')
const fs = require('fs');
const ajv = require('ajv');

const DATA_PATH = "src/main/data/";
const DATA_SCHEMA_PATH = "src/main/schemas/%s.schema.json";
const DATA_VALIDATE_PATH = "src/main/scripts/%s.validate.js"; // additional checks

/* load and validate the registry */

var validator_factory = new ajv();

for (const dataFile of fs.readdirSync(DATA_PATH).filter(f => /.json$/.test(f))) {
  console.log(`Checking ${dataFile}`)
  const name = path.basename(dataFile, ".json")
  const registry = JSON.parse(fs.readFileSync(path.join(DATA_PATH, dataFile)))
  const schemaFile = DATA_SCHEMA_PATH.replace("%s", name)
  const validateFile = DATA_VALIDATE_PATH.replace("%s", name)
  const validator = validator_factory.compile(JSON.parse(fs.readFileSync(schemaFile)))

  if (!validator(registry))
    throw `${name} registry fails validation`

  /* perform additional checks if applicable */
  if (fs.statSync(validateFile)) {
    require("./" + path.basename(validateFile))(registry)
  }
}
