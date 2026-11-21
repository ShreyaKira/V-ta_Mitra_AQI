/**
 * Vata Mitra — CPCB NAQI Engine Unit Tests
 */
import { describe, it, expect } from "vitest";
import {
  calculateCpcbNaqi,
  validateCityInput,
  AirQualityError,
  type PollutantConcentrations,
} from "../aqi";

// ─────────────────── Helper ───────────────────

/** Create a zeroed-out pollutant set with optional overrides */
function makePollutants(
  overrides: Partial<PollutantConcentrations> = {},
): PollutantConcentrations {
  return {
    pm2_5: 0,
    pm10: 0,
    no2: 0,
    so2: 0,
    co: 0,
    o3: 0,
    ...overrides,
  };
}

// ─────────────────── CPCB NAQI Breakpoint Tests ───────────────

describe("calculateCpcbNaqi", () => {
  describe("PM2.5 breakpoints", () => {
    it("returns Good (0–50) for PM2.5 = 15 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 15 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
      expect(result.categoryHi).toBe("अच्छा");
      expect(result.rank).toBe(1);
      expect(result.dominantPollutant).toBe("PM2.5");
    });

    it("returns Good for PM2.5 = 0 (boundary)", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 0 }));
      expect(result.naqi).toBe(0);
      expect(result.categoryEn).toBe("Good");
      expect(result.rank).toBe(1);
    });

    it("returns Good for PM2.5 = 30 (upper boundary)", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 30 }));
      expect(result.naqi).toBe(50);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Satisfactory (51–100) for PM2.5 = 45 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 45 }));
      expect(result.naqi).toBeGreaterThanOrEqual(51);
      expect(result.naqi).toBeLessThanOrEqual(100);
      expect(result.categoryEn).toBe("Satisfactory");
      expect(result.categoryHi).toBe("संतोषजनक");
      expect(result.rank).toBe(2);
    });

    it("returns Moderate (101–200) for PM2.5 = 75 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 75 }));
      expect(result.naqi).toBeGreaterThanOrEqual(101);
      expect(result.naqi).toBeLessThanOrEqual(200);
      expect(result.categoryEn).toBe("Moderate");
      expect(result.categoryHi).toBe("मध्यम");
      expect(result.rank).toBe(3);
    });

    it("returns Poor (201–300) for PM2.5 = 105 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 105 }));
      expect(result.naqi).toBeGreaterThanOrEqual(201);
      expect(result.naqi).toBeLessThanOrEqual(300);
      expect(result.categoryEn).toBe("Poor");
      expect(result.categoryHi).toBe("खराब");
      expect(result.rank).toBe(4);
    });

    it("returns Very Poor (301–400) for PM2.5 = 185 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 185 }));
      expect(result.naqi).toBeGreaterThanOrEqual(301);
      expect(result.naqi).toBeLessThanOrEqual(400);
      expect(result.categoryEn).toBe("Very Poor");
      expect(result.categoryHi).toBe("बहुत खराब");
      expect(result.rank).toBe(5);
    });

    it("returns Severe (401–500) for PM2.5 = 375 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 375 }));
      expect(result.naqi).toBeGreaterThanOrEqual(401);
      expect(result.naqi).toBeLessThanOrEqual(500);
      expect(result.categoryEn).toBe("Severe");
      expect(result.categoryHi).toBe("गंभीर");
      expect(result.rank).toBe(6);
    });
  });

  describe("PM10 breakpoints", () => {
    it("returns Good for PM10 = 25 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm10: 25 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Satisfactory for PM10 = 75 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm10: 75 }));
      expect(result.naqi).toBeGreaterThanOrEqual(51);
      expect(result.naqi).toBeLessThanOrEqual(100);
      expect(result.categoryEn).toBe("Satisfactory");
    });

    it("returns Severe for PM10 = 470 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm10: 470 }));
      expect(result.naqi).toBeGreaterThanOrEqual(401);
      expect(result.naqi).toBeLessThanOrEqual(500);
      expect(result.categoryEn).toBe("Severe");
    });
  });

  describe("NO₂ breakpoints", () => {
    it("returns Good for NO₂ = 20 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ no2: 20 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Poor for NO₂ = 230 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ no2: 230 }));
      expect(result.naqi).toBeGreaterThanOrEqual(201);
      expect(result.naqi).toBeLessThanOrEqual(300);
      expect(result.categoryEn).toBe("Poor");
    });
  });

  describe("SO₂ breakpoints", () => {
    it("returns Good for SO₂ = 20 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ so2: 20 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Moderate for SO₂ = 230 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ so2: 230 }));
      expect(result.naqi).toBeGreaterThanOrEqual(101);
      expect(result.naqi).toBeLessThanOrEqual(200);
      expect(result.categoryEn).toBe("Moderate");
    });
  });

  describe("CO breakpoints (mg/m³)", () => {
    it("returns Good for CO = 0.5 mg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ co: 0.5 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Satisfactory for CO = 1.5 mg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ co: 1.5 }));
      expect(result.naqi).toBeGreaterThanOrEqual(51);
      expect(result.naqi).toBeLessThanOrEqual(100);
      expect(result.categoryEn).toBe("Satisfactory");
    });

    it("returns Moderate for CO = 6 mg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ co: 6 }));
      expect(result.naqi).toBeGreaterThanOrEqual(101);
      expect(result.naqi).toBeLessThanOrEqual(200);
      expect(result.categoryEn).toBe("Moderate");
    });
  });

  describe("O₃ breakpoints", () => {
    it("returns Good for O₃ = 25 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ o3: 25 }));
      expect(result.naqi).toBe(25);
      expect(result.categoryEn).toBe("Good");
    });

    it("returns Satisfactory for O₃ = 75 µg/m³", () => {
      const result = calculateCpcbNaqi(makePollutants({ o3: 75 }));
      expect(result.naqi).toBeGreaterThanOrEqual(51);
      expect(result.naqi).toBeLessThanOrEqual(100);
      expect(result.categoryEn).toBe("Satisfactory");
    });
  });

  describe("Dominant pollutant selection (worst sub-index wins)", () => {
    it("picks PM2.5 as dominant when it has the worst sub-index", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 200, pm10: 25, no2: 10 }),
      );
      expect(result.dominantPollutant).toBe("PM2.5");
      expect(result.naqi).toBeGreaterThan(300);
    });

    it("picks PM10 as dominant when it has the worst sub-index", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 10, pm10: 400, no2: 10 }),
      );
      expect(result.dominantPollutant).toBe("PM10");
    });

    it("picks NO₂ as dominant when it has the worst sub-index", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 10, pm10: 25, no2: 350 }),
      );
      expect(result.dominantPollutant).toBe("NO₂");
    });

    it("picks CO as dominant when it has the worst sub-index", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 10, co: 20 }),
      );
      expect(result.dominantPollutant).toBe("CO");
    });

    it("picks O₃ as dominant when it has the worst sub-index", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 10, o3: 500 }),
      );
      expect(result.dominantPollutant).toBe("O₃");
    });
  });

  describe("rankLabel format", () => {
    it("formats correctly for a Poor result", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 105 }));
      expect(result.rankLabel).toBe("Rank 4 of 6 — Poor");
    });

    it("formats correctly for a Good result", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 10 }));
      expect(result.rankLabel).toBe("Rank 1 of 6 — Good");
    });
  });

  describe("subIndices array", () => {
    it("returns exactly 6 sub-index entries", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 50 }));
      expect(result.subIndices).toHaveLength(6);
    });

    it("includes all pollutant labels", () => {
      const result = calculateCpcbNaqi(makePollutants());
      const labels = result.subIndices.map((s) => s.pollutant);
      expect(labels).toContain("PM2.5");
      expect(labels).toContain("PM10");
      expect(labels).toContain("NO₂");
      expect(labels).toContain("SO₂");
      expect(labels).toContain("CO");
      expect(labels).toContain("O₃");
    });

    it("stores the original concentrations", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 42, pm10: 88 }));
      const pm25 = result.subIndices.find((s) => s.pollutant === "PM2.5");
      expect(pm25?.concentration).toBe(42);
      const pm10 = result.subIndices.find((s) => s.pollutant === "PM10");
      expect(pm10?.concentration).toBe(88);
    });
  });

  describe("edge cases", () => {
    it("all zeroes → NAQI 0, Good", () => {
      const result = calculateCpcbNaqi(makePollutants());
      expect(result.naqi).toBe(0);
      expect(result.categoryEn).toBe("Good");
      expect(result.rank).toBe(1);
    });

    it("caps at 500 for extremely high concentrations", () => {
      const result = calculateCpcbNaqi(makePollutants({ pm2_5: 9999 }));
      expect(result.naqi).toBe(500);
      expect(result.categoryEn).toBe("Severe");
      expect(result.rank).toBe(6);
    });

    it("multiple pollutants at Severe → NAQI from worst", () => {
      const result = calculateCpcbNaqi(
        makePollutants({ pm2_5: 300, pm10: 510, no2: 450 }),
      );
      expect(result.naqi).toBe(500);
      expect(result.categoryEn).toBe("Severe");
    });
  });
});

// ─────────────────── Input Validation Tests ───────────────────

describe("validateCityInput", () => {
  it("accepts a valid city name", () => {
    expect(validateCityInput("Delhi")).toBe("Delhi");
  });

  it("trims whitespace", () => {
    expect(validateCityInput("  Mumbai  ")).toBe("Mumbai");
  });

  it("accepts city names with hyphens and apostrophes", () => {
    expect(validateCityInput("Navi-Mumbai")).toBe("Navi-Mumbai");
    expect(validateCityInput("St. John's")).toBe("St. John's");
  });

  it("rejects empty string", () => {
    expect(() => validateCityInput("")).toThrow(AirQualityError);
    expect(() => validateCityInput("")).toThrow("City name cannot be empty");
  });

  it("rejects whitespace-only string", () => {
    expect(() => validateCityInput("   ")).toThrow(AirQualityError);
  });

  it("rejects null/undefined coerced to string", () => {
    expect(() => validateCityInput(null as unknown as string)).toThrow(
      AirQualityError,
    );
    expect(() => validateCityInput(undefined as unknown as string)).toThrow(
      AirQualityError,
    );
  });

  it("rejects strings with script injection attempts", () => {
    expect(() => validateCityInput("<script>alert('xss')</script>")).toThrow(
      AirQualityError,
    );
    expect(() => validateCityInput("Delhi; DROP TABLE cities")).toThrow(
      AirQualityError,
    );
  });

  it("rejects strings with special/control characters", () => {
    expect(() => validateCityInput("Delhi\0")).toThrow(AirQualityError);
    expect(() => validateCityInput("Delhi\n")).toThrow(AirQualityError);
    expect(() => validateCityInput("Delhi&Mumbai")).toThrow(AirQualityError);
  });

  it("rejects excessively long strings", () => {
    const longName = "A".repeat(101);
    expect(() => validateCityInput(longName)).toThrow(AirQualityError);
    expect(() => validateCityInput(longName)).toThrow("too long");
  });

  it("sets error code to INVALID_INPUT", () => {
    try {
      validateCityInput("");
    } catch (err) {
      expect(err).toBeInstanceOf(AirQualityError);
      expect((err as AirQualityError).code).toBe("INVALID_INPUT");
    }
  });
});
