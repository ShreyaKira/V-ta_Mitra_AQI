# Vata Mitra (वाता मित्र) — Generative AI Urban Air Quality Assistant

> An intelligent, accessible, bilingual (English / हिंदी) Urban Air Quality Assistant built for Indian households, powered by live **Open-Meteo CAMS Air Quality**, official **India CPCB National Air Quality Index (NAQI)** mathematics, and **Gemini 2.5 Flash**.

---

## 1. Chosen Vertical: Urban Air Quality Assistant

Indian cities face extreme seasonal and localized air pollution variations. From winter temperature inversions in Delhi-NCR and construction dust in Pune to coastal humidity trapping industrial SO₂ in Mumbai and Outer Ring Road traffic exhaust in Bengaluru, a one-size-fits-all AQI alert fails Indian households.

**Vata Mitra (वाता मित्र)** solves this by:
1. Translating raw live multi-pollutant telemetry into official **CPCB National Air Quality Index (NAQI)** sub-indices (0–500) and severity rankings (Rank 1 to 6).
2. Grounding Generative AI recommendations in real **city-specific transit networks** (e.g., Pune Aqua/Purple Metro, Delhi Metro N95 protocols, Bengaluru Namma Metro).
3. Tailoring actionable, low-cost daily routines for **up to 3 family members under one roof** (commuter, young child, senior citizen, student) based on budget tier and exposure vulnerability.

---

## 2. Approach & Logic

### A. Official CPCB NAQI Engine (`src/lib/aqi.ts`)
The Central Pollution Control Board (CPCB) computes NAQI as the worst sub-index among monitored pollutants:
- **PM2.5** (24h avg): `0-30` (Good), `31-60` (Satisfactory), `61-90` (Moderate), `91-120` (Poor), `121-250` (Very Poor), `251-500` (Severe)
- **PM10** (24h avg): `0-50`, `51-100`, `101-250`, `251-350`, `351-430`, `431-510`
- **NO₂** (24h avg): `0-40`, `41-80`, `81-180`, `181-280`, `281-400`, `401-500`
- **SO₂** (24h avg): `0-40`, `41-80`, `81-380`, `381-800`, `801-1600`, `1601-2100`
- **CO** (8h max in mg/m³): `0-1.0`, `1.1-2.0`, `2.1-10`, `10.1-17`, `17.1-34`, `34.1-50`
- **O₃** (8h max): `0-50`, `51-100`, `101-168`, `169-208`, `209-748`, `749-1000`

Linear interpolation formula:
$$I_P = \frac{I_{Hi} - I_{Lo}}{BP_{Hi} - BP_{Lo}} \times (C_P - BP_{Lo}) + I_{Lo}$$
$$NAQI = \max(I_{PM2.5}, I_{PM10}, I_{NO2}, I_{SO2}, I_{CO}, I_{O3})$$

### B. Live Telemetry & 15-Minute TTL Cache
- **Geocoding:** Open-Meteo Geocoding API with India-first filtering + instant coordinates for 6 benchmark metros (Delhi, Pune, Mumbai, Bengaluru, Kolkata, Noida).
- **Air Quality API:** Live CAMS European atmospheric chemistry model requesting `pm10, pm2_5, carbon_monoxide, nitrogen_dioxide, sulphur_dioxide, ozone, us_aqi` and 24-hour hourly forecast.
- **Cache & Resilience:** In-memory 15-minute TTL cache per city, 8-second HTTP timeout with AbortController, and unit conversion (CO from µg/m³ to mg/m³).
- **Safest Outdoor Window:** Scans the 24-hour hourly forecast to find the minimum contiguous 2-hour AQI window for safe ventilation or outdoor activities.

### C. City Transit & Pollution Rules (`src/data/cityRules.ts`)
- **Pune:** Recommends Pune Aqua/Purple Metro corridors and carpooling (Quick Ride/sRide) for Hinjewadi & Kharadi; avoids unpunctual PMPML buses for time-critical travel; notes local construction PM10 and winter inversion.
- **Mumbai:** Recommends Suburban Rail / Metro Line 1, 2A & 7, BEST electric buses; accounts for coastal humidity and construction dust in BKC and Andheri.
- **Bengaluru:** Recommends Namma Metro Purple/Green lines; cautions against peak-hour exposure at Silk Board and Outer Ring Road (ORR).
- **Delhi-NCR:** Recommends Delhi Metro as clean-air backbone; enforces mandatory N95 masks during Poor/Very Poor/Severe days; accounts for winter inversion and stubble drift.
- **Kolkata:** Recommends Metro and river ferries; cautions against morning fog inversion and soot trapping.
- **National Fallback:** Default public transit guidance for any other Indian tier-1/tier-2 city.

### D. 3-Member Household Personalization Across 3 Pillars
For each configured family member, Vata Mitra produces:
1. **Low-Emission Routine:** Morning, afternoon, evening timing + transit swaps.
2. **Indoor Air Hacks:** Budget-aware hacks (free wet-mopping, sealed windows, cross-ventilation, spider plants vs. purifier schedule).
3. **Impact Justification:** Clear physiological and environmental "Why" (e.g., child developing lung capacity vs. senior cardiovascular risks).

---

## 3. How the Solution Works

### Architecture Diagram
```
User Interface (Next.js 16 + Tailwind CSS)
  │
  ├──> Top Bar (EN/हिंदी Toggle + Senior High-Contrast Mode)
  ├──> City Selector (Search + Presets + Browser Geolocation)
  ├──> Live AQI Hero Card (CPCB NAQI + Dominant Pollutant + 5-City Strip + Safest Window)
  ├──> Household Builder (1 Roof, Up to 3 Personas + Budget Tier)
  ├──> Action Cards (3 Pillars per Member)
  ├──> "What-If" Impact Simulator (CO2 saved, PM2.5 lung reduction)
  ├──> Daily ESG Green Fact Card (10 Indian-context facts with citations)
  └──> Conversational Follow-Up Q&A
        │
        ├──> GET /api/aqi?city=...
        │      └── Open-Meteo API + CPCB Formula + 15m Cache + Safest Window
        │
        └──> POST /api/advise
               ├── Server-side Live AQI validation (NEVER invented by LLM)
               ├── Gemini 2.5 Flash (Structured JSON output)
               └── Deterministic Rule-Based Fallback (if key is absent/rate-limited)
```

### Sample Test Inputs for Evaluators

1. **Test Input 1 — High-Smog Metro Commuter & Senior:**
   - **City:** `Delhi`
   - **Language:** English or हिंदी
   - **Budget Tier:** `No Purifier / Low-Cost`
   - **Member 1:** `Commuter` | Must go out: `Yes` | Commute: `Car`
   - **Member 2:** `Senior Citizen` | Must go out: `No` | Commute: `Walk`
   - **Expected Output:** Delhi Metro shift, N95 mask recommendation, senior advised to stay indoors during morning smog, wet-mopping and door towel sealing hacks, CO₂ savings quantified.

2. **Test Input 2 — Pune IT Corridor Family:**
   - **City:** `Pune`
   - **Language:** English
   - **Budget Tier:** `Purifier Owner`
   - **Member 1:** `Commuter` | Must go out: `Yes` | Commute: `Bike`
   - **Member 2:** `Young Child` | Must go out: `Yes` | Commute: `Bus`
   - **Expected Output:** Pune Aqua/Purple Metro corridor advice, school bus carpool recommendations, purifier 24/7 schedule, quantified PM2.5 lung inhalation reduction.

3. **Test Input 3 — Follow-Up Question:**
   - **Question:** `"Can my elderly grandfather go for a morning walk?"`
   - **Expected Output:** Directly references the live NAQI category and the calculated Safest 2-Hour Outdoor Window.

---

## 4. Key Design & Accessibility Features

- **Colorblind-Safe Badging:** Never relies on color alone. Every AQI rank uses a distinct badge, explicit category text, numeric rank (`Rank X of 6`), and shape icon (e.g., 🟢 Circle, 🟦 Square, 🟡 Triangle, 🟧 Diamond, 🛑 Octagon, ⚠️ Warning).
- **Senior-Friendly Large Text Mode:** One-click toggle that scales typography to `text-lg`/`text-xl` and boosts contrast for elderly citizens.
- **Zero Hallucination Guarantee:** The LLM is never allowed to guess or hallucinate air quality numbers; live verified CPCB data is fetched server-side and injected as strict ground truth.
- **Fail-Safe Fallback:** If the Gemini API key is unset or hits a quota limit, the application automatically engages `generateFallbackAdvice()` so evaluation never crashes.

---

## 5. Assumptions Made

1. **Telemetric Data Source:** Uses Open-Meteo CAMS atmospheric model which offers high-resolution real-time hourly pollution forecasting across India without requiring proprietary API keys.
2. **CO Units:** Open-Meteo reports Carbon Monoxide in µg/m³; Vata Mitra converts this to mg/m³ ($\div 1000$) to conform with the official CPCB NAQI standard.
3. **Household Size:** Restricted to a maximum of 3 members per household submission to keep API responses compact, fast, and legible side-by-side on mobile and desktop screens.
4. **Transit Availability:** Metro recommendations are scoped to corridors active or operational in Pune, Mumbai, Delhi-NCR, Bengaluru, and Kolkata as of 2026.

---

## 6. Running the Project Locally

```bash
# 1. Clone & install dependencies
npm install

# 2. Configure environment (optional - deterministic fallback works automatically)
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local

# 3. Run unit tests
npm test

# 4. Build production bundle
npm run build

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore Vata Mitra.
