/**
 * 10 interesting daily ESG / indoor-air / urban-climate facts
 * in both English and Hindi. One is picked at random each session.
 */

export interface EsgFact {
  en: string;
  hi: string;
  source: string;
}

export const ESG_FACTS: EsgFact[] = [
  {
    en: "Cooking a traditional tadka (tempering spices in hot oil) can spike your kitchen's PM2.5 to 300–500 µg/m³ — worse than Delhi on a bad day. Always use an exhaust fan or open a window while cooking.",
    hi: "तड़का लगाते समय (गर्म तेल में मसाले भूनना) आपकी रसोई का PM2.5 300–500 µg/m³ तक बढ़ सकता है — दिल्ली के खराब दिन से भी बुरा। खाना बनाते समय हमेशा एग्ज़ॉस्ट फैन चलाएं या खिड़की खोलें।",
    source: "Indoor air quality studies, IIT Delhi",
  },
  {
    en: "Burning a single incense stick (agarbatti) for 30 minutes releases PM2.5 comparable to smoking 2–3 cigarettes in the same room. Use natural essential oil diffusers as a safer alternative.",
    hi: "एक अगरबत्ती 30 मिनट जलाने से उतना ही PM2.5 निकलता है जितना उसी कमरे में 2–3 सिगरेट पीने से। सुरक्षित विकल्प के रूप में प्राकृतिक एसेंशियल ऑइल डिफ्यूज़र का उपयोग करें।",
    source: "Environmental Health Perspectives journal",
  },
  {
    en: "A single mature urban tree can filter up to 22 kg of particulate matter per year and absorb 21 kg of CO₂. Planting trees near busy roads creates a natural air-cleaning buffer for nearby homes.",
    hi: "एक परिपक्व शहरी पेड़ प्रति वर्ष 22 किलो तक पार्टिकुलेट मैटर फ़िल्टर कर सकता है और 21 किलो CO₂ अवशोषित कर सकता है। व्यस्त सड़कों के पास पेड़ लगाना पास के घरों के लिए प्राकृतिक वायु-शुद्धि बफर बनाता है।",
    source: "USDA Forest Service research",
  },
  {
    en: "Indoor spider plants (Chlorophytum) and money plants (Epipremnum) can reduce formaldehyde and VOCs by 40–70% in a closed room within 24 hours. Keep 2–3 plants per 100 sq ft for best effect.",
    hi: "स्पाइडर प्लांट और मनी प्लांट 24 घंटों में बंद कमरे में फॉर्मेल्डिहाइड और VOCs को 40–70% तक कम कर सकते हैं। सर्वोत्तम प्रभाव के लिए प्रति 100 वर्ग फुट में 2–3 पौधे रखें।",
    source: "NASA Clean Air Study",
  },
  {
    en: "Wet mopping your floors daily can reduce indoor dust (PM10) by up to 40% compared to dry sweeping, which actually re-suspends particles into the air you breathe.",
    hi: "रोज़ाना गीला पोछा लगाने से इनडोर धूल (PM10) 40% तक कम हो सकती है, जबकि सूखी झाड़ू वास्तव में कणों को वापस हवा में उड़ा देती है।",
    source: "Indoor air hygiene research",
  },
  {
    en: "Using a pressure cooker instead of open-pot boiling reduces cooking time by 70% and proportionally cuts indoor air pollution from gas stove combustion byproducts (NO₂, CO).",
    hi: "खुले बर्तन में उबालने की बजाय प्रेशर कुकर का उपयोग करने से खाना पकाने का समय 70% कम होता है और गैस स्टोव दहन उपउत्पादों (NO₂, CO) से इनडोर वायु प्रदूषण आनुपातिक रूप से कम होता है।",
    source: "Energy efficiency studies, BEE India",
  },
  {
    en: "Opening windows on opposite sides of your home for just 15 minutes creates cross-ventilation that can flush out 90% of stale indoor air — but only do this when outdoor AQI is Good or Satisfactory.",
    hi: "घर के विपरीत दिशाओं में खिड़कियां सिर्फ 15 मिनट खोलने से क्रॉस-वेंटिलेशन बनता है जो 90% बासी इनडोर हवा बाहर निकाल सकता है — लेकिन यह तभी करें जब बाहरी AQI अच्छा या संतोषजनक हो।",
    source: "ASHRAE ventilation guidelines",
  },
  {
    en: "Walking or cycling a 5 km commute instead of driving saves approximately 1.2 kg of CO₂ per trip. Over a year, that's equivalent to planting 20 trees.",
    hi: "ड्राइविंग की बजाय 5 किमी की यात्रा पैदल या साइकिल से करने से प्रति यात्रा लगभग 1.2 किलो CO₂ बचती है। एक साल में, यह 20 पेड़ लगाने के बराबर है।",
    source: "IPCC emission factors for transport",
  },
  {
    en: "Mosquito coils release as much PM2.5 as burning 75–137 cigarettes. Electric liquid vaporizers or mosquito nets are far safer for indoor air quality.",
    hi: "मच्छर कॉइल 75–137 सिगरेट जलाने जितना PM2.5 छोड़ती हैं। इलेक्ट्रिक लिक्विड वेपोराइज़र या मच्छरदानी इनडोर वायु गुणवत्ता के लिए कहीं अधिक सुरक्षित हैं।",
    source: "WHO Indoor Air Pollution report",
  },
  {
    en: "India's urban heat island effect makes city centers 2–5°C warmer than suburbs, which accelerates ground-level ozone formation. Light-colored rooftops and green terraces can reduce this by 30%.",
    hi: "भारत का शहरी ऊष्मा द्वीप प्रभाव शहर के केंद्रों को उपनगरों से 2–5°C गर्म बनाता है, जो ज़मीनी स्तर पर ओज़ोन गठन को तेज़ करता है। हल्के रंग की छतें और हरी छत-बागवानी इसे 30% तक कम कर सकती हैं।",
    source: "TERI urban climate studies",
  },
];

/** Get a random daily fact (seeded by date for consistency within a day) */
export function getDailyFact(): EsgFact {
  const today = new Date();
  const dayOfYear =
    Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000,
    );
  return ESG_FACTS[dayOfYear % ESG_FACTS.length];
}
