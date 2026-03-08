/**
 * Community Guardian — Test Suite
 * Tests core logic functions isolated from the UI.
 * Run: node tests/tests.js
 */

// ─── FUNCTIONS UNDER TEST (extracted from app logic) ─────────────────────────

/**
 * Rule-based fallback categorizer.
 * Used when AI is unavailable.
 */
function ruleCategorize(text) {
  const t = text.toLowerCase();
  if (t.includes('breach') || t.includes('hacked') || t.includes('data exposed') || t.includes('data leak'))
    return { category: 'data_breach', severity: 'high' };
  if (t.includes('phish') || t.includes('email') || t.includes('password') || t.includes('click') || t.includes('scam'))
    return { category: 'phishing', severity: 'medium' };
  if (t.includes('stolen') || t.includes('theft') || t.includes('stole') || t.includes('package'))
    return { category: 'package_theft', severity: 'medium' };
  if (t.includes('wifi') || t.includes('network') || t.includes('hotspot'))
    return { category: 'wifi_security', severity: 'high' };
  if (t.includes('popup') || t.includes('virus') || t.includes('malware'))
    return { category: 'malware', severity: 'high' };
  return { category: 'other', severity: 'medium' };
}

/**
 * Noise filter — determines if a community report is actionable signal.
 */
function isNoise(text) {
  const t = text.toLowerCase();
  const noisePatterns = [
    /^\s*(ugh|omg|wtf|i hate|so annoying|typical)/i,
    /anyone know a good (plumber|electrician|contractor|mechanic)/i,
    /incompetence|politicians|government (is|are) (the )?worst/i,
    /parking (in front|spot|ticket)/i,
    /recommendation(s)? for/i
  ];
  const signalPatterns = [
    /scam|phish|hacked|stolen|theft|breach|malware|fraud/i,
    /police|emergency|fire|flood|accident|injured/i,
    /suspicious (person|vehicle|activity)/i,
    /warning|alert|be careful|watch out/i
  ];
  const hasSignal = signalPatterns.some(p => p.test(t));
  if (hasSignal) return false;
  const hasNoise = noisePatterns.some(p => p.test(t));
  return hasNoise;
}

/**
 * Report validator — ensures required fields meet minimum requirements.
 */
function validateReport(title, type, description) {
  const errors = [];
  if (!title || title.trim().length < 5)
    errors.push('Title must be at least 5 characters');
  if (!type || type === '')
    errors.push('Incident type is required');
  if (!description || description.trim().length < 20)
    errors.push('Description must be at least 20 characters');
  return { valid: errors.length === 0, errors };
}

/**
 * Incident filter — applies type and severity filters to incident array.
 */
function filterIncidents(incidents, { type, severity, search } = {}) {
  return incidents.filter(inc => {
    if (type && type !== 'all' && inc.type !== type) return false;
    if (severity && severity !== 'all' && inc.severity !== severity) return false;
    if (search) {
      const haystack = `${inc.title} ${inc.tags?.join(' ')} ${inc.location?.neighborhood} ${inc.category}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });
}

// ─── TEST RUNNER ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
    results.push({ name, status: 'PASS' });
  } catch (err) {
    console.log(`  ❌  ${name}`);
    console.log(`      → ${err.message}`);
    failed++;
    results.push({ name, status: 'FAIL', error: err.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}", got "${actual}"`);
  }
}

function assertDeepIncludes(obj, key, value) {
  if (obj[key] !== value) {
    throw new Error(`Expected obj.${key} to be "${value}", got "${obj[key]}"`);
  }
}

// ─── RULE CATEGORIZER TESTS ───────────────────────────────────────────────────
console.log('\n📋  ruleCategorize() — Rule-Based Fallback Categorizer\n');

test('Happy path: phishing email detected', () => {
  const result = ruleCategorize('I got an email asking me to click a link and enter my password');
  assertEqual(result.category, 'phishing');
  assertEqual(result.severity, 'medium');
});

test('Happy path: data breach detection', () => {
  const result = ruleCategorize('Local gym says user data was breached and emails exposed');
  assertEqual(result.category, 'data_breach');
  assertEqual(result.severity, 'high');
});

test('Happy path: package theft', () => {
  const result = ruleCategorize('Someone stole packages from my porch again');
  assertEqual(result.category, 'package_theft');
  assertEqual(result.severity, 'medium');
});

test('Happy path: malware popup', () => {
  const result = ruleCategorize('A scary popup appeared saying my computer has a virus');
  assertEqual(result.category, 'malware');
  assertEqual(result.severity, 'high');
});

test('Happy path: wifi security threat', () => {
  const result = ruleCategorize('Suspicious hotspot mimicking our office wifi network detected');
  assertEqual(result.category, 'wifi_security');
  assertEqual(result.severity, 'high');
});

test('Edge case: empty string returns default', () => {
  const result = ruleCategorize('');
  assertEqual(result.category, 'other');
  assertEqual(result.severity, 'medium');
});

test('Edge case: unrelated gibberish returns default', () => {
  const result = ruleCategorize('asdfghjkl qwerty nothing here');
  assertEqual(result.category, 'other');
  assertEqual(result.severity, 'medium');
});

test('Edge case: uppercase input works', () => {
  const result = ruleCategorize('PHISHING SCAM CLICK HERE');
  assertEqual(result.category, 'phishing');
});

test('Edge case: mixed case input works', () => {
  const result = ruleCategorize('Got a fake Email with a link to Click');
  assertEqual(result.category, 'phishing');
});

// ─── NOISE FILTER TESTS ───────────────────────────────────────────────────────
console.log('\n🔇  isNoise() — Noise-to-Signal Filter\n');

test('Happy path: real scam report is NOT noise', () => {
  assert(!isNoise('My neighbor was targeted by a utility impersonation scam today'));
});

test('Happy path: phishing report is NOT noise', () => {
  assert(!isNoise('Warning! Phishing emails pretending to be Netflix are circulating'));
});

test('Happy path: theft report is NOT noise', () => {
  assert(!isNoise('Catalytic converter stolen from car on Oak St last night'));
});

test('Edge case: pure venting IS noise', () => {
  assert(isNoise('Ugh my neighbor parks in front of my house AGAIN so annoying'));
});

test('Edge case: service request IS noise', () => {
  assert(isNoise('Anyone know a good plumber? My sink is leaking'));
});

test('Edge case: political frustration IS noise', () => {
  assert(isNoise('The government is the worst incompetence at every level'));
});

test('Edge case: empty string is NOT flagged as noise', () => {
  // Empty string should not trigger noise (falls through without signal or noise patterns)
  assert(!isNoise(''));
});

// ─── REPORT VALIDATOR TESTS ───────────────────────────────────────────────────
console.log('\n📝  validateReport() — Input Validation\n');

test('Happy path: valid report passes validation', () => {
  const result = validateReport(
    'Phishing email targeting local residents',
    'digital',
    'I received an email claiming to be from Netflix asking me to click a suspicious link and enter payment info.'
  );
  assert(result.valid, 'Expected valid to be true');
  assert(result.errors.length === 0, 'Expected no errors');
});

test('Happy path: minimum length inputs pass validation', () => {
  const result = validateReport('Short', 'physical', 'This is exactly twenty chars!!');
  assert(result.valid, `Should pass with minimum valid input. Errors: ${result.errors.join(', ')}`);
});

test('Edge case: title too short fails', () => {
  const result = validateReport('Hi', 'digital', 'This is a valid description that is long enough for submission.');
  assert(!result.valid, 'Should fail with short title');
  assert(result.errors.some(e => e.includes('Title')), 'Should have title error');
});

test('Edge case: missing type fails', () => {
  const result = validateReport('Valid Title Here', '', 'This is a valid description that is long enough for submission.');
  assert(!result.valid, 'Should fail without type');
  assert(result.errors.some(e => e.includes('type')), 'Should have type error');
});

test('Edge case: description too short fails', () => {
  const result = validateReport('Valid Title Here', 'digital', 'Too short');
  assert(!result.valid, 'Should fail with short description');
  assert(result.errors.some(e => e.includes('Description')), 'Should have description error');
});

test('Edge case: all fields empty fails with multiple errors', () => {
  const result = validateReport('', '', '');
  assert(!result.valid);
  assert(result.errors.length === 3, `Expected 3 errors, got ${result.errors.length}`);
});

test('Edge case: whitespace-only title fails', () => {
  const result = validateReport('     ', 'digital', 'This is a valid description that is long enough.');
  assert(!result.valid, 'Whitespace-only title should fail');
});

// ─── INCIDENT FILTER TESTS ───────────────────────────────────────────────────
console.log('\n🔍  filterIncidents() — Search & Filter Logic\n');

const SAMPLE_INCIDENTS = [
  { id: '1', type: 'digital', severity: 'high', category: 'phishing', title: 'Netflix Phishing Email', tags: ['phishing', 'email'], location: { neighborhood: 'Downtown' } },
  { id: '2', type: 'physical', severity: 'medium', category: 'theft', title: 'Catalytic Converter Theft', tags: ['theft', 'vehicle'], location: { neighborhood: 'Midtown' } },
  { id: '3', type: 'digital', severity: 'high', category: 'data_breach', title: 'Gym Data Breach', tags: ['data-breach'], location: { neighborhood: 'Downtown' } },
  { id: '4', type: 'physical', severity: 'low', category: 'infrastructure', title: 'Road Closure', tags: ['infrastructure'], location: { neighborhood: 'Westside' } }
];

test('Happy path: filter by type=digital returns only digital incidents', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { type: 'digital' });
  assert(result.length === 2, `Expected 2, got ${result.length}`);
  assert(result.every(i => i.type === 'digital'), 'All should be digital');
});

test('Happy path: filter by severity=high returns only high incidents', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { severity: 'high' });
  assert(result.length === 2, `Expected 2 high incidents, got ${result.length}`);
});

test('Happy path: search by keyword finds matching incident', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { search: 'netflix' });
  assert(result.length === 1, `Expected 1 result, got ${result.length}`);
  assertEqual(result[0].id, '1');
});

test('Happy path: search by neighborhood finds matching incidents', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { search: 'downtown' });
  assert(result.length === 2, `Expected 2 Downtown incidents, got ${result.length}`);
});

test('Happy path: search by tag finds matching incident', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { search: 'vehicle' });
  assert(result.length === 1);
  assertEqual(result[0].id, '2');
});

test('Edge case: no filters returns all incidents', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, {});
  assertEqual(result.length, SAMPLE_INCIDENTS.length);
});

test('Edge case: filter=all returns all incidents', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { type: 'all' });
  assertEqual(result.length, SAMPLE_INCIDENTS.length);
});

test('Edge case: search with no match returns empty array', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { search: 'zzz_no_match_zzz' });
  assertEqual(result.length, 0);
});

test('Edge case: empty incidents array returns empty', () => {
  const result = filterIncidents([], { type: 'digital' });
  assertEqual(result.length, 0);
});

test('Edge case: combined type + severity filters work together', () => {
  const result = filterIncidents(SAMPLE_INCIDENTS, { type: 'digital', severity: 'high' });
  assert(result.length === 2, `Expected 2, got ${result.length}`);
  assert(result.every(i => i.type === 'digital' && i.severity === 'high'));
});

// ─── RELATIVE TIME TESTS ─────────────────────────────────────────────────────
console.log('\n⏰  relativeTime() — Relative Timestamp Formatter\n');

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

test('Happy path: just now for recent timestamp', () => {
  const result = relativeTime(new Date().toISOString());
  assertEqual(result, 'just now');
});

test('Happy path: minutes ago', () => {
  const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
  const result = relativeTime(fiveMinAgo);
  assertEqual(result, '5m ago');
});

test('Happy path: hours ago', () => {
  const threeHrsAgo = new Date(Date.now() - 3 * 3600000).toISOString();
  const result = relativeTime(threeHrsAgo);
  assertEqual(result, '3h ago');
});

test('Happy path: days ago', () => {
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
  const result = relativeTime(twoDaysAgo);
  assertEqual(result, '2d ago');
});

// ─── COMPUTE STATS TESTS ─────────────────────────────────────────────────────
console.log('\n📊  computeDashboardStats() — Dashboard Stat Computation\n');

function computeDashboardStats(incidents, noiseCount) {
  const total = incidents.length;
  const high = incidents.filter(i => i.severity === 'high').length;
  const verified = incidents.filter(i => i.verified).length;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  return { total, high, noise: noiseCount, verified, verifiedPct };
}

test('Happy path: computes stats from incident array', () => {
  const stats = computeDashboardStats(SAMPLE_INCIDENTS, 3);
  assertEqual(stats.total, 4);
  assertEqual(stats.high, 2);
  assertEqual(stats.noise, 3);
  assertEqual(stats.verified, 0); // SAMPLE_INCIDENTS don't have verified field
});

test('Edge case: empty incidents returns zeros', () => {
  const stats = computeDashboardStats([], 0);
  assertEqual(stats.total, 0);
  assertEqual(stats.high, 0);
  assertEqual(stats.verifiedPct, 0);
});

test('Happy path: verified percentage calculated correctly', () => {
  const testInc = [
    { severity: 'high', verified: true },
    { severity: 'low', verified: false },
    { severity: 'medium', verified: true },
    { severity: 'high', verified: true }
  ];
  const stats = computeDashboardStats(testInc, 2);
  assertEqual(stats.verifiedPct, 75);
  assertEqual(stats.high, 2);
});

// ─── REALTIME INCIDENT GENERATOR TESTS ───────────────────────────────────────
console.log('\n🔄  generateRealtimeIncident() — Real-Time Incident Generator\n');

const RT_TEMPLATES = [
  { type: "digital", category: "phishing", titles: ["Test Phishing"], severity: "medium", tags: ["phishing"], action_checklist: ["Action 1"] },
  { type: "physical", category: "vehicle", titles: ["Test Vehicle"], severity: "medium", tags: ["vehicle"], action_checklist: ["Action 2"] }
];

const RT_HOODS = [
  { name: "TestHood", lat: 37.77, lng: -122.41 }
];

let rtCounter = 100;
function generateRealtimeIncident(templates, neighborhoods) {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const hood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  return {
    id: 'INC-' + String(++rtCounter).padStart(3, '0'),
    timestamp: new Date().toISOString(),
    type: template.type, category: template.category, title,
    severity: template.severity,
    location: { neighborhood: hood.name, lat: hood.lat, lng: hood.lng },
    verified: Math.random() > 0.3, tags: [...template.tags],
    source: 'community', action_checklist: template.action_checklist
  };
}

test('Happy path: generates valid incident with all fields', () => {
  const inc = generateRealtimeIncident(RT_TEMPLATES, RT_HOODS);
  assert(inc.id.startsWith('INC-'), 'ID should start with INC-');
  assert(inc.timestamp, 'Should have timestamp');
  assert(inc.type === 'digital' || inc.type === 'physical', 'Type should match template');
  assert(inc.location.neighborhood === 'TestHood', 'Should use provided neighborhood');
  assert(inc.tags.length > 0, 'Should have tags');
});

test('Happy path: generates unique IDs', () => {
  const inc1 = generateRealtimeIncident(RT_TEMPLATES, RT_HOODS);
  const inc2 = generateRealtimeIncident(RT_TEMPLATES, RT_HOODS);
  assert(inc1.id !== inc2.id, 'IDs should be unique');
});

test('Happy path: timestamp is recent', () => {
  const inc = generateRealtimeIncident(RT_TEMPLATES, RT_HOODS);
  const diff = Date.now() - new Date(inc.timestamp).getTime();
  assert(diff < 1000, 'Timestamp should be within last second');
});

// ─── DISTANCE HELPER TESTS ───────────────────────────────────────────────────
console.log('\n📍  getDistance() — Geospatial Distance Calculator\n');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

test('Happy path: same location is 0 distance', () => {
  const dist = getDistance(37.77, -122.41, 37.77, -122.41);
  assert(dist < 0.001, `Expected near 0, got ${dist}`);
});

test('Happy path: known distance (SF to LA)', () => {
  const dist = getDistance(37.77, -122.41, 34.05, -118.24);
  assert(dist > 340 && dist < 360, `Expected ~350 miles, got ${dist}`);
});

test('Happy path: nearby location (within 1 mile)', () => {
  // Midtown SF to Downtown SF is approx 1.3 miles, let's pick closer points
  // 0.01 degrees lat is approx 0.69 miles
  const dist = getDistance(37.77, -122.41, 37.775, -122.41);
  assert(dist < 1.0, `Expected < 1 mile, got ${dist}`);
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(52));
console.log(`\n  Total: ${passed + failed} tests · ✅ ${passed} passed · ❌ ${failed} failed\n`);

if (failed > 0) {
  console.log('  Failed tests:');
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`    ✗ ${r.name}: ${r.error}`));
  console.log('');
  process.exit(1);
} else {
  console.log('  All tests passed! 🎉\n');
}

