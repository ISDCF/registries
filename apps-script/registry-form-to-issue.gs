/**
 * registry-form-to-issue.gs
 *
 * Google Apps Script bound to a Google Sheet that backs a Google Form.
 * On each form submission it opens a formatted GitHub issue in ISDCF/registries
 * requesting a Studio or Facility add / update / obsolete.
 *
 * Deploy ONE copy per Sheet (Studios + Facilities); the only difference between
 * deployments is the CONFIG block below. See apps-script/README.md for setup.
 */

// ===== Per-deployment config — change ONLY this block per Sheet =====
const CONFIG = {
  noun: 'Studio',            // 'Studio' on the Studios sheet, 'Facility' on the Facilities sheet
  registry: 'studios',       // 'studios' | 'facilities'  (drives the .json filename + label)
  owner: 'ISDCF',
  repo: 'registries',
  labels: ['studios', 'form-submission'], // must already exist in repo, else set to []
};
const DATA_FILE = CONFIG.registry + '.json';
const N = CONFIG.noun;

// Canonical question labels (the noun fills in 'Studio'/'Facility'). Lookups are tolerant —
// see get() below — so trailing spaces, "(hints)" in the title, or "Email" vs "Email Address"
// in the real form still match. Update these only if a question's core wording changes.
const Q = {
  email:      'Email',
  code:       N + ' Code',
  desc:       N + ' Name / Description',
  url:        N + ' Website',
  obsCode:    'Obsoleted Code',
  oldName:    'Old ' + N + ' Name',
  cName:      'Contact Name',
  cAddr:      'Contact Mailing Address',
  update:     'Update?',
  updCodes:   'Codes to Update',
  optOut:     'Opt Out',
};

// Normalize a label/header for tolerant matching: drop "(...)" hints, lowercase,
// collapse whitespace, strip a trailing "?" and surrounding spaces.
function normLabel(s) {
  return String(s).toLowerCase().replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').replace(/\?$/, '').trim();
}

function onFormSubmit(e) {
  const v = e.namedValues;
  // Match by normalized equality first, then normalized prefix (handles 'Email' vs 'Email Address').
  const get = label => {
    const target = normLabel(label);
    let prefixHit = '';
    for (const key in v) {
      const nk = normLabel(key);
      const val = (v[key] && v[key][0]) ? String(v[key][0]).trim() : '';
      if (nk === target) return val;
      if (!prefixHit && target && nk.indexOf(target) === 0) prefixHit = val;
    }
    return prefixHit;
  };
  const checked = q => /yes/i.test(get(q));

  const code     = get(Q.code).toUpperCase();
  const desc     = get(Q.desc);
  const url      = get(Q.url);
  const obsCode  = get(Q.obsCode).toUpperCase();
  const oldName  = get(Q.oldName);
  const isUpdate = checked(Q.update);
  const updCodes = get(Q.updCodes).split(/[,\s]+/).filter(Boolean).map(s => s.toUpperCase());
  const optedOut = checked(Q.optOut);

  // Primary (new/active) entry
  const entry = { code: code, description: desc };
  if (url) entry.url = url;
  if (!optedOut) {
    const c = {};
    if (get(Q.cName)) c.name = get(Q.cName);
    if (get(Q.email)) c.email = get(Q.email);
    if (get(Q.cAddr)) c.address = get(Q.cAddr);
    const valid = (c.email && !c.name && !c.address) || (c.name && c.address);
    if (valid) entry.contact = c;
  }

  // Optional obsolete entry for the replaced code
  let obsolete = null;
  if (obsCode) {
    obsolete = { code: obsCode, description: oldName || ('(replaced by ' + code + ')'),
                 obsolete: true, obsoletedBy: [code] };
  }

  const existing = fetchExistingCodes();   // Set of codes currently in the registry (or null on fetch failure)
  const badCode = !/^[A-Z0-9]{2,4}$/.test(code);
  const title = buildTitle(isUpdate, updCodes, code, desc, obsCode);
  const body  = buildBody({ isUpdate, updCodes, entry, obsolete, optedOut, badCode, obsCode, existing, get });
  createIssue(title, body);
}

// Read-only: pull the live registry file and return the set of existing codes (null if unreachable)
function fetchExistingCodes() {
  try {
    const raw = 'https://raw.githubusercontent.com/' + CONFIG.owner + '/' + CONFIG.repo +
                '/master/src/main/data/' + DATA_FILE;
    const res = UrlFetchApp.fetch(raw, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return null;
    const arr = JSON.parse(res.getContentText());
    return new Set(arr.map(e => String(e.code).toUpperCase()));
  } catch (err) {
    return null;  // never block issue creation on a check failure
  }
}

function buildTitle(isUpdate, updCodes, code, desc, obsCode) {
  if (isUpdate) return 'Update ' + (updCodes.join(', ') || code) + ' - ' + desc + ' - ' + DATA_FILE;
  if (obsCode)  return 'Add ' + code + ' - ' + desc + ' (obsoletes ' + obsCode + ') - ' + DATA_FILE;
  return 'Add ' + code + ' - ' + desc + ' - Update ' + DATA_FILE;
}

function buildBody(o) {
  const { isUpdate, updCodes, entry, obsolete, optedOut, badCode, obsCode, existing, get } = o;
  let s = '';
  if (badCode) s += '> NOTE: submitted code does not match `^[A-Z0-9]{2,4}$` — needs review.\n\n';
  if (existing) {
    if (!isUpdate && existing.has(entry.code))
      s += '> NOTE: code `' + entry.code + '` already exists in `' + DATA_FILE + '` — possible duplicate (or should this be an update?).\n\n';
    if (obsCode && !existing.has(obsCode))
      s += '> NOTE: obsoleted code `' + obsCode + '` was not found in `' + DATA_FILE + '`.\n\n';
    if (isUpdate) {
      const missing = updCodes.filter(c => !existing.has(c));
      if (missing.length) s += '> NOTE: code(s) to update not found in `' + DATA_FILE + '`: ' + missing.join(', ') + '.\n\n';
    }
  }
  s += '**Request type:** ' + (isUpdate ? 'Update existing' : (obsolete ? 'Add new + obsolete old' : 'Add new')) + '\n';
  s += '**Registry:** `' + DATA_FILE + '`\n\n';
  s += '**Code:** `' + entry.code + '`\n';
  s += '**Description:** ' + entry.description + '\n';
  if (entry.url) s += '**Website:** ' + entry.url + '\n';
  if (isUpdate && updCodes.length) s += '**Codes to update:** ' + updCodes.join(', ') + '\n';
  if (obsolete) s += '**Obsoletes:** `' + obsolete.code + '` (' + obsolete.description + ')\n';
  if (entry.contact) {
    s += '\n**Contact (opted in):**\n';
    if (entry.contact.name)    s += '- Name: ' + entry.contact.name + '\n';
    if (entry.contact.email)   s += '- Email: ' + entry.contact.email + '\n';
    if (entry.contact.address) s += '- Address: ' + entry.contact.address + '\n';
  } else if (optedOut) {
    s += '\n_Submitter opted out of public contact listing — contact omitted._\n';
  }
  const json = obsolete ? [entry, obsolete] : entry;
  s += '\n---\nProposed entry for `' + DATA_FILE + '`:\n```json\n' + JSON.stringify(json, null, 2) + '\n```\n';
  s += '\n_Auto-generated from Google Form submission._';
  return s;
}

function createIssue(title, body) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN script property not set');
  const url = 'https://api.github.com/repos/' + CONFIG.owner + '/' + CONFIG.repo + '/issues';
  const payload = { title: title, body: body };
  if (CONFIG.labels && CONFIG.labels.length) payload.labels = CONFIG.labels;
  const res = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    payload: JSON.stringify(payload), muteHttpExceptions: true,
  });
  const c = res.getResponseCode();
  if (c < 200 || c >= 300) throw new Error('GitHub API ' + c + ': ' + res.getContentText());
}

// Run once manually per spreadsheet to install the form-submit trigger
function installTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit().create();
}
