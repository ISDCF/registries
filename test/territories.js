const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("territories schema", () => {
  before(async () => { ({ territories: { validate } } = await registries() ) })

  it("valid", () => {
    assert.doesNotThrow(() => validate([
      {
        "tag": "ZA",
        "dcncTag": "ZA",
        "name": "South Africa"
      },
      {
        "tag": "XK",
        "tagScope": "https://isdcf.com/ns/cpl/territories",
        "dcncTag": "ZK",
        "name": "Kosovo",
        "comments": ["XK is not yet part of ISO 3166"]
      }
    ]))
  })

  it("illegal IANA region subtag", () => {
    assert.throw(() => validate([
      {
        "tag": "XX",
        "dcncTag": "XX",
        "name": "XXX"
      }
    ]), /not a valid IANA region/)
  })


  it("missing name", () => {
    assert.throw(() => validate([
      {
        "tag": "CA",
        "dcncTag": "CA",
      }
    ]), /fails schema/)
  })

})
