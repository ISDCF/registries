const { loadValidators } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("languages schema", () => {
  before(async () => { ({ languages: { validate } } = await loadValidators() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "dcncTag": "SQ",
        "rfc5646Tag": "sq",
        "use": [
          "audio",
          "text"
        ],
        "comments": [
          "DCNC notes: Albanian"
        ]
      },
      {
        "dcncTag": "AR",
        "rfc5646Tag": "ar",
        "use": [
          "audio",
          "text"
        ],
        "comments": [
          "DCNC notes: Arabic"
        ]
      }]))
  })

  it("invalid", () => {
    assert.throw(() => validate([
      "foo"
    ]), /fails schema/)
  })

})
