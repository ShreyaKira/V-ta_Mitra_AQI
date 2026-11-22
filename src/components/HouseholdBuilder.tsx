"use client";

import React from "react";
import { type HouseholdMember } from "@/lib/adviseFallback";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface HouseholdBuilderProps {
  members: HouseholdMember[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onUpdateMember: (id: string, updates: Partial<HouseholdMember>) => void;
  budgetTier: "low_cost" | "purifier_owner";
  onUpdateBudgetTier: (tier: "low_cost" | "purifier_owner") => void;
  onSubmit: () => void;
  isLoading: boolean;
  lang: Lang;
  seniorMode: boolean;
}

export const HouseholdBuilder: React.FC<HouseholdBuilderProps> = ({
  members,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  budgetTier,
  onUpdateBudgetTier,
  onSubmit,
  isLoading,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];

  return (
    <section className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border space-y-6">
      {/* Header & Budget Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-vm-border/60 pb-4">
        <div>
          <h2
            className={`font-black text-vm-text ${
              seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            👨‍👩‍👧‍👦 {t.householdTitle}
          </h2>
          <p
            className={`text-vm-muted font-medium mt-0.5 ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            {lang === "en"
              ? "Tailor schedules, routes, and room hacks per family member"
              : "परिवार के प्रत्येक सदस्य के अनुसार दिनचर्या, मार्ग और इनडोर टिप्स कस्टमाइज़ करें"}
          </p>
        </div>

        {/* Budget Tier Toggle */}
        <div className="flex flex-col gap-1">
          <label
            className={`font-bold text-vm-text ${
              seniorMode ? "text-base" : "text-xs uppercase tracking-wider text-vm-muted"
            }`}
          >
            {t.budgetTier}:
          </label>
          <div className="flex items-center gap-1.5 p-1 bg-vm-surface rounded-xl border border-vm-border">
            <button
              type="button"
              onClick={() => onUpdateBudgetTier("low_cost")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                budgetTier === "low_cost"
                  ? "bg-vm-brand text-vm-white shadow-xs"
                  : "text-vm-muted hover:text-vm-text"
              }`}
            >
              🌱 {t.budgetLow}
            </button>
            <button
              type="button"
              onClick={() => onUpdateBudgetTier("purifier_owner")}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                budgetTier === "purifier_owner"
                  ? "bg-vm-brand text-vm-white shadow-xs"
                  : "text-vm-muted hover:text-vm-text"
              }`}
            >
              ⚡ {t.budgetPurifier}
            </button>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map((m, idx) => (
          <div
            key={m.id}
            className="p-4 sm:p-5 rounded-2xl bg-vm-surface border border-vm-border shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-vm-text flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-vm-brand text-vm-white flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <span>
                    {m.role === "commuter"
                      ? t.roleCommuter
                      : m.role === "child"
                      ? t.roleChild
                      : m.role === "senior"
                      ? t.roleSenior
                      : t.roleStudent}
                  </span>
                </span>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(m.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                  >
                    ✕ {t.removeMember}
                  </button>
                )}
              </div>

              {/* Role Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.memberRole}
                </label>
                <select
                  value={m.role}
                  onChange={(e) =>
                    onUpdateMember(m.id, {
                      role: e.target.value as HouseholdMember["role"],
                    })
                  }
                  className={`w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white font-medium text-vm-text focus:ring-2 focus:ring-vm-accent ${
                    seniorMode ? "text-base" : "text-xs sm:text-sm"
                  }`}
                >
                  <option value="commuter">{t.roleCommuter}</option>
                  <option value="child">{t.roleChild}</option>
                  <option value="senior">{t.roleSenior}</option>
                  <option value="student">{t.roleStudent}</option>
                </select>
              </div>

              {/* Must Go Out Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.mustGoOut}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateMember(m.id, { mustGoOut: true })}
                    className={`py-1.5 px-3 rounded-lg border font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                      m.mustGoOut
                        ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                        : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
                    }`}
                  >
                    {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateMember(m.id, { mustGoOut: false })}
                    className={`py-1.5 px-3 rounded-lg border font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                      !m.mustGoOut
                        ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                        : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
                    }`}
                  >
                    {t.no}
                  </button>
                </div>
              </div>

              {/* Commute Mode Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.commuteMode}
                </label>
                <select
                  value={m.commuteMode}
                  onChange={(e) =>
                    onUpdateMember(m.id, { commuteMode: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white font-medium text-vm-text focus:ring-2 focus:ring-vm-accent ${
                    seniorMode ? "text-base" : "text-xs sm:text-sm"
                  }`}
                >
                  <option value="metro">{t.modeMetro}</option>
                  <option value="bus">{t.modeBus}</option>
                  <option value="car">{t.modeCar}</option>
                  <option value="cycle">{t.modeCycle}</option>
                  <option value="wfh">{t.modeWfh}</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {members.length < 3 ? (
          <button
            type="button"
            onClick={onAddMember}
            className={`px-4 py-2 rounded-xl border border-dashed border-vm-brand hover:bg-vm-surface text-vm-brand font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            <span>➕</span>
            <span>{t.addMember} (Max 3)</span>
          </button>
        ) : (
          <span className="text-xs font-semibold text-vm-muted">
            {lang === "en"
              ? "Max 3 members per household reached"
              : "अधिकतम 3 सदस्य सीमा पूरी हुई"}
          </span>
        )}

        {/* CTA Button in Warm Saffron Amber with White Text */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`px-7 py-3 rounded-xl bg-vm-accent hover:brightness-110 active:scale-95 disabled:opacity-50 text-vm-white font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            seniorMode ? "text-xl" : "text-base sm:text-lg"
          }`}
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin">⏳</span>
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <span>🌿</span>
              <span>{t.getAdvice}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
