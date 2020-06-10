/*
Copyright (c), InterSociety Digital Cinema Forum (ISDCF) <info@isdcf.com>

This work is licensed under the Creative Commons Attribution 4.0 International License.

You should have received a copy of the license along with this work.  If not, see <https://creativecommons.org/licenses/by/4.0/>.
*/

const hb = require('handlebars');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const proc = require('child_process');
const ajv = require('ajv');


const DATA_PATH = "src/main/data/facilities.json";
const DATA_SCHEMA_PATH = "src/main/schemas/facilities.schema.json";
const TEMPLATE_PATH = "src/main/templates/facilities.hbs";
const BUILD_PATH = "build";
const PAGE_SITE_PATH = "facilities.html";
const PDF_SITE_PATH = "isdcf-facilities.pdf";

/* instantiate template */

let template = hb.compile(
  fs.readFileSync(
    TEMPLATE_PATH,
    'utf8'
  )
);

if (!template) {
  throw "Cannot load HTML template";
}

/* load and validate the registry */

let registry = JSON.parse(
  fs.readFileSync(
    DATA_PATH
  )
);

if (!registry) {
  throw "Cannot load registry";
}

var validator_factory = new ajv();

let validator = validator_factory.compile(
  JSON.parse(
    fs.readFileSync(
      DATA_SCHEMA_PATH
    )
  )
);

if (! validator(registry)) {
  console.log(validator.errors);
  throw "Registry fails validation";
};

/* is the registry sorted */

for(let i = 1; i < registry.length; i++) {
  if (registry[i-1].code > registry[i].code) {
    throw "Registry key " + registry[i-1].code + " is not sorted";
  }
}

/* get the version field */

let version = "Unknown version"

try {
  version = proc.execSync('git rev-parse HEAD').toString().trim();
} catch (e) {
}

/* create build directory */

fs.mkdirSync(BUILD_PATH, { recursive: true });

/* apply template */

var html = template({
  "version" : version,
  "data" : registry,
  "date" :  new Date(),
  "pdf_path": PDF_SITE_PATH
});

/* write HTML file */

fs.writeFileSync(path.join(BUILD_PATH, PAGE_SITE_PATH), html, 'utf8');

/* write pdf */

/* set the CHROMEPATH environment variable to provide your own Chrome executable */

var pptr_options = {};

if (process.env.CHROMEPATH) {
  pptr_options.executablePath = process.env.CHROMEPATH;
}

(async () => {
  const browser = await puppeteer.launch(pptr_options);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: path.join(BUILD_PATH, PDF_SITE_PATH).toString() })
  await browser.close();
  process.exit();
})();

