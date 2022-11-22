const { registries } = require("..")
const assert = require('assert');

describe("projectoraspectratios schema", async () => {
  before(async () => { ({ projectoraspectratios: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Height": 1080,
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          },
          "definingDocs": [
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
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]))
  })

  it("ScreenAspectRatio not a ratio", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "definingDocs": [
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
          ],
          "2K": {
            "MainPictureStoredArea": {
              "Height": 1080,
              "Width": 1998
            },
            "ScreenAspectRatio": "1998x1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          }
        },
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("missing metadata definingDoc", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Height": 1080,
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          }
        },
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("missing height in 2K", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          },
          "definingDocs": [
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
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("2K height not an integer", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Height": "1080",
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          },
          "definingDocs": [
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
        "dcncCode": "F",
        "dcncSortOrder": "1.5",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("missing sort order", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Height": 1080,
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          },
          "definingDocs": [
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
        "dcncCode": "F",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("sort order not an integer", async () => {
    await assert.rejects(validate([
      {
        "cplMetadata": {
          "2K": {
            "MainPictureStoredArea": {
              "Height": 1080,
              "Width": 1998
            },
            "ScreenAspectRatio": "1998 1080"
          },
          "4K": {
            "MainPictureStoredArea": {
              "Height": 2160,
              "Width": 3996
            },
            "ScreenAspectRatio": "3996 2160"
          },
          "definingDocs": [
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
        "dcncCode": "F",
        "dcncSortOrder": "1.5",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

})
