"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { CitySelector } from "@/components/CitySelector";
import { AqiHeroCard } from "@/components/AqiHeroCard";
import { HouseholdBuilder } from "@/components/HouseholdBuilder";
import { AdviceCards } from "@/components/AdviceCards";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { EsgFactCard } from "@/components/EsgFactCard";
import { FollowUpChat } from "@/components/FollowUpChat";
import { type LiveAirQualityResult } from "@/lib/aqi";
import { type AqiApiResponse, type SafestWindow } from "@/app/api/aqi/route";
import {
  type HouseholdMember,
  type AdviseResponse,
} from "@/lib/adviseFallback";
import { type Lang, UI_TEXT } from "@/data/i18n";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [seniorMode, setSeniorMode] = useState(false);
  const [city, setCity] = useState("Delhi");

  // AQI Data state
  const [aqiLoading, setAqiLoading] = useState(false);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const [aqiData, setAqiData] = useState<LiveAirQualityResult | null>(null);
  const [safestWindow, setSafestWindow] = useState<SafestWindow | null>(null);
  const [cityComparison, setCityComparison] = useState<
    AqiApiResponse["cityComparison"]
  >([]);

  // Household builder state
  const [budgetTier, setBudgetTier] = useState<"low_cost" | "purifier_owner">(
    "low_cost"
  );
  const [members, setMembers] = useState<HouseholdMember[]>([
    { id: "mem-1", role: "commuter", mustGoOut: true, commuteMode: "car" },
    { id: "mem-2", role: "child", mustGoOut: true, commuteMode: "bus" },
    { id: "mem-3", role: "senior", mustGoOut: false, commuteMode: "cycle" },
  ]);

  // Advice state
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [adviceData, setAdviceData] = useState<AdviseResponse | null>(null);

  const t = UI_TEXT[lang];

  // Fetch AQI for a given city
  const fetchCityAqi = useCallback(async (targetCity: string) => {
    setAqiLoading(true);
    setAqiError(null);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(targetCity)}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to fetch air quality");
      }
      const data: AqiApiResponse = await res.json();
      setAqiData(data.data);
      setSafestWindow(data.safestWindow);
      if (data.cityComparison) {
        setCityComparison(data.cityComparison);
      }
      setCity(targetCity);
    } catch (err: unknown) {
      setAqiError(
        err instanceof Error ? err.message : "Error fetching air quality"
      );
    } finally {
      setAqiLoading(false);
    }
  }, []);

  // Fetch initial city on mount
  useEffect(() => {
    fetchCityAqi("Delhi");
  }, [fetchCityAqi]);

  // Handle Household Member modifications
  const handleAddMember = () => {
    if (members.length >= 3) return;
    const newId = `mem-${Date.now()}`;
    const nextRole: HouseholdMember["role"] =
      members.length === 1 ? "child" : "senior";
    setMembers((prev) => [
      ...prev,
      { id: newId, role: nextRole, mustGoOut: false, commuteMode: "metro" },
    ]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMember = (
    id: string,
    updates: Partial<HouseholdMember>
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Submit household plan for AI advice
  const handleGenerateAdvice = async () => {
    if (!city) return;
    setAdviceLoading(true);
    setAdviceError(null);

    try {
      const res = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          language: lang,
          budgetTier,
          members,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to generate advice");
      }

      const data: AdviseResponse = await res.json();
      setAdviceData(data);
    } catch (err: unknown) {
      setAdviceError(
        err instanceof Error ? err.message : "Error generating advice"
      );
    } finally {
      setAdviceLoading(false);
    }
  };

  // Follow-up question handler
  const handleAskFollowUp = async (
    question: string
  ): Promise<string | null> => {
    try {
      const res = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          language: lang,
          budgetTier,
          members,
          followUpQuestion: question,
        }),
      });

      if (!res.ok) return null;
      const data: AdviseResponse = await res.json();
      return data.followUpAnswer || null;
    } catch {
      return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-vm-page text-vm-text ${
        seniorMode ? "text-lg" : "text-base"
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === "en" ? "hi" : "en"))}
        seniorMode={seniorMode}
        onToggleSeniorMode={() => setSeniorMode((prev) => !prev)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Selector */}
        <CitySelector
          currentCity={city}
          onSelectCity={fetchCityAqi}
          isLoading={aqiLoading}
          lang={lang}
          seniorMode={seniorMode}
        />

        {/* AQI Error Banner */}
        {aqiError && (
          <div className="bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-2xl p-4 font-bold flex items-center justify-between">
            <span>⚠️ {aqiError}</span>
            <button
              type="button"
              onClick={() => fetchCityAqi(city)}
              className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live AQI Hero Card */}
        {aqiData && (
          <AqiHeroCard
            aqiData={aqiData}
            safestWindow={safestWindow}
            cityComparison={cityComparison}
            lang={lang}
            seniorMode={seniorMode}
          />
        )}

        {/* Daily Green Fact */}
        <EsgFactCard lang={lang} seniorMode={seniorMode} />

        {/* Household Action Builder */}
        <HouseholdBuilder
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onUpdateMember={handleUpdateMember}
          budgetTier={budgetTier}
          onUpdateBudgetTier={setBudgetTier}
          onSubmit={handleGenerateAdvice}
          isLoading={adviceLoading}
          lang={lang}
          seniorMode={seniorMode}
        />

        {/* Advice Error Banner */}
        {adviceError && (
          <div className="bg-amber-50 border-2 border-vm-accent text-amber-950 rounded-2xl p-4 font-bold">
            ⚠️ {adviceError}
          </div>
        )}

        {/* Generated Advice Action Cards */}
        {adviceData && (
          <AdviceCards
            adviceData={adviceData}
            lang={lang}
            seniorMode={seniorMode}
          />
        )}

        {/* Interactive What-If Simulator */}
        {aqiData && (
          <WhatIfSimulator
            currentAqi={aqiData.cpcb.naqi}
            safestWindowStr={
              safestWindow
                ? `${new Date(safestWindow.startTime).toLocaleTimeString(
                    lang === "en" ? "en-IN" : "hi-IN",
                    { hour: "2-digit", minute: "2-digit", hour12: true }
                  )} – ${new Date(safestWindow.endTime).toLocaleTimeString(
                    lang === "en" ? "en-IN" : "hi-IN",
                    { hour: "2-digit", minute: "2-digit", hour12: true }
                  )}`
                : "3:00 PM – 5:00 PM"
            }
            lang={lang}
            seniorMode={seniorMode}
          />
        )}

        {/* Conversational Follow-Up Q&A Box */}
        <FollowUpChat
          onAsk={handleAskFollowUp}
          initialAnswer={adviceData?.followUpAnswer}
          lang={lang}
          seniorMode={seniorMode}
        />
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-vm-border bg-vm-white py-6 mt-12 text-center text-xs text-vm-muted space-y-1">
        <p className="font-semibold text-vm-brand">
          Vata Mitra (वाता मित्र) • Generative AI Urban Air Quality Assistant
        </p>
        <p>
          Built for Hack2skill PromptWars (Challenge 6) • Official CPCB National Air Quality Index Formula • Open-Meteo CAMS Air Quality
        </p>
      </footer>
    </div>
  );
}
