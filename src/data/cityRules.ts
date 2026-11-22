/**
 * City-specific transit, pollution rules, and high-oxygen green zones
 * for Indian metros, districts, and industrial corridors.
 */

export interface GreenZone {
  nameEn: string;
  nameHi: string;
  benefitEn: string;
  benefitHi: string;
}

export interface CityRule {
  city: string;
  transitAdvice: string[];
  pollutionNotes: string[];
  transitAdviceHi: string[];
  pollutionNotesHi: string[];
  greenZones: GreenZone[];
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
    greenZones: [
      {
        nameEn: "Empress Botanical Garden & Vetal Tekdi",
        nameHi: "एम्प्रेस बॉटनिकल गार्डन और वेताल टेकड़ी",
        benefitEn: "High-density tree canopy buffers urban PM2.5 by 30-45% during low-inversion afternoon hours.",
        benefitHi: "घना वनस्पति छत्र दोपहर के समय शहरी PM2.5 को 30-45% तक कम करता है।",
      },
      {
        nameEn: "Chittaranjan Vatika (Model Colony)",
        nameHi: "चित्तरंजन वाटिका (मॉडल कॉलोनी)",
        benefitEn: "Protected green pocket with dense foliage away from traffic arterial roads.",
        benefitHi: "ट्रैफिक मुख्य सड़कों से दूर घने पेड़ों से सुरक्षित हरित क्षेत्र।",
      },
    ],
  },

  mumbai: {
    city: "Mumbai",
    transitAdvice: [
      "Mumbai Suburban Rail (Western/Central/Harbour lines) is the fastest low-emission option — avoid peak-hour overcrowding by shifting travel 30 min earlier.",
      "Use Mumbai Metro Line 1 (Versova–Ghatkopar) or the new Metro Lines 2A/7 to skip Western Express Highway traffic.",
      "BEST electric buses are expanding; prefer them on routes along LBS Marg and Eastern Express Highway.",
      "For last-mile, use shared auto-rickshaws rather than private cabs to cut per-person emissions.",
      "Walking along Marine Drive or coastal routes offers cleaner sea-breeze air vs. inland roads.",
    ],
    pollutionNotes: [
      "Coastal humidity helps settle PM but also traps SO₂ from Chembur/Trombay industrial areas at ground level.",
      "Massive construction dust from metro/coastal road projects significantly elevates PM10, especially in BKC, Andheri, and Worli.",
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
      "मेट्रो/कोस्टल रोड परियोजनाओं से निर्माण धूल PM10 को बढ़ाती है।",
      "मानसून के बाद (अक्टूबर) उत्तरी राज्यों से पराली जलाने का प्रभाव AQI को अस्थायी रूप से खराब करता है।",
    ],
    greenZones: [
      {
        nameEn: "Sanjay Gandhi National Park & Five Gardens Matunga",
        nameHi: "संजय गांधी राष्ट्रीय उद्यान और फाइव गार्डन्स माटुंगा",
        benefitEn: "Expansive forest canopy provides the cleanest ambient oxygen basin in the Mumbai metropolitan area.",
        benefitHi: "विस्तृत वन क्षेत्र मुंबई में सबसे स्वच्छ ऑक्सीजन बेसिन प्रदान करता है।",
      },
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
      "Lake-bed dust contributes to localized PM10 spikes in southeast Bengaluru.",
      "Winter (Dec–Jan) sees mild inversions; AQI rarely hits Severe but Moderate is common.",
    ],
    transitAdviceHi: [
      "नम्मा मेट्रो (ग्रीन: नागसांद्रा–सिल्क इंस्टीट्यूट, पर्पल: व्हाइटफील्ड–केंगेरी) का उपयोग करें।",
      "सिल्क बोर्ड जंक्शन और ORR पर सुबह 8:30–10:30 और शाम 5:30–8:00 बजे यात्रा से बचें।",
      "व्हाइटफील्ड/ITPL यात्रा के लिए मेट्रो + शटल को प्राथमिकता दें।",
      "BMTC वज्र (AC) बसें मेट्रो के बिना मार्गों पर उचित विकल्प हैं।",
      "अच्छे AQI में सुबह 8 बजे से पहले इंदीरानगर, कोरमंगला में साइकिलिंग संभव है।",
    ],
    pollutionNotesHi: [
      "ORR और सिल्क बोर्ड क्षेत्र से वाहन निकास PM2.5 का प्राथमिक स्रोत है।",
      "सूखी झीलों से धूल दक्षिण-पूर्व बेंगलुरु में PM10 बढ़ाती है।",
      "सर्दियों में हल्के उलटाव होते हैं; मध्यम स्तर आम है।",
    ],
    greenZones: [
      {
        nameEn: "Cubbon Park & Lalbagh Botanical Garden",
        nameHi: "कब्बन पार्क और लालबाग बॉटनिकल गार्डन",
        benefitEn: "Over 300 acres of century-old tree cover naturally scrubs vehicular particulates.",
        benefitHi: "300 एकड़ से अधिक पुराना वृक्ष आवरण वाहन कणों को प्राकृतिक रूप से फ़िल्टर करता है।",
      },
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
      "Construction, road dust, and vehicle exhaust are year-round PM contributors.",
      "Diwali fireworks regularly push AQI above 500; seal all windows and run purifiers.",
    ],
    transitAdviceHi: [
      "दिल्ली मेट्रो रीढ़ है — सड़क-स्तरीय PM2.5 एक्सपोज़र से बचने के लिए सभी मध्यम/लंबी यात्राओं के लिए इसका उपयोग करें।",
      "खराब (201–300), बहुत खराब (301–400), और गंभीर (401–500) AQI दिनों पर बाहर N95/FFP2 मास्क अनिवार्य है।",
      "बहुत खराब/गंभीर दिनों पर बाहरी व्यायाम से पूरी तरह बचें।",
      "यदि ड्राइविंग अनिवार्य है, तो कार की खिड़कियां बंद रखें और AC पर रीसर्कुलेशन मोड का उपयोग करें।",
      "DTC और क्लस्टर इलेक्ट्रिक बसें बढ़ रही हैं; डीजल ऑटो की बजाय इन्हें प्राथमिकता दें।",
    ],
    pollutionNotesHi: [
      "सर्दियों का उलटाव (नवंबर-फरवरी) प्रदूषकों को फंसाता है; सबसे खराब AQI रात 10 बजे – सुबह 10 बजे के बीच।",
      "पंजाब/हरियाणा से पराली जलाना घंटों में AQI को खराब से गंभीर तक बढ़ा सकता है।",
      "निर्माण, सड़क धूल, और वाहन निकास साल भर PM योगदानकर्ता हैं।",
      "दिवाली आतिशबाजी नियमित रूप से AQI को 500 से ऊपर धकेलती है।",
    ],
    greenZones: [
      {
        nameEn: "Lodhi Gardens, Nehru Park & Sanjay Van",
        nameHi: "लोधी गार्डन, नेहरू पार्क और संजय वन",
        benefitEn: "Extensive Neem, Peepal, and Jamun woodland canopy creating low-dust microclimates during midday hours.",
        benefitHi: "नीम, पीपल और जामुन का विशाल वन छत्र दोपहर में कम धूल वाला माइक्रॉक्लाइमेट बनाता है।",
      },
    ],
  },

  durg: {
    city: "Durg / Bhilai",
    transitAdvice: [
      "For commutes along Great Eastern (GE) Road connecting Durg, Bhilai, and Power House, prefer shared e-rickshaws or city electric buses over open two-wheelers.",
      "Avoid driving through Industrial Area Hathkhoj and Bhilai Steel Plant peripheral roads during shift changes (7–9 AM and 4–6 PM).",
      "Keep vehicle AC in recirculate mode when crossing Supela and Power House flyover junctions where heavy coal and slag transport trucks operate.",
      "For short errands within township sectors (Sectors 1 to 10), residential avenues have extensive tree cover with 35% lower ground PM2.5.",
    ],
    pollutionNotes: [
      "Industrial emissions from steel manufacturing, sinter plants, and slag crushers release fine particulates and sulfur dioxide into the local airshed.",
      "Dry winter months (November to February) create particulate haze in the Durg-Bhilai twin city basin.",
      "Heavy freight traffic along NH-53 (GE Road) generates severe fugitive dust on unpaved shoulders.",
    ],
    transitAdviceHi: [
      "दुर्ग, भिलाई और पावर हाउस को जोड़ने वाले जीई रोड पर खुली बाइक की बजाय ई-रिक्शा या सिटी बस को प्राथमिकता दें।",
      "हथखोज औद्योगिक क्षेत्र और बीएसपी परिधीय मार्गों पर शिफ्ट बदलने (सुबह 7–9 और शाम 4–6) के समय यात्रा से बचें।",
      "सुपेला और पावर हाउस जंक्शन पार करते समय वाहन एसी को रीसर्कुलेट मोड में रखें।",
      "टाउनशिप सेक्टरों (सेक्टर 1 से 10) के अंदर की आवासीय सड़कों पर पेड़ लगे होने से 35% कम PM2.5 रहता है।",
    ],
    pollutionNotesHi: [
      "इस्पात निर्माण और सिंटर प्लांट से निकलने वाला धुआं स्थानीय हवा में महीन कण और सल्फर डाइऑक्साइड छोड़ता है।",
      "सर्दियों के सूखे महीनों (नवंबर-फरवरी) में दुर्ग-भिलाई बेसिन में धुंध की परत बन जाती है।",
      "NH-53 पर भारी मालवाहक ट्रकों की आवाजाही से कच्ची पटरियों पर भारी धूल उड़ती है।",
    ],
    greenZones: [
      {
        nameEn: "Civic Centre Park & Maitri Bagh Botanical Garden (Bhilai / Durg)",
        nameHi: "सिविक सेंटर पार्क और मैत्री बाग बॉटनिकल गार्डन (भिलाई / दुर्ग)",
        benefitEn: "Densely planted mature Gulmohar, Karanj, and Eucalyptus trees act as a natural particulate sink absorbing industrial dust.",
        benefitHi: "गुलमोहर, करंज और यूकेलिप्टस के पुराने पेड़ औद्योगिक धूल को अवशोषित करने वाले प्राकृतिक सिंक का कार्य करते हैं।",
      },
      {
        nameEn: "Nehru Nagar Garden & Madan Mohan Malviya Park (Durg)",
        nameHi: "नेहरू नगर गार्डन और मदन मोहन मालवीय पार्क (दुर्ग)",
        benefitEn: "Buffered residential park with wide walking tracks away from highway truck transit.",
        benefitHi: "हाईवे ट्रक ट्रैफिक से दूर शांत आवासीय पार्क जिसमें स्वच्छ सैर के रास्ते हैं।",
      },
    ],
  },

  raipur: {
    city: "Raipur",
    transitAdvice: [
      "Use Raipur City Bus routes along VIP Road and Ring Road rather than open autos during peak traffic.",
      "Avoid Telibandha and Tatibandh junctions during rush hours where inter-district freight creates exhaust bottlenecks.",
      "Naya Raipur (Atal Nagar) wide corridors have clean roadside plantation buffers — great for electric vehicles.",
    ],
    pollutionNotes: [
      "Surrounding sponge iron plants in Urla and Siltara industrial belts contribute to elevated nighttime PM10 and SO₂.",
      "Road dust resuspension along GE Road and Ring Roads 1 and 2 is a significant particulate source.",
    ],
    transitAdviceHi: [
      "पीक ट्रैफिक के दौरान खुली ऑटो की बजाय वीआईपी रोड पर रायपुर सिटी बस का उपयोग करें।",
      "तेलीबांधा और तातीबंध जंक्शनों पर भारी मालवाहक ट्रकों के जाम से बचें।",
      "नवा रायपुर (अटल नगर) के चौड़े गलियारों में स्वच्छ वृक्षारोपण है।",
    ],
    pollutionNotesHi: [
      "उरला और सिलतरा औद्योगिक क्षेत्रों के स्पंज आयरन प्लांट रात में PM10 और SO₂ बढ़ाते हैं।",
      "जीई रोड और रिंग रोड पर उड़ने वाली धूल प्रमुख प्रदूषक है।",
    ],
    greenZones: [
      {
        nameEn: "Telibandha Marine Drive & Gandhi Udyan (Raipur)",
        nameHi: "तेलीबांधा मरीन ड्राइव और गांधी उद्यान (रायपुर)",
        benefitEn: "Lake breeze coupled with large green lawns aids particulate settling during recommended low-AQI hours.",
        benefitHi: "झील की हवा और बड़े हरे लॉन सुरक्षित घंटों में धूल को नीचे बैठाने में सहायक होते हैं।",
      },
    ],
  },

  kolkata: {
    city: "Kolkata",
    transitAdvice: [
      "Kolkata Metro (Blue Line: Dakshineswar–New Garia, Green Line) is the cleanest commute option.",
      "Use trams on heritage routes for short central Kolkata trips — they're electric and zero-emission.",
      "AC buses on EM Bypass and VIP Road corridors are preferable to diesel autos.",
      "Ferry services across the Hooghly (Howrah–BBD Bagh) offer low-emission river commuting.",
      "Avoid walking along Chitpur Road, Sealdah, and Park Circus during morning rush.",
    ],
    pollutionNotes: [
      "Morning fog (November–January) traps pollutants at ground level; AQI is typically worst between 6–10 AM.",
      "Industrial emissions from Howrah and the eastern bank contribute to SO₂ and PM levels.",
    ],
    transitAdviceHi: [
      "कोलकाता मेट्रो सबसे स्वच्छ यात्रा विकल्प है।",
      "केंद्रीय कोलकाता में छोटी यात्राओं के लिए ट्राम का उपयोग करें।",
      "EM बाईपास और VIP रोड कॉरिडोर पर AC बसें डीजल ऑटो से बेहतर हैं।",
      "हुगली नदी पार फेरी सेवाएं कम-उत्सर्जन नदी यात्रा प्रदान करती हैं।",
    ],
    pollutionNotesHi: [
      "सुबह का कोहरा प्रदूषकों को ज़मीन पर फंसा देता है; सुबह 6–10 बजे सबसे खराब।",
      "हावड़ा से औद्योगिक उत्सर्जन SO₂ और PM स्तर में योगदान देता है।",
    ],
    greenZones: [
      {
        nameEn: "Central Park Salt Lake, Rabindra Sarobar & Maidan",
        nameHi: "सेंट्रल पार्क साल्ट लेक, रवींद्र सरोवर और मैदान",
        benefitEn: "Water-body adjacent tree canopies accelerate natural deposition of airborne particulate matter.",
        benefitHi: "जलाशयों के पास स्थित वृक्ष छत्र हवा में तैरते धूल कणों को प्राकृतिक रूप से नीचे बैठाते हैं।",
      },
    ],
  },

  noida: {
    city: "Noida / Greater Noida",
    transitAdvice: [
      "Noida Metro (Aqua Line) + Delhi Metro Blue Line provide comprehensive low-emission coverage.",
      "For Noida–Delhi commutes, metro is far preferable to DND Flyway driving during peak hours.",
      "E-rickshaws for last-mile from metro stations are low-emission alternatives to diesel autos.",
    ],
    pollutionNotes: [
      "Noida shares Delhi-NCR's winter inversion; patterns mirror Delhi with dense morning smog.",
      "Construction activity from new sector developments is a constant PM10 source.",
    ],
    transitAdviceHi: [
      "नोएडा मेट्रो (एक्वा लाइन) + दिल्ली मेट्रो ब्लू लाइन अच्छा कवरेज प्रदान करते हैं।",
      "नोएडा-दिल्ली यात्रा के लिए पीक आवर्स में DND फ्लाईवे की जगह मेट्रो चुनें।",
      "मेट्रो स्टेशनों से लास्ट-माइल के लिए ई-रिक्शा अपनाएं।",
    ],
    pollutionNotesHi: [
      "नोएडा में दिल्ली-NCR जैसा शीतकालीन उलटाव और सुबह का घना स्मॉग होता है।",
      "नए सेक्टर निर्माण से धूल PM10 का लगातार स्रोत है।",
    ],
    greenZones: [
      {
        nameEn: "Noida Biodiversity Park & Meghdootam Park",
        nameHi: "नोएडा जैव विविधता पार्क और मेघदूतम पार्क",
        benefitEn: "Protected urban forest oasis with diverse indigenous trees filtering expressway dust.",
        benefitHi: "एक्सप्रेसवे की धूल को फ़िल्टर करने वाले विविध देशी पेड़ों से युक्त शहरी वन।",
      },
    ],
  },
};

/** Default fallback for any Indian city, district, or rural area */
export const DEFAULT_CITY_RULE: CityRule = {
  city: "India (Town & Rural)",
  transitAdvice: [
    "Prefer shared public transit (metro, electric bus, shared auto) over private single-occupancy vehicles to cut emissions.",
    "For last-mile connectivity from bus/train stops, prefer walking or e-rickshaws through residential lanes rather than heavy highway corridors.",
    "Avoid strenuous outdoor activities near unpaved roads and truck transit routes during peak morning hours (7:30–9:30 AM).",
    "If cycling or walking, choose avenues with mature tree cover (Peepal, Neem, Banyan) where ambient PM2.5 is significantly lower.",
    "On Poor/Very Poor AQI days, wear a well-fitted N95 mask for any outdoor travel exceeding 30 minutes.",
  ],
  pollutionNotes: [
    "Winter months (November to February) create ground-level temperature inversions across most Indian plains and valleys.",
    "Road dust resuspension, biomass/chulha burning, and localized construction are major particulate contributors.",
    "Agricultural stubble burning and festival fireworks cause sharp seasonal spikes in late autumn.",
  ],
  transitAdviceHi: [
    "उत्सर्जन कम करने के लिए निजी वाहनों की बजाय सार्वजनिक परिवहन (बस, शेयर्ड ऑटो) को प्राथमिकता दें।",
    "बस या ट्रेन स्टॉप से आगे जाने के लिए मुख्य हाईवे की बजाय आवासीय गलियों से ई-रिक्शा या पैदल जाएं।",
    "सुबह पीक आवर्स (7:30–9:30 बजे) में कच्ची सड़कों और भारी ट्रक मार्गों के पास भारी व्यायाम से बचें।",
    "साइकिलिंग या पैदल चलने के लिए घने पेड़ों (पीपल, नीम, बरगद) वाले मार्ग चुनें जहाँ PM2.5 काफी कम रहता है।",
    "खराब/बहुत खराब AQI दिनों में 30 मिनट से अधिक बाहर रहने पर N95 मास्क अवश्य पहनें।",
  ],
  pollutionNotesHi: [
    "सर्दियों के महीनों (नवंबर-फरवरी) में ज़मीनी तापमान उलटाव से धुआं और धूल ज़मीन के करीब जम जाते हैं।",
    "सड़क की धूल, चूल्हा/बायोमास धुआं और निर्माण कार्य प्रमुख स्थानीय प्रदूषक हैं।",
    "पराली जलाने और त्योहारों के समय हवा में तेज अस्थायी गिरावट आती है।",
  ],
  greenZones: [
    {
      nameEn: "Local Municipal Botanical Garden, Cantonment Park, or Lake Promenade",
      nameHi: "स्थानीय नगर निगम बॉटनिकल गार्डन, छावनी पार्क या झील किनारा",
      benefitEn: "Mature native tree canopies (Neem, Banyan, Peepal) provide an active particulate buffer and high oxygenation during midday convection hours.",
      benefitHi: "पुराने देशी पेड़ (नीम, बरगद, पीपल) दोपहर के समय प्राकृतिक धूल फ़िल्टर और उच्च ऑक्सीजन प्रदान करते हैं।",
    },
  ],
};

/**
 * Look up city-specific rules; normalizes the city/district name
 * and matches known Indian metros, districts (e.g. Durg, Bhilai, Raipur),
 * or falls back to DEFAULT_CITY_RULE.
 */
export function getCityRule(city: string): CityRule {
  const key = city.toLowerCase().trim().replace(/[^a-z]/g, "");
  if (key.includes("pune")) return CITY_RULES.pune;
  if (key.includes("mumbai") || key.includes("bombay") || key.includes("thane") || key.includes("navi")) return CITY_RULES.mumbai;
  if (key.includes("bengaluru") || key.includes("bangalore")) return CITY_RULES.bengaluru;
  if (key.includes("delhi") || key === "newdelhi") return CITY_RULES.delhi;
  if (key.includes("noida") || key.includes("gurgaon") || key.includes("gurugram") || key.includes("ghaziabad") || key.includes("faridabad")) return CITY_RULES.noida;
  if (key.includes("durg") || key.includes("bhilai")) return CITY_RULES.durg;
  if (key.includes("raipur") || key.includes("chhattisgarh") || key.includes("bilaspur") || key.includes("korba")) return CITY_RULES.raipur;
  if (key.includes("kolkata") || key.includes("calcutta") || key.includes("howrah")) return CITY_RULES.kolkata;
  return DEFAULT_CITY_RULE;
}
