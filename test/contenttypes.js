const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("contenttypes schema", () => {
  before(async () => { ({ contenttypes: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "dcncCode": "FTR",
        "dcncSortOrder": 1,
        "cplContentKind": {
          "value": "feature",
          "scope": "http://www.smpte-ra.org/schemas/429-7/2006/CPL#standard-content",
          "definingDocs": [
            {
              "name": "SMPTE ST 429-7:2006",
              "url": "https://doi.org/10.5594/SMPTE.ST429-7.2006"
            }
          ]
        },
        "description": "A theatrical feature."
      },
      {
        "dcncCode": "EPS",
        "dcncSortOrder": 13,
        "cplContentKind": {
          "value": "episode",
          "scope": "http://www.smpte-ra.org/schemas/2067-3/2013#content-kind",
          "definingDocs": [
            {
              "name": "SMPTE ST 2067-3:2013",
              "url": "https://doi.org/10.5594/SMPTE.ST2067-3.2013"
            }
          ]
        },
        "description": "Part of a dramatic work such as a serial television program."
      }
    ]))
  })

  it("missing scope", () => {
    assert.throw(() => validate([
      {
        "dcncCode": "FTR",
        "cplContentKind": {
          "value": "feature",
          "definingDocs": [
            {
              "name": "SMPTE ST 429-7:2006",
              "url": "https://doi.org/10.5594/SMPTE.ST429-7.2006"
            }
          ]
        },
        "description": "A theatrical feature."
      }
    ]), /fails schema/)
  })

  it("missing sort order", () => {
    assert.throw(() => validate([
      {
        "cplContentKind": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-7:2006",
              "url": "https://doi.org/10.5594/SMPTE.ST429-7.2006"
            }
          ],
          "scope": "http://www.smpte-ra.org/schemas/429-7/2006/CPL#standard-content",
          "value": "trailer"
        },
        "dcncCode": "TLR",
        "description": "Short (2 to 3 minutes) content promoting an upcoming theatrical feature."
      }
    ]), /fails schema/)
  })

  it("sort order not an integer", () => {
    assert.throw(() => validate([
      {
        "cplContentKind": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-7:2006",
              "url": "https://doi.org/10.5594/SMPTE.ST429-7.2006"
            }
          ],
          "scope": "http://www.smpte-ra.org/schemas/429-7/2006/CPL#standard-content",
          "value": "trailer"
        },
        "dcncCode": "TLR",
        "dcncSortOrder": "2.4",
        "description": "Short (2 to 3 minutes) content promoting an upcoming theatrical feature."
      }
    ]), /fails schema/)
  })

})
