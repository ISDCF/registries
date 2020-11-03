const make_ratings = require("../src/main/scripts/ratings-make")
const chai = require('chai')
const should = chai.should();
const assert = chai.assert;
const fs = require('fs');
const path = require('path');

BUILD_DIR = "build";
ML_REGISTER_PATH = "src/main/resources/ml-registry/CMR_Ratings_2.4.2.xml";

describe("make ratings registry from MovieLabs registry", () => {
  it("valid", () => {
    assert.doesNotThrow(
      () => {
        fs.mkdirSync(BUILD_DIR, { recursive: true })
        fs.writeFileSync(
          path.join(BUILD_DIR, "ratings.json"),
          JSON.stringify(
            make_ratings.convertMLRatingsRegistry(
              fs.readFileSync(ML_REGISTER_PATH, 'utf8')
            ),
            null,
            "  "
          )
        );
      }
    )
  })


})
