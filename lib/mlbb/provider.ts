import {
  CheckPlayerParams,
  MLBBPlayer,
  MLBBProviderError,
} from "./types";

const API_URL = "https://api.isan.eu.org/nickname/ml";
const DEFAULT_TIMEOUT_MS = 8000;

export async function checkPlayer(
  params: CheckPlayerParams
): Promise<MLBBPlayer> {
  const timeoutMs =
    Number(process.env.MLBB_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;

  const url = new URL(API_URL);

  // API MLBB menggunakan:
  // id = User ID
  // server = Zone ID
  url.searchParams.set("id", params.userId);
  url.searchParams.set("server", params.zoneId);

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new MLBBProviderError(
        "REQUEST_TIMEOUT",
        "API terlalu lama merespons."
      );
    }

    throw new MLBBProviderError(
      "PROVIDER_UNAVAILABLE",
      "API Mobile Legends sedang tidak tersedia."
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) {
    throw new MLBBProviderError(
      "RATE_LIMITED",
      "Terlalu banyak request. Coba lagi beberapa saat."
    );
  }

  if (response.status >= 500) {
    throw new MLBBProviderError(
      "PROVIDER_UNAVAILABLE",
      "Server API Mobile Legends sedang bermasalah."
    );
  }

  if (!response.ok) {
    throw new MLBBProviderError(
      "UNKNOWN_ERROR",
      `API mengembalikan status ${response.status}.`
    );
  }

  let raw: unknown;

  try {
    raw = await response.json();
  } catch {
    throw new MLBBProviderError(
      "UNKNOWN_ERROR",
      "Response API tidak dapat dibaca."
    );
  }

  const data = raw as Record<string, unknown>;

  // API mengembalikan:
  // {
  //   success: true,
  //   game: "Mobile Legends: Bang Bang",
  //   id: 1114917746,
  //   server: 13486,
  //   name: "Outrageous Dominance",
  //   country: "Indonesia"
  // }

  if (data.success !== true || !data.name) {
    throw new MLBBProviderError(
      "PLAYER_NOT_FOUND",
      "Player tidak ditemukan. Periksa kembali User ID dan Zone ID."
    );
  }

  const player: MLBBPlayer = {
    userId: String(data.id ?? params.userId),
    zoneId: String(data.server ?? params.zoneId),

    nickname: String(data.name),

    // API ini belum menyediakan data berikut.
    // Jangan mengarang nilainya.
    level: null,
    currentRank: null,
    highestRank: null,
    lastOnline: null,
    accountCreated: null,
    diamonds: null,

    country:
      data.country !== undefined && data.country !== null
        ? String(data.country)
        : null,

    squad: null,
    skinCount: null,
    heroCount: null,
  };

  return player;
}