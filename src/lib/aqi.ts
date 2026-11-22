/**
 * Vata Mitra (वाता मित्र) — CPCB National Air Quality Index Engine
 * Live data via Open-Meteo CAMS Air Quality API + official CPCB NAQI computation.
 */

// ─────────────────────────── Types ───────────────────────────

export interface PollutantConcentrations {
  /** PM2.5 in µg/m³ */
  pm2_5: number;
  /** PM10 in µg/m³ */
  pm10: number;
  /** NO₂ in µg/m³ */
  no2: number;
  /** SO₂ in µg/m³ */
  so2: number;
  /** CO in mg/m³ */
  co: number;
  /** O₃ in µg/m³ */
  o3: number;
}

export type AqiCategoryEn =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

export type AqiCategoryHi =
  | "अच्छा"
  | "संतोषजनक"
  | "मध्यम"
  | "खराब"
  | "बहुत खराब"
  | "गंभीर";

export type AqiRank = 1 | 2 | 3 | 4 | 5 | 6;

export interface SubIndex {
  pollutant: string;
  concentration: number;
  subIndex: number;
}

export interface CpcbNaqiResult {
  naqi: number;
  categoryEn: AqiCategoryEn;
  categoryHi: AqiCategoryHi;
  rank: AqiRank;
  rankLabel: string;
  dominantPollutant: string;
  subIndices: SubIndex[];
}

export interface HourlyForecastPoint {
  time: string;
  pm2_5: number | null;
  pm10: number | null;
  usAqi: number | null;
}

export interface LiveAirQualityResult {
  city: string;
  latitude: number;
  longitude: number;
  sourceName: "Open-Meteo CAMS Air Quality + CPCB NAQI";
  lastUpdatedIso: string;
  lastUpdatedIst: string;
  usAqi: number;
  cpcb: CpcbNaqiResult;
  hourlyForecast: HourlyForecastPoint[];
}

export function formatIstTimestamp(date: Date = new Date()): string {
  try {
    return (
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date) + " IST"
    );
  } catch {
    return date.toLocaleString("en-IN") + " IST";
  }
}

export function formatIstTimestampHi(date: Date = new Date()): string {
  try {
    return (
      new Intl.DateTimeFormat("hi-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date) + " IST"
    );
  } catch {
    return date.toLocaleString("hi-IN") + " IST";
  }
}

export class AirQualityError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_INPUT"
      | "GEOCODING_FAILED"
      | "API_ERROR"
      | "NO_DATA"
      | "TIMEOUT",
  ) {
    super(message);
    this.name = "AirQualityError";
  }
}

// ─────────────────── CPCB Breakpoint Tables ──────────────────
// Source: CPCB National Air Quality Index (2014)
// Each entry: [BPLo, BPHi, ILo, IHi]

type BreakpointRow = [number, number, number, number];

const BREAKPOINTS: Record<string, { label: string; rows: BreakpointRow[] }> = {
  pm2_5: {
    label: "PM2.5",
    rows: [
      [0, 30, 0, 50],       // Good
      [31, 60, 51, 100],     // Satisfactory
      [61, 90, 101, 200],    // Moderate
      [91, 120, 201, 300],   // Poor
      [121, 250, 301, 400],  // Very Poor
      [251, 500, 401, 500],  // Severe  (using 500 as upper cap)
    ],
  },
  pm10: {
    label: "PM10",
    rows: [
      [0, 50, 0, 50],
      [51, 100, 51, 100],
      [101, 250, 101, 200],
      [251, 350, 201, 300],
      [351, 430, 301, 400],
      [431, 510, 401, 500],
    ],
  },
  no2: {
    label: "NO₂",
    rows: [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 180, 101, 200],
      [181, 280, 201, 300],
      [281, 400, 301, 400],
      [401, 500, 401, 500],
    ],
  },
  so2: {
    label: "SO₂",
    rows: [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 380, 101, 200],
      [381, 800, 201, 300],
      [801, 1600, 301, 400],
      [1601, 2100, 401, 500],
    ],
  },
  co: {
    // CPCB breakpoints are in mg/m³
    label: "CO",
    rows: [
      [0, 1.0, 0, 50],
      [1.1, 2.0, 51, 100],
      [2.1, 10, 101, 200],
      [10.1, 17, 201, 300],
      [17.1, 34, 301, 400],
      [34.1, 50, 401, 500],
    ],
  },
  o3: {
    label: "O₃",
    rows: [
      [0, 50, 0, 50],
      [51, 100, 51, 100],
      [101, 168, 101, 200],
      [169, 208, 201, 300],
      [209, 748, 301, 400],
      [749, 1000, 401, 500],
    ],
  },
};

const CATEGORIES: {
  en: AqiCategoryEn;
  hi: AqiCategoryHi;
  rank: AqiRank;
}[] = [
  { en: "Good", hi: "अच्छा", rank: 1 },
  { en: "Satisfactory", hi: "संतोषजनक", rank: 2 },
  { en: "Moderate", hi: "मध्यम", rank: 3 },
  { en: "Poor", hi: "खराब", rank: 4 },
  { en: "Very Poor", hi: "बहुत खराब", rank: 5 },
  { en: "Severe", hi: "गंभीर", rank: 6 },
];

// ───────────────── Sub-Index Calculation ─────────────────────

function linearInterpolate(
  cp: number,
  bpLo: number,
  bpHi: number,
  iLo: number,
  iHi: number,
): number {
  if (bpHi === bpLo) return iLo;
  return ((iHi - iLo) / (bpHi - bpLo)) * (cp - bpLo) + iLo;
}

function computeSubIndex(pollutantKey: string, concentration: number): number {
  const bp = BREAKPOINTS[pollutantKey];
  if (!bp) return 0;

  const rows = bp.rows;

  // Clamp to minimum 0
  const cp = Math.max(0, concentration);

  // Find the matching breakpoint range
  for (const [bpLo, bpHi, iLo, iHi] of rows) {
    if (cp >= bpLo && cp <= bpHi) {
      return Math.round(linearInterpolate(cp, bpLo, bpHi, iLo, iHi));
    }
  }

  // If concentration exceeds the highest breakpoint, cap at 500
  const lastRow = rows[rows.length - 1];
  if (cp > lastRow[1]) {
    return 500;
  }

  return 0;
}

function getCategory(aqi: number): {
  en: AqiCategoryEn;
  hi: AqiCategoryHi;
  rank: AqiRank;
} {
  if (aqi <= 50) return CATEGORIES[0];
  if (aqi <= 100) return CATEGORIES[1];
  if (aqi <= 200) return CATEGORIES[2];
  if (aqi <= 300) return CATEGORIES[3];
  if (aqi <= 400) return CATEGORIES[4];
  return CATEGORIES[5];
}

// ──────────────── Main CPCB NAQI Calculator ──────────────────

export function calculateCpcbNaqi(
  pollutants: PollutantConcentrations,
): CpcbNaqiResult {
  const entries: { key: string; label: string; concentration: number }[] = [
    { key: "pm2_5", label: "PM2.5", concentration: pollutants.pm2_5 },
    { key: "pm10", label: "PM10", concentration: pollutants.pm10 },
    { key: "no2", label: "NO₂", concentration: pollutants.no2 },
    { key: "so2", label: "SO₂", concentration: pollutants.so2 },
    { key: "co", label: "CO", concentration: pollutants.co },
    { key: "o3", label: "O₃", concentration: pollutants.o3 },
  ];

  const subIndices: SubIndex[] = entries.map((e) => ({
    pollutant: e.label,
    concentration: e.concentration,
    subIndex: computeSubIndex(e.key, e.concentration),
  }));

  // NAQI = worst (maximum) sub-index
  let maxSubIndex = 0;
  let dominantPollutant = "PM2.5";

  for (const si of subIndices) {
    if (si.subIndex > maxSubIndex) {
      maxSubIndex = si.subIndex;
      dominantPollutant = si.pollutant;
    }
  }

  const naqi = maxSubIndex;
  const cat = getCategory(naqi);

  return {
    naqi,
    categoryEn: cat.en,
    categoryHi: cat.hi,
    rank: cat.rank,
    rankLabel: `Rank ${cat.rank} of 6 — ${cat.en}`,
    dominantPollutant,
    subIndices,
  };
}

// ─────────────────── Preset City Coordinates ─────────────────

interface CityCoord {
  lat: number;
  lon: number;
  name: string;
}

const INDIA_PRESETS: Record<string, CityCoord> = {
  delhi: { lat: 28.6139, lon: 77.209, name: "Delhi" },
  "new delhi": { lat: 28.6139, lon: 77.209, name: "New Delhi" },
  mumbai: { lat: 19.076, lon: 72.8777, name: "Mumbai" },
  pune: { lat: 18.5204, lon: 73.8567, name: "Pune" },
  bengaluru: { lat: 12.9716, lon: 77.5946, name: "Bengaluru" },
  bangalore: { lat: 12.9716, lon: 77.5946, name: "Bengaluru" },
  kolkata: { lat: 22.5726, lon: 88.3639, name: "Kolkata" },
  noida: { lat: 28.5355, lon: 77.391, name: "Noida" },
  durg: { lat: 21.1904, lon: 81.2849, name: "Durg, Chhattisgarh" },
  bhilai: { lat: 21.2144, lon: 81.3815, name: "Bhilai, Chhattisgarh" },
  raipur: { lat: 21.2514, lon: 81.6296, name: "Raipur, Chhattisgarh" },
  korba: { lat: 22.3595, lon: 82.7501, name: "Korba, Chhattisgarh" },
};

// ──────────────────── TTL Cache ──────────────────────────────

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<LiveAirQualityResult>>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCached(key: string): LiveAirQualityResult | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: LiveAirQualityResult): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

// ─────────────────── Input Validation ────────────────────────

const CITY_NAME_REGEX = /^[a-zA-Z0-9\s\-',.()]+$/;

export function validateCityInput(city: string): string {
  if (city === null || city === undefined || typeof city !== "string") {
    throw new AirQualityError(
      "City name is required and must be a non-empty string.",
      "INVALID_INPUT",
    );
  }

  // Reject control characters BEFORE trimming (null bytes, newlines, tabs, etc.)
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f]/.test(city)) {
    throw new AirQualityError(
      "City name contains invalid control characters.",
      "INVALID_INPUT",
    );
  }

  const trimmed = city.trim();

  if (trimmed.length === 0) {
    throw new AirQualityError(
      "City name cannot be empty or whitespace only.",
      "INVALID_INPUT",
    );
  }

  if (trimmed.length > 100) {
    throw new AirQualityError(
      "City name is too long (max 100 characters).",
      "INVALID_INPUT",
    );
  }

  if (!CITY_NAME_REGEX.test(trimmed)) {
    throw new AirQualityError(
      "City name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed.",
      "INVALID_INPUT",
    );
  }

  return trimmed;
}

// ─────────────────── Fetch with Timeout ──────────────────────

async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 8000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new AirQualityError(
        `Request timed out after ${timeoutMs}ms`,
        "TIMEOUT",
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ───────────────── Geocoding (Open-Meteo) ────────────────────

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country: string;
  admin1?: string;
}

async function geocodeCity(
  cityQuery: string,
): Promise<{ name: string; lat: number; lon: number }> {
  // Support direct latitude, longitude coordinate queries
  const coordMatch = cityQuery.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[3]);
    return { name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`, lat, lon };
  }

  // Check presets first
  const presetKey = cityQuery.toLowerCase().trim();
  if (INDIA_PRESETS[presetKey]) {
    const p = INDIA_PRESETS[presetKey];
    return { name: p.name, lat: p.lat, lon: p.lon };
  }

  const searchNames = [cityQuery];
  if (cityQuery.includes(",")) {
    // If "Durg, Chhattisgarh", also allow querying "Durg" as fallback
    const firstPart = cityQuery.split(",")[0].trim();
    if (firstPart.length > 0 && !searchNames.includes(firstPart)) {
      searchNames.push(firstPart);
    }
  }

  let results: GeoResult[] = [];

  for (const q of searchNames) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`;
    const response = await fetchWithTimeout(url);

    if (response.ok) {
      const data = (await response.json()) as { results?: GeoResult[] };
      if (data.results && data.results.length > 0) {
        results = data.results;
        break;
      }
    }
  }

  if (results.length === 0) {
    throw new AirQualityError(
      `No location found for "${cityQuery}". Please try a different city name.`,
      "GEOCODING_FAILED",
    );
  }

  // Prioritize Indian results
  const indiaResults = results.filter((r) => r.country_code === "IN");
  let best = indiaResults.length > 0 ? indiaResults[0] : results[0];

  // If query mentions state or district, check for matching admin1
  const lowerQuery = cityQuery.toLowerCase();
  for (const ir of indiaResults) {
    if (ir.admin1 && lowerQuery.includes(ir.admin1.toLowerCase())) {
      best = ir;
      break;
    }
  }

  return {
    name: best.admin1 ? `${best.name}, ${best.admin1}` : best.name,
    lat: best.latitude,
    lon: best.longitude,
  };
}

// ────────────── Open-Meteo Air Quality Fetch ─────────────────

interface OpenMeteoAQResponse {
  current?: {
    time?: string;
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    us_aqi?: number;
  };
  hourly?: {
    time?: string[];
    pm2_5?: (number | null)[];
    pm10?: (number | null)[];
    us_aqi?: (number | null)[];
  };
}

export async function fetchLiveIndiaAirQuality(
  cityQuery: string,
): Promise<LiveAirQualityResult> {
  // Validate input
  const sanitizedCity = validateCityInput(cityQuery);

  // Check cache
  const cacheKey = sanitizedCity.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Geocode
  const geo = await geocodeCity(sanitizedCity);

  // Fetch air quality data
  const aqUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${geo.lat}&longitude=${geo.lon}` +
    `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi` +
    `&hourly=pm2_5,pm10,us_aqi` +
    `&forecast_days=2` +
    `&timezone=auto`;

  const response = await fetchWithTimeout(aqUrl);

  if (!response.ok) {
    throw new AirQualityError(
      `Air Quality API returned ${response.status}: ${response.statusText}`,
      "API_ERROR",
    );
  }

  const data = (await response.json()) as OpenMeteoAQResponse;

  if (!data.current) {
    throw new AirQualityError(
      "No current air quality data available for this location.",
      "NO_DATA",
    );
  }

  const current = data.current;

  // Open-Meteo returns CO in µg/m³ — convert to mg/m³ for CPCB
  const coMgM3 = (current.carbon_monoxide ?? 0) / 1000;

  const pollutants: PollutantConcentrations = {
    pm2_5: current.pm2_5 ?? 0,
    pm10: current.pm10 ?? 0,
    no2: current.nitrogen_dioxide ?? 0,
    so2: current.sulphur_dioxide ?? 0,
    co: coMgM3,
    o3: current.ozone ?? 0,
  };

  const cpcb = calculateCpcbNaqi(pollutants);

  // Build hourly forecast (next 24 hours)
  const hourlyForecast: HourlyForecastPoint[] = [];
  if (data.hourly?.time) {
    const now = new Date();
    const times = data.hourly.time;
    const pm25Arr = data.hourly.pm2_5 ?? [];
    const pm10Arr = data.hourly.pm10 ?? [];
    const usAqiArr = data.hourly.us_aqi ?? [];

    for (let i = 0; i < times.length && hourlyForecast.length < 24; i++) {
      const pointTime = new Date(times[i]);
      if (pointTime > now) {
        hourlyForecast.push({
          time: times[i],
          pm2_5: pm25Arr[i] ?? null,
          pm10: pm10Arr[i] ?? null,
          usAqi: usAqiArr[i] ?? null,
        });
      }
    }
  }

  const fetchDate = new Date();
  const result: LiveAirQualityResult = {
    city: geo.name,
    latitude: geo.lat,
    longitude: geo.lon,
    sourceName: "Open-Meteo CAMS Air Quality + CPCB NAQI",
    lastUpdatedIso: current.time ?? fetchDate.toISOString(),
    lastUpdatedIst: formatIstTimestamp(fetchDate),
    usAqi: current.us_aqi ?? 0,
    cpcb,
    hourlyForecast,
  };

  // Cache the result
  setCache(cacheKey, result);

  return result;
}
