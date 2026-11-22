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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-vm-safe to-vm-brand flex items-center justify-center text-white text-lg shadow-md font-extrabold tracking-tight">
            वा
          </div>
          <div>
            <h1
              className={`font-black tracking-tight text-vm-white ${
                seniorMode ? "text-2xl" : "text-lg sm:text-xl"
              }`}
            >
              {t.appTitle}
            </h1>
            <p
              className={`text-vm-border/90 font-medium ${
                seniorMode ? "text-base" : "text-xs"
              }`}
            >
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          {/* Senior Mode Toggle with Clean Eye SVG */}
          <button
            type="button"
            onClick={onToggleSeniorMode}
            aria-pressed={seniorMode}
            className={`px-3 py-2 rounded-xl border font-bold transition-all flex items-center gap-2 cursor-pointer ${
              seniorMode
                ? "bg-amber-100 border-vm-accent text-amber-950 ring-2 ring-vm-accent shadow-sm"
                : "bg-vm-brand/60 hover:bg-vm-brand border-vm-brand text-vm-white text-xs sm:text-sm"
            }`}
            title="Toggle Senior-Friendly High-Contrast Large Text Mode"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="hidden sm:inline">{t.seniorMode}</span>
            <span className="sm:hidden">{lang === "hi" ? "बड़ा टेक्स्ट" : "Large Text"}</span>
          </button>

          {/* Language Toggle with Clean Globe SVG */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3.5 py-2 rounded-xl bg-vm-accent hover:brightness-110 active:scale-95 text-vm-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span>{t.langToggle}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
