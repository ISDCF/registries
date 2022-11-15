const make_ratings = require("../src/main/scripts/ratings-make")
const assert = require('assert');
const fs = require('fs');
const path = require('path');

BUILD_DIR = "build";
ML_REGISTER_PATH = "src/main/resources/ml-registry/CMR_Ratings_v2.4.5.xml";

describe("make ratings registry from MovieLabs registry", async () => {
  it("valid", async () => {
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
