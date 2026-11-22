"use client";

import React, { useState } from "react";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface FollowUpChatProps {
  onAsk: (question: string) => Promise<string | null>;
  initialAnswer?: string;
  lang: Lang;
  seniorMode: boolean;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  onAsk,
  initialAnswer,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(initialAnswer || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    setIsAsking(true);
    try {
      const resp = await onAsk(trimmed);
      if (resp) {
        setAnswer(resp);
      }
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions =
    lang === "en"
      ? [
          "Can my elderly grandfather go for a 6 AM walk today?",
          "How much does a kitchen exhaust fan reduce indoor PM2.5?",
          "Should I buy an N95 mask or a cloth mask?",
        ]
      : [
          "क्या मेरे बुज़ुर्ग दादाजी आज सुबह 6 बजे सैर पर जा सकते हैं?",
          "रसोई का एग्ज़ॉस्ट फैन इनडोर PM2.5 को कितना कम करता है?",
          "क्या मुझे N95 मास्क खरीदना चाहिए या कपड़े का मास्क?",
        ];

  return (
    <section className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border space-y-5">
      <div className="flex items-center gap-2.5 border-b border-vm-border/60 pb-3">
        <span className="text-2xl" aria-hidden="true">
          💬
        </span>
        <div>
          <h2
            className={`font-black text-vm-text ${
              seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {t.followUpTitle}
          </h2>
          <p
            className={`text-vm-muted font-medium ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            {lang === "en"
              ? "Ask any question about your live city AQI, vulnerable family members, or safe windows"
              : "अपने शहर के लाइव AQI, संवेदनशील सदस्यों या सुरक्षित समय के बारे में कोई भी प्रश्न पूछें"}
          </p>
        </div>
      </div>

      {/* Sample Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setQuestion(sq)}
            className="text-xs bg-vm-surface hover:bg-vm-border/50 text-vm-text px-3 py-1.5 rounded-xl font-medium transition-all text-left border border-vm-border cursor-pointer"
          >
            💡 {sq}
          </button>
        ))}
      </div>

      {/* Input Form with Warm Saffron Amber CTA Button */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="text"
          maxLength={300}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.followUpPlaceholder}
          disabled={isAsking}
          className={`flex-1 px-4 py-2.5 rounded-xl border border-vm-border focus:outline-hidden focus:ring-2 focus:ring-vm-accent focus:border-vm-accent bg-vm-surface text-vm-text placeholder:text-vm-muted ${
            seniorMode ? "text-lg" : "text-sm sm:text-base"
          }`}
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className={`px-6 py-2.5 rounded-xl bg-vm-accent hover:brightness-110 active:scale-95 disabled:opacity-50 text-vm-white font-bold transition-all shadow-xs cursor-pointer ${
            seniorMode ? "text-lg" : "text-sm sm:text-base"
          }`}
        >
          {isAsking ? "..." : t.askFollowUp}
        </button>
      </form>

      {/* Answer Output */}
      {answer && (
        <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-vm-safe/40 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
            <span>🤖</span>
            <span>{t.followUpAnswer}</span>
          </p>
          <p
            className={`text-vm-text leading-relaxed font-medium ${
              seniorMode ? "text-lg sm:text-xl" : "text-sm sm:text-base"
            }`}
          >
            {answer}
          </p>
        </div>
      )}
    </section>
  );
};
