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

const { parseLanguageTag, parsedTagToCLDRLocale } = require('./language-utilities.js')

module.exports = (registry, name) => {

  /* is the registry sorted */
 for (let i = 1; i < registry.length; i++) {
  if (registry[i-1].dcncLanguage >= registry[i].dcncLanguage) {
    throw name + " registry key " + registry[i-1].dcncLanguage + " is " +
      ((registry[i-1].dcncLanguage === registry[i].dcncLanguage) ? "duplicated" : "not sorted");
    }
  }

  /* is any dcncTag in the registry duplicated */

  const dcncTags = []

  for (i in registry) {
    if (registry[i].dcncTag !== undefined) {
      if (dcncTags.includes(registry[i].dcncTag)) {
        throw name + " dcncTag " + registry[i].dcncTag + " is " + "duplicated";
      }
      dcncTags.push(registry[i].dcncTag)
    }
  }

  /* is any rfc5646Tag in the registry duplicated */

  const rfc5646Tags = []

  for (i in registry) {
    if (rfc5646Tags.includes(registry[i].rfc5646Tag)) {
      throw name + " rfc5646Tag " + registry[i].rfc5646Tag + " is " + "duplicated";
    }
    rfc5646Tags.push(registry[i].rfc5646Tag)
  }

  for (const i in registry) {

    /* an RFC 5646 language tag is required */

    const langtag = registry[i].rfc5646Tag;

    if (! langtag) {
      throw "Missing RFC5646 language tag name for entry #" + i;
    }

    /* the RFC 5646 language tag must be a valid CLDR locale */

    const ptag = parseLanguageTag(langtag);

    if (ptag === null) {
      throw "Invalid language tag: " + langtag
    }

    const locale = parsedTagToCLDRLocale(ptag);

    if (!locale) {
      throw "Cannot transform language tag to locale: " + langtag;
    }
  }
}
