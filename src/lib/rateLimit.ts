/**
 * Lightweight in-memory sliding-window rate limiter.
 * Designed for serverless Next.js API routes (single-process).
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 30 });
 *   const { limited } = limiter.check(clientIp);
 *   if (limited) return NextResponse.json({ error: "..." }, { status: 429 });
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimiterConfig {
  /** Window duration in milliseconds */
  windowMs: number;
  /** Maximum requests allowed within the window */
  maxRequests: number;
}

export interface RateLimiter {
  /**
   * Check whether a key (e.g. client IP) is rate-limited.
   * Returns { limited: true, retryAfterMs } when the quota is exhausted.
   */
  check(key: string): { limited: boolean; retryAfterMs: number };

  /** Visible for testing — number of keys currently tracked */
  readonly size: number;

  /** Reset all tracked state (testing only) */
  reset(): void;
}

export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  const { windowMs, maxRequests } = config;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup every 2 minutes to prevent unbounded memory growth
  let cleanupTimer: ReturnType<typeof setInterval> | null = null;

  function startCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store) {
        entry.timestamps = entry.timestamps.filter(
          (ts) => now - ts < windowMs,
        );
        if (entry.timestamps.length === 0) {
          store.delete(key);
        }
      }
    }, 120_000);
    // Allow the process to exit without waiting for this timer
    if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
      cleanupTimer.unref();
    }
  }

  startCleanup();

  return {
    check(key: string): { limited: boolean; retryAfterMs: number } {
      const now = Date.now();
      let entry = store.get(key);

      if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
      }

      // Slide the window: drop timestamps older than windowMs
      entry.timestamps = entry.timestamps.filter(
        (ts) => now - ts < windowMs,
      );

      if (entry.timestamps.length >= maxRequests) {
        // Rate limited — compute when the oldest request in the window expires
        const oldestInWindow = entry.timestamps[0];
        const retryAfterMs = oldestInWindow + windowMs - now;
        return { limited: true, retryAfterMs: Math.max(retryAfterMs, 0) };
      }

      // Allow the request and record it
      entry.timestamps.push(now);
      return { limited: false, retryAfterMs: 0 };
    },

    get size() {
      return store.size;
    },

    reset() {
      store.clear();
    },
  };
}

// ── Singleton limiters for API routes ──

/** /api/aqi — 30 requests/min per IP */
export const aqiRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 30,
});

/** /api/advise — 12 requests/min per IP */
export const adviseRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 12,
});

/** Extract a client IP from a Next.js request */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  // Standard proxy headers (Vercel, Cloudflare, nginx)
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
