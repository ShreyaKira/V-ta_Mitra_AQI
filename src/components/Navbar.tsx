"use client";

import React from "react";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  seniorMode,
  onToggleSeniorMode,
}) => {
  const t = UI_TEXT[lang];

  return (
    <header className="sticky top-0 z-30 border-b border-vm-border bg-vm-brand-deep shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-vm-safe to-vm-brand flex items-center justify-center text-white text-xl shadow-md font-bold">
            वा
          </div>
          <div>
            <h1
              className={`font-extrabold tracking-tight text-vm-white ${
                seniorMode ? "text-2xl" : "text-xl sm:text-2xl"
              }`}
            >
              {t.appTitle}
            </h1>
            <p
              className={`text-vm-border font-medium ${
                seniorMode ? "text-base" : "text-xs sm:text-sm"
              }`}
            >
              {t.appSubtitle} • Hack2skill PromptWars
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Senior Mode Toggle */}
          <button
            type="button"
            onClick={onToggleSeniorMode}
            aria-pressed={seniorMode}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              seniorMode
                ? "bg-amber-100 border-vm-accent text-amber-950 ring-2 ring-vm-accent shadow-sm text-base"
                : "bg-vm-brand/40 hover:bg-vm-brand/60 border-vm-brand text-vm-white/90 text-xs sm:text-sm"
            }`}
            title="Toggle Senior-Friendly High-Contrast Large Text"
          >
            <span aria-hidden="true" className="text-base">
              👁️
            </span>
            <span>{t.seniorMode}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3.5 py-1.5 rounded-lg bg-vm-accent hover:brightness-110 active:scale-95 text-vm-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <span aria-hidden="true">🌐</span>
            <span>{t.langToggle}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
