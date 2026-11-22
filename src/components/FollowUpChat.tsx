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
      <div className="flex items-center gap-3 border-b border-vm-border/60 pb-3">
        <div className="w-10 h-10 rounded-xl bg-vm-surface border border-vm-border flex items-center justify-center text-vm-brand shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
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
            className="text-xs bg-vm-surface hover:bg-vm-border/50 text-vm-text px-3 py-1.5 rounded-xl font-medium transition-all text-left border border-vm-border cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-vm-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>{sq}</span>
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
            <svg className="w-4 h-4 text-vm-safe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
