# ISDCF Metadata Registries

## Overview

Metadata registries maintained by the InterSociety Digital Cinema Forum (ISDCF).

The registry data is:

* stored as JSON at [`src/main/data`](src/main/data/)

* available through an API at https://registry.isdcf.com

* published as HTML at https://registry-page.isdcf.com/

## Notes

The _ratings_ registry is generated from the information at <https://movielabs.com/md/ratings/>, which is maintained by [MovieLabs](https://movielabs.com/).

The environment variable `G_SAFE_BROWSING_API_KEY` must contain an Google API
Key with permissions to the Safe Browsing API, or the environment variable
`ISDCF_SKIP_URL_CHECK` must be set.
