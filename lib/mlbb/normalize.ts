import { MLBBPlayer } from "./types";

/**
 * Turns whatever shape the configured provider returns into the
 * internal MLBBPlayer shape. Providers differ in field names
 * (nickname vs name vs player_name, etc.), so this is the single
 * place that maps between them.
 *
 * Rule: if a field isn't present in the raw response, it becomes
 * `null` here — never a guessed/fabricated value. The UI is
 * responsible for turning `null` into "Not Available".
 */
export function normalizePlayer(
  raw: Record<string, unknown>,
  userId: string,
  zoneId: string
): MLBBPlayer {
  const pick = (...keys: string[]): unknown => {
    for (const key of keys) {
      if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "") {
        return raw[key];
      }
    }
    return undefined;
  };

  const toStringOrNull = (v: unknown): string | null =>
    v === undefined || v === null || v === "" ? null : String(v);

  const toNumberOrNull = (v: unknown): number | null => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    userId,
    zoneId,
    nickname: toStringOrNull(
      pick("nickname", "name", "player_name", "username", "ign")
    ),
    level: toNumberOrNull(pick("level", "player_level")),
    currentRank: toStringOrNull(
      pick("currentRank", "current_rank", "rank")
    ),
    highestRank: toStringOrNull(
      pick("highestRank", "highest_rank", "peak_rank")
    ),
    lastOnline: toStringOrNull(
      pick("lastOnline", "last_online", "last_login")
    ),
    accountCreated: toStringOrNull(
      pick("accountCreated", "account_created", "created_at")
    ),
    diamonds: toNumberOrNull(pick("diamonds", "diamond_balance")),
    country: toStringOrNull(pick("country", "region")),
    squad: toStringOrNull(pick("squad", "guild", "clan")),
    skinCount: toNumberOrNull(pick("skinCount", "skin_count")),
    heroCount: toNumberOrNull(pick("heroCount", "hero_count")),
  };
}

/** Known MLBB rank tiers, used only to validate/display — never to invent a rank. */
export const KNOWN_RANKS = [
  "Warrior",
  "Elite",
  "Master",
  "Grandmaster",
  "Epic",
  "Legend",
  "Mythic",
  "Mythical Honor",
  "Mythical Glory",
  "Mythical Immortal",
];

export function displayRank(rank: string | null): string {
  if (!rank) return "Not Available";
  const known = KNOWN_RANKS.find(
    (r) => r.toLowerCase() === rank.toLowerCase()
  );
  return known ?? rank;
}
