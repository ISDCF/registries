const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("cplmetadataexts schema", () => {
  before(async () => { ({ cplmetadataexts: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "definingDoc": "https://ieeexplore.ieee.org/document/9161348",
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

  it("missing extension required field", () => {
    assert.throw(() => validate([
      {
        "definingDoc": "https://ieeexplore.ieee.org/document/9161348",
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
