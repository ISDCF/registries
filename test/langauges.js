const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("languages schema", () => {
  before(async () => { ({ languages: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
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
      }]))
  })

  it("invalid", () => {
    assert.throw(() => validate([
      "foo"
    ]), /fails schema/)
  })

})
