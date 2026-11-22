/**
 * Deterministic rule-based fallback advice generator.
 * Produces personalized, city-specific advice across:
 * 1) Shared Home & Indoor Air Plan (with high-oxygen green zone walk suggestion)
 * 2) Individual Member Action Cards (schedule risk, transit swap, exercise window, impact)
 * 3) Daily Schedule & Commute Exposure Calculator
 */

import {
  type LiveAirQualityResult,
  type HourlyForecastPoint,
} from "@/lib/aqi";
import { getCityRule } from "@/data/cityRules";

export interface HouseholdMember {
  id: string;
  name?: string;
  ageGroup?: "child" | "adult" | "senior";
  role?: string; // "commuter" | "child" | "senior" | "student" for backward compatibility
  activity?: "office_college" | "outdoor_active" | "mostly_indoors";
  leaveTime?: string; // e.g. "09:00"
  returnTime?: string; // e.g. "18:30"
  homeArea?: string;
  workSchoolArea?: string;
  commuteMode?: string;
  mustGoOut?: boolean;
  hasAsthmaOrSensitivity?: boolean;
  isSmoker?: boolean;
}

export interface AdviseRequest {
  city: string;
  language: "en" | "hi";
  budgetTier?: "low_cost" | "purifier_owner";
  hasPurifier?: boolean;
  hasPlants?: boolean;
  members: HouseholdMember[];
  followUpQuestion?: string;
}

export interface HomePlan {
  indoorAirHacks: string[];
  hasPurifier: boolean;
  purifierRecommendation: string;
  hasPlants: boolean;
  plantAirCare: string;
  ventilationSchedule: string;
  nearbyGreenZone: {
    name: string;
    timingSuggestion: string;
    benefitReason: string;
  };
}

export interface MemberAdvice {
  memberId: string;
  name?: string;
  role: string;
  ageGroup?: "child" | "adult" | "senior";
  activity?: string;
  scheduleRisk: string;
  commuteTransitSwap: string;
  outdoorExerciseWindow: string;
  lowEmissionRoutine: {
    morning: string;
    afternoon: string;
    evening: string;
    transitSwaps: string;
  };
  indoorAirHacks: string[];
  impactJustification: string;
}

export interface ScheduleExposureCalculator {
  currentCommuteExposureScore: number;
  optimizedCommuteExposureScore: number;
  inhalationReductionPct: number;
  summaryText: string;
}

export interface AdviseResponse {
  homePlan: HomePlan;
  memberAdvice: MemberAdvice[];
  scheduleExposureCalculator: ScheduleExposureCalculator;
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

  const hasPurifier =
    req.hasPurifier !== undefined
      ? req.hasPurifier
      : req.budgetTier === "purifier_owner";
  const hasPlants = Boolean(req.hasPlants);

  // 1. Shared Home & Indoor Air Plan
  const sharedHacks: string[] = [];
  if (isPoor) {
    sharedHacks.push(
      isHindi
        ? "खिड़कियां और बालकनी के दरवाज़े बंद रखें; बाहरी धूल रोकने के लिए मुख्य दरवाज़े के नीचे गीला तौलिया लगाएं।"
        : "Keep windows and balcony doors sealed during peak traffic; place a damp cloth under door gaps to trap dust.",
      isHindi
        ? "रोज़ाना 1 बार गीला पोछा (Wet mop) लगाएं — सूखी झाड़ू से सूक्ष्म कण (PM10) हवा में उड़ते हैं।"
        : "Wet mop floors once daily — avoid dry brooms which resuspend fine dust into breathing zones.",
      isHindi
        ? "रसोई में खाना बनाते समय, विशेषकर तड़का लगाते समय एग्ज़ॉस्ट फैन चलाएं और रसोई का दरवाज़ा बंद रखें।"
        : "Run kitchen exhaust fan throughout cooking (especially spice tempering/frying) and keep kitchen door closed.",
      isHindi
        ? "धूपबत्ती, अगरबत्ती और मॉस्किटो कॉइल जलाने से बचें; प्राकृतिक विकर्षक या मॉस्किटो नेट का उपयोग करें।"
        : "Avoid burning incense (agarbatti) and mosquito coils; switch to electric diffusers or mosquito nets.",
    );
  } else {
    sharedHacks.push(
      isHindi
        ? `सबसे सुरक्षित समय (${safestWindow}) में 15 मिनट विपरीत खिड़कियां खोलकर क्रॉस-वेंटिलेशन करें।`
        : `Perform 15-minute cross-ventilation during the safest outdoor window (${safestWindow}).`,
      isHindi
        ? "रोज़ाना गीला पोछा (Wet mop) लगाएं और पंखे के ब्लेड्स पर जमी धूल पोंछें।"
        : "Wet mop floors daily and wipe dust off ceiling fan blades.",
      isHindi
        ? "रसोई में खाना बनाते समय एग्ज़ॉस्ट फैन हमेशा ऑन रखें।"
        : "Always operate the kitchen exhaust while frying or tempering spices.",
    );
  }

  if (hasPurifier) {
    sharedHacks.push(
      isHindi
        ? "एयर प्यूरीफायर (HEPA H13) को बेडरूम या लिविंग रूम में चलाएं। Run air purifier in main rooms."
        : "Run air purifier (HEPA H13) on medium speed in bedrooms or main living spaces; vacuum pre-filter fortnightly.",
    );
  }

  const purifierRec = hasPurifier
    ? isHindi
      ? `एयर प्यूरीफायर को मुख्य बेडरूम या लिविंग एरिया में ${isPoor ? "24 घंटे मध्यम गति पर" : "सोते समय और सुबह"} चलाएं। प्री-फिल्टर हर 15 दिन में साफ करें।`
      : `Operate air purifier in the main bedroom/living area ${isPoor ? "24/7 on medium mode" : "during sleep hours and early morning"}. Vacuum the pre-filter every 2 weeks.`
    : isHindi
      ? "प्यूरीफायर नहीं है: गीले पोछे, क्रॉस-वेंटिलेशन शेड्यूलिंग और दरवाज़ों की सीलिंग से इनडोर प्रदूषण 40-50% तक कम रखें।"
      : "No purifier: Rely on disciplined damp mopping, timed cross-ventilation during safest windows, and door gap sealing for 40-50% cleaner indoor air.";

  const plantCare = hasPlants
    ? isHindi
      ? "मौजूदा पौधों (मनी प्लांट, स्नेक प्लांट, एरिका पाम) की पत्तियों को गीले कपड़े से हफ्ते में दो बार पोंछें ताकि रंध्र धूल से न रुकें और ऑक्सीजन उत्पादन सक्रिय रहे।"
      : "Wipe dust off existing indoor and balcony plant leaves twice weekly with a damp cloth to maximize their stomatal particulate trapping and oxygen release."
    : isHindi
      ? "कम रखरखाव वाले 2-3 इनडोर पौधे (जैसे स्नेक प्लांट या मनी प्लांट) रखें — ये बंद कमरों में फॉर्मेल्डिहाइड और वाष्पशील यौगिकों (VOCs) को कम करते हैं।"
      : "Consider adding 2-3 low-maintenance plants (Snake Plant, Spider Plant, Areca Palm) in bedrooms to naturally absorb VOCs and refresh stale indoor air.";

  const greenZoneEntry = cityRule.greenZones[0] || {
    nameEn: "Municipal Botanical Park or Local Lake Promenade",
    nameHi: "नगर निगम बॉटनिकल पार्क या स्थानीय झील किनारा",
    benefitEn: "Mature tree foliage filters ambient particulates during midday hours.",
    benefitHi: "पुराने पेड़ दोपहर के समय हवा के धूल कणों को प्राकृतिक रूप से फ़िल्टर करते हैं।",
  };

  const homePlan: HomePlan = {
    indoorAirHacks: sharedHacks,
    hasPurifier,
    purifierRecommendation: purifierRec,
    hasPlants,
    plantAirCare: plantCare,
    ventilationSchedule: isHindi
      ? `सर्वोत्तम वेंटिलेशन समय: ${safestWindow}`
      : `Recommended Cross-Ventilation Time: ${safestWindow}`,
    nearbyGreenZone: {
      name: isHindi ? greenZoneEntry.nameHi : greenZoneEntry.nameEn,
      timingSuggestion: isHindi
        ? `अनुशंसित समय: सबसे सुरक्षित खिड़की (${safestWindow}) के दौरान`
        : `Recommended Window: During safest AQI period (${safestWindow})`,
      benefitReason: isHindi ? greenZoneEntry.benefitHi : greenZoneEntry.benefitEn,
    },
  };

  // 2. Individual Member Advice Cards
  const memberAdvice: MemberAdvice[] = req.members.map((m, idx) => {
    const ageGroup =
      m.ageGroup ||
      (m.role === "child" ? "child" : m.role === "senior" ? "senior" : "adult");
    const isVulnerable =
      ageGroup === "child" || ageGroup === "senior" || Boolean(m.hasAsthmaOrSensitivity);
    const memberName = m.name?.trim() || `Member ${idx + 1}`;
    const commuteMode = m.commuteMode || (ageGroup === "senior" ? "walk" : "car");
    const leaveTime = m.leaveTime || "09:00";
    const returnTime = m.returnTime || "18:30";

    // Schedule risk assessment
    let scheduleRisk: string;
    if (isSevere) {
      scheduleRisk = isHindi
        ? `${memberName} का आवागमन समय (${leaveTime} – ${returnTime}) गंभीर स्मॉग के घंटों से मेल खाता है। N95 मास्क अनिवार्य है और खुली यात्रा से बचें।`
        : `${memberName}'s commute hours (${leaveTime} – ${returnTime}) fall during severe inversion and peak exhaust. N95 mask is strictly mandatory; avoid open-air travel.`;
    } else if (isPoor) {
      scheduleRisk = isHindi
        ? `${leaveTime} बजे सुबह की यात्रा में सड़क-स्तरीय PM2.5 उच्च रहता है। यदि संभव हो तो यात्रा 30 मिनट पहले या बाद में करें।`
        : `Commuting at ${leaveTime} coincides with morning road-level particulate buildup. Shifting travel by 30-45 minutes cuts direct exhaust intake.`;
    } else {
      scheduleRisk = isHindi
        ? `${leaveTime} और ${returnTime} के समय हवा मध्यम है। नियमित सावधानी के साथ आवागमन सुरक्षित है।`
        : `Current air quality at ${leaveTime} & ${returnTime} is manageable. Standard commute routine is safe.`;
    }

    // Commute / Transit swap
    let commuteSwap: string;
    const cityTransitAdvice = isHindi
      ? (cityRule.transitAdviceHi[0] || "")
      : (cityRule.transitAdvice[0] || "");

    if (commuteMode === "two_wheeler" || commuteMode === "bike") {
      commuteSwap = isHindi
        ? `दोपहिया वाहन पर सीधे निकास का प्रभाव 3 गुना अधिक होता है। ${cityTransitAdvice} या कवर्ड पब्लिक बस अपनाएं।`
        : `Open two-wheelers expose riders to 3x higher PM2.5 inhalation. ${cityTransitAdvice}`;
    } else if (commuteMode === "car") {
      commuteSwap = isHindi
        ? `कार चलाते समय खिड़कियां बंद रखें और एसी को रीसर्कुलेशन मोड पर चलाएं। ${cityTransitAdvice} पर विचार करें।`
        : `Drive with sealed windows and AC set to cabin air recirculation mode. ${cityTransitAdvice}`;
    } else {
      commuteSwap = cityTransitAdvice || (isHindi ? "सार्वजनिक परिवहन को प्राथमिकता दें।" : "Prefer electric public transit and carpooling.");
    }

    // Exercise window
    const exerciseWindow = isHindi
      ? `सुबह के घने स्मॉग (6–8 AM) में दौड़ने से बचें। व्यायाम या सैर केवल सबसे सुरक्षित समय (${safestWindow}) में या इनडोर करें।`
      : `Avoid early morning (6–8 AM) high-smog runs. Schedule walks or workouts during the safest window (${safestWindow}) or indoors.`;

    // Impact Justification
    let impact: string;
    if (m.hasAsthmaOrSensitivity) {
      impact = isHindi
        ? `सांस की संवेदनशीलता के कारण, NAQI ${naqi} पर महीन कण ब्रांकाई में सूजन ला सकते हैं। N95 सुरक्षा और इनडोर एयर प्रोटेक्शन आवश्यक है।`
        : `Due to respiratory sensitivity, PM2.5 at NAQI ${naqi} can trigger bronchial airway inflammation. N95 protection and clean indoor air are essential.`;
    } else if (ageGroup === "child") {
      impact = isHindi
        ? `बच्चों के फेफड़े विकसित हो रहे हैं और उनकी सांस लेने की गति वयस्कों से तेज़ होती है। NAQI ${naqi} पर बाहरी खेल सीमित करना फेफड़ों की क्षमता सुरक्षित रखता है।`
        : `Children breathe faster relative to body mass while lungs are developing. Limiting peak-smog exposure at NAQI ${naqi} protects long-term pulmonary capacity.`;
    } else if (ageGroup === "senior") {
      impact = isHindi
        ? `वरिष्ठ नागरिकों में हृदय और श्वसन जोखिम अधिक है। NAQI ${naqi} (${aqiData.cpcb.categoryHi}) पर, PM2.5 हृदय संबंधी घटनाओं का जोखिम 25% बढ़ा सकता है।`
        : `Seniors face elevated cardiac and respiratory risks. At NAQI ${naqi} (${aqiData.cpcb.categoryEn}), PM2.5 can increase cardiovascular event risk by 25%.`;
    } else {
      impact = isHindi
        ? `${commuteMode === "car" || commuteMode === "bike" ? "कार/बाइक" : "सार्वजनिक परिवहन"} यात्री ${commuteMode === "car" || commuteMode === "bike" ? "प्रति यात्रा ~1.5 kg CO₂ उत्सर्जित करता है। मेट्रो पर स्विच करने से 70% उत्सर्जन कम होगा।" : "पहले से ही कम उत्सर्जन कर रहा है। बढ़िया!"}`
        : `${commuteMode === "car" || commuteMode === "bike" ? "Car/bike" : "Public transit"} commuter: ${commuteMode === "car" || commuteMode === "bike" ? "emits ~1.5 kg CO₂ per trip. Switching to metro would cut emissions by 70%." : "already has a low emission footprint. Great choice!"}`;
    }

    // Morning, afternoon, evening (compatibility)
    const morning = isSevere
      ? isHindi ? "सुबह बाहर जाने से बचें। सभी दरवाज़े बंद रखें।" : "Avoid going outdoors in the morning. Keep all doors sealed."
      : isPoor
      ? isVulnerable
        ? isHindi ? "सुबह घर के अंदर रहें। बाहरी गतिविधि मत करें।" : "Stay indoors in the morning. Avoid all outdoor activity."
        : isHindi ? `सुबह बाहर जाना ज़रूरी हो तो N95 मास्क पहनें। ${safestWindow} का इंतज़ार करें।` : `If you must go out in the morning, wear an N95 mask. Wait for the safest window: ${safestWindow}.`
      : isHindi ? "सुबह हल्की बाहरी गतिविधि ठीक है।" : "Light outdoor activity in the morning is fine.";

    const afternoon = isSevere
      ? isHindi ? "दोपहर में भी घर के अंदर रहें।" : "Stay indoors in the afternoon as well."
      : m.mustGoOut
      ? isHindi ? `दोपहर में ${commuteMode} से यात्रा करें।` : `Commute by ${commuteMode} in the afternoon.`
      : isHindi ? "दोपहर में घर से काम करें।" : "Work from home in the afternoon.";

    const evening = isPoor
      ? isHindi ? "शाम को बाहरी व्यायाम से बचें।" : "Avoid outdoor exercise in the evening."
      : isHindi ? "शाम को पार्क में हल्की सैर ठीक है।" : "A light walk in the park in the evening is fine.";

    return {
      memberId: m.id,
      name: memberName,
      role: m.role || (ageGroup === "child" ? "child" : ageGroup === "senior" ? "senior" : "commuter"),
      ageGroup,
      activity: m.activity || "office_college",
      scheduleRisk,
      commuteTransitSwap: commuteSwap,
      outdoorExerciseWindow: exerciseWindow,
      lowEmissionRoutine: {
        morning,
        afternoon,
        evening,
        transitSwaps: commuteSwap,
      },
      indoorAirHacks: sharedHacks,
      impactJustification: impact,
    };
  });

  // 3. Schedule & Exposure Calculator
  const reductionPct = isPoor ? 68 : 45;
  const scheduleCalculator: ScheduleExposureCalculator = {
    currentCommuteExposureScore: isSevere ? 88 : isPoor ? 74 : 48,
    optimizedCommuteExposureScore: isSevere ? 28 : isPoor ? 24 : 18,
    inhalationReductionPct: reductionPct,
    summaryText: isHindi
      ? `खुली बाइक/पैदल यात्रा से कवर्ड मेट्रो/कारपूल पर स्विच करने और व्यायाम को सबसे सुरक्षित समय (${safestWindow}) में शिफ्ट करने से PM2.5 सांस में जाने में लगभग ${reductionPct}% की कमी होगी।`
      : `Shifting from open two-wheeler to covered public transit and scheduling walks to the safest window (${safestWindow}) reduces direct PM2.5 inhalation by ~${reductionPct}%.`,
  };

  const whatIfMetrics = {
    commuteSwitch: isHindi
      ? `कार/बाइक से मेट्रो पर स्विच करने से प्रति यात्रा ~1.2 kg CO₂ और PM2.5 एक्सपोज़र 60-80% कम होता है।`
      : `Switching from car/bike to metro saves ~1.2 kg CO₂ per trip and reduces PM2.5 exposure by 60-80%.`,
    ventilationTiming: isHindi
      ? `सबसे सुरक्षित खिड़की (${safestWindow}) में वेंटिलेशन करने से इनडोर PM2.5 एक्सपोज़र 40-60% कम होता है।`
      : `Ventilating during the safest window (${safestWindow}) reduces indoor PM2.5 exposure by 40-60%.`,
  };

  let followUpAnswer: string | undefined;
  if (req.followUpQuestion) {
    followUpAnswer = isHindi
      ? `आपके प्रश्न ("${req.followUpQuestion}") का उत्तर: वर्तमान NAQI ${naqi} (${aqiData.cpcb.categoryHi}) है। यदि बाहर जाना आवश्यक हो, तो सबसे सुरक्षित समय (${safestWindow}) में जाएं और N95 मास्क का उपयोग करें।`
      : `Answering your question ("${req.followUpQuestion}"): Current NAQI is ${naqi} (${aqiData.cpcb.categoryEn}). For any outdoor errand, schedule it during the safest window (${safestWindow}) and wear a protective N95 mask.`;
  }

  return {
    homePlan,
    memberAdvice,
    scheduleExposureCalculator: scheduleCalculator,
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
export const MAX_COMMUTE_MODE_CHARS = 40;
export const MAX_MEMBER_ID_CHARS = 50;
export const MAX_MEMBER_NAME_CHARS = 50;
export const VALID_ROLES = ["commuter", "child", "senior", "student"] as const;
export const VALID_AGE_GROUPS = ["child", "adult", "senior"] as const;
export const VALID_ACTIVITIES = ["office_college", "outdoor_active", "mostly_indoors"] as const;
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

  // budgetTier or hasPurifier
  let budgetTier: "low_cost" | "purifier_owner" = "low_cost";
  if (b.budgetTier !== undefined) {
    if (!VALID_BUDGETS.includes(b.budgetTier as typeof VALID_BUDGETS[number])) {
      throw new ValidationError("budgetTier must be 'low_cost' or 'purifier_owner'.");
    }
    budgetTier = b.budgetTier as "low_cost" | "purifier_owner";
  } else if (b.hasPurifier !== undefined) {
    budgetTier = b.hasPurifier ? "purifier_owner" : "low_cost";
  }

  const hasPurifier = b.hasPurifier !== undefined ? Boolean(b.hasPurifier) : budgetTier === "purifier_owner";
  const hasPlants = Boolean(b.hasPlants);

  // members
  if (!Array.isArray(b.members) || b.members.length === 0) {
    throw new ValidationError("members array is required (1-3 members).");
  }
  if (b.members.length > 3) {
    throw new ValidationError("Maximum 3 household members allowed.");
  }

  const validatedMembers: HouseholdMember[] = [];

  for (const raw of b.members) {
    const m = raw as Record<string, unknown>;

    // Role or AgeGroup validation
    let role = "commuter";
    let ageGroup: "child" | "adult" | "senior" = "adult";

    if (m.role !== undefined) {
      if (!VALID_ROLES.includes(m.role as typeof VALID_ROLES[number])) {
        throw new ValidationError(
          `Invalid role. Allowed: ${VALID_ROLES.join(", ")}.`,
        );
      }
      role = String(m.role);
      ageGroup = role === "child" ? "child" : role === "senior" ? "senior" : "adult";
    }

    if (m.ageGroup !== undefined) {
      if (!VALID_AGE_GROUPS.includes(m.ageGroup as typeof VALID_AGE_GROUPS[number])) {
        throw new ValidationError(
          `Invalid ageGroup. Allowed: ${VALID_AGE_GROUPS.join(", ")}.`,
        );
      }
      ageGroup = m.ageGroup as "child" | "adult" | "senior";
      role = ageGroup === "child" ? "child" : ageGroup === "senior" ? "senior" : "commuter";
    }

    type ActivityType = (typeof VALID_ACTIVITIES)[number];
    let activity: ActivityType = "office_college";
    if (m.activity !== undefined) {
      if (!VALID_ACTIVITIES.includes(m.activity as ActivityType)) {
        throw new ValidationError(
          `Invalid activity. Allowed: ${VALID_ACTIVITIES.join(", ")}.`,
        );
      }
      activity = m.activity as ActivityType;
    }

    const mustGoOut =
      m.mustGoOut !== undefined
        ? Boolean(m.mustGoOut)
        : (activity as string) !== "mostly_indoors";

    let commuteMode = "metro";
    if (m.commuteMode !== undefined) {
      if (typeof m.commuteMode !== "string") {
        throw new ValidationError("commuteMode must be a string.");
      }
      if (m.commuteMode.length > MAX_COMMUTE_MODE_CHARS) {
        throw new ValidationError(
          `commuteMode must be under ${MAX_COMMUTE_MODE_CHARS} characters.`,
        );
      }
      commuteMode = m.commuteMode.trim();
    }

    if (typeof m.id !== "string" || m.id.length === 0 || m.id.length > MAX_MEMBER_ID_CHARS) {
      throw new ValidationError(
        `Member id must be a non-empty string under ${MAX_MEMBER_ID_CHARS} characters.`,
      );
    }

    const name = typeof m.name === "string" ? m.name.slice(0, MAX_MEMBER_NAME_CHARS).trim() : undefined;
    const leaveTime = typeof m.leaveTime === "string" ? m.leaveTime.slice(0, 10).trim() : "09:00";
    const returnTime = typeof m.returnTime === "string" ? m.returnTime.slice(0, 10).trim() : "18:30";
    const homeArea = typeof m.homeArea === "string" ? m.homeArea.slice(0, 60).trim() : undefined;
    const workSchoolArea = typeof m.workSchoolArea === "string" ? m.workSchoolArea.slice(0, 60).trim() : undefined;

    validatedMembers.push({
      id: String(m.id).trim(),
      name,
      role,
      ageGroup,
      activity,
      leaveTime,
      returnTime,
      homeArea,
      workSchoolArea,
      commuteMode,
      mustGoOut,
      hasAsthmaOrSensitivity: Boolean(m.hasAsthmaOrSensitivity),
      isSmoker: Boolean(m.isSmoker),
    });
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
    budgetTier,
    hasPurifier,
    hasPlants,
    members: validatedMembers,
    followUpQuestion,
  };
}
