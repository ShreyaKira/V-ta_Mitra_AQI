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
  const { homePlan, memberAdvice, source } = adviceData;

  const ageGroupLabels: Record<string, { en: string; hi: string }> = {
    child: { en: "Child (0-14 yrs)", hi: "बच्चा (0-14 वर्ष)" },
    adult: { en: "Adult", hi: "वयस्क" },
    senior: { en: "Senior Citizen (60+ yrs)", hi: "वरिष्ठ नागरिक (60+ वर्ष)" },
  };

  return (
    <section className="space-y-6">
      {/* ─── 1. Shared Home & Indoor Air Plan Card ─── */}
      <article className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-vm-brand space-y-5">
        {/* Card Header in Deep Teal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-vm-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-vm-brand text-vm-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-vm-brand bg-vm-surface px-2.5 py-0.5 rounded-md border border-vm-border">
                {lang === "en" ? "Shared Household Protocol" : "सांझा घरेलू प्रोटोकॉल"}
              </span>
              <h3
                className={`font-black text-vm-brand-deep mt-0.5 ${
                  seniorMode ? "text-2xl" : "text-xl sm:text-2xl"
                }`}
              >
                {t.sharedHomePlanTitle}
              </h3>
            </div>
          </div>

          <span className="text-xs px-3 py-1.5 rounded-xl bg-vm-surface border border-vm-border font-bold text-vm-brand self-start sm:self-auto">
            {source === "gemini" ? "AI Verified (Gemini 2.5 Flash)" : "CPCB Grounded Plan"}
          </span>
        </div>

        {/* Home Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Indoor Air & Ventilation Hacks */}
          <div className="bg-vm-surface rounded-2xl p-4 sm:p-5 border border-vm-border space-y-3">
            <h4 className="font-extrabold text-sm sm:text-base text-vm-brand-deep flex items-center gap-2">
              <svg className="w-4 h-4 text-vm-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span>{t.indoorAirHacks}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-vm-text list-disc list-inside">
              {homePlan.indoorAirHacks.map((hack, hIdx) => (
                <li key={hIdx} className="leading-relaxed">
                  <span className="font-medium">{hack}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-vm-border/60 text-xs font-bold text-vm-brand">
              {homePlan.ventilationSchedule}
            </div>
          </div>

          {/* Purifier & Plant Strategy */}
          <div className="space-y-4">
            {/* Purifier Strategy */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-300 space-y-1.5">
              <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{t.purifierGuidance}</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
                {homePlan.purifierRecommendation}
              </p>
            </div>

            {/* Plants Strategy */}
            <div className="bg-vm-surface rounded-2xl p-4 border border-vm-border space-y-1.5">
              <h4 className="font-extrabold text-xs sm:text-sm text-vm-brand-deep flex items-center gap-2">
                <svg className="w-4 h-4 text-vm-safe shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>{t.plantAirCare}</span>
              </h4>
              <p className="text-xs sm:text-sm text-vm-text font-medium leading-relaxed">
                {homePlan.plantAirCare}
              </p>
            </div>
          </div>
        </div>

        {/* Nearby High-Oxygen Green Zone Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-vm-surface to-teal-50 rounded-2xl p-4 sm:p-5 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {t.nearbyGreenZoneTitle}
            </span>
            <h4 className="font-black text-base sm:text-lg text-vm-brand-deep">
              {homePlan.nearbyGreenZone.name}
            </h4>
            <p className="text-xs sm:text-sm text-vm-text font-medium leading-relaxed">
              {homePlan.nearbyGreenZone.benefitReason}
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-vm-white border border-emerald-300 font-bold text-xs sm:text-sm text-emerald-950 whitespace-nowrap shadow-2xs">
            {homePlan.nearbyGreenZone.timingSuggestion}
          </div>
        </div>
      </article>

      {/* ─── 2. Individual Member Action Cards ─── */}
      <div className="space-y-4">
        <h3
          className={`font-black text-vm-text ${
            seniorMode ? "text-2xl" : "text-xl sm:text-2xl"
          }`}
        >
          {t.individualRoutinesTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {memberAdvice.map((m, idx) => {
            const ageGroupStr = m.ageGroup || (m.role === "child" ? "child" : m.role === "senior" ? "senior" : "adult");
            const ageLabel = ageGroupLabels[ageGroupStr] || ageGroupLabels.adult;

            return (
              <article
                key={m.memberId || idx}
                className="bg-vm-white rounded-3xl p-5 sm:p-6 shadow-md border border-vm-border flex flex-col justify-between space-y-4 transition-all hover:shadow-lg"
              >
                {/* Member Header */}
                <div className="border-b border-vm-border/50 pb-3 flex items-center justify-between">
                  <div>
                    <h4
                      className={`font-black text-vm-text ${
                        seniorMode ? "text-xl" : "text-base sm:text-lg"
                      }`}
                    >
                      {m.name || `Person ${idx + 1}`}
                    </h4>
                    <p className="text-xs font-bold text-vm-brand">
                      {lang === "hi" ? ageLabel.hi : ageLabel.en}
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-vm-surface border border-vm-border text-vm-brand flex items-center justify-center text-xs font-black">
                    #{idx + 1}
                  </span>
                </div>

                {/* Commute Risk Analysis */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-vm-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{t.scheduleRisk}</span>
                  </h5>
                  <div className="p-3 rounded-xl bg-vm-surface border border-vm-border text-xs sm:text-sm text-vm-text font-medium leading-relaxed">
                    {m.scheduleRisk}
                  </div>
                </div>

                {/* Recommended Transit Swap */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-vm-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-vm-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>{t.transitSwap}</span>
                  </h5>
                  <div className="p-3 rounded-xl bg-vm-surface border border-vm-border text-xs sm:text-sm text-vm-brand font-semibold leading-relaxed">
                    {m.commuteTransitSwap}
                  </div>
                </div>

                {/* Exercise / Walk Timing */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-vm-muted flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t.exerciseWindow}</span>
                  </h5>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                    {m.outdoorExerciseWindow}
                  </div>
                </div>

                {/* Health & Physiological Impact */}
                <div className="space-y-1.5 pt-2 border-t border-vm-border/50">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-vm-muted">
                    {t.impactJustification}
                  </h5>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                    {m.impactJustification}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
