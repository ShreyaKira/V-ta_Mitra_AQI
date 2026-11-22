"use client";

import React from "react";
import { type HouseholdMember } from "@/lib/adviseFallback";
import { type Lang, UI_TEXT } from "@/data/i18n";

interface HouseholdBuilderProps {
  members: HouseholdMember[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onUpdateMember: (id: string, updates: Partial<HouseholdMember>) => void;
  hasPurifier: boolean;
  onUpdateHasPurifier: (val: boolean) => void;
  hasPlants: boolean;
  onUpdateHasPlants: (val: boolean) => void;
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
  hasPurifier,
  onUpdateHasPurifier,
  hasPlants,
  onUpdateHasPlants,
  onSubmit,
  isLoading,
  lang,
  seniorMode,
}) => {
  const t = UI_TEXT[lang];

  return (
    <section className="bg-vm-white rounded-3xl p-5 sm:p-7 shadow-md border border-vm-border space-y-6">
      {/* Header */}
      <div className="border-b border-vm-border/60 pb-4">
        <h2
          className={`font-black text-vm-text ${
            seniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {t.householdTitle}
        </h2>
        <p
          className={`text-vm-muted font-medium mt-0.5 ${
            seniorMode ? "text-base" : "text-xs sm:text-sm"
          }`}
        >
          {t.householdSubtitle}
        </p>
      </div>

      {/* Polite Home Setup Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-vm-surface border border-vm-border">
        {/* Air Purifier Question */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-vm-text block">
            {t.purifierQuestion}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateHasPurifier(true)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                hasPurifier
                  ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                  : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
              }`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => onUpdateHasPurifier(false)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                !hasPurifier
                  ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                  : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {/* Plants & Garden Question */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-vm-text block">
            {t.plantsQuestion}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateHasPlants(true)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                hasPlants
                  ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                  : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
              }`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => onUpdateHasPlants(false)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                !hasPlants
                  ? "bg-vm-brand border-vm-brand text-vm-white shadow-2xs"
                  : "bg-vm-white border-vm-border text-vm-text hover:bg-vm-surface"
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>
      </div>

      {/* Household Members Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map((m, idx) => (
          <div
            key={m.id}
            className="p-4 sm:p-5 rounded-2xl bg-vm-surface border border-vm-border shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              {/* Member Card Title & Remove */}
              <div className="flex items-center justify-between border-b border-vm-border/50 pb-2.5">
                <span className="font-black text-sm text-vm-brand-deep flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-vm-brand text-vm-white flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  <span>{m.name || `Person ${idx + 1}`}</span>
                </span>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveMember(m.id)}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
                  >
                    ✕ {t.removeMember}
                  </button>
                )}
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.memberName}
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={m.name || ""}
                  onChange={(e) => onUpdateMember(m.id, { name: e.target.value })}
                  placeholder={lang === "hi" ? "उदा. श्रेया" : "e.g. Shreya"}
                  className="w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white text-sm font-semibold text-vm-text focus:ring-2 focus:ring-vm-accent"
                />
              </div>

              {/* Age Group */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.ageGroup}
                </label>
                <select
                  value={m.ageGroup || "adult"}
                  onChange={(e) =>
                    onUpdateMember(m.id, {
                      ageGroup: e.target.value as HouseholdMember["ageGroup"],
                      role: e.target.value as string,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white text-sm font-semibold text-vm-text focus:ring-2 focus:ring-vm-accent"
                >
                  <option value="adult">{t.ageAdult}</option>
                  <option value="child">{t.ageChild}</option>
                  <option value="senior">{t.ageSenior}</option>
                </select>
              </div>

              {/* Activity / Schedule */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.activityLabel}
                </label>
                <select
                  value={m.activity || "office_college"}
                  onChange={(e) =>
                    onUpdateMember(m.id, {
                      activity: e.target.value as HouseholdMember["activity"],
                      mustGoOut: e.target.value !== "mostly_indoors",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white text-sm font-semibold text-vm-text focus:ring-2 focus:ring-vm-accent"
                >
                  <option value="office_college">{t.actOfficeCollege}</option>
                  <option value="outdoor_active">{t.actOutdoorActive}</option>
                  <option value="mostly_indoors">{t.actMostlyIndoors}</option>
                </select>
              </div>

              {/* Leave and Return Times */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-vm-muted truncate block">
                    {t.leaveTime}
                  </label>
                  <input
                    type="time"
                    value={m.leaveTime || "09:00"}
                    onChange={(e) => onUpdateMember(m.id, { leaveTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-vm-border bg-vm-white text-xs sm:text-sm font-semibold text-vm-text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-vm-muted truncate block">
                    {t.returnTime}
                  </label>
                  <input
                    type="time"
                    value={m.returnTime || "18:30"}
                    onChange={(e) => onUpdateMember(m.id, { returnTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-vm-border bg-vm-white text-xs sm:text-sm font-semibold text-vm-text"
                  />
                </div>
              </div>

              {/* Commute Mode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-vm-muted">
                  {t.commuteMode}
                </label>
                <select
                  value={m.commuteMode || "two_wheeler"}
                  onChange={(e) => onUpdateMember(m.id, { commuteMode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-vm-border bg-vm-white text-sm font-semibold text-vm-text focus:ring-2 focus:ring-vm-accent"
                >
                  <option value="two_wheeler">{t.modeTwoWheeler}</option>
                  <option value="car">{t.modeCarCab}</option>
                  <option value="metro">{t.modePublicTransit}</option>
                  <option value="cycle">{t.modeWalkCycle}</option>
                  <option value="none">{t.modeNone}</option>
                </select>
              </div>

              {/* Areas (Optional) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  maxLength={40}
                  value={m.homeArea || ""}
                  onChange={(e) => onUpdateMember(m.id, { homeArea: e.target.value })}
                  placeholder={t.homeArea}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-vm-border bg-vm-white text-xs font-medium text-vm-text"
                />
                <input
                  type="text"
                  maxLength={40}
                  value={m.workSchoolArea || ""}
                  onChange={(e) => onUpdateMember(m.id, { workSchoolArea: e.target.value })}
                  placeholder={t.workArea}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-vm-border bg-vm-white text-xs font-medium text-vm-text"
                />
              </div>

              {/* Health Flags (Checkboxes) */}
              <div className="pt-2 border-t border-vm-border/50 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-vm-text">
                  <input
                    type="checkbox"
                    checked={Boolean(m.hasAsthmaOrSensitivity)}
                    onChange={(e) =>
                      onUpdateMember(m.id, { hasAsthmaOrSensitivity: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-vm-brand accent-vm-brand"
                  />
                  <span>{t.asthmaFlag}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-vm-text">
                  <input
                    type="checkbox"
                    checked={Boolean(m.isSmoker)}
                    onChange={(e) =>
                      onUpdateMember(m.id, { isSmoker: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-vm-brand accent-vm-brand"
                  />
                  <span>{t.smokerFlag}</span>
                </label>
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
            className={`px-4 py-2.5 rounded-2xl border border-dashed border-vm-brand hover:bg-vm-surface text-vm-brand font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              seniorMode ? "text-base" : "text-xs sm:text-sm"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{t.addMember}</span>
          </button>
        ) : (
          <span className="text-xs font-bold text-vm-muted">
            {lang === "en" ? "Max 3 family members configured" : "अधिकतम 3 सदस्य सीमा पूरी हुई"}
          </span>
        )}

        {/* CTA Button in Warm Saffron Amber */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`px-8 py-3.5 rounded-2xl bg-vm-accent hover:brightness-110 active:scale-95 disabled:opacity-50 text-vm-white font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
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
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.getAdvice}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
