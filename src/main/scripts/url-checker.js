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

const https = require('https');

exports.SAMPLE_BAD_URL = "http://malware.testing.google.test/testing/malware/home.html";

if (! ("G_SAFE_BROWSING_API_KEY" in process.env || "ISDCF_SKIP_URL_CHECK" in process.env))
  throw "Google Safe Browsing API Key missing in G_SAFE_BROWSING_API_KEY environment variable.";

exports.areSafeURLs = async function(url_list) {

  const threatEntries = url_list.map((e) => ({"url" : e}));

  return await new Promise((resolve, reject) => {
    let r = https.request(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.G_SAFE_BROWSING_API_KEY}`,
      {
        "headers": {
          "Content-Type": "application/json"
        },
        "method": "POST"
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject("Bad API call");
        }

        res.setEncoding('utf8');

        let body = "";

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (!res.complete)
            reject(e);

          try {
            const m = JSON.parse(body);
            resolve(!("matches" in m && m.matches.length > 0));
          } catch(e) {
            reject(e);
          }
        });
      }
    );

    r.on('error', (e) => {
      reject(e);
    });

    r.write(JSON.stringify({
      "client": {
        "clientId":      "isdcf.com/registries",
        "clientVersion": "1.0.0"
      },
      "threatInfo": {
        "threatTypes":      ["THREAT_TYPE_UNSPECIFIED", "MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        "platformTypes":    ["ANY_PLATFORM"],
        "threatEntryTypes": ["URL"],
        "threatEntries": threatEntries
      }
    }));

    r.end();
  });

}