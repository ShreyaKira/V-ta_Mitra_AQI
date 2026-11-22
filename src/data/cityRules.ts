/**
 * City-specific transit & pollution rules for Indian metros.
 * Used by the Gemini prompt and deterministic fallback to give
 * locally relevant advice.
 */

export interface CityRule {
  city: string;
  transitAdvice: string[];
  pollutionNotes: string[];
  transitAdviceHi: string[];
  pollutionNotesHi: string[];
}

export const CITY_RULES: Record<string, CityRule> = {
  pune: {
    city: "Pune",
    transitAdvice: [
      "Prefer Pune Aqua Metro (Line 1: PCMC–Swargate) or Purple Metro (Line 2: Vanaz–Ramwadi) for low-emission commuting.",
      "Use carpooling apps (Quick Ride, sRide) for Hinjewadi IT Park and Kharadi corridors — shared autos are reliable here.",
      "Avoid relying on PMPML buses for time-critical commutes; frequency is inconsistent on many routes.",
      "For short trips within core areas (Shivajinagar, FC Road, JM Road), prefer cycling or walking during Good/Satisfactory AQI.",
      "If commuting to Hinjewadi/Wakad, leave before 8:30 AM or after 10:30 AM to avoid NH-48 congestion and exhaust exposure.",
    ],
    pollutionNotes: [
      "Construction dust from ongoing metro expansion and new townships is a major local PM10 contributor.",
      "Winter (Nov–Jan) temperature inversions trap pollutants near ground level, especially in low-lying areas like Kothrud and Warje.",
      "Diwali week and sugarcane stubble burning season (Oct–Nov) can spike AQI to Very Poor in Hadapsar and eastern Pune.",
    ],
    transitAdviceHi: [
      "कम उत्सर्जन वाली यात्रा के लिए पुणे एक्वा मेट्रो (लाइन 1: PCMC–स्वारगेट) या पर्पल मेट्रो (लाइन 2: वनाज़–रामवाड़ी) को प्राथमिकता दें।",
      "हिंजेवाड़ी आईटी पार्क और खराड़ी कॉरिडोर के लिए कारपूलिंग ऐप्स (Quick Ride, sRide) का उपयोग करें।",
      "समय-महत्वपूर्ण यात्रा के लिए PMPML बसों पर निर्भर न रहें; कई मार्गों पर आवृत्ति असंगत है।",
      "मुख्य क्षेत्रों (शिवाजीनगर, FC रोड, JM रोड) में छोटी यात्राओं के लिए अच्छे AQI में साइकिलिंग या पैदल चलें।",
      "हिंजेवाड़ी/वाकड़ जाने के लिए सुबह 8:30 से पहले या 10:30 के बाद निकलें।",
    ],
    pollutionNotesHi: [
      "चल रहे मेट्रो विस्तार से निर्माण धूल PM10 का प्रमुख स्थानीय स्रोत है।",
      "सर्दियों (नवंबर-जनवरी) में तापमान उलटाव प्रदूषकों को ज़मीन के पास फंसा देता है।",
      "दिवाली सप्ताह और गन्ना पराली जलाने के मौसम (अक्टूबर-नवंबर) में AQI बहुत खराब तक बढ़ सकता है।",
    ],
  },

  mumbai: {
    city: "Mumbai",
    transitAdvice: [
      "Mumbai Suburban Rail (Western/Central/Harbour lines) is the fastest low-emission option — avoid peak-hour first-class overcrowding by shifting travel 30 min earlier.",
      "Use Mumbai Metro Line 1 (Versova–Ghatkopar) or the new Metro Lines 2A/7 to skip Western Express Highway traffic.",
      "BEST electric buses are expanding; prefer them on routes along LBS Marg and Eastern Express Highway.",
      "For last-mile, use shared auto-rickshaws rather than private cabs to cut per-person emissions.",
      "Walking along Marine Drive or coastal routes offers cleaner sea-breeze air vs. inland roads.",
    ],
    pollutionNotes: [
      "Coastal humidity helps settle PM but also traps SO₂ from Chembur/Trombay industrial areas at ground level.",
      "Massive construction dust from metro/coastal road/MTHL projects significantly elevates PM10, especially in BKC, Andheri, and Worli.",
      "Post-monsoon (October) brings stubble burning drift from northern states, worsening AQI temporarily.",
    ],
    transitAdviceHi: [
      "मुंबई उपनगरीय रेल (पश्चिमी/मध्य/हार्बर लाइन) सबसे तेज़ कम-उत्सर्जन विकल्प है।",
      "मुंबई मेट्रो लाइन 1 (वर्सोवा-घाटकोपर) या नई मेट्रो लाइन 2A/7 का उपयोग करें।",
      "BEST इलेक्ट्रिक बसें बढ़ रही हैं; LBS मार्ग और ईस्टर्न एक्सप्रेस हाईवे पर इन्हें प्राथमिकता दें।",
      "लास्ट-माइल के लिए निजी कैब की बजाय शेयर्ड ऑटो-रिक्शा का उपयोग करें।",
      "मरीन ड्राइव या तटीय मार्गों पर चलना अंदरूनी सड़कों की तुलना में स्वच्छ हवा देता है।",
    ],
    pollutionNotesHi: [
      "तटीय नमी PM को बसाने में मदद करती है लेकिन चेंबूर/ट्रॉम्बे औद्योगिक क्षेत्रों से SO₂ को ज़मीन पर फंसा देती है।",
      "मेट्रो/कोस्टल रोड/MTHL परियोजनाओं से भारी निर्माण धूल PM10 को बढ़ाती है।",
      "मानसून के बाद (अक्टूबर) उत्तरी राज्यों से पराली जलाने का प्रभाव AQI को अस्थायी रूप से खराब करता है।",
    ],
  },

  bengaluru: {
    city: "Bengaluru",
    transitAdvice: [
      "Use Namma Metro (Green: Nagasandra–Silk Institute, Purple: Whitefield–Kengeri) — it bypasses the worst traffic corridors.",
      "Avoid Silk Board Junction and ORR (Outer Ring Road) during 8:30–10:30 AM and 5:30–8:00 PM — exhaust exposure is extreme.",
      "For Whitefield/ITPL commutes, prefer metro + shuttle; Namma Metro Purple Line extension significantly reduces road exposure.",
      "BMTC Vajra (AC) buses on dedicated corridors are a reasonable option when metro doesn't cover your route.",
      "Cycling is viable on early mornings (before 8 AM) in Indiranagar, Koramangala, and HSR Layout when AQI is Good.",
    ],
    pollutionNotes: [
      "Vehicle exhaust from ORR and Silk Board area is the primary PM2.5 source; residential areas 500m from these roads see 30-40% higher levels.",
      "Lake-bed dust (dried Bellandur, Varthur lakes) contributes to localized PM10 spikes in southeast Bengaluru.",
      "Winter (Dec–Jan) sees mild inversions; AQI rarely hits Severe but Moderate is common, especially near construction zones.",
    ],
    transitAdviceHi: [
      "नम्मा मेट्रो (ग्रीन: नागसांद्रा–सिल्क इंस्टीट्यूट, पर्पल: व्हाइटफील्ड–केंगेरी) का उपयोग करें।",
      "सिल्क बोर्ड जंक्शन और ORR पर सुबह 8:30–10:30 और शाम 5:30–8:00 बजे यात्रा से बचें।",
      "व्हाइटफील्ड/ITPL यात्रा के लिए मेट्रो + शटल को प्राथमिकता दें।",
      "BMTC वज्र (AC) बसें मेट्रो के बिना मार्गों पर उचित विकल्प हैं।",
      "अच्छे AQI में सुबह 8 बजे से पहले इंदीरानगर, कोरमंगला, HSR लेआउट में साइकिलिंग संभव है।",
    ],
    pollutionNotesHi: [
      "ORR और सिल्क बोर्ड क्षेत्र से वाहन निकास PM2.5 का प्राथमिक स्रोत है।",
      "सूखी बेल्लंदूर, वर्थूर झीलों से झील-तल की धूल दक्षिण-पूर्व बेंगलुरु में PM10 बढ़ाती है।",
      "सर्दियों (दिसंबर-जनवरी) में हल्के उलटाव होते हैं; AQI शायद ही कभी गंभीर होता है लेकिन मध्यम आम है।",
    ],
  },

  delhi: {
    city: "Delhi",
    transitAdvice: [
      "Delhi Metro is the backbone — use it for all medium/long commutes to avoid road-level PM2.5 exposure.",
      "N95/FFP2 mask is MANDATORY on Poor (201–300), Very Poor (301–400), and Severe (401–500) AQI days when outdoors.",
      "Avoid outdoor exercise entirely on Very Poor/Severe days; shift to indoor gyms or home workouts.",
      "If driving is unavoidable, keep car windows closed and use recirculation mode on AC; avoid routes near Anand Vihar, ITO, and Mundka.",
      "DTC and cluster electric buses are expanding; prefer them over diesel autos for short hops.",
    ],
    pollutionNotes: [
      "Winter inversion (November–February) traps pollutants; worst AQI typically between 10 PM – 10 AM. Plan outdoor time for early afternoon when mixing height is greatest.",
      "Stubble burning from Punjab/Haryana (October–November) can push AQI from Poor to Severe within hours.",
      "Construction, road dust, and vehicle exhaust are year-round PM contributors; industrial areas (Bawana, Narela, Mundka) are hotspots.",
      "Diwali fireworks regularly push AQI above 500 (beyond scale); seal all windows and run purifiers 48 hours around the festival.",
    ],
    transitAdviceHi: [
      "दिल्ली मेट्रो रीढ़ है — सड़क-स्तरीय PM2.5 एक्सपोज़र से बचने के लिए सभी मध्यम/लंबी यात्राओं के लिए इसका उपयोग करें।",
      "खराब (201–300), बहुत खराब (301–400), और गंभीर (401–500) AQI दिनों पर बाहर N95/FFP2 मास्क अनिवार्य है।",
      "बहुत खराब/गंभीर दिनों पर बाहरी व्यायाम से पूरी तरह बचें।",
      "यदि ड्राइविंग अनिवार्य है, तो कार की खिड़कियां बंद रखें और AC पर रीसर्कुलेशन मोड का उपयोग करें।",
      "DTC और क्लस्टर इलेक्ट्रिक बसें बढ़ रही हैं; डीजल ऑटो की बजाय इन्हें प्राथमिकता दें।",
    ],
    pollutionNotesHi: [
      "सर्दियों का उलटाव (नवंबर-फरवरी) प्रदूषकों को फंसाता है; सबसे खराब AQI आमतौर पर रात 10 बजे – सुबह 10 बजे के बीच।",
      "पंजाब/हरियाणा से पराली जलाना (अक्टूबर-नवंबर) घंटों में AQI को खराब से गंभीर तक बढ़ा सकता है।",
      "निर्माण, सड़क धूल, और वाहन निकास साल भर PM योगदानकर्ता हैं।",
      "दिवाली आतिशबाजी नियमित रूप से AQI को 500 से ऊपर धकेलती है; सभी खिड़कियां सील करें।",
    ],
  },

  kolkata: {
    city: "Kolkata",
    transitAdvice: [
      "Kolkata Metro (Blue Line: Dakshineswar–New Garia, Green Line expanding) is the cleanest commute option.",
      "Use trams on heritage routes for short central Kolkata trips — they're electric and zero-emission.",
      "AC buses on EM Bypass and VIP Road corridors are preferable to diesel autos.",
      "Ferry services across the Hooghly (Howrah–BBD Bagh) offer low-emission river commuting.",
      "Avoid walking along Chitpur Road, Sealdah, and Park Circus during morning rush — exhaust concentration peaks there.",
    ],
    pollutionNotes: [
      "Morning fog (November–January) traps pollutants at ground level; AQI is typically worst between 6–10 AM.",
      "Industrial emissions from Howrah and the eastern bank contribute significantly to SO₂ and PM levels.",
      "Post-Kali Puja/Diwali fireworks and winter crop burning drift from Bihar/Jharkhand worsen November AQI.",
    ],
    transitAdviceHi: [
      "कोलकाता मेट्रो (ब्लू लाइन: दक्षिणेश्वर–न्यू गड़िया, ग्रीन लाइन विस्तार) सबसे स्वच्छ यात्रा विकल्प है।",
      "केंद्रीय कोलकाता में छोटी यात्राओं के लिए ट्राम का उपयोग करें — वे इलेक्ट्रिक और शून्य-उत्सर्जन हैं।",
      "EM बाईपास और VIP रोड कॉरिडोर पर AC बसें डीजल ऑटो से बेहतर हैं।",
      "हुगली नदी पार फेरी सेवाएं (हावड़ा-BBD बाग) कम-उत्सर्जन नदी यात्रा प्रदान करती हैं।",
      "सुबह की भीड़ में चितपुर रोड, सियालदह, और पार्क सर्कस पर चलने से बचें।",
    ],
    pollutionNotesHi: [
      "सुबह का कोहरा (नवंबर-जनवरी) प्रदूषकों को ज़मीन पर फंसा देता है; AQI आमतौर पर सुबह 6–10 बजे सबसे खराब होता है।",
      "हावड़ा और पूर्वी तट से औद्योगिक उत्सर्जन SO₂ और PM स्तर में महत्वपूर्ण योगदान देता है।",
      "काली पूजा/दिवाली आतिशबाजी और बिहार/झारखंड से शीतकालीन फसल जलाने का प्रभाव नवंबर AQI को खराब करता है।",
    ],
  },

  noida: {
    city: "Noida",
    transitAdvice: [
      "Noida Metro (Aqua Line: Noida Sec 51–Greater Noida) + Delhi Metro Blue Line extension provide good coverage.",
      "For Noida–Delhi commutes, metro is far preferable to DND Flyway driving during peak hours.",
      "E-rickshaws for last-mile from metro stations are low-emission alternatives to diesel autos.",
    ],
    pollutionNotes: [
      "Noida shares Delhi-NCR's winter inversion problem; AQI patterns closely mirror Delhi with a 12–24 hour lag.",
      "Construction activity from new sector developments is a constant PM10 source.",
      "Proximity to UP agricultural burning areas means October–November AQI spikes are severe.",
    ],
    transitAdviceHi: [
      "नोएडा मेट्रो (एक्वा लाइन) + दिल्ली मेट्रो ब्लू लाइन एक्सटेंशन अच्छा कवरेज प्रदान करते हैं।",
      "नोएडा-दिल्ली यात्रा के लिए पीक आवर्स में DND फ्लाईवे ड्राइविंग से मेट्रो कहीं बेहतर है।",
      "मेट्रो स्टेशनों से लास्ट-माइल के लिए ई-रिक्शा कम-उत्सर्जन विकल्प हैं।",
    ],
    pollutionNotesHi: [
      "नोएडा दिल्ली-NCR की शीतकालीन उलटाव समस्या साझा करता है।",
      "नए सेक्टर विकास से निर्माण गतिविधि निरंतर PM10 स्रोत है।",
      "UP कृषि जलाने वाले क्षेत्रों की निकटता का मतलब है कि अक्टूबर-नवंबर AQI स्पाइक्स गंभीर हैं।",
    ],
  },
};

/** Default fallback for any Indian city not in presets */
export const DEFAULT_CITY_RULE: CityRule = {
  city: "India (General)",
  transitAdvice: [
    "Prefer public transit (metro/local train/bus) over private vehicles to reduce your emission footprint.",
    "Use shared autos or carpooling for last-mile connectivity from transit stations.",
    "Avoid outdoor exercise near heavy traffic corridors during peak hours (8–10 AM, 5–8 PM).",
    "If cycling or walking, choose residential side roads over main arterial roads.",
    "On Poor/Very Poor AQI days, an N95 mask is strongly recommended for any outdoor exposure over 30 minutes.",
  ],
  pollutionNotes: [
    "Winter months (November–February) generally see worse AQI across North India due to temperature inversions and crop burning.",
    "Construction activity and road dust are significant year-round PM10 sources in most Indian cities.",
    "Festival seasons (Diwali, New Year) typically cause sharp temporary AQI spikes from fireworks.",
  ],
  transitAdviceHi: [
    "निजी वाहनों की बजाय सार्वजनिक परिवहन (मेट्रो/लोकल ट्रेन/बस) को प्राथमिकता दें।",
    "ट्रांजिट स्टेशनों से लास्ट-माइल कनेक्टिविटी के लिए शेयर्ड ऑटो या कारपूलिंग का उपयोग करें।",
    "पीक आवर्स (सुबह 8–10, शाम 5–8) में भारी ट्रैफिक गलियारों के पास बाहरी व्यायाम से बचें।",
    "साइकिलिंग या पैदल चलते समय मुख्य सड़कों की बजाय आवासीय साइड रोड चुनें।",
    "खराब/बहुत खराब AQI दिनों पर 30 मिनट से अधिक बाहरी एक्सपोज़र के लिए N95 मास्क दृढ़ता से अनुशंसित है।",
  ],
  pollutionNotesHi: [
    "सर्दियों के महीनों (नवंबर-फरवरी) में उत्तर भारत में तापमान उलटाव और फसल जलाने के कारण AQI आमतौर पर खराब रहता है।",
    "निर्माण गतिविधि और सड़क धूल अधिकांश भारतीय शहरों में साल भर PM10 के महत्वपूर्ण स्रोत हैं।",
    "त्योहारी मौसम (दिवाली, नए साल) में आतिशबाजी से AQI में तेज अस्थायी बढ़ोतरी होती है।",
  ],
};

/**
 * Look up city-specific rules; normalizes the city name
 * and falls back to DEFAULT_CITY_RULE for unknown cities.
 */
export function getCityRule(city: string): CityRule {
  const key = city.toLowerCase().trim().replace(/[^a-z]/g, "");
  // Check known cities
  if (key.includes("pune")) return CITY_RULES.pune;
  if (key.includes("mumbai")) return CITY_RULES.mumbai;
  if (key.includes("bengaluru") || key.includes("bangalore"))
    return CITY_RULES.bengaluru;
  if (key.includes("delhi") || key === "newdelhi")
    return CITY_RULES.delhi;
  if (key.includes("noida") || key.includes("gurgaon") || key.includes("gurugram") || key.includes("ghaziabad") || key.includes("faridabad"))
    return CITY_RULES.noida;
  if (key.includes("kolkata") || key.includes("calcutta"))
    return CITY_RULES.kolkata;
  return DEFAULT_CITY_RULE;
}
