/*
Copyright (c), InterSociety Digital Cinema Forum (ISDCF) <info@isdcf.com>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following 
conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following 
disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following 
disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
`convertMLRatingsRegistry` creates the ISDCF ratings registry using the
[MovieLabs Common Medadata Ratings](https://movielabs.com/md/ratings/).
*/

const fs = require('fs');
const dom = require('xmldom');
const path = require('path');

const DATA_PATH = "src/main/data/";
const CMR_RATINGS_PATH = "src/main/resources/ml-registry/CMR_Ratings_2.4.2.xml";
const REG_FN = "ratings.json";

const MDCR_NS = "http://www.movielabs.com/schema/mdcr/v1.1";
const MD_NS = "http://www.movielabs.com/schema/md/v2.1/md";

function convertMLRatingsRegistry(registry_str) {

  const doc = new dom.DOMParser().parseFromString(registry_str, 'text/xml');

  let registry = []

  let systems = doc.getElementsByTagNameNS(MDCR_NS, "RatingSystem");

  for (let i = 0; i < systems.length; i++) {

    let regions = systems.item(i).getElementsByTagNameNS(MDCR_NS, "AdoptiveRegion");

    for (let j = 0; j < regions.length; j++) {

      let environs = regions.item(j).getElementsByTagNameNS(MDCR_NS, "Environment");

      let is_applicable = false;

      for (let k = 0; k < environs.length; k++) {

        if (environs.item(k).textContent === "Theater") {

          is_applicable = true;

        }

      }

      if (!is_applicable) break;

      let entry = {
        "agency": {},
        "region": {},
        "use": [],
        "ratings": [],
        "reference": {}
      };

      let medias = regions.item(j).getElementsByTagNameNS(MDCR_NS, "Media");

      for (let k = 0; k < medias.length; k++) {

        if (medias.item(k).textContent === "Film") {

          entry.use.push("feature");

        } else if (medias.item(k).textContent === "Trailer") {

          entry.use.push("trailer");

        }

      }

      /* assume rating can be used for both feature and trailer if no specific use is specified */

      if (entry.use.length == 0) {
        entry.use = ["feature", "trailer"];
      }

      entry.agency.system = systems.item(i).getElementsByTagNameNS(MDCR_NS, "System").item(0).textContent;

      entry.agency.organization = systems.item(i).getElementsByTagNameNS(MDCR_NS, "RatingsOrg").item(0).getAttribute("organizationID");

      entry.agency.identifier = systems.item(i).getElementsByTagNameNS(MDCR_NS, "URI").item(0).textContent;

      countries = regions.item(j).getElementsByTagNameNS(MD_NS, "country");

      if (countries.length === 0) {
        countries = regions.item(j).getElementsByTagNameNS(MD_NS, "countryRegion");
      }

      entry.region.code = countries.item(0).textContent;

      entry.region.name = regions.item(j).getElementsByTagNameNS(MDCR_NS, "RegionName").item(0).textContent;

      ratings = systems.item(i).getElementsByTagNameNS(MDCR_NS, "Rating");

      for (let m = 0; m < ratings.length; m++) {
        entry.ratings.push(ratings.item(m).getAttribute("ratingID"));
      }

      entry.reference.description = "MovieLabs, Common Metadata Ratings (" + systems.item(i).getAttribute("lastSave") + ")";
      entry.reference.url = "https://movielabs.com/md/ratings/";

      registry.push(entry);
    }
  }

  return registry;
}

module.exports = { convertMLRatingsRegistry };

if (require.main === module) {
  fs.writeFileSync(
    path.join(DATA_PATH, REG_FN),
    JSON.stringify(
      convertMLRatingsRegistry(
        fs.readFileSync(CMR_RATINGS_PATH, 'utf8')
      ),
      null,
      "  "
    )
  );
}
