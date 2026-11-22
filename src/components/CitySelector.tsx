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
  { name: "Pune", label: "Pune", labelHi: "पुणे" },
  { name: "Mumbai", label: "Mumbai", labelHi: "मुंबई" },
  { name: "Bengaluru", label: "Bengaluru", labelHi: "बेंगलुरु" },
  { name: "Kolkata", label: "Kolkata", labelHi: "कोलकाता" },
  { name: "Noida", label: "Noida", labelHi: "नोएडा" },
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
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          let chosen = "Delhi";
          let minDistance = Infinity;

          const presets = [
            { name: "Delhi", lat: 28.6139, lon: 77.209 },
            { name: "Pune", lat: 18.5204, lon: 73.8567 },
            { name: "Mumbai", lat: 19.076, lon: 72.8777 },
            { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
            { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
            { name: "Noida", lat: 28.5355, lon: 77.391 },
          ];

          for (const p of presets) {
            const d = Math.hypot(p.lat - latitude, p.lon - longitude);
            if (d < minDistance) {
              minDistance = d;
              chosen = p.name;
            }
          }

          onSelectCity(chosen);
        } catch {
          setGeoError(
            lang === "en"
              ? "Could not resolve your location. Please select a city manually."
              : "स्थान प्राप्त नहीं हो सका। कृपया मैन्युअल रूप से शहर चुनें।"
          );
        } finally {
          setGeoLocating(false);
        }
      },
      () => {
        setGeoLocating(false);
        setGeoError(
          lang === "en"
            ? "Location permission denied or unavailable."
            : "स्थान अनुमति अस्वीकृत या अनुपलब्ध है।"
        );
      },
      { timeout: 8000 }
    );
  };

  return (
    <section className="bg-vm-white rounded-2xl p-4 sm:p-6 shadow-sm border border-vm-border">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.citySearchPlaceholder}
            disabled={isLoading || geoLocating}
            className={`w-full px-4 py-2.5 rounded-xl border border-vm-border focus:outline-hidden focus:ring-2 focus:ring-vm-accent focus:border-vm-accent bg-vm-surface text-vm-text transition-all placeholder:text-vm-muted ${
              seniorMode ? "text-lg" : "text-sm sm:text-base"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || geoLocating || !inputVal.trim()}
          className={`px-5 py-2.5 rounded-xl bg-vm-accent hover:brightness-110 disabled:opacity-50 text-vm-white font-semibold transition-all shadow-xs cursor-pointer ${
            seniorMode ? "text-lg" : "text-sm sm:text-base"
          }`}
        >
          {isLoading ? t.loading : lang === "en" ? "Search" : "खोजें"}
        </button>

        <button
          type="button"
          onClick={handleUseLocation}
          disabled={isLoading || geoLocating}
          className={`px-4 py-2.5 rounded-xl border border-vm-border hover:bg-vm-surface disabled:opacity-50 text-vm-text font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            seniorMode ? "text-base" : "text-xs sm:text-sm"
          }`}
        >
          {geoLocating ? (
            <span className="inline-block animate-spin">⏳</span>
          ) : (
            <span>📍</span>
          )}
          <span>{t.useMyLocation}</span>
        </button>
      </form>

      {geoError && (
        <p className="mt-2 text-xs sm:text-sm text-red-600 font-medium">
          {geoError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`font-semibold text-vm-muted mr-1 ${
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
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
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
