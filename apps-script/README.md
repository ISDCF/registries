# Form → Sheet → GitHub issue automation

[`registry-form-to-issue.gs`](registry-form-to-issue.gs) is a Google Apps Script bound to a
Google Sheet that backs a Google Form. On each submission it opens a formatted GitHub issue in
`ISDCF/registries` requesting a Studio or Facility **add**, **update**, or **obsolete**.

There are two Forms (one per registry), each feeding its own Sheet. Deploy **one copy of the
script per Sheet** — the only difference between the two deployments is the `CONFIG` block.

## What the issue contains

- A human-readable summary of the submitted fields.
- A fenced ` ```json ` block with the canonical entry (paste-ready into `src/main/data/<registry>.json`).
  When an `Obsoleted Code` is given, the block is an array of `[new entry, obsolete entry]`. The
  obsolete entry keeps the registry's **existing** description verbatim (it falls back to the
  submitted `Old … Name`, then a placeholder, only if the code isn't already listed).
- Advisory `> NOTE:` lines when the code looks wrong (`^[A-Z0-9]{2,4}$`), already exists in the
  registry, or references a code that isn't there. These never block the issue — a maintainer decides.

**Contact privacy:** if the submitter ticks **Opt Out**, no contact data (name, email, address)
goes into the issue at all — it stays only in the Google Sheet.

## Form questions (tolerant matching)

The script reads responses by question **title** via `e.namedValues` (keyed by the Form question
text, **not** the Sheet column headers — editing/reordering Sheet columns has no effect). Matching is
**tolerant**: titles are normalized before comparison, so all of these still match without edits:

- trailing/leading spaces (e.g. `Facility Code` saved with a trailing space)
- parenthetical hints (e.g. `Studio Website (please include https:// …)`)
- a trailing `?` (e.g. `Update?`)
- `Email` vs auto-collected `Email Address` (prefix match)

`CONFIG.noun` fills in "Studio"/"Facility". You only need to touch the `Q` constants in the script if a
question's **core wording** changes (e.g. renaming "Studio Code" to "Studio Identifier").

| Core title (Studio / Facility) | Used as |
| --- | --- |
| `Email` (or `Email Address`) | contact email (omitted if Opt Out) |
| `Studio Code` / `Facility Code` | `code` |
| `Studio Name / Description` / `Facility Name / Description` | `description` |
| `Studio Website` / `Facility Website` | `url` |
| `Obsoleted Code` | old code to mark obsolete (`obsoletedBy` the new code) |
| `Old Studio Name` / `Old Facility Name` | description fallback for the obsoleted code (registry value wins) |
| `Contact Name` | contact `name` (omitted if Opt Out) |
| `Contact Mailing Address` | contact `address` (omitted if Opt Out) |
| `Update?` (checkbox `Yes`) | marks this as an update to existing codes |
| `Codes to Update` | codes targeted by the update |
| `Opt Out` (checkbox `Yes`) | suppress all contact data in the issue |

Extra Sheet-only helper columns (e.g. `Updated … URL`, `Location of …`, `corrected Address`,
`Entered into Github`, `Response Sent`, `Notes`) and the `Send me a copy of my responses` receipt
are not Form responses the script needs, so they're simply ignored.

## Setup (per Sheet)

1. **Create a GitHub token** — a fine-grained personal access token scoped to `ISDCF/registries`
   with **Issues: Read and write**.
2. In the Sheet: **Extensions → Apps Script**. Paste the contents of `registry-form-to-issue.gs`.
3. Edit the `CONFIG` block:
   - Studios sheet → `noun: 'Studio'`, `registry: 'studios'`, `labels: ['studios', 'form-submission']`
   - Facilities sheet → `noun: 'Facility'`, `registry: 'facilities'`, `labels: ['facilities', 'form-submission']`
4. **Project Settings → Script Properties → Add script property**: name `GITHUB_TOKEN`, value = the PAT.
5. Run the `installTrigger` function once from the editor and accept the OAuth authorization prompt
   (grants the spreadsheet/external-request scopes). This installs the on-form-submit trigger.
6. *(Optional)* Create the repo labels `studios`, `facilities`, `form-submission` once, or set
   `labels: []` to skip labelling (an unknown label otherwise causes a 422).

## Testing

In the Apps Script editor, run a temporary function that calls `onFormSubmit` with a stubbed event,
e.g.:

```javascript
function _test() {
  onFormSubmit({ namedValues: {
    'Email': ['x@y.com'],
    'Studio Code': ['ZZ'],
    'Studio Name / Description': ['Test Studio'],
    'Studio Website': ['https://example.com'],
    'Contact Name': ['Jane Doe'],
    'Contact Mailing Address': ['1 Main St'],
    // 'Opt Out': ['Yes'],                       // -> omits all contact data
    // 'Obsoleted Code': ['OLD'], 'Old Studio Name': ['Old Co'],  // -> add + obsolete
    // 'Update?': ['Yes'], 'Codes to Update': ['AA, BB'],         // -> update request
  }});
}
```

Then confirm a correctly-titled, correctly-labelled issue appears in `ISDCF/registries`, and that
the JSON block pastes into `src/main/data/<registry>.json` cleanly:

```sh
npm run canonicalize && npm run validate
```
