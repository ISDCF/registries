const { registries } = require("..")
const assert = require('assert');
const chai = require('chai');
const should = chai.should();

const { SAMPLE_BAD_URL, isSkipURLCheck } =  require("../src/main/scripts/url-checker")

describe("studios schema", async () => {
  let validate
  before(async () => { ({ studios: { validate } } = await registries() ) })

  it("schema exists", async () => {
    validate.should.be.a('function')
  })

  it("correct validation", async () => {
    await assert.doesNotReject(validate([
      { code: "AAA", description: "A A A" },
      { code: "BBB", description: "B B B", url: "http://www.foo.com"},
      { code: "CCC", description: "C C C", obsolete: true },
      { code: "DDD", description: "D D D", obsolete: true, comments: [ "foo", "bar" ] },
      { code: "EEE", description: "E E E", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'BBB' ] },
      { code: "FFF", description: "F F F", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'BBB' ], url: "http://www.foo.com"},
      { code: "GGG", description: "G G G", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'BBB' ], contact: { name: "Bob Smith", email: "bob@foo.com", address: "1234 Main St., Anytown, State, Country" } },
      { code: "HHH", description: "H H H", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'BBB' ], url: "http://www.foo.com", contact: { name: "Bob Smith", email: "bob@foo.com", address: "1234 Main St., Anytown, State, Country" } }
    ]))
  })

  it("bad order", async () => {
    await assert.rejects(validate([
      { code: "BBB", description: "B B B", obsolete: true },
      { code: "AAA", description: "A A A" },
    ]))
  })

  it("incorrect obsoletedBy", async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ true ] }
    ]), /fails schema/)
  })

  it("obsoletedBy unknown code", async () => {
    await assert.rejects(validate([
      { code: "AAA", description: "A A A" },
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ "XYZ" ] }
    ]), /invalid code/)
  })

  it("empty obsoletedBy",async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ ] }
    ]), /fails schema/)
  })

  it("incorrect obsolete", async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsolete: "foo", obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("no obsoletedBy without obsolete", async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsolete: false, obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("no obsoletedBy without obsoletedBy (implicit value)", async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("invalid case", async () => {
    await assert.rejects(validate([
      { code: "aaa", description: "A A A" },
      { code: "BBB", description: "B B B" }
    ]), /fails schema/)
  })

  it("additional element 1", async () => {
    await assert.rejects(validate([
      { code: "aaa", description: "A A A" },
      { code: "BBB", description: "B B B", foo: "bar" }
    ]), /fails schema/)
  })

  it("additional element 2", async () => {
    await assert.rejects(validate([
      { code: "DDD", description: "C C C", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'DDD' ], foo: "bar" }
    ]), /fails schema/)
  })

  it("code too long", async () => {
    await assert.rejects(validate([
      { code: "AAA", description: "A A A" },
      { code: "BBBBB", description: "B B B" }
    ]), /fails schema/)
  })

  if (! isSkipURLCheck())
    it("bad url", async () => {
      await assert.rejects(validate([
        { code: "BBB", description: "B B B", url: SAMPLE_BAD_URL},
      ]), /Malicious URLs/)
    })

})
