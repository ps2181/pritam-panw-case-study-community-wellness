# 🛡 Community Guardian — Safety Intelligence Platform

> A calm, AI-powered community safety platform that filters noise, surfaces actionable threat intelligence, and empowers residents to protect each other — without the anxiety spiral.

---

## Candidate Information

**Candidate Name:** PRITAM SATPATHY 
**Scenario Chosen:** Option 3 — Community Safety & Digital Wellness  
**Estimated Time Spent:** ~5.5 hours  

---

## Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Gemini API key (for AI features — app runs fully in fallback mode without one)
- Node.js v16+ (for running tests only)

### Run the App

**Option A — Open directly in browser (no server needed):**
```bash
open index.html
# or just double-click index.html in your file manager
```

**Option B — Serve locally:**
```bash
# Using Python
python3 -m http.server 8080
# Then visit: http://localhost:8080/index.html

# Using Node
npx serve ./
```

### Configure AI Features

```bash
# <!-- API KEY: Set GEMINI_API_KEY in your environment or .env for production -->
#
# For local testing, you can temporarily set the key in browser console:
# window.GEMINI_API_KEY = '...'
#
# The app works fully without a key using the rule-based fallback.
```

> **Security note:** No API key is committed to this repo. See `.env.example`.

### Run Tests

```bash
node tests.js
```

Expected output:
```
  Total: 33 tests · ✅ 33 passed · ❌ 0 failed
  All tests passed! 🎉
```

---

## Problem Being Solved

Individuals — especially elderly users, remote workers, and neighborhood groups — struggle with:
1. **Alert fatigue** from social media feeds mixing venting, misinformation, and real threats
2. **Scattered information** across news sites, Nextdoor, Ring, Reddit, and local PD feeds
3. **No actionable guidance** — even when people see a real threat, they don't know what to do
4. **Anxiety amplification** — most safety apps use alarming red dashboards that increase stress without increasing safety

**Community Guardian** solves this with three core ideas:
- **Noise filtering:** AI separates actionable reports from social venting
- **Calm digests:** Daily AI-generated summaries replace real-time anxiety loops
- **Safe Circles:** Encrypted private check-ins for trusted groups, not public broadcasts

---

## Features Implemented

### Core Flow (Create + View + Update)
| Flow | Implementation |
|------|---------------|
| **Create** | Incident Report form with real-time validation and AI auto-categorization |
| **View** | Live Incident Feed with expand-to-detail, plus Dashboard overview |
| **Update** | Safe Circle status updates; filter/search updates the feed view in real-time |
| **Search/Filter** | Full-text search + type filter (digital/physical) + severity filter |
| **Map** | Live Leaflet map integration with neighborhood-level markers and popups |
| **Accessibility** | ARIA labels, semantic HTML, and mobile-responsive layout (<480px) |

### AI Integration (Gemini API — `gemini-2.0-flash`)

| Feature | AI Behavior | Fallback Behavior |
|---------|------------|-------------------|
| **Incident Summary** | Gemini generates a calm, empowering 2-3 sentence summary of each incident on expand | Rule-based template system using category + severity |
| **Daily Safety Digest** | Gemini analyzes all 10 incidents and writes a narrative threat summary | Hardcoded pattern-matched digest with trend data |
| **Auto-Categorization** | Gemini classifies report text into category, severity, and tags in real-time as user types | `ruleCategorize()` function using keyword matching with priority ordering |
| **Noise Detection** | AI filters venting/off-topic posts | `isNoise()` regex-based pattern matcher |

**AI Toggle:** The "AI: ONLINE" badge in the top bar lets users (or reviewers) instantly switch to fallback mode to demonstrate both paths. It's also accessible from Settings.

### Input Validation
- Title: minimum 5 non-whitespace characters
- Type: required selection
- Description: minimum 20 characters
- All errors shown inline with red styling before submission

### Data Safety
- All data in `data/incidents.json` is entirely synthetic — fabricated neighborhoods, fabricated scam descriptions, no real personal information
- No web scraping or live data sources
- Location data limited to neighborhood-level (no GPS, no addresses stored)

### Security
- No API keys committed to repository
- `.env.example` provided
- API key never logged or exposed in UI

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | Vanilla HTML/CSS/JS (single file) | Zero build toolchain — runs anywhere, easy to review, fast to iterate |
| **AI** | Gemini API (`gemini-2.0-flash`) | Best-in-class reasoning, fast, reliable JSON outputs |
| **Fonts** | Syne (display) + Space Mono (data) + Inter (body) | Syne's geometric weight reads as authoritative; Mono for data density; Inter for readability |
| **Styling** | CSS custom properties, no framework | Full control, no utility-class clutter, cohesive dark theme |
| **Tests** | Node.js built-in (no test framework) | Zero dependencies — demonstrates testing fundamentals directly |
| **Data** | Static JSON | Simple, auditable, no database setup required |

---

## Design Philosophy

### Aesthetic Direction: "Dark Command Center — Calm Not Cold"
The visual language is inspired by security operations centers (SOCs) but deliberately **warmer and less aggressive** than typical cybersecurity tools. Key decisions:

- **Dark theme with cyan accent (`#00e5ff`)** — evokes clarity and precision, not alarm
- **Color-coded severity** — `danger` red / `warn` amber / `safe` green — but used sparingly (only on incident borders and badges, not backgrounds)
- **Noise grain overlay** — subtle texture prevents the sterile "AI app" look
- **Syne typeface** — geometric but humanist; feels capable, not cold
- **Animated heatmap dots** — provide a sense of live monitoring without being alarming
- **Stat cards with gradient top borders** — draws the eye to key metrics without overusing color

### Anxiety-Reduction Principles
1. Incidents are collapsed by default — users choose when to engage with detail
2. AI digest is written in calm, first-person plural ("your neighborhood")
3. Every high-severity incident has a checklist of empowering actions
4. The noise filter is surfaced as a feature (transparency builds trust)

---

## Architecture

```
├── tests.js                # 43 tests across 8 test suites
├── .env.example            # API key template
└── README.md               # This file
|__ app.js
|__ index.html
|__ incidents.json
```

### Key Functions

| Function | Purpose | AI or Rule-Based |
|----------|---------|-----------------|
| `loadAISummary(inc)` | Fetches Gemini summary for an incident | AI + fallback |
| `generateDigest()` | Creates daily safety narrative | AI + fallback |
| `aiCategorize()` | Tags and categorizes report form input | AI + fallback |
| `ruleCategorize(text)` | Keyword-based fallback categorizer | Rule-based only |
| `isNoise(text)` | Filters venting from actionable reports | Rule-based (regex) |
| `validateReport()` | Input validation with inline error messages | Rule-based |
| `filterIncidents()` | Search + type + severity filtering | Rule-based |

---

## Test Coverage

```
📋  ruleCategorize()     9 tests  (happy paths + edge cases)
🔇  isNoise()            7 tests  (signal detection + noise patterns)  
📝  validateReport()     7 tests  (valid inputs + all error paths)
🔍  filterIncidents()   10 tests  (search, filter, combined, empty)
                        ─────────
                        43 total  ✅ 100% pass rate
```

Notable edge cases covered:
- Empty string inputs don't crash the categorizer
- Whitespace-only titles correctly fail validation  
- `data_breach` correctly outranks `phishing` when both keywords present (bug found and fixed during testing)
- Combined filter (type + severity) works correctly
- Empty incident array returns empty without error

---

## AI Disclosure

**Did you use an AI assistant?** Yes — Gemini was used for:
- Brainstorming the visual design direction ("dark SOC but calmer")
- Drafting initial CSS variable names and color palette
- Suggesting test case names for edge cases

**How I verified suggestions:**
- Every AI-generated code suggestion was read line-by-line before inclusion
- Tests were written independently and run to validate logic — the data_breach/phishing priority bug was caught by tests, not AI
- All prompts shown to Claude were crafted to solve specific, bounded problems

**Example of a suggestion I rejected:**
Claude initially suggested using a `<form>` element with `action=""` for the report submission. I rejected this because: (1) the instructions specifically warn against HTML `<form>` tags in this context, (2) it would cause a page reload, and (3) event-based validation with `onclick` handlers gives finer-grained control over error display and UX state.

---

## Tradeoffs & Prioritization

### What I Cut to Stay Within 4–6 Hours
- **Real map integration** (Leaflet) — Fully implemented with live markers and popups.
- **Backend/persistence** — all state is in-memory; a real app would use a database and websockets for live updates
- **User authentication** — Safe Circles show a simulated user ("Jordan D.") rather than a real auth flow
- **Push notifications** — notification toggles are present in Settings but only toggle UI state
- **Pagination** — the feed renders all incidents; production would need virtual scrolling

### What I'd Build Next
1. **Real-time ingestion pipeline** — ingest from Nextdoor RSS, local PD open data APIs, and Reddit using a worker queue, running AI noise-filtering before storage
2. **WebSocket live feed** — push new incidents to connected clients without polling
3. **Verified badge system** — community corroboration (3+ reports of same incident = auto-verified)
4. **Geofenced alerts** — use browser Geolocation API (with consent) to send push alerts only for incidents within user's 1-mile radius
5. **Accessibility pass** — full WCAG 2.1 AA compliance; keyboard navigation; screen reader announcements for new incidents
6. **Senior-specific mode** — larger text, simplified layout, fewer features, higher-contrast palette

### Known Limitations
- AI summaries require a Gemini API key; the fallback is functional but less nuanced
- Incident data is static synthetic data — a production version would need a backend
- No rate limiting on the AI API calls (would need debouncing at scale)
- The app is fully mobile-responsive for screens down to 360px

---

## Responsible AI Considerations

| Risk | Mitigation |
|------|-----------|
| **AI fabricates incident details** | AI is only used to *summarize* and *categorize* existing reports, never to generate incident content from scratch |
| **False positives in noise filter** | Borderline cases flagged for human moderator review; users can appeal filtered reports |
| **Bias in categorization** | Rule-based fallback provides transparency; AI suggestions are labeled as suggestions users can override |
| **Privacy of report submitters** | Reports are anonymous by default; location is neighborhood-level only |
| **AI unavailability** | Every AI feature has a rule-based fallback that degrades gracefully |
| **Anxiety amplification** | AI digest prompts explicitly instruct against alarmist language; test this in UX review |

---

## Video Walkthrough

[Link to be added before submission — YouTube/Vimeo unlisted link]

The video covers:
1. Problem statement and design decisions (1 min)
2. Dashboard, Incident Feed, and filter/search demo (1.5 min)
3. AI summary generation + live toggle to fallback mode (1.5 min)
4. Report submission with AI auto-categorization and validation errors (1 min)
5. Safe Circles and Noise Filter pages (30 sec)
6. Running test suite in terminal (30 sec)

---

## .env.example

```
# Gemini API Key — required for AI features
# Get one at: https://aistudio.google.com/
GEMINI_API_KEY=your-key-here

# App runs in rule-based fallback mode if this is not set.
```
