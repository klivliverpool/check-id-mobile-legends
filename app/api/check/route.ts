import { NextRequest, NextResponse } from "next/server";
import { checkPlayer } from "@/lib/mlbb/provider";
import { validatePlayerInput } from "@/lib/validation";
import { MLBBProviderError } from "@/lib/mlbb/types";

export const runtime = "nodejs";

/**
 * Very small in-memory cache + rate limiter.
 *
 * Limitation (documented, not hidden): this runs per serverless
 * instance. On Vercel/Netlify, concurrent/cold-started instances do
 * NOT share this Map, so it is best-effort protection against a single
 * hot instance being hammered — not a real distributed rate limiter.
 * For real abuse protection at scale, put this behind something like
 * Vercel's Edge Config / Upstash Redis / Cloudflare rate limiting.
 */
const CACHE_TTL_MS = 60_000;
const RATE_WINDOW_MS = 10_000;
const RATE_MAX_REQUESTS = 5;

const cache = new Map<string, { data: unknown; expires: number }>();
const rateBuckets = new Map<string, number[]>();

function getClientKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (rateBuckets.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  hits.push(now);
  rateBuckets.set(key, hits);
  return hits.length > RATE_MAX_REQUESTS;
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export async function GET(req: NextRequest) {
  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many requests. Please wait a moment before trying again.",
      429
    );
  }

  const { searchParams } = new URL(req.url);
  const check = validatePlayerInput(
    searchParams.get("userId"),
    searchParams.get("zoneId")
  );

  if (!check.valid || !check.userId || !check.zoneId) {
    return errorResponse(
      "INVALID_INPUT",
      check.error ?? "Invalid input.",
      400
    );
  }

  const cacheKey = `${check.userId}:${check.zoneId}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ success: true, player: cached.data });
  }

  try {
    const player = await checkPlayer({
      userId: check.userId,
      zoneId: check.zoneId,
    });
    cache.set(cacheKey, { data: player, expires: Date.now() + CACHE_TTL_MS });
    return NextResponse.json({ success: true, player });
  } catch (err) {
    if (err instanceof MLBBProviderError) {
      const statusByCode: Record<string, number> = {
        PLAYER_NOT_FOUND: 404,
        REQUEST_TIMEOUT: 504,
        RATE_LIMITED: 429,
        PROVIDER_UNAVAILABLE: 503,
        CONFIG_ERROR: 500,
        INVALID_INPUT: 400,
        UNKNOWN_ERROR: 502,
      };
      return errorResponse(
        err.code,
        err.message,
        statusByCode[err.code] ?? 500
      );
    }
    // Never leak internal error details to the client.
    return errorResponse(
      "UNKNOWN_ERROR",
      "Something went wrong while checking this player.",
      500
    );
  }
}
