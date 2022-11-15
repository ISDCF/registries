const { areSafeURLs, SAMPLE_BAD_URL} =  require("../src/main/scripts/url-checker")
const assert = require('assert');;


describe("Check URL checker", async () => {
  it("valid", async () => {
    assert(await areSafeURLs(["http://isdcf.com"]));
  })

  it("malicious", async () => {
    assert(! (await areSafeURLs([SAMPLE_BAD_URL])));
  })
})