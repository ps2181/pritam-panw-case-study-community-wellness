// ─── Community Guardian — Real-Time AI Engine ───────────────────────────────
// ─── DATA ───────────────────────────────────────────────────────────────────

const BASE_INCIDENTS = [
  { id: "INC-001", offsetHours: -2, type: "digital", category: "phishing", title: "Netflix Billing Scam Email", severity: "medium", location: { neighborhood: "Downtown", lat: 37.7849, lng: -122.4094 }, verified: true, tags: ["phishing", "email", "billing-scam"], source: "community", action_checklist: ["Do not click links in suspicious emails", "Report to Netflix at netflix.com/help", "Check email sender address carefully"] },
  { id: "INC-002", offsetHours: -3, type: "physical", category: "vehicle", title: "Catalytic Converter Theft Wave", severity: "medium", location: { neighborhood: "Elm District", lat: 37.7599, lng: -122.4148 }, verified: true, tags: ["theft", "vehicle", "catalytic-converter"], source: "community", action_checklist: ["Park in well-lit or enclosed areas", "Consider anti-theft shield installation", "File police report if targeted"] },
  { id: "INC-003", offsetHours: -4, type: "digital", category: "data_breach", title: "Local Gym Member Data Breach", severity: "high", location: { neighborhood: "Midtown", lat: 37.7749, lng: -122.4294 }, verified: true, tags: ["data-breach", "personal-info", "credit-card"], source: "news", action_checklist: ["Monitor your credit card statements", "Change your FitLife password immediately", "Enable 2FA on email and banking accounts", "Consider a temporary credit freeze"] }
];

const REALTIME_TEMPLATES = [
  { type: "digital", category: "phishing", titles: ["Amazon Order Confirmation Scam", "PayPal Suspicious Login Alert", "Bank Account Verification Email", "Apple ID Locked Phishing Text"], severity: "medium", tags: ["phishing", "email"], action_checklist: ["Do not click any links", "Verify directly with the company", "Report the message as spam"] },
  { type: "physical", category: "vehicle", titles: ["Car Break-in Reported", "Suspicious Vehicle Casing Neighborhood", "Hit and Run on Main Street", "Vehicle Vandalism Overnight"], severity: "medium", tags: ["vehicle", "crime"], action_checklist: ["File a police report", "Check security cameras", "Alert neighbors"] },
  { type: "digital", category: "malware", titles: ["Ransomware Email Wave Detected", "Fake Antivirus Download Circulating", "Trojan Disguised as Invoice PDF", "Crypto Mining Malware Alert"], severity: "high", tags: ["malware", "security"], action_checklist: ["Update your antivirus software", "Do not open unknown attachments", "Report to IT department"] },
  { type: "physical", category: "package_theft", titles: ["Package Stolen from Porch", "Delivery Driver Impersonation", "Multiple Deliveries Missing This Week", "Ring Camera Catches Package Thief"], severity: "medium", tags: ["theft", "package"], action_checklist: ["Use secure delivery options", "Install a doorbell camera", "Report to police"] },
  { type: "physical", category: "infrastructure", titles: ["Power Outage in District", "Gas Leak Investigation Underway", "Road Sinkhole Forming", "Traffic Light Malfunction at Intersection"], severity: "medium", tags: ["infrastructure", "alert"], action_checklist: ["Avoid the affected area", "Follow official updates", "Report to 311"] },
  { type: "digital", category: "data_breach", titles: ["Online Retailer Data Leak", "Local Hospital Records Exposed", "Restaurant Chain Payment Data Breach", "Social Media Account Dump Detected"], severity: "high", tags: ["data-breach", "security"], action_checklist: ["Change your passwords immediately", "Monitor bank statements", "Enable 2FA everywhere"] }
];

const NEIGHBORHOODS = [
  { name: "Downtown", lat: 37.7849, lng: -122.4094 }, { name: "Midtown", lat: 37.7749, lng: -122.4294 },
  { name: "Elm District", lat: 37.7599, lng: -122.4148 }, { name: "Westside", lat: 37.7749, lng: -122.4594 },
  { name: "Northgate", lat: 37.8049, lng: -122.4194 }, { name: "Arts Quarter", lat: 37.7849, lng: -122.3994 },
  { name: "Riverside", lat: 37.7549, lng: -122.3894 }, { name: "Oak District", lat: 37.7699, lng: -122.4394 },
  { name: "Sunnyvale Heights", lat: 37.7449, lng: -122.4094 }, { name: "Marina", lat: 37.8020, lng: -122.4370 },
  { name: "SoMa", lat: 37.7785, lng: -122.3950 }, { name: "Castro", lat: 37.7609, lng: -122.4350 }
];

const CITY_PRESETS = [
  { name: "San Francisco, CA", lat: 37.7749, lng: -122.4194, state: "CA" },
  { name: "New York, NY", lat: 40.7128, lng: -74.0060, state: "NY" },
  { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437, state: "CA" },
  { name: "Chicago, IL", lat: 41.8781, lng: -87.6298, state: "IL" },
  { name: "Miami, FL", lat: 25.7617, lng: -80.1918, state: "FL" },
  { name: "Austin, TX", lat: 30.2672, lng: -97.7431, state: "TX" },
  { name: "Seattle, WA", lat: 47.6062, lng: -122.3321, state: "WA" },
  { name: "Denver, CO", lat: 39.7392, lng: -104.9903, state: "CO" },
  { name: "Washington, DC", lat: 38.9072, lng: -77.0369, state: "DC" },
  { name: "Boston, MA", lat: 42.3601, lng: -71.0589, state: "MA" },
  { name: "Atlanta, GA", lat: 33.7490, lng: -84.3880, state: "GA" },
  { name: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, state: "AZ" },
  { name: "New Orleans, LA", lat: 29.9511, lng: -90.0715, state: "LA" }
];

const NOISE = [
  { raw: "ugh my neighbor parks in front of my house AGAIN so annoying i hate living here", reason: "Personal frustration — no safety incident" },
  { raw: "the city takes forever to fix potholes typical government incompetence!!", reason: "Opinion/venting — no actionable info" },
  { raw: "anyone know a good plumber? my sink is leaking", reason: "Service request — not a safety concern" }
];

const CIRCLES = [
  { name: "Family", icon: "👨‍👩‍👧", members: ["JD", "MA", "TL"], lastStatus: "All safe · 2h ago", color: "#a29bfe" },
  { name: "Block Neighbors", icon: "🏘", members: ["JD", "RK", "SP", "OM"], lastStatus: "No alerts · 5h ago", color: "#00e5ff" },
  { name: "Coworkers", icon: "💼", members: ["JD", "CE", "PW"], lastStatus: "All clear · 1d ago", color: "#2ed573" }
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let aiOnline = true;
let activeFilter = 'all';
let aiCategorizeTimer = null;
let selectedEmoji = '👨‍👩‍👧';
let userLocation = { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, state: 'CA', radius: 50 };
let localCircles = [...CIRCLES];
let localIncidents = [];
let noiseCount = NOISE.length;
let incidentCounter = 10;
let refreshSeconds = 180;
let leafletMap = null;
let mapMarkers = [];
let realtimeInterval = null;
let seniorMode = localStorage.getItem('seniorMode') === 'true';

function getApiKey() { return localStorage.getItem('gemini_api_key') || ''; }

// ─── LOCATION SELECTION ──────────────────────────────────────────────────────
function initLocation() {
  const saved = localStorage.getItem('userLocation');
  if (saved) {
    userLocation = JSON.parse(saved);
  }
  updateLocationUI();
  renderLocationOptions();
}

function updateLocationUI() {
  const display = document.getElementById('currentLocationDisplay');
  if (display) display.textContent = userLocation.name;

  const radiusVal = document.getElementById('radiusValueDisplay');
  if (radiusVal) radiusVal.textContent = `${userLocation.radius} mi`;

  const radiusSlider = document.getElementById('radiusSlider');
  if (radiusSlider) radiusSlider.value = userLocation.radius;

  // New settings page elements
  const settingsDisplay = document.getElementById('settingsRadiusDisplay');
  if (settingsDisplay) settingsDisplay.textContent = `${userLocation.radius} mi`;

  const settingsSlider = document.getElementById('settingsRadiusSlider');
  if (settingsSlider) settingsSlider.value = userLocation.radius;

  const settingsSelect = document.getElementById('settingsLocationSelect');
  if (settingsSelect) settingsSelect.value = userLocation.name;

  // Update sidebar user zone
  const zoneEl = document.querySelector('.user-zone');
  if (zoneEl) zoneEl.textContent = `Zone: ${userLocation.name.split(',')[0]}`;
}

function renderLocationOptions() {
  const container = document.getElementById('locationOptionsContainer');
  const settingsSelect = document.getElementById('settingsLocationSelect');

  const optionsHTML = CITY_PRESETS.map(city => `
    <div class="location-option ${city.name === userLocation.name ? 'current' : ''}" onclick="selectLocationByName('${city.name}')">
      <span class="location-option-icon">📍</span>
      <span>${city.name}</span>
    </div>
  `).join('');

  const selectHTML = CITY_PRESETS.map(city => `
    <option value="${city.name}" ${city.name === userLocation.name ? 'selected' : ''}>${city.name}</option>
  `).join('');

  if (container) container.innerHTML = optionsHTML;
  if (settingsSelect) settingsSelect.innerHTML = selectHTML;
}

function toggleLocationDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('locationDropdown');
  dropdown.classList.toggle('open');

  // Close when clicking outside
  const closeDropdown = (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
      document.removeEventListener('click', closeDropdown);
    }
  };
  document.addEventListener('click', closeDropdown);
}

function selectLocationByName(cityName) {
  const city = CITY_PRESETS.find(c => c.name === cityName);
  if (city) {
    userLocation = { ...userLocation, ...city };
    saveAndRefreshLocation();
  }
}

function updateRadius(val) {
  userLocation.radius = parseInt(val);
  document.getElementById('radiusValueDisplay').textContent = `${val} mi`;
  saveAndRefreshLocation();
}

function saveAndRefreshLocation() {
  localStorage.setItem('userLocation', JSON.stringify(userLocation));
  updateLocationUI();
  renderLocationOptions();

  if (leafletMap) {
    leafletMap.setView([userLocation.lat, userLocation.lng], 12);
    clearMapMarkers();
    // Re-add existing incidents that are within the new radius
    localIncidents.forEach(inc => addMapMarker(inc));
  }

  showToast('info', `📍 Location set to ${userLocation.name}`);

  // Trigger re-fetch
  fetchAllLiveData();
}

async function detectLocation() {
  if (!navigator.geolocation) {
    showToast('error', 'Geolocation is not supported by your browser');
    return;
  }

  showToast('info', '🛰 Detecting location...');
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {
      // Reverse geocode using Nominatim (open layer)
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      const data = await res.json();
      const cityName = data.address.city || data.address.town || data.address.county || 'Unknown Location';
      const state = data.address.state_code || data.address.state || '';

      userLocation = {
        ...userLocation,
        name: `${cityName}, ${state}`,
        lat, lng, state
      };
      saveAndRefreshLocation();
    } catch {
      userLocation = { ...userLocation, name: 'Custom Location', lat, lng };
      saveAndRefreshLocation();
    }
  }, () => {
    showToast('error', 'Unable to retrieve your location');
  });
}

// ─── INIT INCIDENTS WITH RELATIVE TIMESTAMPS ─────────────────────────────────
function initIncidents() {
  const now = Date.now();
  return BASE_INCIDENTS.map(inc => {
    const copy = { ...inc };
    copy.timestamp = new Date(now + inc.offsetHours * 3600000).toISOString();
    copy.location = { ...inc.location };
    delete copy.offsetHours;
    return copy;
  });
}

// ─── RELATIVE TIME ───────────────────────────────────────────────────────────
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

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if ((pageId === 'dashboard' && n.textContent.includes('Dashboard')) ||
      (pageId === 'feed' && n.textContent.includes('Feed')) ||
      (pageId === 'digest' && n.textContent.includes('Digest')) ||
      (pageId === 'circles' && n.textContent.includes('Circles')) ||
      (pageId === 'report' && n.textContent.includes('Report')) ||
      (pageId === 'noise' && n.textContent.includes('Noise')) ||
      (pageId === 'settings' && n.textContent.includes('Settings'))) {
      n.classList.add('active');
    }
  });
  if (pageId === 'dashboard') { updateDashboard(); initMap(); }
  if (pageId === 'digest') generateDigest();
  if (pageId === 'feed') renderFeed();
  if (pageId === 'noise') renderNoise();
  if (pageId === 'circles') renderCircles();
}

// ─── AI MODE ─────────────────────────────────────────────────────────────────
function toggleAIMode() {
  aiOnline = !aiOnline;
  const badge = document.getElementById('aiBadge');
  const dbadge = document.getElementById('digestAiBadge');
  if (aiOnline) {
    badge.textContent = '⚡ AI: ONLINE';
    badge.classList.remove('offline');
    if (dbadge) { dbadge.textContent = '⚡ AI GENERATED'; dbadge.classList.remove('offline'); }
    showToast('info', '⚡ AI mode enabled — Using Gemini API for summaries');
  } else {
    badge.textContent = '⚠ AI: OFFLINE';
    badge.classList.add('offline');
    if (dbadge) { dbadge.textContent = '⚠ RULE-BASED FALLBACK'; dbadge.classList.add('offline'); }
    showToast('error', '⚠ AI offline — Fallback rule-based mode active');
  }
  generateDigest();
}

function toggleAIFromSettings(btn) {
  btn.classList.toggle('on');
  aiOnline = btn.classList.contains('on');
  toggleAIMode();
}

// ─── SENIOR MODE ─────────────────────────────────────────────────────────────
function toggleSeniorMode() {
  seniorMode = !seniorMode;
  localStorage.setItem('seniorMode', seniorMode);
  applySeniorMode();
  showToast('info', seniorMode ? '👵 Senior Mode enabled' : '👤 Senior Mode disabled');
}

function applySeniorMode() {
  const sidebarToggle = document.getElementById('sidebarSeniorToggle');
  const settingsToggle = document.getElementById('settingsSeniorToggle');

  if (seniorMode) {
    document.body.classList.add('senior-mode');
    if (sidebarToggle) sidebarToggle.classList.add('on');
    if (settingsToggle) settingsToggle.classList.add('on');
  } else {
    document.body.classList.remove('senior-mode');
    if (sidebarToggle) sidebarToggle.classList.remove('on');
    if (settingsToggle) settingsToggle.classList.remove('on');
  }
}

function saveApiKey() {
  const key = document.getElementById('geminiKeyInput').value.trim();
  if (key) {
    localStorage.setItem('gemini_api_key', key);
    document.getElementById('apiKeyStatus').innerHTML = '<span style="color:var(--safe);">✓ API key saved securely to browser storage</span>';
    showToast('success', '🔑 Gemini API key saved — AI features enabled');
  } else {
    document.getElementById('apiKeyStatus').innerHTML = '<span style="color:var(--danger);">Please enter a valid API key</span>';
  }
}

// ─── GEMINI AI CALLS ─────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const key = getApiKey();
  if (!key) throw new Error('No API key');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  if (!response.ok) throw new Error('API error ' + response.status);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─── TRUST LEVEL HELPER ─────────────────────────────────────────────────────
function getTrustLevel(inc) {
  if (inc.source === 'news' || inc.source === 'police') return { label: 'OFFICIAL', class: 'trust-official' };
  const count = inc.verifications || 0;
  if (inc.verified || count >= 3) return { label: 'HIGH TRUST', class: 'trust-high' };
  if (count >= 1) return { label: 'CORROBORATED', class: 'trust-medium' };
  return { label: 'COMMUNITY', class: 'trust-low' };
}

// ─── DISTANCE HELPER ─────────────────────────────────────────────────────────
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

// ─── INCIDENT CARD BUILDER ───────────────────────────────────────────────────
function buildIncidentCard(inc, mini = false) {
  const icons = { digital: '💻', physical: '🏘', infrastructure: '🚧', other: '❓' };
  const timeAgo = relativeTime(inc.timestamp);
  const isNew = (Date.now() - new Date(inc.timestamp).getTime()) < 120000;

  const card = document.createElement('div');
  card.className = `incident-card sev-${inc.severity}${isNew ? ' new-incident' : ''}`;
  card.dataset.id = inc.id;

  const sourceHTML = inc.source ? `<span class="source-badge">${inc.source}</span>` : '';
  const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';

  const trust = getTrustLevel(inc);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-type-icon">${icons[inc.type] || '❓'}</div>
      <div class="card-meta">
        <div class="card-title">${inc.title}${newBadge}</div>
        <div class="card-time">📍 ${inc.location.neighborhood} · ${timeAgo} ${sourceHTML}</div>
      </div>
      <div class="card-right">
        <div class="severity-badge">${inc.severity}</div>
        <div class="type-badge">${inc.type}</div>
        <div class="trust-badge ${trust.class}">${trust.label}</div>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <div class="card-tags" style="margin-top: 0;">
        ${inc.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      ${getNearbyBadge(inc)}
    </div>
    ${inc.verifications > 0 ? `<div class="neighbors-verified">👥 Verified by ${inc.verifications} neighbors</div>` : ''}
    ${!mini ? `
    <div class="card-expand" id="expand-${inc.id}">
      <div class="ai-summary-block" id="ai-block-${inc.id}">
        <div class="ai-block-header" id="ai-header-${inc.id}">⚡ AI SUMMARY</div>
        <div id="ai-content-${inc.id}"><div class="ai-loading"><div class="spinner"></div> Generating summary...</div></div>
      </div>
      <div style="margin-top:14px;">
        <div style="font-size:11px;color:var(--muted);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Recommended Actions</div>
        <ul class="checklist">
          ${inc.action_checklist.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    </div>` : ''}
  `;

  if (!mini) card.addEventListener('click', () => toggleCard(card, inc));
  return card;
}

function getNearbyBadge(inc) {
  if (!inc.location.lat || !userLocation.lat) return '';
  const dist = getDistance(userLocation.lat, userLocation.lng, inc.location.lat, inc.location.lng);
  if (dist <= 1.0) {
    return `<span class="nearby-badge">NEARBY (${dist.toFixed(1)} mi)</span>`;
  }
  return '';
}

async function toggleCard(card, inc) {
  const isExpanded = card.classList.contains('expanded');
  document.querySelectorAll('.incident-card.expanded').forEach(c => c.classList.remove('expanded'));
  if (!isExpanded) {
    card.classList.add('expanded');
    await loadAISummary(inc);
  }
}

async function loadAISummary(inc) {
  const contentEl = document.getElementById(`ai-content-${inc.id}`);
  const headerEl = document.getElementById(`ai-header-${inc.id}`);
  if (!contentEl) return;

  if (!aiOnline || !getApiKey()) {
    headerEl.className = 'ai-block-header fallback';
    headerEl.textContent = '⚠ RULE-BASED FALLBACK';
    contentEl.innerHTML = `<p style="font-size:13px;">${generateFallbackSummary(inc)}</p>`;
    return;
  }

  contentEl.innerHTML = '<div class="ai-loading"><div class="spinner"></div> AI analyzing incident...</div>';
  try {
    const text = await callGemini(`You are a calm, factual community safety assistant. In 2-3 sentences, provide a clear, non-alarmist summary of this safety incident. Be empowering, not fear-inducing.\n\nIncident: "${inc.title}"\nType: ${inc.type} / ${inc.category}\nLocation: ${inc.location.neighborhood}\nTags: ${inc.tags.join(', ')}\n\nRespond with ONLY the summary text.`);
    headerEl.className = 'ai-block-header';
    headerEl.textContent = '⚡ AI SUMMARY — Gemini';
    contentEl.innerHTML = `<p style="font-size:13px;">${text}</p>`;
  } catch {
    headerEl.className = 'ai-block-header fallback';
    headerEl.textContent = '⚠ FALLBACK MODE';
    contentEl.innerHTML = `<p style="font-size:13px;">${generateFallbackSummary(inc)}</p>`;
  }
}

function generateFallbackSummary(inc) {
  const templates = {
    phishing: `This is a ${inc.severity}-severity phishing attempt reported in ${inc.location.neighborhood}. Phishing scams attempt to steal credentials or money by impersonating trusted services. Stay alert and verify any unexpected communications.`,
    data_breach: `A data breach affecting ${inc.location.neighborhood} residents has been reported. If you are a member of the affected service, your personal data may be at risk. Take immediate steps to secure your accounts.`,
    malware: `Malware or tech-support scam activity has been detected in ${inc.location.neighborhood}. Fraudsters use fake security alerts to gain remote access to your device. Do not engage with unsolicited popups or calls.`,
    vehicle: `Vehicle theft or tampering incidents have been reported in ${inc.location.neighborhood}. Take preventive measures to protect your vehicle, especially overnight.`,
    package_theft: `Package theft has been reported in ${inc.location.neighborhood}. Consider using secure delivery options and sharing information with neighbors to deter repeat incidents.`,
    scam: `A scam targeting residents has been reported in ${inc.location.neighborhood}. Be skeptical of unsolicited visitors or callers claiming to represent official organizations.`,
    vulnerability: `This is a ${inc.severity}-severity security vulnerability (CVE) that may affect software or systems you use. CVEs are documented flaws that attackers could exploit. Review the technical details and apply relevant security patches immediately.`,
    default: `A ${inc.severity}-severity ${inc.type} incident has been reported in ${inc.location.neighborhood}. Review the recommended actions below to protect yourself.`
  };
  return templates[inc.category] || templates.default;
}

// ─── RENDER FUNCTIONS ────────────────────────────────────────────────────────
function renderFeed() {
  const container = document.getElementById('incidentFeed');
  if (!container) return;
  container.innerHTML = '';
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  let filtered = localIncidents.filter(inc => {
    if (activeFilter === 'digital' && inc.type !== 'digital') return false;
    if (activeFilter === 'physical' && inc.type !== 'physical') return false;
    if (activeFilter === 'high' && inc.severity !== 'high') return false;
    if (search) {
      const haystack = `${inc.title} ${inc.tags.join(' ')} ${inc.location.neighborhood} ${inc.category}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><div class="title">No incidents found</div><div class="body">Try adjusting your search or filters</div></div>`;
    return;
  }
  filtered.forEach(inc => container.appendChild(buildIncidentCard(inc)));
  document.getElementById('incidentBadge').textContent = localIncidents.length;
}

function renderDashboard() {
  const container = document.getElementById('dashboardFeed');
  if (!container) return;
  container.innerHTML = '';
  const highPriority = localIncidents.filter(i => i.severity === 'high').slice(0, 3);
  highPriority.forEach(inc => container.appendChild(buildIncidentCard(inc, true)));
}

function renderNoise() {
  const container = document.getElementById('noiseList');
  if (!container) return;
  container.innerHTML = NOISE.map(n => `
    <div class="noise-item">
      <div class="noise-verdict filtered">NOISE</div>
      <div>
        <div class="noise-text">"${n.raw}"</div>
        <div class="noise-reason">🤖 AI: ${n.reason}</div>
      </div>
    </div>
  `).join('');
}

function renderCircles() {
  const container = document.getElementById('circlesGrid');
  if (!container) return;
  container.innerHTML = '';
  localCircles.forEach((c) => {
    const avatarColors = ['#a29bfe', '#00e5ff', '#2ed573', '#ff9f43', '#ff4757'];
    const card = document.createElement('div');
    card.className = 'circle-card';
    card.innerHTML = `
      <div class="circle-header">
        <div class="circle-avatar" style="background:${c.color}20;border:1px solid ${c.color}40;font-size:18px;">${c.icon}</div>
        <div>
          <div class="circle-name">${c.name}</div>
          <div class="circle-count">${c.members.length} member${c.members.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="circle-members">
        ${c.members.map((m, mi) => `<div class="member-avatar" style="background:${avatarColors[mi % avatarColors.length]};">${m}</div>`).join('')}
      </div>
      <button class="status-update-btn" onclick="sendStatusUpdate('${c.name}')">+ Send Status Update</button>
      <div class="last-status">🕐 ${c.lastStatus}</div>
    `;
    container.appendChild(card);
  });
}

// ─── DYNAMIC DASHBOARD ───────────────────────────────────────────────────────
function computeStats() {
  const total = localIncidents.length;
  const high = localIncidents.filter(i => i.severity === 'high').length;
  const verified = localIncidents.filter(i => i.verified).length;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  const cyber = localIncidents.filter(i => i.category === 'vulnerability').length;
  return { total, high, noise: noiseCount, verified, verifiedPct, cyber };
}

function animateCounter(el, target) {
  const start = parseInt(el.textContent) || 0;
  if (start === target) return;
  const duration = 600;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateDashboard() {
  const stats = computeStats();
  animateCounter(document.getElementById('statTotal'), stats.total);
  animateCounter(document.getElementById('statHigh'), stats.high);
  animateCounter(document.getElementById('statNoise'), stats.noise);
  animateCounter(document.getElementById('statVerified'), stats.verified);
  animateCounter(document.getElementById('statCyber'), stats.cyber);

  const tc = document.getElementById('statTotalChange');
  tc.className = 'stat-change up';
  tc.textContent = `↑ ${Math.max(0, stats.total - 8)} vs last week`;

  const hc = document.getElementById('statHighChange');
  hc.className = 'stat-change up';
  hc.textContent = `${stats.high} critical this week`;

  const nc = document.getElementById('statNoiseChange');
  nc.className = 'stat-change down';
  nc.textContent = `AI filtered ${stats.noise} reports`;

  const vc = document.getElementById('statVerifiedChange');
  vc.className = 'stat-change down';
  vc.textContent = `${stats.verifiedPct}% verification rate`;

  const cc = document.getElementById('statCyberChange');
  if (cc) {
    cc.className = 'stat-change up';
    cc.textContent = `${stats.cyber} active vulnerabilities`;
  }

  renderSparklines();
  renderDashboard();
  updateAlertBanner();
}

function renderSparklines() {
  const sparkTotal = document.getElementById('sparkTotal');
  const sparkHigh = document.getElementById('sparkHigh');
  if (!sparkTotal) return;
  const totalData = [5, 7, 4, 8, 6, 9, localIncidents.length];
  const highData = [2, 3, 2, 4, 3, 5, localIncidents.filter(i => i.severity === 'high').length];
  sparkTotal.innerHTML = totalData.map(v => `<div class="bar" style="height:${Math.max(4, (v / Math.max(...totalData)) * 24)}px;"></div>`).join('');
  sparkHigh.innerHTML = highData.map(v => `<div class="bar" style="height:${Math.max(4, (v / Math.max(...highData)) * 24)}px;background:var(--danger);"></div>`).join('');
}

function updateAlertBanner() {
  const cats = {};
  localIncidents.filter(i => i.severity === 'high').forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
  let topCat = 'phishing', topCount = 0;
  Object.entries(cats).forEach(([k, v]) => { if (v > topCount) { topCat = k; topCount = v; } });
  const banner = document.querySelector('.alert-banner');
  if (banner) {
    const catNames = { phishing: 'Phishing Surge', data_breach: 'Data Breach Alert', malware: 'Malware Wave', wifi_security: 'WiFi Security Alert', romance_scam: 'Romance Scam Alert', scam: 'Scam Alert', vehicle: 'Vehicle Crime Alert', package_theft: 'Package Theft Alert', infrastructure: 'Infrastructure Alert' };
    banner.querySelector('.title').textContent = `Active Alert: ${catNames[topCat] || 'Safety Alert'}`;
    banner.querySelector('.body').textContent = `${topCount} confirmed ${topCat.replace(/_/g, ' ')} incidents in the last 48 hours. See AI Digest for details.`;
  }
}

// ─── AI DIGEST ───────────────────────────────────────────────────────────────
async function generateDigest() {
  const bodyEl = document.getElementById('digestBody');
  const metaEl = document.getElementById('digestMeta');
  const dbadge = document.getElementById('digestAiBadge');
  const checklistEl = document.getElementById('digestChecklist');
  const trendsEl = document.getElementById('digestTrends');
  if (!bodyEl) return;

  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  if (metaEl) metaEl.textContent = `Generated ${now} · ${new Date().toLocaleTimeString()}`;

  if (!aiOnline || !getApiKey()) {
    if (dbadge) { dbadge.textContent = '⚠ RULE-BASED FALLBACK'; dbadge.classList.add('offline'); }
    bodyEl.innerHTML = generateFallbackDigest();
    if (checklistEl) checklistEl.innerHTML = getFallbackChecklist();
    if (trendsEl) trendsEl.innerHTML = getFallbackTrends();
    return;
  }

  if (dbadge) { dbadge.textContent = '⚡ AI GENERATED — Gemini'; dbadge.classList.remove('offline'); }
  bodyEl.innerHTML = `<div class="ai-loading"><div class="spinner"></div> Analyzing ${localIncidents.length} community reports via Gemini...</div>`;

  const summary = localIncidents.slice(0, 15).map(i => `- [${i.severity.toUpperCase()}] ${i.title} (${i.type}, ${i.location.neighborhood}, ${relativeTime(i.timestamp)})`).join('\n');
  try {
    const text = await callGemini(`You are a calm, empowering community safety assistant generating a daily digest. Based on these recent incidents, write a 3-4 sentence safety digest:\n1. Summarize main threat patterns without causing anxiety\n2. Highlight the most important thing residents should know\n3. End with an empowering, actionable statement\n\nIncidents:\n${summary}\n\nTone: Clear, calm, informative. NOT alarmist. Respond with ONLY the digest text.`);
    bodyEl.innerHTML = `<p>${text}</p>`;
  } catch {
    bodyEl.innerHTML = generateFallbackDigest();
    if (dbadge) { dbadge.textContent = '⚠ FALLBACK MODE'; dbadge.classList.add('offline'); }
  }
  if (checklistEl) checklistEl.innerHTML = getFallbackChecklist();
  if (trendsEl) trendsEl.innerHTML = getFallbackTrends();
}

function generateFallbackDigest() {
  const stats = computeStats();
  const digitalPct = Math.round((localIncidents.filter(i => i.type === 'digital').length / Math.max(1, stats.total)) * 100);
  return `<p>Today's safety digest shows <strong>${stats.total} incidents</strong> tracked, with digital threats accounting for ${digitalPct}% of reports. The most active threat type is <strong>phishing and social engineering</strong>. Property crime including catalytic converter theft and package theft remains elevated. Your neighborhood's safety posture is moderate — stay alert to suspicious emails and verify unexpected visitors.</p>`;
}

function getFallbackChecklist() {
  const actions = [
    "Verify unexpected emails before clicking links — phishing is surging this week",
    "Check accounts associated with any reported data breaches",
    "Avoid areas with reported infrastructure issues",
    "Remind elderly family members about phone and romance scams",
    "Park vehicles in well-lit areas overnight — vehicle crime remains active"
  ];
  return actions.map(a => `<li>${a}</li>`).join('');
}

function getFallbackTrends() {
  const stats = computeStats();
  const digitalCount = localIncidents.filter(i => i.type === 'digital').length;
  return `<p style="margin-bottom:8px;">📈 <strong>Phishing up 40%</strong> vs last week — tax season driving scams.</p>
  <p style="margin-bottom:8px;">📊 <strong>Digital incidents: ${digitalCount}/${stats.total}</strong> — elevated this week.</p>
  <p style="margin-bottom:8px;">📉 <strong>Physical crime steady</strong> — no significant change.</p>
  <p>🔍 <strong>Seniors targeted</strong> in ${localIncidents.filter(i => i.tags.includes('seniors')).length} incidents this week.</p>`;
}

// ─── FILTER ───────────────────────────────────────────────────────────────────
function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFeed();
}

function filterFeed() { renderFeed(); }

// ─── REPORT ───────────────────────────────────────────────────────────────────
function validateReport() {
  const title = document.getElementById('reportTitle').value;
  const desc = document.getElementById('reportDesc').value;
  document.getElementById('titleError').style.display = title.length > 0 && title.length < 5 ? 'block' : 'none';
  document.getElementById('typeError').style.display = 'none';
  document.getElementById('descError').style.display = desc.length > 0 && desc.length < 20 ? 'block' : 'none';
  document.getElementById('noiseError').style.display = 'none';
}

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

function aiCategorize() {
  clearTimeout(aiCategorizeTimer);
  const desc = document.getElementById('reportDesc').value;
  if (desc.length < 15) { document.getElementById('aiSuggestionBlock').style.display = 'none'; return; }
  aiCategorizeTimer = setTimeout(async () => {
    const block = document.getElementById('aiSuggestionBlock');
    const content = document.getElementById('aiSuggestionContent');
    block.style.display = 'block';
    content.innerHTML = '<div class="ai-loading"><div class="spinner"></div> AI categorizing...</div>';

    if (!aiOnline || !getApiKey()) {
      const suggestion = ruleCategorize(desc);
      content.innerHTML = `<p>📋 Suggested category: <strong>${suggestion.category}</strong> · Severity: <strong>${suggestion.severity}</strong><br><span style="color:var(--muted);">(Rule-based fallback)</span></p>`;
      return;
    }

    try {
      const raw = await callGemini(`Categorize this community safety report. Respond ONLY with a JSON object: {category (phishing/data_breach/malware/wifi_security/romance_scam/vehicle/package_theft/scam/infrastructure/other), severity (low/medium/high), tags (array of 2-3 strings)}.\n\nReport: "${desc}"\n\nRespond with ONLY valid JSON.`);
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      content.innerHTML = `<p>🤖 AI Suggestion: <strong>${parsed.category}</strong> · Severity: <strong>${parsed.severity}</strong></p>
        <p style="margin-top:4px;color:var(--muted);">Tags: ${(parsed.tags || []).map(t => `<span class="tag">${t}</span>`).join(' ')}</p>
        <p style="margin-top:6px;font-size:11px;color:var(--muted);">You can override these suggestions.</p>`;
      if (!document.getElementById('reportType').value) {
        const typeMap = { phishing: 'digital', data_breach: 'digital', malware: 'digital', wifi_security: 'digital', romance_scam: 'digital', vulnerability: 'digital', vehicle: 'physical', package_theft: 'physical', scam: 'physical', infrastructure: 'infrastructure' };
        document.getElementById('reportType').value = typeMap[parsed.category] || 'other';
      }
    } catch {
      const suggestion = ruleCategorize(desc);
      content.innerHTML = `<p>📋 Suggested: <strong>${suggestion.category}</strong> · Severity: <strong>${suggestion.severity}</strong><br><span style="color:var(--muted);font-size:11px;">(Fallback mode)</span></p>`;
    }
  }, 800);
}

function ruleCategorize(text) {
  const t = text.toLowerCase();
  if (t.includes('breach') || t.includes('hacked') || t.includes('data exposed') || t.includes('data leak')) return { category: 'data_breach', severity: 'high' };
  if (t.includes('phish') || t.includes('email') || t.includes('password') || t.includes('click') || t.includes('scam')) return { category: 'phishing', severity: 'medium' };
  if (t.includes('stolen') || t.includes('theft') || t.includes('stole') || t.includes('package')) return { category: 'package_theft', severity: 'medium' };
  if (t.includes('wifi') || t.includes('network') || t.includes('hotspot')) return { category: 'wifi_security', severity: 'high' };
  if (t.includes('popup') || t.includes('virus') || t.includes('malware')) return { category: 'malware', severity: 'high' };
  if (t.includes('cve-') || t.includes('vulnerability') || t.includes('exploit') || t.includes('zero-day')) return { category: 'vulnerability', severity: 'high' };
  return { category: 'other', severity: 'medium' };
}

function submitReport() {
  const title = document.getElementById('reportTitle').value.trim();
  const type = document.getElementById('reportType').value;
  const desc = document.getElementById('reportDesc').value.trim();
  const neighborhood = document.getElementById('reportNeighborhood').value.trim();
  const formSuccess = document.getElementById('formSuccess');

  document.getElementById('titleError').style.display = 'none';
  document.getElementById('typeError').style.display = 'none';
  document.getElementById('descError').style.display = 'none';

  let valid = true;
  if (title.length < 5) { document.getElementById('titleError').style.display = 'block'; valid = false; }
  if (!type) { document.getElementById('typeError').style.display = 'block'; valid = false; }
  if (desc.length < 20) { document.getElementById('descError').style.display = 'block'; valid = false; }
  if (valid && isNoise(desc)) {
    document.getElementById('noiseError').style.display = 'block';
    showToast('error', '🤖 AI Filter: This report looks like noise (venting or off-topic).');
    valid = false;
  }
  if (!valid) return;

  // ─── CORROBORATION LOGIC ───────────────────────────────────────────────────
  const words = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const hood = NEIGHBORHOODS.find(n => n.name.toLowerCase() === neighborhood.toLowerCase()) || NEIGHBORHOODS[0];

  const existing = localIncidents.find(inc => {
    if (inc.type !== type) return false;
    // Only corroborate within the last 24 hours
    const ageMins = (Date.now() - new Date(inc.timestamp).getTime()) / 60000;
    if (ageMins > 1440) return false;

    const dist = getDistance(hood.lat, hood.lng, inc.location.lat, inc.location.lng);
    if (dist > 1.5) return false; // Slightly larger radius for corroboration

    // Check for keyword overlap
    const incWords = inc.title.toLowerCase().split(/\W+/);
    const overlap = words.filter(w => incWords.includes(w));
    return overlap.length >= 2 || (overlap.length >= 1 && dist < 0.3);
  });

  if (existing) {
    existing.verifications = (existing.verifications || 0) + 1;
    if (existing.verifications >= 3) {
      existing.verified = true;
      existing.severity = existing.severity === 'low' ? 'medium' : existing.severity; // Escalate severity
    }

    showToast('success', `👥 Thanks! Corroboration added for: "${existing.title}" (Trust Level: ${getTrustLevel(existing).label})`);
    clearReport();
    renderFeed();
    updateDashboard();
    return;
  }
  // ───────────────────────────────────────────────────────────────────────────

  const newInc = {
    id: 'INC-' + String(++incidentCounter).padStart(3, '0'),
    timestamp: new Date().toISOString(),
    type, category: 'other', title, severity: 'medium',
    location: { neighborhood: neighborhood || 'Unknown', lat: hood.lat + (Math.random() - 0.5) * 0.01, lng: hood.lng + (Math.random() - 0.5) * 0.01 },
    verified: false, verifications: 0, tags: ['user-submitted'], source: 'user-report',
    action_checklist: ['Review official sources for more information', 'Report to local authorities if appropriate']
  };

  localIncidents.unshift(newInc);
  addMapMarker(newInc);
  document.getElementById('incidentBadge').textContent = localIncidents.length;
  updateDashboard();

  formSuccess.className = 'validation-msg success';
  formSuccess.textContent = '✓ Report submitted successfully! It will be reviewed by AI and verified.';
  showToast('success', `✓ Incident "${title}" submitted for review`);
  clearReport();
  setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
}

function clearReport() {
  ['reportTitle', 'reportDesc', 'reportNeighborhood'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('reportType').value = '';
  document.getElementById('reportTime').value = '';
  document.getElementById('aiSuggestionBlock').style.display = 'none';
  ['titleError', 'typeError', 'descError', 'noiseError'].forEach(id => { document.getElementById(id).style.display = 'none'; });
}

// ─── CIRCLES ─────────────────────────────────────────────────────────────────
function openCreateCircle() { document.getElementById('circleModal').classList.add('open'); }
function closeModal() { document.getElementById('circleModal').classList.remove('open'); }

function selectEmoji(el) {
  selectedEmoji = el.textContent;
  el.parentElement.querySelectorAll('span').forEach(s => s.style.opacity = '0.4');
  el.style.opacity = '1';
}

function createCircle() {
  const name = document.getElementById('circleName').value.trim();
  if (!name) { showToast('error', '⚠ Please enter a circle name'); return; }
  const colors = ['#a29bfe', '#00e5ff', '#2ed573', '#ff9f43'];
  localCircles.push({ name, icon: selectedEmoji, members: ['JD'], lastStatus: 'Just created · now', color: colors[localCircles.length % colors.length] });
  closeModal();
  renderCircles();
  showToast('success', `🔐 Safe Circle "${name}" created!`);
}

function sendStatusUpdate(circleName) {
  const messages = ['✅ All safe', '🏠 Safe at home', '📍 Heading home now', '⚠ Heads up — be careful downtown'];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const idx = localCircles.findIndex(c => c.name === circleName);
  if (idx !== -1) {
    localCircles[idx].lastStatus = `${msg} · just now`;
    renderCircles();
    showToast('info', `📤 Status sent to ${circleName}: "${msg}"`);
  }
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(type, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ─── LEAFLET MAP ─────────────────────────────────────────────────────────────
function initMap() {
  if (leafletMap) return;
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  leafletMap = L.map('leafletMap', { zoomControl: true, attributionControl: true }).setView([userLocation.lat, userLocation.lng], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(leafletMap);

  localIncidents.forEach(inc => addMapMarker(inc));
  setTimeout(() => leafletMap.invalidateSize(), 200);
}

function addMapMarker(inc) {
  if (!leafletMap || !inc.location.lat) return;

  // Prevent duplicate markers if switching locations/radius
  if (mapMarkers.some(m => m._incId === inc.id)) return;

  const colors = { high: '#ff4757', medium: '#ff9f43', low: '#2ed573' };
  const color = colors[inc.severity] || '#00e5ff';

  const marker = L.circleMarker([inc.location.lat, inc.location.lng], {
    radius: inc.severity === 'high' ? 10 : 7,
    fillColor: color, color: color, weight: 2, opacity: 0.8, fillOpacity: 0.5
  }).addTo(leafletMap);

  marker._incId = inc.id;
  marker.bindPopup(`<div class="popup-title">${inc.title}</div><div class="popup-meta">📍 ${inc.location.neighborhood} · ${inc.severity.toUpperCase()} · ${relativeTime(inc.timestamp)}</div>`);
  mapMarkers.push(marker);
}

function clearMapMarkers() {
  if (!leafletMap) return;
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];
}

// ─── REAL-TIME ENGINE ────────────────────────────────────────────────────────
function generateRealtimeIncident() {
  const template = REALTIME_TEMPLATES[Math.floor(Math.random() * REALTIME_TEMPLATES.length)];
  const hood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];

  return {
    id: 'INC-' + String(++incidentCounter).padStart(3, '0'),
    timestamp: new Date().toISOString(),
    type: template.type,
    category: template.category,
    title: title,
    severity: template.severity,
    location: { neighborhood: hood.name, lat: hood.lat + (Math.random() - 0.5) * 0.008, lng: hood.lng + (Math.random() - 0.5) * 0.008 },
    verified: Math.random() > 0.3,
    tags: [...template.tags],
    source: ['community', 'news', 'city-api', 'sensor'][Math.floor(Math.random() * 4)],
    action_checklist: template.action_checklist
  };
}

function pushRealtimeIncident() {
  const inc = generateRealtimeIncident();
  localIncidents.unshift(inc);
  addMapMarker(inc);
  showToast('info', `📡 New: ${inc.title} — ${inc.location.neighborhood}`);

  // Update feed if visible
  const feedContainer = document.getElementById('incidentFeed');
  if (feedContainer && document.getElementById('page-feed')?.classList.contains('active')) {
    const card = buildIncidentCard(inc);
    feedContainer.insertBefore(card, feedContainer.firstChild);
  }

  document.getElementById('incidentBadge').textContent = localIncidents.length;
  if (document.getElementById('page-dashboard')?.classList.contains('active')) updateDashboard();
}

function startRealtimeEngine() {
  const interval = 120000 + Math.random() * 60000; // 2-3 minutes
  realtimeInterval = setInterval(() => {
    // Generate synthetic data periodically
    pushRealtimeIncident();
  }, interval);
}

// ─── LIVE DATA FEEDS ─────────────────────────────────────────────────────────
// Real-time API implementations have been removed to comply with synthetic data requirements.

// ─── LIVE CLOCK & COUNTDOWN ──────────────────────────────────────────────────
function startLiveClock() {
  setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updatedEl = document.getElementById('lastUpdated');
    if (updatedEl) updatedEl.textContent = `Last updated: ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    refreshSeconds--;
    if (refreshSeconds <= 0) {
      refreshSeconds = 180;
      updateDashboard();
      fetchAllLiveData();
    }
    const mins = Math.floor(refreshSeconds / 60);
    const secs = refreshSeconds % 60;
    const countdownEl = document.getElementById('refreshCountdown');
    if (countdownEl) countdownEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

function fetchAllLiveData() {
  // Use synthetic data only
  console.log('Live APIs disabled to comply with synthetic data requirement.');
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize location system
  initLocation();
  applySeniorMode();

  // Initialize incidents with relative timestamps
  localIncidents = initIncidents();

  // Load saved API key
  const savedKey = getApiKey();
  if (savedKey) {
    const keyInput = document.getElementById('geminiKeyInput');
    if (keyInput) keyInput.value = savedKey;
  }

  // Render everything
  renderDashboard();
  renderFeed();
  renderNoise();
  renderCircles();
  generateDigest();
  updateDashboard();

  // Initialize map on dashboard
  setTimeout(() => initMap(), 300);

  // Set default time
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const timeInput = document.getElementById('reportTime');
  if (timeInput) timeInput.value = now.toISOString().slice(0, 16);

  // Close modal on overlay click
  document.getElementById('circleModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Start real-time engines
  startLiveClock();
  startRealtimeEngine();

  // Fetch live data
  fetchAllLiveData();

  showToast('info', '📡 Community Guardian — Live monitoring active');
});
