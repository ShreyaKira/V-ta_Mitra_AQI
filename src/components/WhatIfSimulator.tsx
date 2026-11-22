"use client";

import React, { useState } from "react";
import { type Lang } from "@/data/i18n";

interface WhatIfSimulatorProps {
  currentAqi: number;
  safestWindowStr: string;
  lang: Lang;
  seniorMode: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentAqi,
  safestWindowStr,
  lang,
  seniorMode,
}) => {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(15);
  const [currentMode, setCurrentMode] = useState<"car" | "bike">("car");
  const [ventilationChoice, setVentilationChoice] = useState<"safest" | "peak">("safest");

  // Calculations
  const carEmissionPerTrip = commuteDistanceKm * 0.15;
  const bikeEmissionPerTrip = commuteDistanceKm * 0.04;
  const metroEmissionPerTrip = commuteDistanceKm * 0.015;

  const currentTripEmission =
    currentMode === "car" ? carEmissionPerTrip : bikeEmissionPerTrip;
  const co2SavedPerTrip = Math.max(0, currentTripEmission - metroEmissionPerTrip);
  const co2SavedPerYearKg = Math.round(co2SavedPerTrip * 2 * 250);

  const exposureReductionPct = currentMode === "car" ? 65 : 82;

  const indoorExposureShift =
    ventilationChoice === "safest"
      ? { pct: 55, textEn: "55% less particulate ingress", textHi: "55% कम धूल का प्रवेश" }
      : { pct: 0, textEn: "High exposure during peak smog hours", textHi: "पीक स्मॉग में उच्च एक्सपोज़र" };

  return (
    <section className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border space-y-6">
      <div className="flex items-center gap-2.5 border-b border-vm-border/60 pb-3">
        <span className="text-2xl" aria-hidden="true">
          🧮
        </span>
        <div>
          <h2
            className={`font-black text-vm-text ${
              seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {lang === "en"
              ? "Interactive 'What-If' Impact Simulator"
              : "इंटरएक्टिव 'क्या-अगर' प्रभाव सिम्युलेटर"}
          </h2>
          <p
            className={`text-vm-muted font-medium ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            {lang === "en"
              ? "Simulate the immediate health & carbon savings of small everyday swaps"
              : "रोज़मर्रा के छोटे बदलावों से होने वाली स्वास्थ्य व कार्बन बचत का तुरंत आंकलन करें"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario 1: Commute Swap */}
        <div className="p-5 rounded-2xl bg-vm-surface border border-vm-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-vm-text text-sm sm:text-base flex items-center gap-1.5">
              <span>🚗 ➔ 🚇</span>
              <span>{lang === "en" ? "Switch Commute to Metro" : "कार/बाइक से मेट्रो पर स्विच"}</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B] font-bold">
              {lang === "en" ? "Transport" : "परिवहन"}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="font-semibold text-vm-text block mb-1">
                {lang === "en" ? "Current Vehicle:" : "वर्तमान वाहन:"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMode("car")}
                  className={`py-1.5 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                    currentMode === "car"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border"
                  }`}
                >
                  🚗 {lang === "en" ? "Car (Petrol/Diesel)" : "कार"}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMode("bike")}
                  className={`py-1.5 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                    currentMode === "bike"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border"
                  }`}
                >
                  🛵 {lang === "en" ? "Two-Wheeler / Bike" : "बाइक / स्कूटी"}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-vm-text">
                  {lang === "en" ? "Daily One-Way Distance:" : "एक तरफ की दूरी:"}
                </label>
                <span className="font-extrabold text-vm-brand">{commuteDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                value={commuteDistanceKm}
                onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
                className="w-full accent-vm-brand cursor-pointer"
              />
            </div>

            {/* Impact Metric Output */}
            <div className="p-3.5 rounded-xl bg-vm-white border border-vm-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-vm-muted">
                  {lang === "en" ? "Annual CO₂ Reduction:" : "सालाना CO₂ बचत:"}
                </span>
                <span className="font-black text-vm-safe text-base">
                  ~{co2SavedPerYearKg} kg CO₂
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-vm-muted">
                  {lang === "en" ? "PM2.5 Lung Inhalation Cut:" : "PM2.5 सांस में जाने में कमी:"}
                </span>
                <span className="font-black text-vm-safe text-base">
                  -{exposureReductionPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario 2: Ventilation Window Shift */}
        <div className="p-5 rounded-2xl bg-vm-surface border border-vm-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-vm-text text-sm sm:text-base flex items-center gap-1.5">
              <span>🪟 ➔ 🌬️</span>
              <span>{lang === "en" ? "Shift Window Opening Time" : "खिड़की खोलने का समय बदलना"}</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold">
              {lang === "en" ? "Indoor Air" : "इनडोर हवा"}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="font-semibold text-vm-text block mb-1">
                {lang === "en" ? "Ventilation Timing:" : "खिड़की कब खोलें:"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVentilationChoice("safest")}
                  className={`py-1.5 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                    ventilationChoice === "safest"
                      ? "bg-vm-brand text-vm-white border-vm-brand shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border"
                  }`}
                >
                  🕒 {lang === "en" ? "Safest Window" : "सुरक्षित समय"}
                </button>
                <button
                  type="button"
                  onClick={() => setVentilationChoice("peak")}
                  className={`py-1.5 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
                    ventilationChoice === "peak"
                      ? "bg-rose-700 text-vm-white border-rose-700 shadow-2xs"
                      : "bg-vm-white text-vm-text border-vm-border"
                  }`}
                >
                  🚗 {lang === "en" ? "Peak Traffic (8-10 AM)" : "पीक ट्रैफिक समय"}
                </button>
              </div>
            </div>

            <p className="text-vm-muted text-xs">
              {lang === "en"
                ? `Current outdoor NAQI is ${currentAqi}. Opening windows at random hours pulls smog indoors.`
                : `वर्तमान बाहरी NAQI ${currentAqi} है। किसी भी समय खिड़की खोलने से स्मॉग अंदर आता है।`}
            </p>

            {/* Impact Metric Output */}
            <div className="p-3.5 rounded-xl bg-vm-white border border-vm-border shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-vm-muted">
                  {lang === "en" ? "Indoor PM2.5 Influx:" : "इनडोर PM2.5 फैलाव:"}
                </span>
                <span
                  className={`font-black text-base ${
                    ventilationChoice === "safest" ? "text-vm-safe" : "text-rose-600"
                  }`}
                >
                  {lang === "hi" ? indoorExposureShift.textHi : indoorExposureShift.textEn}
                </span>
              </div>
              <p className="text-[11px] text-vm-muted">
                {lang === "en"
                  ? `Recommended 15-min cross-ventilation window: ${safestWindowStr}`
                  : `अनुशंसित 15-मिनट वेंटिलेशन विंडो: ${safestWindowStr}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
