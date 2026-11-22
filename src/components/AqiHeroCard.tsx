"use client";

import React from "react";
import { type LiveAirQualityResult } from "@/lib/aqi";
import { type SafestWindow } from "@/app/api/aqi/route";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface AqiHeroCardProps {
  aqiData: LiveAirQualityResult;
  safestWindow: SafestWindow | null;
  cityComparison?: {
    city: string;
    naqi: number;
    categoryEn: string;
    categoryHi: string;
  }[];
  lang: Lang;
  seniorMode: boolean;
}

interface BadgeConfig {
  bg: string;
  border: string;
  text: string;
  icon: string;
  shape: string;
}

/* Colorblind-safe: every rank combines a distinct hue, icon, and
   explicit text shape label so users never rely on color alone. */
const RANK_BADGES: Record<number, BadgeConfig> = {
  1: {
    bg: "bg-emerald-50",
    border: "border-[#0D9488]",
    text: "text-[#064E3B]",
    icon: "🟢",
    shape: "Circle — Safe",
  },
  2: {
    bg: "bg-cyan-50",
    border: "border-cyan-500",
    text: "text-cyan-950",
    icon: "🟦",
    shape: "Square — OK",
  },
  3: {
    bg: "bg-amber-50",
    border: "border-[#D97706]",
    text: "text-amber-950",
    icon: "🟡",
    shape: "Triangle — Caution",
  },
  4: {
    bg: "bg-orange-50",
    border: "border-orange-600",
    text: "text-orange-950",
    icon: "🟧",
    shape: "Diamond — Unhealthy",
  },
  5: {
    bg: "bg-rose-50",
    border: "border-rose-700",
    text: "text-rose-950",
    icon: "🛑",
    shape: "Octagon — Danger",
  },
  6: {
    bg: "bg-purple-100",
    border: "border-purple-900",
    text: "text-purple-950",
    icon: "⚠️",
    shape: "Warning — Hazardous",
  },
};

export const AqiHeroCard: React.FC<AqiHeroCardProps> = ({
  aqiData,
  safestWindow,
  cityComparison,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];
  const { cpcb, sourceName, lastUpdatedIso, usAqi } = aqiData;
  const dominantPollutant = cpcb.dominantPollutant;
  const badge = RANK_BADGES[cpcb.rank] || RANK_BADGES[3];

  const formattedDate = new Date(lastUpdatedIso).toLocaleString(
    lang === "en" ? "en-IN" : "hi-IN",
    { dateStyle: "medium", timeStyle: "short" }
  );

  return (
    <article
      aria-live="polite"
      className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border transition-all space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vm-border/50 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-vm-safe bg-emerald-50 px-2.5 py-1 rounded-md border border-vm-safe/30">
            {aqiData.city}
          </span>
          <h2
            className={`font-black text-vm-text mt-1 ${
              seniorMode ? "text-3xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {t.liveAqi}
          </h2>
        </div>
        <div className="text-xs text-vm-muted text-left sm:text-right space-y-0.5">
          <p><span className="font-semibold">{t.source}:</span> {sourceName}</p>
          <p><span className="font-semibold">{t.lastUpdated}:</span> {formattedDate}</p>
        </div>
      </div>

      {/* Main Metric */}
      <div className={`rounded-2xl p-5 sm:p-6 border-2 transition-all ${badge.bg} ${badge.border}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span
                className={`font-black tracking-tight text-vm-text ${
                  seniorMode ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl"
                }`}
              >
                {cpcb.naqi}
              </span>
              <span className="text-sm sm:text-base font-bold text-vm-muted">/ 500 NAQI</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold shadow-xs border ${badge.bg} ${badge.border} ${badge.text} ${
                  seniorMode ? "text-xl" : "text-base sm:text-lg"
                }`}
              >
                <span aria-hidden="true">{badge.icon}</span>
                <span>{lang === "hi" ? cpcb.categoryHi : cpcb.categoryEn}</span>
                <span className="text-xs font-normal opacity-80">({badge.shape})</span>
              </span>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg bg-vm-white/90 border border-vm-border font-bold text-vm-text shadow-2xs ${
                  seniorMode ? "text-base" : "text-xs sm:text-sm"
                }`}
              >
                {cpcb.rankLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 justify-between md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-vm-border/50">
            <div>
              <p className={`font-semibold text-vm-muted uppercase tracking-wider ${seniorMode ? "text-sm" : "text-xs"}`}>
                {t.primaryPollutant}
              </p>
              <p className={`font-black text-rose-600 ${seniorMode ? "text-2xl" : "text-xl sm:text-2xl"}`}>
                {dominantPollutant}
              </p>
            </div>
            <div>
              <p className={`font-semibold text-vm-muted uppercase tracking-wider ${seniorMode ? "text-sm" : "text-xs"}`}>
                {t.usEpaAqi}
              </p>
              <p className={`font-bold text-vm-text ${seniorMode ? "text-xl" : "text-lg"}`}>
                {usAqi} <span className="text-xs font-normal text-vm-muted">(EPA scale)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sub-indices */}
        <div className="mt-5 pt-4 border-t border-vm-border/40 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {cpcb.subIndices.map((si) => (
            <div key={si.pollutant} className="bg-vm-white/80 rounded-lg p-2 border border-vm-border/60 shadow-2xs">
              <p className="text-xs font-semibold text-vm-muted">{si.pollutant}</p>
              <p className="text-sm sm:text-base font-extrabold text-vm-text mt-0.5">{si.subIndex}</p>
              <p className="text-[10px] text-vm-muted truncate">
                {si.concentration.toFixed(1)} {si.pollutant === "CO" ? "mg/m³" : "µg/m³"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safest Window */}
      <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-[#0D9488]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🕒</span>
            <h3 className={`font-bold text-[#064E3B] ${seniorMode ? "text-xl" : "text-base sm:text-lg"}`}>
              {t.safestWindow}
            </h3>
          </div>
          <p className={`text-[#065F46] ${seniorMode ? "text-base" : "text-xs sm:text-sm"}`}>
            {safestWindow
              ? lang === "hi" ? safestWindow.recommendationHi : safestWindow.recommendation
              : t.noForecast}
          </p>
        </div>
        {safestWindow && (
          <div className="px-3.5 py-1.5 rounded-xl bg-vm-white border border-[#0D9488]/40 font-extrabold text-[#064E3B] text-sm whitespace-nowrap shadow-2xs">
            {new Date(safestWindow.startTime).toLocaleTimeString(lang === "en" ? "en-IN" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
            {" – "}
            {new Date(safestWindow.endTime).toLocaleTimeString(lang === "en" ? "en-IN" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </div>
        )}
      </div>

      {/* City Comparison */}
      {cityComparison && cityComparison.length > 0 && (
        <div className="pt-2">
          <h4 className={`font-bold text-vm-text mb-2.5 flex items-center gap-1.5 ${
            seniorMode ? "text-base" : "text-xs sm:text-sm uppercase tracking-wider"
          }`}>
            <span>🇮🇳</span> {t.cityComparison}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {cityComparison.map((c) => {
              const rankVal = c.naqi <= 50 ? 1 : c.naqi <= 100 ? 2 : c.naqi <= 200 ? 3 : c.naqi <= 300 ? 4 : c.naqi <= 400 ? 5 : 6;
              const b = RANK_BADGES[rankVal] || RANK_BADGES[3];
              return (
                <div key={c.city} className={`p-2.5 rounded-xl border ${b.bg} ${b.border} flex flex-col justify-between`}>
                  <p className="font-bold text-xs text-vm-text truncate">{c.city}</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-black text-sm sm:text-base text-vm-text">{c.naqi}</span>
                    <span className="text-[11px] font-semibold flex items-center gap-0.5">
                      <span aria-hidden="true">{b.icon}</span>
                      <span>{lang === "hi" ? c.categoryHi : c.categoryEn}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
};
