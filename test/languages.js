const { registries } = require("..")
const assert = require('assert');

describe("languages schema", async () => {
  before(async () => { ({ languages: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "dcncLanguage": "Albanian",
        "dcncTag": "SQ",
        "rfc5646Tag": "sq",
        "use": [
          "audio",
          "text"
        ]
      },
      {
        "dcncLanguage": "Chinese - Mandarin PRC",
        "dcncTag": "CMN",
        "rfc5646Tag": "cmn",
        "use": [
          "audio"
        ]
      }
    ]))
  })

  it("missing RFC Tag", async () => {
    await assert.rejects(validate([
      {
        "dcncLanguage": "Albanian",
        "dcncTag": "SQ",
        "use": [
          "audio",
          "text"
        ]
      },
      {
        "dcncLanguage": "Chinese - Mandarin PRC",
        "dcncTag": "CMN",
        "rfc5646Tag": "cmn",
        "use": [
          "audio"
        ]
      }
    ]), /fails schema/)
  })

  it("missing use", async () => {
    await assert.rejects(validate([
      {
        "dcncLanguage": "Albanian",
        "dcncTag": "SQ",
        "use": [
          "audio",
          "text"
        ]
      },
      {
        "dcncLanguage": "Chinese - Mandarin PRC",
        "dcncTag": "CMN",
        "rfc5646Tag": "cmn"
      }
    ]), /fails schema/)
  })


})
