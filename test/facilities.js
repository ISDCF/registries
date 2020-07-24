const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("facilities schema", () => {
  let validate
  before(async () => { ({ facilities: { validate } } = await registries() ) })

  it("schema exists", () => {
    validate.should.be.a('function')
  })

  it("correct validation", () => {
    assert.doesNotThrow(() => validate([
      { code: "AAA", description: "A A A" },
      { code: "BBB", description: "B B B", obsolete: true },
      { code: "CCC", description: "C C C", obsolete: true, comments: [ "foo", "bar" ] },
      { code: "DDD", description: "D D D", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'BBB' ] }
    ]))
  })

  it("bad order", () => {
    assert.throw(() => validate([
      { code: "BBB", description: "B B B", obsolete: true },
      { code: "AAA", description: "A A A" },
    ]), /sorted/)
  })

  it("incorrect obsoletedBy", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ true ] }
    ]), /fails schema/)
  })

  it("obsoletedBy unknown code", () => {
    assert.throw(() => validate([
      { code: "AAA", description: "A A A" },
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ "XYZ" ] }
    ]), /invalid code/)
  })

  it("empty obsoletedBy", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsolete: true, obsoletedBy: [ ] }
    ]), /fails schema/)
  })

  it("incorrect obsolete", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsolete: "foo", obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("no obsoletedBy without obsolete", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsolete: false, obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("no obsoletedBy without obsoletedBy (implicit value)", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsoletedBy: [ "AAA" ] }
    ]), /fails schema/)
  })

  it("invalid case", () => {
    assert.throw(() => validate([
      { code: "aaa", description: "A A A" },
      { code: "BBB", description: "B B B" }
    ]), /fails schema/)
  })

  it("additional", () => {
    assert.throw(() => validate([
      { code: "aaa", description: "A A A" },
      { code: "BBB", description: "B B B", foo: "bar" }
    ]), /fails schema/)
  })

  it("additional", () => {
    assert.throw(() => validate([
      { code: "DDD", description: "C C C", obsolete: true, comments: [ "foo", "bar" ], obsoletedBy: [ 'AAA', 'DDD' ], foo: "bar" }
    ]), /fails schema/)
  })

  it("code too long", () => {
    assert.throw(() => validate([
      { code: "AAA", description: "A A A" },
      { code: "BBBBB", description: "B B B" }
    ]), /fails schema/)
  })

})
