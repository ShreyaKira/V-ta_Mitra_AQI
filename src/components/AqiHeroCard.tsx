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
  shapeText: string;
}

const RANK_BADGES: Record<number, BadgeConfig> = {
  1: {
    bg: "bg-emerald-50",
    border: "border-emerald-600",
    text: "text-emerald-950",
    shapeText: "Circle — Safe",
  },
  2: {
    bg: "bg-cyan-50",
    border: "border-cyan-600",
    text: "text-cyan-950",
    shapeText: "Square — Satisfactory",
  },
  3: {
    bg: "bg-amber-50",
    border: "border-amber-600",
    text: "text-amber-950",
    shapeText: "Triangle — Moderate Caution",
  },
  4: {
    bg: "bg-orange-50",
    border: "border-orange-600",
    text: "text-orange-950",
    shapeText: "Diamond — Unhealthy",
  },
  5: {
    bg: "bg-rose-50",
    border: "border-rose-700",
    text: "text-rose-950",
    shapeText: "Octagon — Very Poor",
  },
  6: {
    bg: "bg-purple-100",
    border: "border-purple-900",
    text: "text-purple-950",
    shapeText: "Warning Triangle — Severe",
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
  const { cpcb, sourceName, usAqi, lastUpdatedIst, lastUpdatedIso } = aqiData;
  const dominantPollutant = cpcb.dominantPollutant;
  const badge = RANK_BADGES[cpcb.rank] || RANK_BADGES[3];

  const displayTimestamp =
    lastUpdatedIst ||
    new Date(lastUpdatedIso).toLocaleString(lang === "en" ? "en-IN" : "hi-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }) + " IST";

  return (
    <article
      aria-live="polite"
      className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border transition-all space-y-6"
    >
      {/* Location & Live IST Timestamp Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vm-border/50 pb-3.5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-vm-brand bg-vm-surface px-3 py-1 rounded-lg border border-vm-border">
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

        <div className="text-xs sm:text-sm text-vm-muted text-left sm:text-right space-y-0.5">
          <p>
            <span className="font-bold text-vm-text">{t.lastUpdated}:</span>{" "}
            <span className="font-extrabold text-vm-brand">{displayTimestamp}</span>
          </p>
          <p className="text-[11px] text-vm-muted">
            <span className="font-semibold">{t.source}:</span> {sourceName}
          </p>
        </div>
      </div>

      {/* Main Metric Spotlight Card */}
      <div className={`rounded-2xl p-5 sm:p-6 border-2 transition-all ${badge.bg} ${badge.border}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
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

            {/* Colorblind-Safe Category Pill (Color + Text + Shape Label) */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-black shadow-xs border ${badge.bg} ${badge.border} ${badge.text} ${
                  seniorMode ? "text-xl" : "text-base sm:text-lg"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-current shrink-0" aria-hidden="true" />
                <span>{lang === "hi" ? cpcb.categoryHi : cpcb.categoryEn}</span>
                <span className="text-xs font-semibold opacity-80">({badge.shapeText})</span>
              </span>

              <span
                className={`inline-flex items-center px-3.5 py-1.5 rounded-xl bg-vm-white/95 border border-vm-border font-bold text-vm-text shadow-2xs ${
                  seniorMode ? "text-base" : "text-xs sm:text-sm"
                }`}
              >
                {cpcb.rankLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 justify-between md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-vm-border/50">
            <div>
              <p className={`font-bold text-vm-muted uppercase tracking-wider ${seniorMode ? "text-sm" : "text-xs"}`}>
                {t.primaryPollutant}
              </p>
              <p className={`font-black text-rose-700 ${seniorMode ? "text-2xl" : "text-xl sm:text-2xl"}`}>
                {dominantPollutant}
              </p>
            </div>
            <div>
              <p className={`font-bold text-vm-muted uppercase tracking-wider ${seniorMode ? "text-sm" : "text-xs"}`}>
                {t.usEpaAqi}
              </p>
              <p className={`font-bold text-vm-text ${seniorMode ? "text-xl" : "text-lg"}`}>
                {usAqi} <span className="text-xs font-normal text-vm-muted">(US EPA)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 6 Pollutants Sub-Indices */}
        <div className="mt-5 pt-4 border-t border-vm-border/40 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {cpcb.subIndices.map((si) => (
            <div key={si.pollutant} className="bg-vm-white/90 rounded-xl p-2.5 border border-vm-border/60 shadow-2xs">
              <p className="text-xs font-bold text-vm-muted">{si.pollutant}</p>
              <p className="text-base sm:text-lg font-black text-vm-text mt-0.5">{si.subIndex}</p>
              <p className="text-[11px] text-vm-muted truncate">
                {si.concentration.toFixed(1)} {si.pollutant === "CO" ? "mg/m³" : "µg/m³"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safest 2-Hour Outdoor Window Banner */}
      <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className={`font-extrabold text-emerald-950 ${seniorMode ? "text-xl" : "text-base sm:text-lg"}`}>
              {t.safestWindow}
            </h3>
          </div>
          <p className={`text-emerald-900 font-medium ${seniorMode ? "text-base" : "text-xs sm:text-sm"}`}>
            {safestWindow
              ? lang === "hi" ? safestWindow.recommendationHi : safestWindow.recommendation
              : t.noForecast}
          </p>
        </div>
        {safestWindow && (
          <div className="px-4 py-2 rounded-xl bg-vm-white border border-emerald-300 font-black text-emerald-900 text-sm sm:text-base whitespace-nowrap shadow-2xs">
            {new Date(safestWindow.startTime).toLocaleTimeString(lang === "en" ? "en-IN" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
            {" – "}
            {new Date(safestWindow.endTime).toLocaleTimeString(lang === "en" ? "en-IN" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </div>
        )}
      </div>

      {/* 5-City Live India Comparison Strip */}
      {cityComparison && cityComparison.length > 0 && (
        <div className="pt-2">
          <h4 className={`font-bold text-vm-text mb-2.5 flex items-center gap-2 ${
            seniorMode ? "text-base" : "text-xs sm:text-sm uppercase tracking-wider text-vm-muted"
          }`}>
            <span>{t.cityComparison}</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {cityComparison.map((c) => {
              const rankVal = c.naqi <= 50 ? 1 : c.naqi <= 100 ? 2 : c.naqi <= 200 ? 3 : c.naqi <= 300 ? 4 : c.naqi <= 400 ? 5 : 6;
              const b = RANK_BADGES[rankVal] || RANK_BADGES[3];
              return (
                <div key={c.city} className={`p-3 rounded-2xl border ${b.bg} ${b.border} flex flex-col justify-between`}>
                  <p className="font-bold text-xs sm:text-sm text-vm-text truncate">{c.city}</p>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="font-black text-base sm:text-lg text-vm-text">{c.naqi}</span>
                    <span className="text-xs font-bold text-vm-muted">
                      {lang === "hi" ? c.categoryHi : c.categoryEn}
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
