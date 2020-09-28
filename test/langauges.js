const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("languages schema", () => {
  before(async () => { ({ languages: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "dcncTag": "SQ",
        "dcncLanguage": "Albanian",
        "rfc5646Tag": "sq",
        "use": [
          "audio",
          "text"
        ]
      },
      {
        "dcncTag": "CMN",
        "dcncLanguage": "Chinese - Mandarin PRC",
        "rfc5646Tag": "cmn",
        "use": [
          "audio"
        ]
      }]))
  })

  it("invalid", () => {
    assert.throw(() => validate([
      "foo"
    ]), /fails schema/)
  })

})
