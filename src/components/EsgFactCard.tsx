"use client";

import React, { useState, useEffect } from "react";
import { type EsgFact, getDailyFact, ESG_FACTS } from "@/data/esgFacts";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface EsgFactCardProps {
  lang: Lang;
  seniorMode: boolean;
}

export const EsgFactCard: React.FC<EsgFactCardProps> = ({ lang, seniorMode }) => {
  const t = UI_TEXT[lang];
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const daily = getDailyFact();
    const idx = ESG_FACTS.indexOf(daily);
    setFactIndex(idx !== -1 ? idx : 0);
  }, []);

  const currentFact: EsgFact = ESG_FACTS[factIndex] || ESG_FACTS[0];

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % ESG_FACTS.length);
  };

  return (
    <aside className="bg-gradient-to-br from-vm-surface via-emerald-50/50 to-amber-50/40 rounded-3xl p-5 sm:p-7 shadow-sm border border-vm-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-vm-teal-mist text-vm-safe flex items-center justify-center shrink-0 border border-vm-border">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3
            className={`font-black text-vm-brand-deep ${
              seniorMode ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            {t.esgFactTitle}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleNextFact}
          className="text-xs font-bold text-vm-brand hover:text-vm-brand-deep bg-vm-white hover:bg-vm-surface px-3 py-1.5 rounded-lg border border-vm-border shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          title="See another fact / दूसरा तथ्य देखें"
        >
          <span>{lang === "en" ? "Next Fact" : "अगला तथ्य"}</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <p
        className={`text-vm-text leading-relaxed font-medium ${
          seniorMode ? "text-lg sm:text-xl" : "text-sm sm:text-base"
        }`}
      >
        {lang === "hi" ? currentFact.hi : currentFact.en}
      </p>

      <div className="pt-1 flex items-center justify-between text-xs text-vm-muted font-semibold border-t border-vm-border/60">
        <span>
          {lang === "en" ? "Source:" : "स्रोत:"} {currentFact.source}
        </span>
        <span className="text-[11px] text-vm-brand font-bold">
          Fact {factIndex + 1} of {ESG_FACTS.length}
        </span>
      </div>
    </aside>
  );
};
