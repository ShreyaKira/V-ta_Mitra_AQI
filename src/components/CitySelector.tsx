"use client";

import React, { useState } from "react";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface CitySelectorProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  isLoading: boolean;
  lang: Lang;
  seniorMode: boolean;
}

const PRESET_CITIES = [
  { name: "Delhi", label: "Delhi-NCR", labelHi: "दिल्ली-NCR" },
  { name: "Durg", label: "Durg / Bhilai", labelHi: "दुर्ग / भिलाई" },
  { name: "Raipur", label: "Raipur", labelHi: "रायपुर" },
  { name: "Pune", label: "Pune", labelHi: "पुणे" },
  { name: "Mumbai", label: "Mumbai", labelHi: "मुंबई" },
  { name: "Bengaluru", label: "Bengaluru", labelHi: "बेंगलुरु" },
  { name: "Kolkata", label: "Kolkata", labelHi: "कोलकाता" },
];

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  onSelectCity,
  isLoading,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];
  const [inputVal, setInputVal] = useState("");
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      setGeoError(null);
      onSelectCity(trimmed);
      setInputVal("");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(
        lang === "en"
          ? "Geolocation is not supported by your browser."
          : "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।"
      );
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onSelectCity(`${latitude.toFixed(4)},${longitude.toFixed(4)}`);
        setGeoLocating(false);
      },
      () => {
        setGeoLocating(false);
        setGeoError(
          lang === "en"
            ? "Location access denied. Please type your city or town name above."
            : "स्थान अनुमति अस्वीकृत। कृपया ऊपर अपने शहर या कस्बे का नाम दर्ज करें।"
        );
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  return (
    <section className="bg-vm-white rounded-3xl p-4 sm:p-6 shadow-sm border border-vm-border">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.citySearchPlaceholder}
            disabled={isLoading || geoLocating}
            className={`w-full px-4 py-2.5 rounded-2xl border border-vm-border focus:outline-hidden focus:ring-2 focus:ring-vm-accent focus:border-vm-accent bg-vm-surface text-vm-text transition-all placeholder:text-vm-muted ${
              seniorMode ? "text-lg" : "text-sm sm:text-base"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || geoLocating || !inputVal.trim()}
          className={`px-6 py-2.5 rounded-2xl bg-vm-accent hover:brightness-110 active:scale-95 disabled:opacity-50 text-vm-white font-extrabold transition-all shadow-xs cursor-pointer ${
            seniorMode ? "text-lg" : "text-sm sm:text-base"
          }`}
        >
          {isLoading ? t.loading : lang === "en" ? "Search Area" : "खोजें"}
        </button>

        <button
          type="button"
          onClick={handleUseLocation}
          disabled={isLoading || geoLocating}
          className={`px-4 py-2.5 rounded-2xl border border-vm-border hover:bg-vm-surface disabled:opacity-50 text-vm-brand font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            seniorMode ? "text-base" : "text-xs sm:text-sm"
          }`}
          title="Detect my live GPS location"
        >
          <svg
            className={`w-4 h-4 shrink-0 ${geoLocating ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{geoLocating ? t.loading : t.useMyLocation}</span>
        </button>
      </form>

      {geoError && (
        <p className="mt-2 text-xs sm:text-sm text-rose-700 font-semibold">
          {geoError}
        </p>
      )}

      {/* Preset Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`font-bold text-vm-muted mr-1 ${
            seniorMode ? "text-base" : "text-xs sm:text-sm"
          }`}
        >
          {t.quickCities}
        </span>
        {PRESET_CITIES.map((c) => {
          const isSelected =
            currentCity.toLowerCase().includes(c.name.toLowerCase());
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectCity(c.name)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                seniorMode ? "text-base" : "text-xs sm:text-sm"
              } ${
                isSelected
                  ? "bg-vm-brand border-vm-brand text-vm-white shadow-xs scale-105"
                  : "bg-vm-surface hover:bg-vm-border/50 border-vm-border text-vm-text"
              }`}
            >
              {lang === "hi" ? c.labelHi : c.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
