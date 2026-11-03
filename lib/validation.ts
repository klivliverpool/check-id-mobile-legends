export interface ValidationResult {
  valid: boolean;
  error?: string;
  userId?: string;
  zoneId?: string;
}

/**
 * Validates raw userId/zoneId input. Both should be numeric strings
 * (that's the real-world format MLBB uses). Trims whitespace, rejects
 * empty input, and caps length to something sane.
 */
export function validatePlayerInput(
  userIdRaw: unknown,
  zoneIdRaw: unknown
): ValidationResult {
  const userId = typeof userIdRaw === "string" ? userIdRaw.trim() : "";
  const zoneId = typeof zoneIdRaw === "string" ? zoneIdRaw.trim() : "";

  if (!userId || !zoneId) {
    return { valid: false, error: "User ID and Zone ID are required." };
  }

  const numeric = /^[0-9]{3,12}$/;

  if (!numeric.test(userId)) {
    return {
      valid: false,
      error: "User ID must be numeric (3–12 digits).",
    };
  }
  if (!numeric.test(zoneId)) {
    return {
      valid: false,
      error: "Zone ID must be numeric (3–6 digits).",
    };
  }

  return { valid: true, userId, zoneId };
}
