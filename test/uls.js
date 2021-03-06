const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("uls schema", () => {
  before(async () => { ({ uls: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
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

  it("missing ul", () => {
    assert.throw(() => validate([
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

  it("obsolete not boolean", () => {
    assert.throw(() => validate([
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
