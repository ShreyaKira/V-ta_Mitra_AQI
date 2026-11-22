/**
 * Unit tests for rate limiting, security boundaries, and schema validation:
 * - Sliding window rate limiter functionality & window sliding
 * - Client IP extraction across various proxy headers
 * - Strict server-side input validation for /api/advise
 */
import { describe, it, expect, beforeEach } from "vitest";
import { createRateLimiter, getClientIp } from "../rateLimit";
import {
  validateAdviseRequest,
  ValidationError,
  MAX_FOLLOWUP_CHARS,
  MAX_CITY_CHARS,
} from "../adviseFallback";

describe("Rate Limiter (Sliding Window)", () => {
  let limiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 3,
    });
  });

  it("allows requests up to the max threshold", () => {
    const ip = "192.168.1.1";
    expect(limiter.check(ip).limited).toBe(false);
    expect(limiter.check(ip).limited).toBe(false);
    expect(limiter.check(ip).limited).toBe(false);
  });

  it("blocks requests once threshold is exceeded", () => {
    const ip = "192.168.1.2";
    expect(limiter.check(ip).limited).toBe(false);
    expect(limiter.check(ip).limited).toBe(false);
    expect(limiter.check(ip).limited).toBe(false);

    // 4th request exceeds maxRequests = 3
    const result = limiter.check(ip);
    expect(result.limited).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("isolates rate limits by client IP", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    limiter.check(ipA);
    limiter.check(ipA);
    limiter.check(ipA);
    expect(limiter.check(ipA).limited).toBe(true);

    // ipB should still be unblocked
    expect(limiter.check(ipB).limited).toBe(false);
  });

  it("allows resetting the rate limiter store", () => {
    const ip = "127.0.0.1";
    limiter.check(ip);
    limiter.check(ip);
    limiter.check(ip);
    expect(limiter.check(ip).limited).toBe(true);

    limiter.reset();
    expect(limiter.size).toBe(0);
    expect(limiter.check(ip).limited).toBe(false);
  });
});

describe("getClientIp", () => {
  it("extracts the first IP from comma-separated x-forwarded-for", () => {
    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178" },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip if x-forwarded-for is missing", () => {
    const req = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.4" },
    });
    expect(getClientIp(req)).toBe("198.51.100.4");
  });

  it("returns 'unknown' if no IP headers are present", () => {
    const req = new Request("https://example.com");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("validateAdviseRequest (Server-Side Schema Hardening)", () => {
  const validPayload = {
    city: "Pune",
    language: "en",
    budgetTier: "low_cost",
    members: [
      { id: "m1", role: "commuter", mustGoOut: true, commuteMode: "metro" },
    ],
  };

  it("passes for a valid payload", () => {
    const validated = validateAdviseRequest(validPayload);
    expect(validated.city).toBe("Pune");
    expect(validated.language).toBe("en");
    expect(validated.budgetTier).toBe("low_cost");
    expect(validated.members).toHaveLength(1);
  });

  it("rejects non-object request bodies", () => {
    expect(() => validateAdviseRequest(null)).toThrow(ValidationError);
    expect(() => validateAdviseRequest("invalid")).toThrow(ValidationError);
    expect(() => validateAdviseRequest([])).toThrow(ValidationError);
  });

  it("rejects empty or excessively long city names", () => {
    expect(() => validateAdviseRequest({ ...validPayload, city: "" })).toThrow(
      ValidationError
    );
    expect(() => validateAdviseRequest({ ...validPayload, city: "   " })).toThrow(
      ValidationError
    );
    const longCity = "P".repeat(MAX_CITY_CHARS + 1);
    expect(() => validateAdviseRequest({ ...validPayload, city: longCity })).toThrow(
      ValidationError
    );
  });

  it("rejects unsupported languages", () => {
    expect(() => validateAdviseRequest({ ...validPayload, language: "fr" })).toThrow(
      ValidationError
    );
  });

  it("rejects invalid budget tiers", () => {
    expect(() =>
      validateAdviseRequest({ ...validPayload, budgetTier: "luxury" })
    ).toThrow(ValidationError);
  });

  it("enforces member bounds (1 to 3 members)", () => {
    expect(() => validateAdviseRequest({ ...validPayload, members: [] })).toThrow(
      ValidationError
    );

    const fourMembers = [
      { id: "1", role: "commuter", mustGoOut: true, commuteMode: "metro" },
      { id: "2", role: "child", mustGoOut: true, commuteMode: "bus" },
      { id: "3", role: "senior", mustGoOut: false, commuteMode: "walk" },
      { id: "4", role: "student", mustGoOut: true, commuteMode: "cycle" },
    ];
    expect(() =>
      validateAdviseRequest({ ...validPayload, members: fourMembers })
    ).toThrow(ValidationError);
  });

  it("rejects invalid member roles", () => {
    const invalidMember = [
      { id: "1", role: "astronaut", mustGoOut: true, commuteMode: "rocket" },
    ];
    expect(() =>
      validateAdviseRequest({ ...validPayload, members: invalidMember })
    ).toThrow(ValidationError);
  });

  it("validates and caps followUpQuestion length at 300 characters", () => {
    // Valid question
    const withQuestion = validateAdviseRequest({
      ...validPayload,
      followUpQuestion: "Can I exercise outside?",
    });
    expect(withQuestion.followUpQuestion).toBe("Can I exercise outside?");

    // Excessively long question
    const tooLong = "A".repeat(MAX_FOLLOWUP_CHARS + 1);
    expect(() =>
      validateAdviseRequest({ ...validPayload, followUpQuestion: tooLong })
    ).toThrow(ValidationError);
  });
});
