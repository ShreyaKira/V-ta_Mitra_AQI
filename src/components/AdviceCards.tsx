"use client";

import React from "react";
import { type AdviseResponse } from "@/lib/adviseFallback";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface AdviceCardsProps {
  adviceData: AdviseResponse;
  lang: Lang;
  seniorMode: boolean;
}

export const AdviceCards: React.FC<AdviceCardsProps> = ({
  adviceData,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];
  const { memberAdvice, source, whatIfMetrics } = adviceData;

  const roleLabels: Record<string, { en: string; hi: string; icon: string }> = {
    commuter: { en: "Commuter", hi: "यात्री", icon: "💼" },
    child: { en: "Young Child", hi: "छोटा बच्चा", icon: "🎒" },
    senior: { en: "Senior Citizen", hi: "वरिष्ठ नागरिक", icon: "👵" },
    student: { en: "Student", hi: "छात्र", icon: "📚" },
  };

  return (
    <section className="space-y-6">
      {/* Header Banner in Deep Botanical Teal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-vm-brand-deep to-vm-brand text-vm-white rounded-3xl p-5 sm:p-6 shadow-md border border-vm-border">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-vm-border">
            {lang === "en" ? "Tailored Household Plan" : "कस्टमाइज़्ड घरेलू योजना"}
          </span>
          <h2
            className={`font-black mt-0.5 ${
              seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            🌿 {lang === "en" ? "Action Cards for Your Home" : "आपके घर के लिए कार्य योजना"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-vm-brand/60 border border-vm-border/50 font-semibold text-vm-white">
            {source === "gemini" ? "✨ AI Generated (Gemini 2.5 Flash)" : "🛡️ Rule-Based Fallback"}
          </span>
        </div>
      </div>

      {/* Side-by-Side Member Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {memberAdvice.map((m, idx) => {
          const roleMeta = roleLabels[m.role] || {
            en: m.role,
            hi: m.role,
            icon: "👤",
          };

          return (
            <article
              key={m.memberId || idx}
              className="bg-vm-white rounded-3xl p-5 sm:p-6 shadow-md border border-vm-border flex flex-col justify-between space-y-5 transition-all hover:shadow-lg"
            >
              {/* Member Title */}
              <div className="border-b border-vm-border/50 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" aria-hidden="true">
                    {roleMeta.icon}
                  </span>
                  <div>
                    <h3
                      className={`font-black text-vm-text ${
                        seniorMode ? "text-xl" : "text-base sm:text-lg"
                      }`}
                    >
                      {lang === "hi" ? roleMeta.hi : roleMeta.en}
                    </h3>
                    <p className="text-[11px] font-bold text-vm-brand uppercase tracking-wider">
                      {lang === "en" ? `Member #${idx + 1}` : `सदस्य #${idx + 1}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 1: Low-Emission Routine */}
              <div className="space-y-2">
                <h4
                  className={`font-extrabold text-vm-text flex items-center gap-1.5 ${
                    seniorMode ? "text-base" : "text-xs uppercase tracking-wider text-vm-muted"
                  }`}
                >
                  <span>🚶</span>
                  <span>{t.lowEmissionRoutine}</span>
                </h4>
                <div className="bg-vm-surface rounded-2xl p-3.5 border border-vm-border space-y-2 text-xs sm:text-sm text-vm-text">
                  <p>
                    <strong className="text-vm-brand-deep">
                      {lang === "en" ? "🌅 Morning:" : "🌅 सुबह:"}
                    </strong>{" "}
                    {m.lowEmissionRoutine.morning}
                  </p>
                  <p>
                    <strong className="text-vm-brand-deep">
                      {lang === "en" ? "☀️ Afternoon:" : "☀️ दोपहर:"}
                    </strong>{" "}
                    {m.lowEmissionRoutine.afternoon}
                  </p>
                  <p>
                    <strong className="text-vm-brand-deep">
                      {lang === "en" ? "🌆 Evening:" : "🌆 शाम:"}
                    </strong>{" "}
                    {m.lowEmissionRoutine.evening}
                  </p>
                  {m.lowEmissionRoutine.transitSwaps && (
                    <p className="pt-1.5 border-t border-vm-border text-vm-brand font-medium">
                      <strong>
                        {lang === "en" ? "🚇 Transit Swaps:" : "🚇 यात्रा सुझाव:"}
                      </strong>{" "}
                      {m.lowEmissionRoutine.transitSwaps}
                    </p>
                  )}
                </div>
              </div>

              {/* Pillar 2: Indoor Air Hacks */}
              <div className="space-y-2">
                <h4
                  className={`font-extrabold text-vm-text flex items-center gap-1.5 ${
                    seniorMode ? "text-base" : "text-xs uppercase tracking-wider text-vm-muted"
                  }`}
                >
                  <span>🏠</span>
                  <span>{t.indoorAirHacks}</span>
                </h4>
                <ul className="bg-emerald-50/60 rounded-2xl p-3.5 border border-vm-safe/30 space-y-1.5 text-xs sm:text-sm text-[#064E3B] list-disc list-inside">
                  {m.indoorAirHacks.map((hack, hIdx) => (
                    <li key={hIdx} className="leading-snug">
                      <span>{hack}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillar 3: Impact Justification */}
              <div className="space-y-2">
                <h4
                  className={`font-extrabold text-vm-text flex items-center gap-1.5 ${
                    seniorMode ? "text-base" : "text-xs uppercase tracking-wider text-vm-muted"
                  }`}
                >
                  <span>📊</span>
                  <span>{t.impactJustification}</span>
                </h4>
                <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-vm-accent/30 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  {m.impactJustification}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* What-If Metrics Summary */}
      {whatIfMetrics && (
        <div className="bg-vm-white rounded-3xl p-5 sm:p-6 shadow-md border border-vm-border space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🔄
            </span>
            <h3
              className={`font-black text-vm-text ${
                seniorMode ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
              }`}
            >
              {t.whatIfMetrics}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-vm-surface border border-vm-border space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-vm-muted">
                {lang === "en" ? "Commute Mode Shift Impact" : "यात्रा माध्यम बदलने का प्रभाव"}
              </p>
              <p
                className={`font-semibold text-vm-text ${
                  seniorMode ? "text-base" : "text-xs sm:text-sm"
                }`}
              >
                {whatIfMetrics.commuteSwitch}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-vm-surface border border-vm-border space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-vm-muted">
                {lang === "en"
                  ? "Ventilation Shift Impact"
                  : "वेंटिलेशन समय बदलने का प्रभाव"}
              </p>
              <p
                className={`font-semibold text-vm-text ${
                  seniorMode ? "text-base" : "text-xs sm:text-sm"
                }`}
              >
                {whatIfMetrics.ventilationTiming}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
