"use client";

import React, { useState } from "react";
import { type HouseholdMember, type ScheduleExposureCalculator as ExposureData } from "@/lib/adviseFallback";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface ScheduleExposureCalculatorProps {
  members: HouseholdMember[];
  currentAqi: number;
  safestWindowStr: string;
  scheduleExposureData?: ExposureData;
  lang: Lang;
  seniorMode: boolean;
}

export const ScheduleExposureCalculator: React.FC<ScheduleExposureCalculatorProps> = ({
  members,
  currentAqi,
  safestWindowStr,
  scheduleExposureData,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];
  const [selectedMemberIdx, setSelectedMemberIdx] = useState(0);

  // Active member details
  const activeMember = members[selectedMemberIdx] || members[0] || {
    id: "mem-1",
    name: "You",
    commuteMode: "two_wheeler",
    leaveTime: "09:00",
    returnTime: "18:30",
  };

  const [timeShiftMinutes, setTimeShiftMinutes] = useState<number>(30); // 0, 30, 45, 60
  const [selectedOptimizedMode, setSelectedOptimizedMode] = useState<string>("metro");

  const commuteMode = activeMember.commuteMode || "two_wheeler";
  const leaveTime = activeMember.leaveTime || "09:00";
  const returnTime = activeMember.returnTime || "18:30";

  // Calculate base & optimized exposure scores (0-100 scale)
  // Higher = worse exposure
  const getModeFactor = (mode: string): number => {
    switch (mode) {
      case "two_wheeler":
      case "bike":
        return 1.0;
      case "walk":
      case "cycle":
        return 0.85;
      case "car":
        return 0.6;
      case "bus":
        return 0.45;
      case "metro":
      case "train":
        return 0.2;
      default:
        return 0.6;
    }
  };

  const isPeakHour = (timeStr: string): boolean => {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10) || 9;
    // Morning peak 8-10, evening peak 18-20
    return (hours >= 8 && hours <= 10) || (hours >= 18 && hours <= 20);
  };

  const baseFactor = getModeFactor(commuteMode);
  const peakMultiplier = isPeakHour(leaveTime) || isPeakHour(returnTime) ? 1.3 : 1.0;

  // Normalized base score based on AQI (max 500)
  const aqiRatio = Math.min(1.0, Math.max(0.2, currentAqi / 350));
  const baseExposureScore = Math.min(
    95,
    Math.round(aqiRatio * 85 * baseFactor * peakMultiplier)
  );

  // Optimized score
  const optimizedFactor = getModeFactor(selectedOptimizedMode);
  const timeShiftDiscount = timeShiftMinutes >= 45 ? 0.75 : timeShiftMinutes >= 30 ? 0.85 : 1.0;
  const optimizedExposureScore = Math.max(
    12,
    Math.round(baseExposureScore * (optimizedFactor / baseFactor) * timeShiftDiscount)
  );

  const calculatedReductionPct = Math.max(
    25,
    Math.min(88, Math.round(((baseExposureScore - optimizedExposureScore) / baseExposureScore) * 100))
  );

  // Fallback to server-provided metric if available and not modified
  const displayReductionPct = scheduleExposureData?.inhalationReductionPct
    ? Math.max(calculatedReductionPct, scheduleExposureData.inhalationReductionPct)
    : calculatedReductionPct;

  const memberName = activeMember.name?.trim() || `${t.memberName} ${selectedMemberIdx + 1}`;

  return (
    <section className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-vm-border/60 pb-4">
        <div className="w-10 h-10 rounded-xl bg-vm-surface border border-vm-border flex items-center justify-center text-vm-brand shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2
            className={`font-black text-vm-text ${
              seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {t.scheduleCalculatorTitle}
          </h2>
          <p
            className={`text-vm-muted font-medium mt-0.5 ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            {t.scheduleCalculatorSubtitle}
          </p>
        </div>
      </div>

      {/* Member Selection Tabs if more than 1 member */}
      {members.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {members.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMemberIdx(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedMemberIdx === idx
                  ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                  : "bg-vm-surface text-vm-text border-vm-border hover:bg-vm-white"
              }`}
            >
              {m.name?.trim() || `${t.memberName} ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Schedule & Commute Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Member's Active Schedule & Interactive Optimization */}
        <div className="p-5 rounded-2xl bg-vm-surface border border-vm-border space-y-4">
          <div className="flex items-center justify-between border-b border-vm-border/60 pb-2.5">
            <span className="font-bold text-vm-text text-sm sm:text-base">
              {memberName}: {leaveTime} – {returnTime}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-vm-teal-mist text-vm-brand font-bold border border-vm-border">
              {lang === "en" ? "Daily Commute" : "दैनिक आवागमन"}
            </span>
          </div>

          {/* Interactive Mode Swap */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-vm-text block mb-1.5">
                {lang === "en" ? "Switch Commute Mode to:" : "यात्रा माध्यम बदलें:"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOptimizedMode("metro")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    selectedOptimizedMode === "metro"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border hover:bg-vm-surface"
                  }`}
                >
                  {lang === "en" ? "Metro / Train" : "मेट्रो / ट्रेन"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOptimizedMode("bus")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    selectedOptimizedMode === "bus"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border hover:bg-vm-surface"
                  }`}
                >
                  {lang === "en" ? "AC City Bus" : "एसी सिटी बस"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOptimizedMode("car")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    selectedOptimizedMode === "car"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border hover:bg-vm-surface"
                  }`}
                >
                  {lang === "en" ? "Carpool (AC)" : "कारपूल (एसी)"}
                </button>
              </div>
            </div>

            {/* Time Shift Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-vm-text">
                  {lang === "en"
                    ? "Shift Commute Away from Peak Smog:"
                    : "पीक स्मॉग से यात्रा समय बदलें:"}
                </label>
                <span className="font-extrabold text-vm-accent text-xs">
                  +{timeShiftMinutes} {lang === "en" ? "mins shift" : "मिनट"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="15"
                value={timeShiftMinutes}
                onChange={(e) => setTimeShiftMinutes(Number(e.target.value))}
                className="w-full accent-vm-accent cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-vm-muted mt-0.5">
                <span>0m (Peak)</span>
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m (Off-Peak)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Exposure Reduction & Clinical Impact */}
        <div className="p-5 rounded-2xl bg-vm-surface border border-vm-border flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-vm-muted uppercase tracking-wider">
                {t.inhalationReduction}
              </span>
              <span className="text-xs font-semibold text-vm-brand">
                {lang === "en" ? "Based on Live NAQI" : "लाइव NAQI आधारित"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-vm-safe">
                -{displayReductionPct}%
              </span>
              <span className="text-xs sm:text-sm font-bold text-vm-text">
                {lang === "en" ? "Direct PM2.5 Inhaled" : "PM2.5 सांस में जाने में कमी"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-vm-muted font-medium leading-relaxed">
              {lang === "en"
                ? `By shifting departure away from morning inversion peaks and switching to covered ${selectedOptimizedMode}, ${memberName} avoids intense direct vehicular exhaust plumes.`
                : `सुबह के स्मॉग पीक से समय बदलकर कवर्ड ${selectedOptimizedMode} अपनाने से ${memberName} सीधे वाहनों के धुएं से बचेंगे।`}
            </p>
          </div>

          {/* Metric Comparison Bar */}
          <div className="p-3 rounded-xl bg-vm-white border border-vm-border shadow-2xs space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-rose-700">
                {t.currentScheduleExposure}: {baseExposureScore}/100
              </span>
              <span className="text-vm-safe">
                {t.optimizedScheduleExposure}: {optimizedExposureScore}/100
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-vm-surface border border-vm-border overflow-hidden flex">
              <div
                className="bg-vm-safe h-full transition-all duration-300"
                style={{ width: `${100 - displayReductionPct}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${displayReductionPct}%` }}
              />
            </div>
            <p className="text-[11px] text-vm-muted">
              {lang === "en"
                ? `Safest 2-hour outdoor ventilation window: ${safestWindowStr}`
                : `सबसे सुरक्षित 2-घंटे की वेंटिलेशन खिड़की: ${safestWindowStr}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
