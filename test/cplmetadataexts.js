const { registries } = require("..")
const assert = require('assert');

describe("cplmetadataexts schema", async () => {
  before(async () => { ({ cplmetadataexts: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "definingDocs": [
          {
            "name": "SMPTE RDD 52",
            "url": "https://ieeexplore.ieee.org/document/9161348"
          }
        ],
        "extension": {
          "extName": "Application",
          "extScope": "http://isdcf.com/ns/cplmd/app",
          "extpropName": "DCP Constraints Profile",
          "extpropValue": "SMPTE-RDD-52:2020-Bv2.1"
        },
        "description": "SMPTE Bv2.1 DCP (SMPTE RDD52)"
      }
    ]))
  })

  it("missing extension required field", async () => {
    await assert.rejects(validate([
      {
       "definingDocs": [
          {
            "name": "SMPTE RDD 52",
            "url": "https://ieeexplore.ieee.org/document/9161348"
          }
        ],
        "extension": {
          "extName": "Application",
          "extpropName": "DCP Constraints Profile",
          "extpropValue": "SMPTE-RDD-52:2020-Bv2.1"
        },
        "description": "SMPTE Bv2.1 DCP (SMPTE RDD52)"
      }
    ]), /fails schema/)
  })

})
