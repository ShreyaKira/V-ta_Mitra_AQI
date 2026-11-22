/**
 * GET /api/aqi?city=...
 * Fetches live air quality, computes CPCB NAQI, safest window,
 * and optionally returns a 5-city comparison strip.
 * Protected by sliding-window rate limiter (30 req/min per IP).
 */
import { NextRequest, NextResponse } from "next/server";
import {
  fetchLiveIndiaAirQuality,
  AirQualityError,
  type LiveAirQualityResult,
  type HourlyForecastPoint,
} from "@/lib/aqi";
import { aqiRateLimiter, getClientIp } from "@/lib/rateLimit";

export interface SafestWindow {
  startTime: string;
  endTime: string;
  avgUsAqi: number;
  recommendation: string;
  recommendationHi: string;
}

export interface AqiApiResponse {
  data: LiveAirQualityResult;
  safestWindow: SafestWindow | null;
  cityComparison?: {
    city: string;
    naqi: number;
    categoryEn: string;
    categoryHi: string;
  }[];
}

/**
 * Find the safest 2-hour outdoor/ventilation window
 * from the 24h hourly forecast.
 */
function findSafestWindow(
  forecast: HourlyForecastPoint[],
): SafestWindow | null {
  if (forecast.length < 2) return null;

  let bestStart = 0;
  let bestAvg = Infinity;

  for (let i = 0; i <= forecast.length - 2; i++) {
    const a = forecast[i].usAqi;
    const b = forecast[i + 1].usAqi;
    if (a === null || b === null) continue;
    const avg = (a + b) / 2;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestStart = i;
    }
  }

  if (bestAvg === Infinity) return null;

  const startTime = forecast[bestStart].time;
  const endIdx = Math.min(bestStart + 1, forecast.length - 1);
  const endTime = forecast[endIdx].time;

  const startHour = new Date(startTime).getHours();
  const period =
    startHour < 6
      ? "early morning"
      : startHour < 12
        ? "morning"
        : startHour < 17
          ? "afternoon"
          : "evening";
  const periodHi =
    startHour < 6
      ? "तड़के सुबह"
      : startHour < 12
        ? "सुबह"
        : startHour < 17
          ? "दोपहर"
          : "शाम";

  const recommendation =
    bestAvg <= 50
      ? `Great time for outdoor activity in the ${period} (AQI ~${Math.round(bestAvg)}). Open windows for ventilation.`
      : bestAvg <= 100
        ? `Decent window in the ${period} (AQI ~${Math.round(bestAvg)}). Short outdoor activities OK.`
        : `Best available in the ${period} (AQI ~${Math.round(bestAvg)}), but still elevated. Limit outdoor time.`;

  const recommendationHi =
    bestAvg <= 50
      ? `${periodHi} में बाहरी गतिविधि के लिए बढ़िया समय (AQI ~${Math.round(bestAvg)})। वेंटिलेशन के लिए खिड़कियां खोलें।`
      : bestAvg <= 100
        ? `${periodHi} में अच्छी खिड़की (AQI ~${Math.round(bestAvg)})। छोटी बाहरी गतिविधियां ठीक हैं।`
        : `${periodHi} में सबसे अच्छा उपलब्ध (AQI ~${Math.round(bestAvg)}), लेकिन अभी भी ऊंचा। बाहरी समय सीमित करें।`;

  return {
    startTime,
    endTime,
    avgUsAqi: Math.round(bestAvg),
    recommendation,
    recommendationHi,
  };
}

const BENCHMARK_CITIES = ["Delhi", "Pune", "Mumbai", "Bengaluru", "Kolkata"];

export async function GET(request: NextRequest) {
  // ── Rate Limiting ──
  const clientIp = getClientIp(request);
  const { limited, retryAfterMs } = aqiRateLimiter.check(clientIp);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        },
      },
    );
  }

  const city = request.nextUrl.searchParams.get("city");
  const includeComparison =
    request.nextUrl.searchParams.get("compare") !== "false";

  if (!city) {
    return NextResponse.json(
      { error: "Missing required query parameter: city" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchLiveIndiaAirQuality(city);
    const safestWindow = findSafestWindow(data.hourlyForecast);

    const response: AqiApiResponse = { data, safestWindow };

    if (includeComparison) {
      try {
        const comparisons = await Promise.allSettled(
          BENCHMARK_CITIES.map((c) => fetchLiveIndiaAirQuality(c)),
        );
        response.cityComparison = comparisons
          .filter(
            (r): r is PromiseFulfilledResult<LiveAirQualityResult> =>
              r.status === "fulfilled",
          )
          .map((r) => ({
            city: r.value.city,
            naqi: r.value.cpcb.naqi,
            categoryEn: r.value.cpcb.categoryEn,
            categoryHi: r.value.cpcb.categoryHi,
          }));
      } catch {
        // Non-critical — skip comparison strip
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof AirQualityError) {
      const status =
        err.code === "INVALID_INPUT"
          ? 400
          : err.code === "TIMEOUT"
            ? 504
            : 502;
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status },
      );
    }
    // Never leak stack traces
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
