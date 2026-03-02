import type { RegisterResponseData } from "@/lib/api/types";

const AUTH_TOKEN_KEY = "flynt_token";
const REGISTER_DATA_KEY = "flynt_register_data";
const INITIAL_USER_KEY = "flynt_initial_user";
const MAX_AGE_DAYS = 7;
const REGISTER_DATA_MAX_AGE_SECONDS = 900; // 15 minutes

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
