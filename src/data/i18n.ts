/**
 * Bilingual UI dictionary — English (en) and Hindi (hi).
 * Standalone product strings for Vata Mitra (वाता मित्र).
 */

export type Lang = "en" | "hi";

export const UI_TEXT: Record<Lang, Record<string, string>> = {
  en: {
    // App Header
    appTitle: "Vata Mitra (वाता मित्र)",
    appSubtitle: "AI Urban Air Quality & Clean Commute Assistant",
    langToggle: "हिंदी",
    seniorMode: "Senior-Friendly Large Text",

    // City Selector
    citySearchPlaceholder: "Search any Indian city, district, or town (e.g. Durg, Bhilai, Delhi)...",
    useMyLocation: "Use My Location",
    quickCities: "Quick Select:",

    // Live AQI Hero Card
    liveAqi: "Live Air Quality",
    cpcbNaqi: "CPCB NAQI",
    usEpaAqi: "US EPA AQI",
    primaryPollutant: "Primary Pollutant",
    source: "Source",
    lastUpdated: "Last Updated",
    rank: "Rank",
    safestWindow: "Safest 2-Hour Outdoor Window",
    safestWindowDesc: "Best time to cross-ventilate or exercise outdoors",
    cityComparison: "Live India City Comparison",
    noForecast: "Forecast data unavailable",

    // CPCB Categories
    catGood: "Good",
    catSatisfactory: "Satisfactory",
    catModerate: "Moderate",
    catPoor: "Poor",
    catVeryPoor: "Very Poor",
    catSevere: "Severe",

    // Household Builder
    householdTitle: "Household & Daily Schedule Builder",
    householdSubtitle: "Configure up to 3 family members with actual routines and home air setup",
    addMember: "+ Add Family Member (Up to 3)",
    removeMember: "Remove",
    memberName: "Name",
    ageGroup: "Age Group",
    ageChild: "Child (0-14 yrs)",
    ageAdult: "Adult (15-59 yrs)",
    ageSenior: "Senior Citizen (60+ yrs)",
    activityLabel: "Daily Schedule & Activity",
    actOfficeCollege: "Office / College Commute",
    actOutdoorActive: "Outdoor Runner / Field Work",
    actMostlyIndoors: "Mostly Indoors / WFH / Homemaker",
    leaveTime: "Leave Home",
    returnTime: "Return Home",
    homeArea: "Home Area (Optional)",
    workArea: "Work / School Area (Optional)",
    healthFlags: "Health & Sensitivities (Optional)",
    asthmaFlag: "Asthma / Breathing Sensitivity",
    smokerFlag: "Smoker in Household",
    commuteMode: "Primary Commute Mode",
    modeTwoWheeler: "Two-Wheeler (Bike / Scooter)",
    modeCarCab: "Car / Cab",
    modePublicTransit: "Metro / Train / Electric Bus",
    modeWalkCycle: "Walk / Bicycle",
    modeNone: "None (Stay at Home)",

    // Home Setup Questions
    purifierQuestion: "Do you use an air purifier at home?",
    plantsQuestion: "Do you have a home garden, balcony, or indoor plants?",
    yes: "Yes",
    no: "No",

    // Actions
    getAdvice: "Get Personalized Household Plan",
    generating: "Generating verified plan...",

    // Action Cards & Plans
    sharedHomePlanTitle: "Shared Home & Indoor Air Plan",
    sharedHomePlanSubtitle: "One clean plan for the entire household to eliminate smoke, dust, and VOCs",
    indoorAirHacks: "Indoor Air & Ventilation Hacks",
    purifierGuidance: "Air Purifier Usage Strategy",
    plantAirCare: "Plants & Natural Oxygen Boosters",
    nearbyGreenZoneTitle: "Nearby High-Oxygen Green Walk",
    individualRoutinesTitle: "Personalized Member Action Cards",
    scheduleRisk: "Commute Risk Analysis",
    transitSwap: "Recommended Transit Swap",
    exerciseWindow: "Safest Exercise / Walk Timing",
    impactJustification: "Why This Matters For Your Health",

    // Schedule & Exposure Calculator
    scheduleCalculatorTitle: "Daily Schedule & Commute Exposure Check",
    scheduleCalculatorSubtitle: "Real-time estimated reduction in inhaled PM2.5 based on your actual commute hours",
    currentScheduleExposure: "Current Commute Exposure",
    optimizedScheduleExposure: "Optimized Routine Exposure",
    inhalationReduction: "PM2.5 Inhalation Cut",

    // Follow-up
    followUpTitle: "Ask a Question",
    followUpSubtitle: "Ask about your city's live air, vulnerable family members, or safe windows",
    followUpPlaceholder: "e.g., Can my mother go for a walk in Durg at 7 AM?",
    askFollowUp: "Ask",
    followUpAnswer: "Answer",

    // ESG Fact
    esgFactTitle: "Today's Clean Air Insight",

    // Errors
    errorFetchAqi: "Failed to fetch air quality data. Please try again.",
    errorAdvice: "Failed to generate advice. Using rule-based fallback.",
    errorNoCity: "Please select or search for a city first.",
    loading: "Loading...",
  },

  hi: {
    // App Header
    appTitle: "वाता मित्र (Vata Mitra)",
    appSubtitle: "AI शहरी वायु गुणवत्ता व स्वच्छ आवागमन सहायक",
    langToggle: "English",
    seniorMode: "बड़ा टेक्स्ट (बुज़ुर्गों के लिए)",

    // City Selector
    citySearchPlaceholder: "कोई भी भारतीय शहर, जिला या कस्बा खोजें (जैसे दुर्ग, भिलाई, रायपुर, दिल्ली)...",
    useMyLocation: "मेरा स्थान उपयोग करें",
    quickCities: "त्वरित चयन:",

    // Live AQI Hero Card
    liveAqi: "लाइव वायु गुणवत्ता",
    cpcbNaqi: "CPCB NAQI",
    usEpaAqi: "US EPA AQI",
    primaryPollutant: "प्रमुख प्रदूषक",
    source: "स्रोत",
    lastUpdated: "अंतिम अपडेट",
    rank: "रैंक",
    safestWindow: "सबसे सुरक्षित 2-घंटे की बाहरी खिड़की",
    safestWindowDesc: "खिड़कियां खोलने या बाहर व्यायाम करने का सर्वोत्तम समय",
    cityComparison: "लाइव भारत शहर तुलना",
    noForecast: "पूर्वानुमान डेटा अनुपलब्ध",

    // CPCB Categories
    catGood: "अच्छा",
    catSatisfactory: "संतोषजनक",
    catModerate: "मध्यम",
    catPoor: "खराब",
    catVeryPoor: "बहुत खराब",
    catSevere: "गंभीर",

    // Household Builder
    householdTitle: "घरेलू व दैनिक दिनचर्या बिल्डर",
    householdSubtitle: "परिवार के 3 सदस्यों तक की वास्तविक दिनचर्या व घरेलू सेटअप कॉन्फ़िगर करें",
    addMember: "+ परिवार का सदस्य जोड़ें (अधिकतम 3)",
    removeMember: "हटाएं",
    memberName: "नाम",
    ageGroup: "आयु वर्ग",
    ageChild: "बच्चा (0-14 वर्ष)",
    ageAdult: "वयस्क (15-59 वर्ष)",
    ageSenior: "वरिष्ठ नागरिक (60+ वर्ष)",
    activityLabel: "दैनिक कार्य व दिनचर्या",
    actOfficeCollege: "कार्यालय / कॉलेज आवागमन",
    actOutdoorActive: "बाहरी कार्य / दौड़ / खेल",
    actMostlyIndoors: "अधिकांश समय घर में / WFH",
    leaveTime: "घर से निकलने का समय",
    returnTime: "घर लौटने का समय",
    homeArea: "घर का क्षेत्र (वैकल्पिक)",
    workArea: "कार्य/स्कूल क्षेत्र (वैकल्पिक)",
    healthFlags: "स्वास्थ्य संवेदनशीलता (वैकल्पिक)",
    asthmaFlag: "अस्थमा / सांस लेने में संवेदनशीलता",
    smokerFlag: "परिवार में धूम्रपान",
    commuteMode: "प्राथमिक आवागमन का साधन",
    modeTwoWheeler: "दोपहिया (बाइक / स्कूटर)",
    modeCarCab: "कार / कैब",
    modePublicTransit: "मेट्रो / ट्रेन / इलेक्ट्रिक बस",
    modeWalkCycle: "पैदल / साइकिल",
    modeNone: "कोई नहीं (घर पर रहें)",

    // Home Setup Questions
    purifierQuestion: "क्या आप घर पर एयर प्यूरीफायर इस्तेमाल करते हैं?",
    plantsQuestion: "क्या आपके पास घरेलू बागवानी, बालकनी या इनडोर पौधे हैं?",
    yes: "हाँ",
    no: "नहीं",

    // Actions
    getAdvice: "व्यक्तिगत घरेलू योजना प्राप्त करें",
    generating: "प्रमाणित योजना तैयार हो रही है...",

    // Action Cards & Plans
    sharedHomePlanTitle: "सांझा घरेलू व इनडोर वायु योजना",
    sharedHomePlanSubtitle: "पूरे परिवार के लिए एक स्वच्छ योजना — धूल, धुआं व VOCs से सुरक्षित रहने हेतु",
    indoorAirHacks: "इनडोर वायु व वेंटिलेशन उपाय",
    purifierGuidance: "एयर प्यूरीफायर संचालन रणनीति",
    plantAirCare: "पौधे व प्राकृतिक ऑक्सीजन संवर्धक",
    nearbyGreenZoneTitle: "समीपस्थ हरित व उच्च-ऑक्सीजन वॉक",
    individualRoutinesTitle: "व्यक्तिगत सदस्य कार्य कार्ड",
    scheduleRisk: "आवागमन जोखिम विश्लेषण",
    transitSwap: "अनुशंसित यात्रा माध्यम बदलाव",
    exerciseWindow: "व्यायाम व सैर का सबसे सुरक्षित समय",
    impactJustification: "यह आपके स्वास्थ्य के लिए क्यों महत्वपूर्ण है",

    // Schedule & Exposure Calculator
    scheduleCalculatorTitle: "दैनिक समय व आवागमन एक्सपोज़र जांच",
    scheduleCalculatorSubtitle: "आपके वास्तविक यात्रा घंटों के आधार पर PM2.5 सांस में जाने में अनुमानित कमी",
    currentScheduleExposure: "वर्तमान आवागमन एक्सपोज़र",
    optimizedScheduleExposure: "अनुकूलित दिनचर्या एक्सपोज़र",
    inhalationReduction: "PM2.5 एक्सपोज़र में कमी",

    // Follow-up
    followUpTitle: "प्रश्न पूछें",
    followUpSubtitle: "अपने शहर की हवा, परिवार के संवेदनशील सदस्यों या सुरक्षित समय के बारे में पूछें",
    followUpPlaceholder: "जैसे, क्या मेरी माताजी दुर्ग में सुबह 7 बजे सैर पर जा सकती हैं?",
    askFollowUp: "पूछें",
    followUpAnswer: "उत्तर",

    // ESG Fact
    esgFactTitle: "आज का स्वच्छ वायु विचार",

    // Errors
    errorFetchAqi: "वायु गुणवत्ता डेटा प्राप्त करने में विफल।",
    errorAdvice: "सलाह बनाने में विफल। नियम-आधारित फ़ॉलबैक का उपयोग।",
    errorNoCity: "कृपया पहले कोई शहर चुनें।",
    loading: "लोड हो रहा है...",
  },
};
