/**
 * Deterministic rule-based fallback advice generator.
 * Produces personalized, city-specific advice across the 3 pillars
 * when Gemini API key is missing, rate-limited, or unavailable.
 */

import {
  type LiveAirQualityResult,
  type HourlyForecastPoint,
} from "@/lib/aqi";
import { getCityRule } from "@/data/cityRules";

export interface HouseholdMember {
  id: string;
  role: "commuter" | "child" | "senior" | "student";
  mustGoOut: boolean;
  commuteMode: string;
}

export interface AdviseRequest {
  city: string;
  language: "en" | "hi";
  budgetTier: "low_cost" | "purifier_owner";
  members: HouseholdMember[];
  followUpQuestion?: string;
}

export interface MemberAdvice {
  memberId: string;
  role: string;
  lowEmissionRoutine: {
    morning: string;
    afternoon: string;
    evening: string;
    transitSwaps: string;
  };
  indoorAirHacks: string[];
  impactJustification: string;
}

export interface AdviseResponse {
  memberAdvice: MemberAdvice[];
  whatIfMetrics: {
    commuteSwitch: string;
    ventilationTiming: string;
  };
  followUpAnswer?: string;
  source: "gemini" | "rule-based-fallback";
  aqiSnapshot: {
    naqi: number;
    categoryEn: string;
    categoryHi: string;
    rankLabel: string;
    dominantPollutant: string;
    usAqi: number;
  };
  safestWindow: string;
}

export function findSafestWindowText(
  forecast: HourlyForecastPoint[],
  lang: "en" | "hi",
): string {
  if (!forecast || forecast.length < 2) {
    return lang === "en"
      ? "No forecast data available"
      : "पूर्वानुमान डेटा उपलब्ध नहीं";
  }

  let bestStart = 0;
  let bestAvg = Infinity;

  for (let i = 0; i <= forecast.length - 2; i++) {
    const a = forecast[i].usAqi;
    const b = forecast[i + 1].usAqi;
    if (a === null || b === null) continue;
    const avg = (a + b) / 2;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestStart = i;
    }
  }

  if (bestAvg === Infinity) {
    return lang === "en"
      ? "Unable to determine safest window"
      : "सबसे सुरक्षित समय निर्धारित करने में असमर्थ";
  }

  const startTime = forecast[bestStart].time;
  const endIdx = bestStart + 1;
  const endTime = forecast[endIdx]?.time ?? startTime;

  const fmtTime = (t: string) => {
    const d = new Date(t);
    return d.toLocaleTimeString(lang === "en" ? "en-IN" : "hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return lang === "en"
    ? `${fmtTime(startTime)} – ${fmtTime(endTime)} (avg AQI ~${Math.round(bestAvg)})`
    : `${fmtTime(startTime)} – ${fmtTime(endTime)} (औसत AQI ~${Math.round(bestAvg)})`;
}

export function generateFallbackAdvice(
  req: AdviseRequest,
  aqiData: LiveAirQualityResult,
  safestWindow: string,
): AdviseResponse {
  const cityRule = getCityRule(req.city);
  const isHindi = req.language === "hi";
  const naqi = aqiData.cpcb.naqi;
  const rank = aqiData.cpcb.rank;
  const isSevere = rank >= 5;
  const isPoor = rank >= 4;
  const hasPurifier = req.budgetTier === "purifier_owner";

  const memberAdvice: MemberAdvice[] = req.members.map((m) => {
    const isVulnerable = m.role === "child" || m.role === "senior";

    // Morning routine
    let morning: string;
    if (isSevere) {
      morning = isHindi
        ? "सुबह बाहर जाने से बचें। सभी दरवाज़े-खिड़कियां बंद रखें।"
        : "Avoid going outdoors in the morning. Keep all doors and windows sealed.";
    } else if (isPoor) {
      morning = isHindi
        ? isVulnerable
          ? "सुबह घर के अंदर रहें। बाहरी गतिविधि मत करें।"
          : `सुबह बाहर जाना ज़रूरी हो तो N95 मास्क पहनें। ${safestWindow} का इंतज़ार करें।`
        : isVulnerable
          ? "Stay indoors in the morning. Avoid all outdoor activity."
          : `If you must go out in the morning, wear an N95 mask. Wait for the safest window: ${safestWindow}.`;
    } else {
      morning = isHindi
        ? "सुबह हल्की बाहरी गतिविधि ठीक है। ताज़ी हवा के लिए 15 मिनट खिड़की खोलें।"
        : "Light outdoor activity in the morning is fine. Open windows for 15 minutes for fresh air.";
    }

    // Afternoon routine
    let afternoon: string;
    if (isSevere) {
      afternoon = isHindi
        ? "दोपहर में भी घर के अंदर रहें। बाहर जाना ज़रूरी हो तो N95 मास्क अनिवार्य।"
        : "Stay indoors in the afternoon as well. N95 mask mandatory if going out is essential.";
    } else if (m.mustGoOut) {
      afternoon = isHindi
        ? `दोपहर में ${m.commuteMode === "metro" ? "मेट्रो" : m.commuteMode} से यात्रा करें। भीड़भाड़ वाली सड़कों से बचें।`
        : `Commute by ${m.commuteMode} in the afternoon. Avoid congested roads.`;
    } else {
      afternoon = isHindi
        ? "दोपहर में घर से काम करें या ऑनलाइन कार्य करें।"
        : "Work from home or complete online tasks in the afternoon.";
    }

    // Evening routine
    let evening: string;
    if (isPoor) {
      evening = isHindi
        ? "शाम को बाहरी व्यायाम से बचें। इनडोर स्ट्रेचिंग या योग करें।"
        : "Avoid outdoor exercise in the evening. Do indoor stretching or yoga instead.";
    } else {
      evening = isHindi
        ? "शाम को पार्क में हल्की सैर ठीक है। भारी ट्रैफिक वाली सड़कों से दूर रहें।"
        : "A light walk in the park in the evening is fine. Stay away from heavy traffic roads.";
    }

    // Transit swaps specific to city & persona
    let transitAdvice: string;
    if (m.role === "commuter") {
      transitAdvice = isHindi
        ? cityRule.transitAdviceHi[0] ?? "कम उत्सर्जन वाली सार्वजनिक यात्रा को प्राथमिकता दें।"
        : cityRule.transitAdvice[0] ?? "Prefer public transit over private vehicles.";
    } else if (m.role === "senior") {
      transitAdvice = isHindi
        ? (cityRule.transitAdviceHi[1] ?? "भीड़भाड़ वाले पीक आवर्स के दौरान बाहर निकलने से बचें।")
        : (cityRule.transitAdvice[1] ?? "Avoid traveling during peak traffic hours; choose shaded, low-traffic routes.");
    } else if (m.role === "child") {
      transitAdvice = isHindi
        ? "स्कूल आने-जाने के लिए कारपूलिंग या स्कूल बस का उपयोग करें; खुली सड़कों पर लंबे समय तक पैदल चलने से बचें।"
        : "Opt for school buses or carpools rather than open-air two-wheelers; avoid heavy arterial roads during school runs.";
    } else {
      transitAdvice = isHindi
        ? cityRule.transitAdviceHi[0] ?? "सार्वजनिक परिवहन को प्राथमिकता दें।"
        : cityRule.transitAdvice[0] ?? "Prefer public transit over private vehicles.";
    }

    // Indoor air hacks
    const indoorHacks: string[] = [];
    if (hasPurifier) {
      indoorHacks.push(
        isHindi
          ? `एयर प्यूरीफायर ${isPoor ? "24/7" : "सुबह-शाम"} चलाएं। फिल्टर हर 3 महीने बदलें।`
          : `Run air purifier ${isPoor ? "24/7" : "morning and evening"}. Replace filters every 3 months.`,
      );
    }
    indoorHacks.push(
      isHindi
        ? "रोज़ाना गीला पोछा लगाएं — सूखी झाड़ू PM10 को हवा में उड़ाती है।"
        : "Wet mop floors daily — dry sweeping re-suspends PM10 into the air.",
      isHindi
        ? `${isPoor ? "खिड़कियां बंद रखें और दरवाज़ों के नीचे गीला तौलिया रखें।" : "अच्छे AQI समय में 15 मिनट क्रॉस-वेंटिलेशन करें।"}`
        : `${isPoor ? "Keep windows closed and place a damp towel under doors to block dust." : "Do 15 minutes of cross-ventilation during good AQI windows."}`,
      isHindi
        ? "रसोई में एग्ज़ॉस्ट फैन चलाएं, खासकर तड़का/तलने के समय।"
        : "Run the kitchen exhaust fan, especially during tadka/frying.",
    );

    // Impact justification
    let impact: string;
    if (m.role === "child") {
      impact = isHindi
        ? `बच्चों के फेफड़े विकसित हो रहे हैं — PM2.5 एक्सपोज़र उनकी फेफड़ों की क्षमता 15-20% तक कम कर सकता है। NAQI ${naqi} पर, बाहरी समय सीमित करना ज़रूरी है।`
        : `Children's lungs are still developing — PM2.5 exposure can reduce their lung capacity by 15-20%. At NAQI ${naqi}, limiting outdoor time is crucial.`;
    } else if (m.role === "senior") {
      impact = isHindi
        ? `वरिष्ठ नागरिकों में हृदय और श्वसन जोखिम अधिक है। NAQI ${naqi} (${aqiData.cpcb.categoryHi}) पर, PM2.5 हृदय संबंधी घटनाओं का जोखिम 25% बढ़ा सकता है।`
        : `Seniors face elevated cardiac and respiratory risks. At NAQI ${naqi} (${aqiData.cpcb.categoryEn}), PM2.5 can increase cardiovascular event risk by 25%.`;
    } else if (m.role === "commuter") {
      impact = isHindi
        ? `${m.commuteMode === "car" || m.commuteMode === "bike" ? "कार/बाइक" : "सार्वजनिक परिवहन"} यात्री ${m.commuteMode === "car" || m.commuteMode === "bike" ? "प्रति यात्रा ~1.5 kg CO₂ उत्सर्जित करता है। मेट्रो पर स्विच करने से 70% उत्सर्जन कम होगा।" : "पहले से ही कम उत्सर्जन कर रहा है। बढ़िया!"}`
        : `${m.commuteMode === "car" || m.commuteMode === "bike" ? "Car/bike" : "Public transit"} commuter: ${m.commuteMode === "car" || m.commuteMode === "bike" ? "emits ~1.5 kg CO₂ per trip. Switching to metro would cut emissions by 70%." : "already has a low emission footprint. Great choice!"}`;
    } else {
      impact = isHindi
        ? `NAQI ${naqi} (${aqiData.cpcb.categoryHi}) पर, कम एक्सपोज़र रणनीति अपनाने से स्वास्थ्य जोखिम में 30-50% की कमी हो सकती है।`
        : `At NAQI ${naqi} (${aqiData.cpcb.categoryEn}), adopting low-exposure strategies can reduce health risk by 30-50%.`;
    }

    return {
      memberId: m.id,
      role: m.role,
      lowEmissionRoutine: {
        morning,
        afternoon,
        evening,
        transitSwaps: transitAdvice,
      },
      indoorAirHacks: indoorHacks,
      impactJustification: impact,
    };
  });

  // What-if metrics
  const whatIfMetrics = {
    commuteSwitch: isHindi
      ? `कार/बाइक से मेट्रो पर स्विच करने से प्रति यात्रा ~1.2 kg CO₂ और PM2.5 एक्सपोज़र 60-80% कम होता है। सालाना ~400 kg CO₂ बचत।`
      : `Switching from car/bike to metro saves ~1.2 kg CO₂ per trip and reduces PM2.5 exposure by 60-80%. Annual savings: ~400 kg CO₂.`,
    ventilationTiming: isHindi
      ? `सबसे सुरक्षित खिड़की (${safestWindow}) में वेंटिलेशन करने से ऊंचे AQI समय की तुलना में इनडोर PM2.5 एक्सपोज़र 40-60% कम होता है।`
      : `Ventilating during the safest window (${safestWindow}) reduces indoor PM2.5 exposure by 40-60% compared to peak AQI hours.`,
  };

  // Follow-up answer (rule-based)
  let followUpAnswer: string | undefined;
  if (req.followUpQuestion) {
    followUpAnswer = isHindi
      ? `आपका प्रश्न: "${req.followUpQuestion}" — वर्तमान NAQI ${naqi} (${aqiData.cpcb.categoryHi}) है। कृपया सबसे सुरक्षित समय ${safestWindow} में बाहर जाएं और N95 मास्क ${isPoor ? "अवश्य" : "यदि संभव हो तो"} पहनें।`
      : `Your question: "${req.followUpQuestion}" — Current NAQI is ${naqi} (${aqiData.cpcb.categoryEn}). Please go outdoors during the safest window ${safestWindow} and ${isPoor ? "wear an N95 mask" : "consider a mask if sensitive"}.`;
  }

  return {
    memberAdvice,
    whatIfMetrics,
    followUpAnswer,
    source: "rule-based-fallback",
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
}

// ── Validation & Security Constants ──
export const MAX_FOLLOWUP_CHARS = 300;
export const MAX_CITY_CHARS = 100;
export const MAX_COMMUTE_MODE_CHARS = 30;
export const MAX_MEMBER_ID_CHARS = 50;
export const VALID_ROLES = ["commuter", "child", "senior", "student"] as const;
export const VALID_LANGS = ["en", "hi"] as const;
export const VALID_BUDGETS = ["low_cost", "purifier_owner"] as const;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateAdviseRequest(body: unknown): AdviseRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }
  const b = body as Record<string, unknown>;

  // city
  if (!b.city || typeof b.city !== "string") {
    throw new ValidationError("city is required and must be a string.");
  }
  const city = b.city.trim();
  if (city.length === 0 || city.length > MAX_CITY_CHARS) {
    throw new ValidationError(`city must be 1-${MAX_CITY_CHARS} characters.`);
  }

  // language
  if (!VALID_LANGS.includes(b.language as typeof VALID_LANGS[number])) {
    throw new ValidationError("language must be 'en' or 'hi'.");
  }

  // budgetTier
  if (!VALID_BUDGETS.includes(b.budgetTier as typeof VALID_BUDGETS[number])) {
    throw new ValidationError("budgetTier must be 'low_cost' or 'purifier_owner'.");
  }

  // members
  if (!Array.isArray(b.members) || b.members.length === 0) {
    throw new ValidationError("members array is required (1-3 members).");
  }
  if (b.members.length > 3) {
    throw new ValidationError("Maximum 3 household members allowed.");
  }

  for (const raw of b.members) {
    const m = raw as Record<string, unknown>;
    if (!VALID_ROLES.includes(m.role as typeof VALID_ROLES[number])) {
      throw new ValidationError(
        `Invalid role. Allowed: ${VALID_ROLES.join(", ")}.`,
      );
    }
    if (typeof m.mustGoOut !== "boolean") {
      throw new ValidationError("mustGoOut must be a boolean.");
    }
    if (typeof m.commuteMode !== "string") {
      throw new ValidationError("commuteMode must be a string.");
    }
    if (m.commuteMode.length > MAX_COMMUTE_MODE_CHARS) {
      throw new ValidationError(
        `commuteMode must be under ${MAX_COMMUTE_MODE_CHARS} characters.`,
      );
    }
    if (typeof m.id !== "string" || m.id.length === 0 || m.id.length > MAX_MEMBER_ID_CHARS) {
      throw new ValidationError(
        `Member id must be a non-empty string under ${MAX_MEMBER_ID_CHARS} characters.`,
      );
    }
  }

  // followUpQuestion (optional)
  let followUpQuestion: string | undefined;
  if (b.followUpQuestion !== undefined && b.followUpQuestion !== null) {
    if (typeof b.followUpQuestion !== "string") {
      throw new ValidationError("followUpQuestion must be a string.");
    }
    const trimmed = b.followUpQuestion.trim();
    if (trimmed.length > MAX_FOLLOWUP_CHARS) {
      throw new ValidationError(
        `followUpQuestion must be under ${MAX_FOLLOWUP_CHARS} characters.`,
      );
    }
    if (trimmed.length > 0) {
      followUpQuestion = trimmed;
    }
  }

  return {
    city,
    language: b.language as "en" | "hi",
    budgetTier: b.budgetTier as "low_cost" | "purifier_owner",
    members: (b.members as HouseholdMember[]).map((m) => ({
      id: String(m.id).trim(),
      role: m.role,
      mustGoOut: Boolean(m.mustGoOut),
      commuteMode: String(m.commuteMode).trim(),
    })),
    followUpQuestion,
  };
}
