/**
 * POST /api/advise
 * Generates personalized household air-quality advice using
 * live CPCB NAQI + city rules + Gemini 2.5 Flash,
 * with a deterministic rule-based fallback.
 *
 * Security: rate-limited (12 req/min per IP), strict input
 * validation, body size cap (16 KB), zero stack-trace leaks.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  fetchLiveIndiaAirQuality,
  AirQualityError,
  type LiveAirQualityResult,
} from "@/lib/aqi";
import { getCityRule } from "@/data/cityRules";
import {
  type AdviseRequest,
  type AdviseResponse,
  type HouseholdMember,
  findSafestWindowText,
  generateFallbackAdvice,
  validateAdviseRequest,
  ValidationError,
} from "@/lib/adviseFallback";
import { adviseRateLimiter, getClientIp } from "@/lib/rateLimit";

// ── Constants ──
const MAX_BODY_BYTES = 16 * 1024; // 16 KB

// ──────────── Gemini AI Advice ───────────────

async function generateGeminiAdvice(
  req: AdviseRequest,
  aqiData: LiveAirQualityResult,
  safestWindow: string,
): Promise<AdviseResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your_google_ai_studio_key_here")) return null;

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const cityRule = getCityRule(req.city);
    const isHindi = req.language === "hi";

    const systemPrompt = `You are Vata Mitra (वाता मित्र), an expert Indian urban air quality advisor. 
You MUST use the EXACT live AQI data provided below — NEVER invent or guess AQI numbers.
Respond in ${isHindi ? "Hindi (Devanagari script)" : "English"}.
Be practical, specific to Indian household context, and empathetic.
Organize your response into:
1. One shared "homePlan" for the entire household (indoor hacks, purifier/non-purifier strategy, indoor plant care, and a nearby high-oxygen green walk recommendation tailored to the city).
2. "memberAdvice" tailored specifically for EACH family member (analyzing their leave/return time risk, commute transit swaps, exercise timing, and physiological health impact).
3. "scheduleExposureCalculator" quantifying PM2.5 inhalation reduction.`;

    const userPrompt = `
## LIVE AQI DATA (use these exact numbers):
- City: ${aqiData.city}
- CPCB NAQI: ${aqiData.cpcb.naqi} (${aqiData.cpcb.categoryEn} / ${aqiData.cpcb.categoryHi})
- Rank: ${aqiData.cpcb.rankLabel}
- Dominant Pollutant: ${aqiData.cpcb.dominantPollutant}
- US AQI: ${aqiData.usAqi}
- Safest 2-hour window: ${safestWindow}

## CITY & LOCAL GREEN ZONES:
Transit: ${isHindi ? cityRule.transitAdviceHi.join("; ") : cityRule.transitAdvice.join("; ")}
Pollution: ${isHindi ? cityRule.pollutionNotesHi.join("; ") : cityRule.pollutionNotes.join("; ")}
Green Zones: ${cityRule.greenZones.map((g) => isHindi ? g.nameHi : g.nameEn).join(", ")}

## HOME SETUP:
- Air Purifier: ${req.hasPurifier ? "Yes, family owns an air purifier" : "No, family does NOT have an air purifier"}
- Indoor Plants / Balcony Garden: ${req.hasPlants ? "Yes, has indoor plants / balcony garden" : "No plants currently"}

## HOUSEHOLD MEMBERS:
${req.members.map((m) => `- Name: ${m.name || m.id}, Age Group: ${m.ageGroup || m.role}, Activity: ${m.activity || "commute"}, Hours: ${m.leaveTime || "09:00"} to ${m.returnTime || "18:30"}, Commute: ${m.commuteMode || "transit"}, Asthma/Sensitivity: ${m.hasAsthmaOrSensitivity ? "Yes" : "No"}, Smoker: ${m.isSmoker ? "Yes" : "No"}`).join("\n")}

${req.followUpQuestion ? `## FOLLOW-UP QUESTION:\n${req.followUpQuestion}` : ""}

## INSTRUCTIONS:
Return valid JSON matching this exact schema:
{
  "homePlan": {
    "indoorAirHacks": ["string"],
    "hasPurifier": ${Boolean(req.hasPurifier)},
    "purifierRecommendation": "string",
    "hasPlants": ${Boolean(req.hasPlants)},
    "plantAirCare": "string",
    "ventilationSchedule": "string",
    "nearbyGreenZone": {
      "name": "string",
      "timingSuggestion": "string",
      "benefitReason": "string"
    }
  },
  "memberAdvice": [
    {
      "memberId": "string",
      "name": "string",
      "role": "string",
      "ageGroup": "child | adult | senior",
      "activity": "string",
      "scheduleRisk": "string",
      "commuteTransitSwap": "string",
      "outdoorExerciseWindow": "string",
      "lowEmissionRoutine": {
        "morning": "string",
        "afternoon": "string",
        "evening": "string",
        "transitSwaps": "string"
      },
      "indoorAirHacks": ["string"],
      "impactJustification": "string"
    }
  ],
  "scheduleExposureCalculator": {
    "currentCommuteExposureScore": 75,
    "optimizedCommuteExposureScore": 25,
    "inhalationReductionPct": 67,
    "summaryText": "string"
  },
  "whatIfMetrics": {
    "commuteSwitch": "string",
    "ventilationTiming": "string"
  },
  "followUpAnswer": "string or null"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text);

    return {
      homePlan: parsed.homePlan,
      memberAdvice: parsed.memberAdvice,
      scheduleExposureCalculator: parsed.scheduleExposureCalculator || {
        currentCommuteExposureScore: 75,
        optimizedCommuteExposureScore: 25,
        inhalationReductionPct: 67,
        summaryText: "Optimizing commute mode and ventilation schedule cuts direct PM2.5 inhalation by ~67%.",
      },
      whatIfMetrics: parsed.whatIfMetrics,
      followUpAnswer: parsed.followUpAnswer ?? undefined,
      source: "gemini",
      aqiSnapshot: {
        naqi: aqiData.cpcb.naqi,
        categoryEn: aqiData.cpcb.categoryEn,
        categoryHi: aqiData.cpcb.categoryHi,
        rankLabel: aqiData.cpcb.rankLabel,
        dominantPollutant: aqiData.cpcb.dominantPollutant,
        usAqi: aqiData.usAqi,
      },
      safestWindow,
    };
  } catch {
    // Never leak Gemini SDK errors or API key-related traces to the client
    return null;
  }
}

// ────────────────── Handler ──────────────────

export async function POST(request: NextRequest) {
  // ── Rate Limiting ──
  const clientIp = getClientIp(request);
  const { limited, retryAfterMs } = adviseRateLimiter.check(clientIp);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        },
      },
    );
  }

  // ── Body Size Check ──
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 413 },
    );
  }

  try {
    const body = await request.json();
    const req = validateAdviseRequest(body);

    // Always fetch live AQI server-side
    let aqiData: LiveAirQualityResult;
    try {
      aqiData = await fetchLiveIndiaAirQuality(req.city);
    } catch (err) {
      if (err instanceof AirQualityError) {
        return NextResponse.json(
          { error: "Could not fetch live air quality data for this city. Please try a different city or retry later." },
          { status: 502 },
        );
      }
      throw err;
    }

    const safestWindow = findSafestWindowText(
      aqiData.hourlyForecast,
      req.language,
    );

    // Try Gemini first, fall back to deterministic rules
    const geminiResult = await generateGeminiAdvice(
      req,
      aqiData,
      safestWindow,
    );
    if (geminiResult) {
      return NextResponse.json(geminiResult);
    }

    // Deterministic fallback
    const fallbackResult = generateFallbackAdvice(req, aqiData, safestWindow);
    return NextResponse.json(fallbackResult);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    // Never leak stack traces or internal details
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
