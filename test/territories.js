const { registries } = require("..")
const assert = require('assert');

describe("territories schema", async () => {
  before(async () => { ({ territories: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "tag": "ZA",
        "dcncTag": "ZA",
        "dcncTerritory": "South Africa"
      },
      {
        "tag": "XK",
        "tagScope": "https://isdcf.com/ns/cplmd/territories",
        "dcncTag": "ZK",
        "dcncTerritory": "Kosovo",
        "comments": ["XK is not yet part of ISO 3166"]
      }
    ]))
  })

  it("M49 Region", async () => {
    await assert.doesNotReject(validate([
      {
        "tag": "001",
        "dcncTag": "INT",
        "dcncTerritory": "International"
      },
    ]))
  })


  it("illegal IANA region subtag", async () => {
    await assert.rejects(validate([
      {
        "tag": "XX",
        "dcncTag": "XX",
        "dcncTerritory": "XXX"
      }
    ]), /not a valid IANA region/)
  })


  it("missing tag", async () => {
    await assert.rejects(validate([
      {
        "dcncTag": "CA",
        "dcncTerritory": "XXX"
      }
    ]), /fails schema/)
  })

})
