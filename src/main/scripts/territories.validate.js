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

const fs = require('fs');
const tags = require('language-tags');

const ST429_16_REGION_SCOPE = "http://www.smpte-ra.org/schemas/429-16/2014/CPL-Metadata#scope/release-territory/UNM49"

module.exports = (registry, name) => {

  /* is the registry sorted */
 for (let i = 1; i < registry.length; i++) {
  if (registry[i-1].dcncTag >= registry[i].dcncTag) {
    throw name + " registry key " + registry[i-1].dcncTag + " is " +
      ((registry[i-1].dcncTag === registry[i].dcncTag) ? "duplicated" : "not sorted");
    }
  }

  for (const i in registry) {

    if ((! ("tagScope" in registry[i])) || registry[i].tagScope === ST429_16_REGION_SCOPE) {
      
      if (tags.region(registry[i].tag.toLowerCase()) === null) {
      
        throw "Tag '" + registry[i].tag + "' is not a valid IANA region subtag at entry #" + i;
    
      }
    }

  }
}
