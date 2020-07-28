const { parseLanguageTag, parsedTagToCLDRLocale } = require('../scripts/language-utilities.js')

module.exports = registry => {
  for (const i in registry) {

    /* an RFC 5646 language tag is required */

    const langtag = registry[i].rfc5646Tag;

    if (! langtag) {
      throw "Missing RFC5646 language tag name for entry #" + i;
    }

    /* the RFC 5646 language tag must be a valid CLDR locale */
    const ptag = parseLanguageTag(langtag);

    if (!ptag) {
      throw "Invalid language tag: " + langtag
    }

    const locale = parsedTagToCLDRLocale(ptag);

    if (!locale) {
      throw "Cannot transform language tag to locale: " + langtag;
    }
  }
}
