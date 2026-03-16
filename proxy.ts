/**
 * Auth proxy for middleware. Server/middleware only — do not import from client code.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "flynt_token";
const REGISTER_DATA_KEY = "flynt_register_data";
const FLYNT_INITIAL_USER_COOKIE = "flynt_initial_user";
/** One-time cookie set by client after fetchUser; proxy applies it to initial user then removes it. */
const FLYNT_UPDATED_USER_COOKIE = "flynt_updated_user";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
/** Same as auth token (7 days) so /auth/me runs once per session. */
const INITIAL_USER_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const isDashboardPath = (pathname: string): boolean =>
  pathname === "/dashboard" || pathname.startsWith("/dashboard/");

const isProtectedPath = (pathname: string): boolean =>
  isDashboardPath(pathname) ||
  pathname === "/onboard" ||
  pathname.startsWith("/onboard/");

const isOnboardStepperPath = (pathname: string): boolean =>
  pathname === "/onboard";

const isAuthPath = (pathname: string): boolean =>
  pathname === "/login" || pathname === "/register" || pathname === "/verify-email";

/** Decode cookie payload to read onboardingCompleted. Returns undefined if invalid. */
const getOnboardingCompletedFromCookie = (raw: string): boolean | undefined => {
  try {
    const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const padded = padding ? base64 + "=".repeat(4 - padding) : base64;
    const decoded = atob(padded);
    const json = new TextDecoder().decode(
      new Uint8Array(decoded.length).map((_, i) => decoded.charCodeAt(i))
    );
    const parsed = JSON.parse(json) as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== "object") return undefined;
    if (typeof (parsed as { user?: { onboardingCompleted?: boolean } }).user?.onboardingCompleted === "boolean") {
      return (parsed as { user: { onboardingCompleted: boolean } }).user.onboardingCompleted;
    }
    return typeof parsed.onboardingCompleted === "boolean"
      ? (parsed.onboardingCompleted as boolean)
      : undefined;
  } catch {
    return undefined;
  }
};

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

/** Clears auth token and initial-user / updated-user cookies (server-side). */
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
  response.cookies.set(FLYNT_UPDATED_USER_COOKIE, "", {
    path: "/",
    maxAge: 0,
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

  const updatedUserCookie = request.cookies.get(FLYNT_UPDATED_USER_COOKIE)?.value;
  if (updatedUserCookie) {
    const onboardingCompleted = getOnboardingCompletedFromCookie(updatedUserCookie);
    if (onboardingCompleted !== undefined) {
      if (onboardingCompleted !== true && isDashboardPath(pathname)) {
        const response = NextResponse.redirect(new URL("/onboard", request.url));
        response.cookies.set(FLYNT_INITIAL_USER_COOKIE, updatedUserCookie, {
          path: "/",
          maxAge: INITIAL_USER_COOKIE_MAX_AGE_SECONDS,
          sameSite: "lax",
          httpOnly: false,
        });
        response.cookies.set(FLYNT_UPDATED_USER_COOKIE, "", {
          path: "/",
          maxAge: 0,
          sameSite: "lax",
        });
        return response;
      }
      if (onboardingCompleted === true && isOnboardStepperPath(pathname)) {
        const response = NextResponse.redirect(new URL("/dashboard", request.url));
        response.cookies.set(FLYNT_INITIAL_USER_COOKIE, updatedUserCookie, {
          path: "/",
          maxAge: INITIAL_USER_COOKIE_MAX_AGE_SECONDS,
          sameSite: "lax",
          httpOnly: false,
        });
        response.cookies.set(FLYNT_UPDATED_USER_COOKIE, "", {
          path: "/",
          maxAge: 0,
          sameSite: "lax",
        });
        return response;
      }
      if (isAuthPath(pathname)) {
        const target = onboardingCompleted ? "/dashboard" : "/onboard";
        const response = NextResponse.redirect(new URL(target, request.url));
        response.cookies.set(FLYNT_INITIAL_USER_COOKIE, updatedUserCookie, {
          path: "/",
          maxAge: INITIAL_USER_COOKIE_MAX_AGE_SECONDS,
          sameSite: "lax",
          httpOnly: false,
        });
        response.cookies.set(FLYNT_UPDATED_USER_COOKIE, "", {
          path: "/",
          maxAge: 0,
          sameSite: "lax",
        });
        return response;
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-flynt-user", updatedUserCookie);
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      response.cookies.set(FLYNT_INITIAL_USER_COOKIE, updatedUserCookie, {
        path: "/",
        maxAge: INITIAL_USER_COOKIE_MAX_AGE_SECONDS,
        sameSite: "lax",
        httpOnly: false,
      });
      response.cookies.set(FLYNT_UPDATED_USER_COOKIE, "", {
        path: "/",
        maxAge: 0,
        sameSite: "lax",
      });
      return response;
    }
  }

  const existingUserCookie = request.cookies.get(FLYNT_INITIAL_USER_COOKIE)?.value;
  if (existingUserCookie) {
    const onboardingCompleted = getOnboardingCompletedFromCookie(existingUserCookie);
    if (onboardingCompleted !== true && isDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/onboard", request.url));
    }
    if (onboardingCompleted === true && isOnboardStepperPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isAuthPath(pathname)) {
      return NextResponse.redirect(
        new URL(onboardingCompleted === false ? "/onboard" : "/dashboard", request.url)
      );
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-flynt-user", existingUserCookie);
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

    const user = body?.data?.user ?? body?.data;
    if (!user || typeof user !== "object") throw new Error("User not found");
    const encoded = base64urlEncode(JSON.stringify(user));

    const onboardingCompleted = user.onboardingCompleted === true;
    if (onboardingCompleted !== true && isDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/onboard", request.url));
    }
    if (onboardingCompleted === true && isOnboardStepperPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isAuthPath(pathname)) {
      return NextResponse.redirect(
        new URL(onboardingCompleted ? "/dashboard" : "/onboard", request.url)
      );
    }

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
    "/onboard",
    "/onboard/:path*",
    "/login",
    "/register",
    "/verify-email",
  ],
};
