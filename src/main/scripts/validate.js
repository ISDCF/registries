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
const ajv = require('ajv');

const DATA_PATH = "src/main/data/facilities.json";
const DATA_SCHEMA_PATH = "src/main/schemas/facilities.schema.json";

/* load and validate the registry */

let registry = JSON.parse(
  fs.readFileSync(
    DATA_PATH
  )
);

if (!registry) {
  throw "Cannot load registry";
}

var validator_factory = new ajv();

let validator = validator_factory.compile(
  JSON.parse(
    fs.readFileSync(
      DATA_SCHEMA_PATH
    )
  )
);

if (! validator(registry)) {
  console.log(validator.errors);
  throw "Registry fails validation";
};

/* is the registry sorted */

for(let i = 1; i < registry.length; i++) {
  if (registry[i-1].code >= registry[i].code) {
    throw "Registry key " + registry[i-1].code + " is " +
      ((registry[i-1].code === registry[i].code) ? "duplicated" : "not sorted");
  }
}

