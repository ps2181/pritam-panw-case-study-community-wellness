Here is the finalized `README.md` for your submission. I have restructured the top section to strictly follow the **README Template** required by the instructions , while retaining your detailed implementation notes below it to showcase your technical rigor.

---

# 🛡️ Community Guardian — Safety Intelligence Platform

> A calm, AI-powered community safety platform that filters noise, surfaces actionable threat intelligence, and empowers residents to protect each other — without the anxiety spiral.

---

## Candidate Information

**Candidate Name:** PRITAM SATPATHY 

**Scenario Chosen:** 3. Community Safety & Digital Wellness 

**Estimated Time Spent:** ~5.5 hours 

---

Quick Start 

* 
**Prerequisites:** 


* A modern web browser (Chrome, Firefox, Safari, Edge).
* A Gemini API key (optional — app runs in fallback mode without one).
* Node.js v16+ (required for running tests only).


* 
**Run Commands:** 


* **Option A:** Open `index.html` directly in your browser.
* **Option B:** Run `python3 -m http.server 8080` and visit `http://localhost:8080`.


* 
**Test Commands:** 


* Run `node tests.js` in your terminal.



---

AI Disclosure 

* 
**Did you use an AI assistant (Copilot, ChatGPT, etc.)?** Yes 


* 
**How did you verify the suggestions?** 


* Every AI-generated code suggestion was read line-by-line before inclusion.
* I wrote an independent test suite to validate logic; this caught a keyword priority bug in the categorizer that the AI missed.


* 
**Give one example of a suggestion you rejected or changed:** 


* I rejected a suggestion to use standard HTML `<form>` tags for report submission. The instructions warn against certain form behaviors, and I preferred event-based validation to prevent page reloads and provide a "calmer" UX. 





---

Tradeoffs & Prioritization 

* 
**What did you cut to stay within the 4–6 hour limit?** 


* **Backend/Persistence:** All state is currently in-memory; a production app would use a database.
* **User Authentication:** Safe Circles use a simulated profile rather than a real OAuth flow.
* **Push Notifications:** UI toggles are functional, but the browser Notification API integration was deferred.


* 
**What would you build next if you had more time?** 


* **Real-time Ingestion:** A pipeline to pull from local PD open data APIs and RSS feeds.
* **Geofenced Alerts:** Using the browser Geolocation API to send alerts only for incidents within a 1-mile radius.


* 
**Known limitations:** 


* AI features require a Gemini API key; the rule-based fallback is functional but less nuanced.
* Incident data is static synthetic data.



---

## Technical Implementation Details

Core Flow (Create + View + Update) 

| Flow | Implementation |
| --- | --- |
| **Create** | Incident Report form with real-time validation and AI auto-categorization. |
| **View** | Live Incident Feed with expand-to-detail and Dashboard metrics. |
| **Update** | Filter/search updates the feed view in real-time; Safe Circle status updates. |
| **Search/Filter** | Full-text search + type filter (digital/physical) + severity filter. |

AI Integration & Fallback 

| Feature | AI Behavior (Gemini) | Fallback Behavior (Manual) |
| --- | --- | --- |
| **Incident Summary** | Generates a calm, empowering summary of reports. | Template system using category + severity keywords. |
| **Auto-Categorization** | Classifies text into severity and tags as user types. | Keyword-based priority matching (`ruleCategorize`). |
| **Noise Detection** | Filters out venting/off-topic social posts. | Regex-based pattern matcher (`isNoise`). |

Test Coverage 

```
📋  ruleCategorize()     9 tests  (Happy path + Priority edge cases)
🔇  isNoise()            9 tests  (Signal vs. Noise detection)  
📝  validateReport()     8 tests  (Validation logic & error paths)
🔍  filterIncidents()   10 tests  (Search, filter, and empty states)
                        ─────────
                        46 total  ✅ 100% pass rate

```

Data Safety & Security 

* 
**Synthetic Data:** All data in `incidents.json` is fabricated (fake neighborhoods, fake scams). 


* **API Security:** No API keys are committed. Uses an `.env` structure as required. 



---

Video Walkthrough 

**Link:** [https://youtu.be/woHuJkc0f_A](https://youtu.be/woHuJkc0f_A) 

*The video demonstrates the core functional flow, the AI features versus the manual fallback, and the automated test suite.*
