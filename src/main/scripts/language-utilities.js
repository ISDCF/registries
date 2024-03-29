/*
Copyright (c) 2019, Pierre-Anthony Lemieux <pal@palemieux.com>


Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const fs = require('fs');
const tags = require('language-tags')

var LANGSUBTAG_RE = /^([a-zA-Z]{2,3}|[a-zA-Z]{5,8})$/;
var SCRIPTSUBTAG_RE = /^[a-zA-Z]{4}$/;
var REGIONSUBTAG_RE = /^([a-zA-Z]{2}|[0-9]{3})$/;
var VARIANTSUBTAG_RE = /^([a-zA-Z]{5,8}|(?:[0-9][0-9A-Za-z]{3}))$/;

const CLDRLANG_PATH = "node_modules/cldr-localenames-modern/main/en/languages.json";
const CLDRSCRIPTS_PATH = "node_modules/cldr-localenames-modern/main/en/scripts.json";
const CLDRTERRITORIES_PATH = "node_modules/cldr-localenames-modern/main/en/territories.json";
const CLDRVARIANTS_PATH = "node_modules/cldr-localenames-modern/main/en/variants.json";
const CLDRALIASES_PATH = "node_modules/cldr-core/supplemental/aliases.json";


/* load CLDR languages */

var cldrLanguages = JSON.parse(
  fs.readFileSync(
    CLDRLANG_PATH
  )
);

if (! cldrLanguages) {
  throw "Cannot load CLDR languages";
}

/* load CLDR scripts */

var cldrScripts = JSON.parse(
  fs.readFileSync(
    CLDRSCRIPTS_PATH
  )
);

if (! cldrScripts) {
  throw "Cannot load CLDR scripts";
}

/* load CLDR territories */

var cldrTerritories = JSON.parse(
  fs.readFileSync(
    CLDRTERRITORIES_PATH
  )
);

if (! cldrTerritories) {
  throw "Cannot load CLDR territories";
}

/* load CLDR variants */

var cldrVariants = JSON.parse(
  fs.readFileSync(
    CLDRVARIANTS_PATH
  )
);

if (! cldrVariants) {
  throw "Cannot load CLDR variants";
}

/* load CLDR aliases */

var cldrAliases = JSON.parse(
  fs.readFileSync(
    CLDRALIASES_PATH
  )
);

if (! cldrAliases) {
  throw "Cannot load CLDR aliases";
}


exports.parseLanguageTag = function(tag) {

  let ptag = tags(tag);

  if (! ptag.valid()) {
    return null;
  }

  let language = ptag.find('language');
  let script = ptag.find('script');
  let region = ptag.find('region');
  
  return {
    language: language ? language.format() : null,
    script: script ? script.format() : null,
    region: region ? region.format() : null,
    variants: ptag.subtags().filter(subtag => subtag.type() === "variant").map(subtag => subtag.format())
  };

};

exports.parsedTagToCLDRLocale = function(ptag) {

  if (! (ptag && ptag.language)) throw "Invalid tag: " + ptag;

  let locale = {
    language: ptag.language,
    script: ptag.script,
    region: ptag.region,
    variants: Array.from(ptag.variants)
  }

  let lang_alias = cldrAliases.supplemental.metadata.alias.languageAlias[ptag.language];

  if (lang_alias) {

    let p_lang_alias = exports.parseLanguageTag(lang_alias._replacement);

    if (! p_lang_alias) throw "Cannot parse language alias";

    locale.language = p_lang_alias.language;
    locale.region = locale.region || p_lang_alias.region;
    locale.script = locale.script || p_lang_alias.script;
    locale.variants = locale.variants | Array.from(p_lang_alias.variants);

  }

  let region_alias = cldrAliases.supplemental.metadata.alias.territoryAlias[ptag.region];

  if (region_alias) {

    let p_region_alias = region_alias._replacement.split(" ");

    if (p_region_alias.length > 1) throw "Cannot handle multi-valued region aliases.";

    locale.region = p_region_alias[0];

  }

  return locale;
}

exports.fromParsedTagToCanonicalTag = function(ptag) {
  let c = [ptag.language];

  if (ptag.script) c.push(ptag.script);

  if (ptag.region) c.push(ptag.region);

  if (ptag.variants) c.concat(ptag.variants);

  return c.join("-");
}

exports.buildDisplayName = function(ptag) {

  if (! ptag) return null;

  /* is a short form available */
  
  let tag = exports.fromParsedTagToCanonicalTag(ptag);

  if (! tag) throw "Invalid tag: " + ptag; 

  let lang = cldrLanguages.main.en.localeDisplayNames.languages[tag];

  if (lang) return lang;

  /* generate long form*/

  let dn = cldrLanguages.main.en.localeDisplayNames.languages[ptag.language];

  if (! dn) {
    dn = tags.subtags(ptag.language).filter(s => s.type() === 'language').map(s => s.descriptions()[0]);
  }

  if (! dn) {
    console.debug("No language name found for subtag: " + ptag.language);
    return null;
  }

  let st = [];

  if (ptag.script) {
    let script = cldrScripts.main.en.localeDisplayNames.scripts[ptag.script];

    if (! script) {
      script = tags.subtags(ptag.script).filter(s => s.type() === 'script').map(s => s.descriptions()[0]);
    }

    if (! script) {
      return null;
    }

    st.push(script);
  }

  if (ptag.region) {
    let region = cldrTerritories.main.en.localeDisplayNames.territories[ptag.region];

    if (! region) {
      console.log(ptag.region);
      region = tags.subtags(ptag.region).filter(s => s.type() === 'region').map(s => s.descriptions()[0]);
    }

    if (! region) return null;

    st.push(region);
  }

  for(let i in ptag.variants) {
    let variant = cldrVariants.main.en.localeDisplayNames.variants[ptag.variants[i]];

    if (! variant) {
      variant = tags.subtags(ptag.variants[i]).filter(s => s.type() === 'variant').map(s => s.descriptions()[0]);
    }

    if (! variant) return null;

    st.push(variant);
  }

  if (st.length > 0) {
    dn += " (" + st.join(", ") + ")";
  }

  return dn;

};