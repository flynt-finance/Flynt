import type { RegisterResponseData } from "@/lib/api/types";
import type { User } from "@/lib/api/types";

const AUTH_TOKEN_KEY = "flynt_token";
const REGISTER_DATA_KEY = "flynt_register_data";
const INITIAL_USER_KEY = "flynt_initial_user";
/** One-time cookie set by client after fetchUser; proxy applies it to initial user then removes it. */
export const FLYNT_UPDATED_USER_COOKIE = "flynt_updated_user";
const MAX_AGE_DAYS = 7;
const REGISTER_DATA_MAX_AGE_SECONDS = 900; // 15 minutes
/** Short TTL so updated-user cookie is consumed on next request; long enough to see in DevTools. */
const UPDATED_USER_COOKIE_MAX_AGE_SECONDS = 300;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, maxAgeDays: number): void => {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  const secure = typeof window !== "undefined" && window.location?.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure ? "; Secure" : ""}`;
};

const setCookieSeconds = (name: string, value: string, maxAgeSeconds: number): void => {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location?.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure ? "; Secure" : ""}`;
};

/** Client/edge-safe base64url encode (matches proxy encoding). */
const base64urlEncode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/** Sets the updated-user cookie so the proxy will apply it to flynt_initial_user and then remove it. */
export const setUpdatedUserCookie = (user: User): void => {
  if (typeof document === "undefined") return;
  const encoded = base64urlEncode(JSON.stringify(user));
  setCookieSeconds(FLYNT_UPDATED_USER_COOKIE, encoded, UPDATED_USER_COOKIE_MAX_AGE_SECONDS);
};

export const getToken = (): string | null => getCookie(AUTH_TOKEN_KEY);

export const setToken = (token: string): void =>
  setCookie(AUTH_TOKEN_KEY, token, MAX_AGE_DAYS);

export const clearToken = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
};

export const clearInitialUserCookie = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${INITIAL_USER_KEY}=; path=/; max-age=0`;
};

export const clearLogoutStorage = (): void => {
  if (typeof document === "undefined") return;
  clearToken();
  clearInitialUserCookie();
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.clear();
    if (typeof localStorage !== "undefined") localStorage.clear();
  } catch {
    // ignore
  }
};

export const setRegisterData = (data: RegisterResponseData | { email: string; name: string }): void => {
  setCookieSeconds(REGISTER_DATA_KEY, JSON.stringify(data), REGISTER_DATA_MAX_AGE_SECONDS);
};

export const getRegisterData = (): RegisterResponseData | null => {
  const raw = getCookie(REGISTER_DATA_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as RegisterResponseData;
    return parsed?.email && parsed?.name ? parsed : null;
  } catch {
    return null;
  }
};

export const clearRegisterData = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${REGISTER_DATA_KEY}=; path=/; max-age=0`;
};

export const clearAllAuthStorage = (): void => {
  if (typeof document === "undefined") return;
  clearToken();
  clearRegisterData();
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.clear();
    if (typeof localStorage !== "undefined") localStorage.clear();
  } catch {
    // ignore
  }
};
