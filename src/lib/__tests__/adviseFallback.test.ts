/**
 * Unit tests for deterministic rule-based advice fallback:
 * - Verifying that two different personas (e.g., commuter vs senior) in the same city receive distinct advice
 * - Verifying that cityRules applies correctly (e.g., Pune metro corridor vs Delhi N95/metro)
 * - Verifying budgetTier differences (low_cost vs purifier_owner)
 * - Verifying bilingual output (en vs hi)
 */
import { describe, it, expect } from "vitest";
import {
  generateFallbackAdvice,
  type AdviseRequest,
} from "../adviseFallback";
import { type LiveAirQualityResult } from "../aqi";

function createMockLiveAQI(overrides: Partial<LiveAirQualityResult> = {}): LiveAirQualityResult {
  return {
    city: "Pune",
    latitude: 18.5204,
    longitude: 73.8567,
    sourceName: "Open-Meteo CAMS Air Quality + CPCB NAQI",
    lastUpdatedIso: "2026-11-21T14:00:00Z",
    usAqi: 165,
    cpcb: {
      naqi: 245,
      categoryEn: "Poor",
      categoryHi: "खराब",
      rank: 4,
      rankLabel: "Rank 4 of 6 — Poor",
      dominantPollutant: "PM2.5",
      subIndices: [
        { pollutant: "PM2.5", concentration: 105, subIndex: 245 },
        { pollutant: "PM10", concentration: 120, subIndex: 113 },
        { pollutant: "NO₂", concentration: 35, subIndex: 44 },
        { pollutant: "SO₂", concentration: 15, subIndex: 19 },
        { pollutant: "CO", concentration: 0.8, subIndex: 40 },
        { pollutant: "O₃", concentration: 40, subIndex: 40 },
      ],
    },
    hourlyForecast: [
      { time: "2026-11-21T15:00:00Z", pm2_5: 80, pm10: 95, usAqi: 120 },
      { time: "2026-11-21T16:00:00Z", pm2_5: 70, pm10: 85, usAqi: 110 },
      { time: "2026-11-21T17:00:00Z", pm2_5: 90, pm10: 110, usAqi: 135 },
    ],
    ...overrides,
  };
}

describe("generateFallbackAdvice", () => {
  it("provides distinct advice for commuter vs senior in the same city (Pune)", () => {
    const mockAqi = createMockLiveAQI({ city: "Pune" });
    const req: AdviseRequest = {
      city: "Pune",
      language: "en",
      budgetTier: "low_cost",
      members: [
        { id: "mem-1", role: "commuter", mustGoOut: true, commuteMode: "bike" },
        { id: "mem-2", role: "senior", mustGoOut: false, commuteMode: "walk" },
      ],
    };

    const result = generateFallbackAdvice(req, mockAqi, "3:00 PM – 4:00 PM (avg AQI ~115)");

    expect(result.memberAdvice).toHaveLength(2);

    const commuterAdvice = result.memberAdvice.find((m) => m.role === "commuter")!;
    const seniorAdvice = result.memberAdvice.find((m) => m.role === "senior")!;

    expect(commuterAdvice).toBeDefined();
    expect(seniorAdvice).toBeDefined();

    // The commuter who must go out should get commuting advice, while senior stays indoors
    expect(commuterAdvice.lowEmissionRoutine.afternoon).toContain("bike");
    expect(seniorAdvice.lowEmissionRoutine.morning).toContain("Stay indoors");

    // Impact justifications must differ significantly
    expect(commuterAdvice.impactJustification).toContain("CO₂");
    expect(seniorAdvice.impactJustification).toContain("cardiovascular");

    // Transit advice should differ
    expect(commuterAdvice.lowEmissionRoutine.transitSwaps).not.toEqual(
      seniorAdvice.lowEmissionRoutine.transitSwaps
    );
  });

  it("applies city-specific rules correctly for Pune vs Delhi", () => {
    const mockPuneAqi = createMockLiveAQI({ city: "Pune" });
    const mockDelhiAqi = createMockLiveAQI({
      city: "Delhi",
      cpcb: {
        naqi: 360,
        categoryEn: "Very Poor",
        categoryHi: "बहुत खराब",
        rank: 5,
        rankLabel: "Rank 5 of 6 — Very Poor",
        dominantPollutant: "PM2.5",
        subIndices: [],
      },
    });

    const puneReq: AdviseRequest = {
      city: "Pune",
      language: "en",
      budgetTier: "low_cost",
      members: [
        { id: "p1", role: "commuter", mustGoOut: true, commuteMode: "car" },
      ],
    };

    const delhiReq: AdviseRequest = {
      city: "Delhi",
      language: "en",
      budgetTier: "low_cost",
      members: [
        { id: "d1", role: "commuter", mustGoOut: true, commuteMode: "car" },
      ],
    };

    const puneResult = generateFallbackAdvice(puneReq, mockPuneAqi, "3:00 PM – 4:00 PM");
    const delhiResult = generateFallbackAdvice(delhiReq, mockDelhiAqi, "1:00 PM – 2:00 PM");

    // Pune commuter receives Pune Metro (Aqua/Purple) guidance
    expect(puneResult.memberAdvice[0].lowEmissionRoutine.transitSwaps).toContain("Pune Aqua Metro");

    // Delhi commuter receives Delhi Metro guidance
    expect(delhiResult.memberAdvice[0].lowEmissionRoutine.transitSwaps).toContain("Delhi Metro");
  });

  it("adjusts indoor hacks based on budget tier (low_cost vs purifier_owner)", () => {
    const mockAqi = createMockLiveAQI();

    const lowCostReq: AdviseRequest = {
      city: "Pune",
      language: "en",
      budgetTier: "low_cost",
      members: [
        { id: "m1", role: "student", mustGoOut: false, commuteMode: "walk" },
      ],
    };

    const purifierReq: AdviseRequest = {
      city: "Pune",
      language: "en",
      budgetTier: "purifier_owner",
      members: [
        { id: "m1", role: "student", mustGoOut: false, commuteMode: "walk" },
      ],
    };

    const lowCostResult = generateFallbackAdvice(lowCostReq, mockAqi, "Safe Window");
    const purifierResult = generateFallbackAdvice(purifierReq, mockAqi, "Safe Window");

    const lowHacks = lowCostResult.memberAdvice[0].indoorAirHacks.join(" ");
    const purifierHacks = purifierResult.memberAdvice[0].indoorAirHacks.join(" ");

    expect(lowHacks).not.toContain("Run air purifier");
    expect(purifierHacks).toContain("Run air purifier");
    expect(lowHacks).toContain("Wet mop");
  });

  it("generates natural Hindi response when language is 'hi'", () => {
    const mockAqi = createMockLiveAQI();
    const hindiReq: AdviseRequest = {
      city: "Pune",
      language: "hi",
      budgetTier: "low_cost",
      members: [
        { id: "m1", role: "senior", mustGoOut: false, commuteMode: "walk" },
      ],
    };

    const result = generateFallbackAdvice(hindiReq, mockAqi, "दोपहर 3:00 – 4:00");
    const advice = result.memberAdvice[0];

    expect(advice.lowEmissionRoutine.morning).toContain("घर के अंदर");
    expect(advice.impactJustification).toContain("वरिष्ठ नागरिक");
    expect(result.whatIfMetrics.commuteSwitch).toContain("मेट्रो");
  });
});
