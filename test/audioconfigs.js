const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("audioconfigs schema", () => {
  before(async () => { ({ audioconfigs: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "cplMetadata": {
          "MCATagSymbol": "sg51",
          "MainSoundConfigurationTag": "51",
          "definingDoc": [
            {
              "name": "SMPTE ST 429-16:2014",
              "url": "https://doi.org/10.5594/SMPTE.ST429-16.2014"
            },
            {
              "name": "SMPTE ST 429-2:2019",
              "url": "https://doi.org/10.5594/SMPTE.ST429-2.2019"
            },
            {
              "name": "SMPTE ST 428-12:2013",
              "url": "https://doi.org/10.5594/SMPTE.ST428-12.2013"
            }
          ]
        },
        "dcncCode": "51",
        "dcncSortOrder": 1,
        "description": "5.1"
      },
      {
        "cplMetadata": {
          "definingDoc": [
            {
              "name": "ISDCF Doc 15",
              "url": "https://isdcf.com/papers/ISDCF-Doc15-IAB-Profile-1-202006012.pdf"
            }
          ],
          "extension": {
            "extName": "Application",
            "extScope": "http://isdcf.com/ns/cplmd/app",
            "extpropName": "IAB Profile",
            "extpropValue": "SMPTE-ST-2098-2:2019-P1"
          }
        },
        "dcncCode": "IAB",
        "dcncSortOrder": 7,
        "description": "Immesive Audio Bitstream (SMPTE ST2098-2) Profile 1"
      }
    ]))
  })

  it("missing metadata definingDoc", () => {
    assert.throw(() => validate([
      {
        "cplMetadata": {
          "MCATagSymbol": "sgHI",
          "MainSoundConfigurationTag": "HI"
        },
        "dcncCode": "HI",
        "dcncSortOrder": 8,
        "description": "Assisted Listening Track"
      }
    ]), /fails schema/)
  })

  it("missing extension required field", () => {
    assert.throw(() => validate([
      {
        "cplMetadata": {
          "MCATagSymbol": "DBOX",
          "MainSoundConfigurationTag": "DBOX",
          "definingDoc": [
            {
              "name": "DBOX Technical Note 124-915-0005-A02",
              "url": "https://www.d-box.com/wp-content/uploads/2020/09/124-915-0005.pdf"
            }
          ],
          "extension": {
            "extName": "D-BOX Enabled",
            "extpropName": "D-BOX Motion Code Primary Stream",
            "extpropValue": "true"
          }
        },
        "dcncCode": "DBox",
        "dcncSortOrder": 14,
        "description": "DBox Motion Control"
      }
    ]), /fails schema/)
  })

  it("missing sort order", () => {
    assert.throw(() => validate([
      {
        "dcncCode": "Atmos",
        "description": "Dolby ATMOS Immersive Audio",
        "note": "Expect a change in the way Atmos content is labeled! IAB (Immersive Audio Bitstream) is the SMPTE standard for Immersive Audio. All Atmos is IAB Profile 1. Many authoring companies are planning to stop labeling Atmos and using the IAB label only."
      }
    ]), /fails schema/)
  })

  it("sort order not an integer", () => {
    assert.throw(() => validate([
      {
        "dcncCode": "Atmos",
        "dcncSortOrder": "11.5",
        "description": "Dolby ATMOS Immersive Audio",
        "note": "Expect a change in the way Atmos content is labeled! IAB (Immersive Audio Bitstream) is the SMPTE standard for Immersive Audio. All Atmos is IAB Profile 1. Many authoring companies are planning to stop labeling Atmos and using the IAB label only."
      }
    ]), /fails schema/)
  })

})
