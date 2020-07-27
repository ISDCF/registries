const { registries } = require("..")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert

describe("studios schema", () => {
  let validate
  before(async () => { ({ studios: { validate } } = await registries() ) })

  it("schema exists", () => {
    validate.should.be.a('function')
  })

  it("correct validation", () => {
    assert.doesNotThrow(() => validate([
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
