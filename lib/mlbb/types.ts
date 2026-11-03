/**
 * Internal, normalized player shape used by the whole frontend.
 * Every field is nullable on purpose: no MLBB data provider we could
 * find publicly exposes all of this, so the frontend must be able to
 * render "Not Available" for anything the provider didn't return.
 *
 * IMPORTANT: nothing in this file invents data. `normalize.ts` is the
 * only place that maps a provider's raw response onto this shape, and
 * it must leave a field `null` rather than guess a value.
 */
export interface MLBBPlayer {
  userId: string;
  zoneId: string;
  nickname: string | null;
  level: number | null;
  currentRank: string | null;
  highestRank: string | null;
  lastOnline: string | null;
  accountCreated: string | null;
  diamonds: number | null;
  country: string | null;
  squad: string | null;
  skinCount: number | null;
  heroCount: number | null;
}

export type MLBBErrorCode =
  | "INVALID_INPUT"
  | "PLAYER_NOT_FOUND"
  | "REQUEST_TIMEOUT"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE"
  | "CONFIG_ERROR"
  | "UNKNOWN_ERROR";

export class MLBBProviderError extends Error {
  code: MLBBErrorCode;
  constructor(code: MLBBErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "MLBBProviderError";
  }
}

export interface CheckPlayerParams {
  userId: string;
  zoneId: string;
}
