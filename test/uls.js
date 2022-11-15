const { registries } = require("..")
const assert = require('assert');

describe("uls schema", async () => {
  before(async () => { ({ uls: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "definingDocs": [
          {
            "name": "ISDCF Doc 13",
            "url": "https://isdcf.com/papers/ISDCF-Doc13-Sign-Language-Video-Encoding-for-Digital-Cinema.pdf"
          }
        ],
        "name": "Sign Language Video Stream",
        "note": "MCATagSymbol = 'SLVS' (Identifies an Audio Channel that contains a Sign Language Video Stream)",
        "ul": "urn:smpte:ul:060e2b34.0401010d.0d0f0302.01010000",
        "usage": "Label"
      }
    ]))
  })

  it("missing ul", async () => {
    await assert.rejects(validate([
      {
        "definingDocs": [
          {
            "name": "ISDCF Doc 13",
            "url": "https://isdcf.com/papers/ISDCF-Doc13-Sign-Language-Video-Encoding-for-Digital-Cinema.pdf"
          }
        ],
        "name": "Sign Language Video Stream",
        "note": "MCATagSymbol = 'SLVS' (Identifies an Audio Channel that contains a Sign Language Video Stream)",
        "usage": "Label"
      }
    ]), /fails schema/)
  })

  it("obsolete not boolean", async () => {
    await assert.rejects(validate([
      {
        "definingDocs": [
          {
            "name": "ISDCF Doc 13",
            "url": "https://isdcf.com/papers/ISDCF-Doc13-Sign-Language-Video-Encoding-for-Digital-Cinema.pdf"
          }
        ],
        "name": "Sign Language Video Stream",
        "note": "MCATagSymbol = 'SLVS' (Identifies an Audio Channel that contains a Sign Language Video Stream)",
        "usage": "Label",
        "obsolete": "yes"
      }
    ]), /fails schema/)
  })

})
