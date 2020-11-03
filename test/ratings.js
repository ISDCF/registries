const make_ratings = require("../src/main/scripts/ratings-make")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const fs = require('fs');

describe("make ratings registry from MovieLabs registry", () => {
  it("valid", () => {
    assert.doesNotThrow(
      () => {
        fs.writeFileSync(
          "build/ratings.json",
          JSON.stringify(
            make_ratings.convertMLRatingsRegistry(
              fs.readFileSync("src/main/resources/ml-registry/CMR_Ratings_2.4.2.xml", 'utf8')
            ),
            null,
            "  "
          )
        );
      }
    )
  })


})
