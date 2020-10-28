const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("contenttypes schema", () => {
  before(async () => { ({ contenttypes: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "code": "EPS",
        "contentKind": {
          "value": "episode",
          "scope": "http://www.smpte-ra.org/schemas/2067-3/2013#content-kind",
          "definingDoc": "SMPTE ST 2067-3"
        },
        "description": "Part of a dramatic work such as a serial television program."
      },
      {
        "code": "FTR",
        "contentKind": {
          "value": "feature",
          "scope": "http://www.smpte-ra.org/schemas/429-7/2006/CPL#standard-content",
          "definingDoc": "SMPTE ST 429-7"
        },
        "description": "A theatrical feature."
      }
    ]))
  })

  it("invalid", () => {
    assert.throw(() => validate([
      "foo"
    ]), /fails schema/)
  })

})
