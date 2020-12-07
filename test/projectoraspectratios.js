const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("projectoraspectratios schema", () => {
  before(async () => { ({ projectoraspectratios: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
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
          "definingDoc": [
            "SMPTE ST 429-16",
            "SMPTE ST 429-2",
            "SMPTE ST 429-7"
          ]
        },
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]))
  })

  it("missing metadata definingDoc", () => {
    assert.throw(() => validate([
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

  it("missing height in 2K", () => {
    assert.throw(() => validate([
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
          "definingDoc": [
            "SMPTE ST 429-16",
            "SMPTE ST 429-2",
            "SMPTE ST 429-7"
          ]
        },
        "dcncCode": "F",
        "dcncSortOrder": 1,
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("2K height not an integer", () => {
    assert.throw(() => validate([
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
          "definingDoc": [
            "SMPTE ST 429-16",
            "SMPTE ST 429-2",
            "SMPTE ST 429-7"
          ]
        },
        "dcncCode": "F",
        "dcncSortOrder": "1.5",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("missing sort order", () => {
    assert.throw(() => validate([
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
          "definingDoc": [
            "SMPTE ST 429-16",
            "SMPTE ST 429-2",
            "SMPTE ST 429-7"
          ]
        },
        "dcncCode": "F",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

  it("sort order not an integer", () => {
    assert.throw(() => validate([
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
          "definingDoc": [
            "SMPTE ST 429-16",
            "SMPTE ST 429-2",
            "SMPTE ST 429-7"
          ]
        },
        "dcncCode": "F",
        "dcncSortOrder": "1.5",
        "description": "Flat (1.85:1)"
      }
    ]), /fails schema/)
  })

})
