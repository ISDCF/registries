const { areBadURLs, SAMPLE_BAD_URL, isSkipURLCheck} =  require("../src/main/scripts/url-checker")
const assert = require('assert');

describe("Check URL checker", async () => {
  if (! isSkipURLCheck())
    it("valid", async () => {
      const badURLs = await areBadURLs(["http://isdcf.com"]);
      assert.equal(badURLs.length, 0);
    })

  if (! isSkipURLCheck())
    it("malicious", async () => {
      const badURLs = await areBadURLs([SAMPLE_BAD_URL]);
      assert.deepEqual(badURLs, [SAMPLE_BAD_URL]);
    })
})