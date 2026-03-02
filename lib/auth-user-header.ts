import type { User } from "@/lib/api/types";

const FLYNT_USER_COOKIE = "flynt_initial_user";

/**
 * Decodes base64url JSON payload to User. Returns null if invalid.
 */
function decodeUserPayload(raw: string): User | null {
  try {
    const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const padded = padding ? base64 + "=".repeat(4 - padding) : base64;
    const decoded = atob(padded);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const u = parsed as Record<string, unknown>;
    if (
      typeof u.id !== "string" ||
      typeof u.email !== "string" ||
      typeof u.name !== "string"
    ) {
      return null;
    }
    return parsed as User;
  } catch {
    return null;
  }
}

/**
 * Reads user from x-flynt-user request header (set by proxy).
 * Returns null if missing or invalid.
 */
export function getInitialUserFromHeaders(headers: Headers): User | null {
  const raw = headers.get("x-flynt-user");
  return raw ? decodeUserPayload(raw) : null;
}

/**
 * Reads user from flynt_initial_user cookie (set by proxy on redirect).
 * Use when request headers are not available to the layout.
 */
export function getInitialUserFromCookie(cookieValue: string | undefined): User | null {
  return cookieValue ? decodeUserPayload(cookieValue) : null;
}

export { FLYNT_USER_COOKIE };
