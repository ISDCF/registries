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

const { areBadURLs, isSkipURLCheck} = require('./url-checker.js')

module.exports = async (registry, name) => {
  /* is the registry sorted */
  for (let i = 1; i < registry.length; i++) {
    if (registry[i-1].code >= registry[i].code) {
      throw name + " registry key " + registry[i-1].code + " is " +
        ((registry[i-1].code === registry[i].code) ? "duplicated" : "not sorted");
    }

    /* ensure all obsoletedBy codes are found */
    (registry[i].obsoletedBy||[]).forEach(obs => {
      if (!registry.find(r => r.code === obs))
        throw `${name}: ${registry[i].description} is obsoletedBy '${obs}' which is an invalid code`
    })
  }

  /* any bad URLs?*/

  if (! isSkipURLCheck()) {
    const urls = registry.filter((e) => "url" in e).map((e) => e.url);
    const badURLs = await areBadURLs(urls);
    if (badURLs.length > 0)
      throw `${name}: Malicious URLs at ${badURLs.join(', ')}.`;
  }
}
