const { registries } = require("..")
const assert = require('assert');

describe("kdmforensicflags schema", async () => {
  before(async () => { ({ kdmforensicflags: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "definingDocs": [
          {
            "name": "DCI DCSS",
            "url": "https://www.dcimovies.com/specification/index.html"
          }
        ],
        "uri": "http://www.dcimovies.com/430-1/2006/KDM#mrkflg-audio-disable-above-channel-XX",
        "description": "Selective audio FM mark flag",
        "note": "where XX is a value in the set {01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16 ... 99}"
      }
    ]))
  })

  it("missing uri", async () => {
    await assert.rejects(validate([
      {
        "definingDocs": [
          {
            "name": "DCI DCSS",
            "url": "https://www.dcimovies.com/specification/index.html"
          }
        ],
        "description": "Selective audio FM mark flag",
        "note": "where XX is a value in the set {01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16 ... 99}"
      }
    ]), /fails schema/)
  })

})
