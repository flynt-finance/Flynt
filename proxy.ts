/**
 * Auth proxy for middleware. Server/middleware only — do not import from client code.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "flynt_token";
const REGISTER_DATA_KEY = "flynt_register_data";
const FLYNT_INITIAL_USER_COOKIE = "flynt_initial_user";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
/** Same as auth token (7 days) so /auth/me runs once per session. */
const INITIAL_USER_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const isProtectedPath = (pathname: string): boolean =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");

const isAuthPath = (pathname: string): boolean =>
  pathname === "/login" || pathname === "/register" || pathname === "/verify-email";

const hasValidRegisterData = (request: NextRequest): boolean => {
  const raw = request.cookies.get(REGISTER_DATA_KEY)?.value;
  if (!raw) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { email?: string; name?: string };
    return Boolean(parsed?.email && parsed?.name);
  } catch {
    return false;
  }
};

/** Clears auth token and initial-user cookie (server-side; required for httpOnly cookie). */
const clearAuthCookies = (response: NextResponse): void => {
  response.cookies.set(AUTH_TOKEN_KEY, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  response.cookies.set(FLYNT_INITIAL_USER_COOKIE, "", {
    path: "/",
    maxAge: 0,
    httpOnly: false,
    sameSite: "lax",
  });
  console.log("Auth cookies cleared");
};

/** Edge-compatible base64url encode (no Buffer). */
const base64urlEncode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (!token) {
    if (isProtectedPath(pathname)) {
      const redirect = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(redirect);
      return redirect;
    }
    if (pathname === "/verify-email" && !hasValidRegisterData(request)) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    return clearAuthCookies(NextResponse.next());
  }
  const existingUserCookie = request.cookies.get(FLYNT_INITIAL_USER_COOKIE)?.value;
  if (existingUserCookie) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-flynt-user", token);
    if (isAuthPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => ({}));
    const valid = res.ok && body?.success === true;

    if (!valid) {
      const redirect = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(redirect);
      return redirect;
    }

    if (isAuthPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const user = body?.data;
    if (!user) throw new Error("User not found");
    const encoded =
      user && typeof user === "object"
        ? base64urlEncode(JSON.stringify(user))
        : null;

    if (encoded && !existingUserCookie) {
      const response = NextResponse.redirect(new URL(request.url));
      response.cookies.set(FLYNT_INITIAL_USER_COOKIE, encoded, {
        path: "/",
        maxAge: INITIAL_USER_COOKIE_MAX_AGE_SECONDS,
        sameSite: "lax",
        httpOnly: false,
      });
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    if (encoded) {
      requestHeaders.set("x-flynt-user", encoded);
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    clearAuthCookies(redirect);
    return redirect;
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/verify-email",
  ],
};
