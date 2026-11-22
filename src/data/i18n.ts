/**
 * Bilingual UI dictionary — English (en) and Hindi (hi).
 */

export type Lang = "en" | "hi";

export const UI_TEXT: Record<Lang, Record<string, string>> = {
  en: {
    // App
    appTitle: "Vata Mitra (वाता मित्र)",
    appSubtitle: "Your AI Urban Air Quality Assistant",
    langToggle: "हिंदी",
    seniorMode: "Senior-Friendly Large Text",

    // City selector
    citySearchPlaceholder: "Search any Indian city...",
    useMyLocation: "📍 Use My Location",
    quickCities: "Quick Select:",

    // AQI Card
    liveAqi: "Live Air Quality",
    cpcbNaqi: "CPCB NAQI",
    usEpaAqi: "US EPA AQI",
    primaryPollutant: "Primary Pollutant",
    source: "Source",
    lastUpdated: "Last Updated",
    rank: "Rank",
    safestWindow: "Safest 2-Hour Outdoor Window",
    safestWindowDesc: "Best time to open windows or exercise outdoors",
    cityComparison: "Live India City Comparison",
    noForecast: "Forecast data unavailable",

    // Categories
    catGood: "Good",
    catSatisfactory: "Satisfactory",
    catModerate: "Moderate",
    catPoor: "Poor",
    catVeryPoor: "Very Poor",
    catSevere: "Severe",

    // Household
    householdTitle: "Household Builder (1 Roof, Up to 3 Members)",
    addMember: "+ Add Member",
    removeMember: "Remove",
    memberRole: "Role",
    roleCommuter: "Commuter",
    roleChild: "Young Child",
    roleSenior: "Senior Citizen",
    roleStudent: "Student",
    mustGoOut: "Must go out today?",
    yes: "Yes",
    no: "No",
    commuteMode: "Commute Mode",
    modeMetro: "Metro/Train",
    modeBus: "Bus",
    modeCar: "Car/Bike",
    modeCycle: "Cycle/Walk",
    modeWfh: "Work from Home",
    budgetTier: "Budget Tier",
    budgetLow: "No Purifier / Low-Cost",
    budgetPurifier: "Purifier Owner",
    getAdvice: "🌿 Get Personalized Advice",
    generating: "Generating advice...",

    // Advice pillars
    lowEmissionRoutine: "🚶 Low-Emission Daily Routine",
    indoorAirHacks: "🏠 Indoor Air Hacks",
    impactJustification: "📊 Why This Matters",
    whatIfMetrics: "🔄 What-If Impact Simulator",
    followUpTitle: "💬 Ask a Follow-Up Question",
    followUpPlaceholder: "e.g., What if I switch from car to metro?",
    askFollowUp: "Ask",
    followUpAnswer: "Follow-Up Answer",

    // ESG Fact
    esgFactTitle: "🌍 Today's Green Fact",

    // Errors
    errorFetchAqi: "Failed to fetch air quality data. Please try again.",
    errorAdvice: "Failed to generate advice. Using rule-based fallback.",
    errorNoCity: "Please select or search for a city first.",

    // Loading
    loading: "Loading...",
  },

  hi: {
    // App
    appTitle: "वाता मित्र (Vata Mitra)",
    appSubtitle: "आपका AI शहरी वायु गुणवत्ता सहायक",
    langToggle: "English",
    seniorMode: "बड़ा टेक्स्ट (बुज़ुर्गों के लिए)",

    // City selector
    citySearchPlaceholder: "कोई भी भारतीय शहर खोजें...",
    useMyLocation: "📍 मेरा स्थान उपयोग करें",
    quickCities: "त्वरित चयन:",

    // AQI Card
    liveAqi: "लाइव वायु गुणवत्ता",
    cpcbNaqi: "CPCB NAQI",
    usEpaAqi: "US EPA AQI",
    primaryPollutant: "प्रमुख प्रदूषक",
    source: "स्रोत",
    lastUpdated: "अंतिम अपडेट",
    rank: "रैंक",
    safestWindow: "सबसे सुरक्षित 2-घंटे की बाहरी खिड़की",
    safestWindowDesc: "खिड़कियां खोलने या बाहर व्यायाम करने का सबसे अच्छा समय",
    cityComparison: "लाइव भारत शहर तुलना",
    noForecast: "पूर्वानुमान डेटा अनुपलब्ध",

    // Categories
    catGood: "अच्छा",
    catSatisfactory: "संतोषजनक",
    catModerate: "मध्यम",
    catPoor: "खराब",
    catVeryPoor: "बहुत खराब",
    catSevere: "गंभीर",

    // Household
    householdTitle: "घरेलू बिल्डर (1 छत, 3 सदस्य तक)",
    addMember: "+ सदस्य जोड़ें",
    removeMember: "हटाएं",
    memberRole: "भूमिका",
    roleCommuter: "यात्री",
    roleChild: "छोटा बच्चा",
    roleSenior: "वरिष्ठ नागरिक",
    roleStudent: "छात्र",
    mustGoOut: "आज बाहर जाना है?",
    yes: "हां",
    no: "नहीं",
    commuteMode: "यात्रा का तरीका",
    modeMetro: "मेट्रो/ट्रेन",
    modeBus: "बस",
    modeCar: "कार/बाइक",
    modeCycle: "साइकिल/पैदल",
    modeWfh: "घर से काम",
    budgetTier: "बजट स्तर",
    budgetLow: "बिना प्यूरीफायर / कम लागत",
    budgetPurifier: "प्यूरीफायर मालिक",
    getAdvice: "🌿 व्यक्तिगत सलाह प्राप्त करें",
    generating: "सलाह तैयार हो रही है...",

    // Advice pillars
    lowEmissionRoutine: "🚶 कम-उत्सर्जन दैनिक दिनचर्या",
    indoorAirHacks: "🏠 इनडोर वायु टिप्स",
    impactJustification: "📊 यह क्यों मायने रखता है",
    whatIfMetrics: "🔄 क्या-अगर प्रभाव सिम्युलेटर",
    followUpTitle: "💬 फॉलो-अप प्रश्न पूछें",
    followUpPlaceholder: "जैसे, अगर मैं कार से मेट्रो पर स्विच करूं तो?",
    askFollowUp: "पूछें",
    followUpAnswer: "फॉलो-अप उत्तर",

    // ESG Fact
    esgFactTitle: "🌍 आज का हरित तथ्य",

    // Errors
    errorFetchAqi: "वायु गुणवत्ता डेटा प्राप्त करने में विफल। कृपया पुनः प्रयास करें।",
    errorAdvice: "सलाह बनाने में विफल। नियम-आधारित फ़ॉलबैक का उपयोग।",
    errorNoCity: "कृपया पहले कोई शहर चुनें या खोजें।",

    // Loading
    loading: "लोड हो रहा है...",
  },
};
