const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("contentmodifiers schema", () => {
  before(async () => { ({ contentmodifiers: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "cplMetadata": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-16:2014",
              "url": "https://doi.org/10.5594/SMPTE.ST429-16.2014"
            }
          ],
          "element": "VersionNumber",
          "elementValue": "[VersionNumber]",
          "metaType": "Element Value",
          "scope": "http://www.smpte-ra.org/schemas/429-16/2014/CPL-Metadata"
        },
        "dcncCode": "[VersionNumber]",
        "dcncSortOrder": 1,
        "description": "Indicates the version number of the Composition.",
        "variableValue": true
      },
      {
        "cplMetadata": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-10:2008",
              "url": "https://doi.org/10.5594/SMPTE.ST429-10.2008"
            }
          ],
          "element": "MainStereoscopicPicture",
          "metaType": "Element Present",
          "scope": "http://www.smpte-ra.org/schemas/429-10/2008/Main-Stereo-Picture-CPL"
        },
        "dcncCode": "3D",
        "dcncSortOrder": 9,
        "description": "If the product is 3D."
      }
    ]))
  })

  it("missing metadata", () => {
    assert.throw(() => validate([
      {
        "dcncCode": "3D",
        "description": "If the product is 3D."
      }
    ]), /fails schema/)
  })

  it("missing sort order", () => {
    assert.throw(() => validate([
      {
        "cplMetadata": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-16:2014",
              "url": "https://doi.org/10.5594/SMPTE.ST429-16.2014"
            }
          ],
          "element": "VersionNumber",
          "elementValue": "[VersionNumber]",
          "metaType": "Element Value",
          "scope": "http://www.smpte-ra.org/schemas/429-16/2014/CPL-Metadata"
        },
        "dcncCode": "[VersionNumber]",
        "description": "Indicates the version number of the Composition.",
        "variableValue": true
      }
    ]), /fails schema/)
  })

  it("sort order not an integer", () => {
    assert.throw(() => validate([
      {
        "cplMetadata": {
          "definingDocs": [
            {
              "name": "SMPTE ST 429-16:2014",
              "url": "https://doi.org/10.5594/SMPTE.ST429-16.2014"
            }
          ],
          "element": "VersionNumber",
          "elementValue": "[VersionNumber]",
          "metaType": "Element Value",
          "scope": "http://www.smpte-ra.org/schemas/429-16/2014/CPL-Metadata"
        },
        "dcncCode": "[VersionNumber]",
        "dcncSortOrder": "2.5",
        "description": "Indicates the version number of the Composition.",
        "variableValue": true
      }
    ]), /fails schema/)
  })

})
