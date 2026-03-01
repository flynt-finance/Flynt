# How the app works and how requests are made

This document describes the Flynt app structure, authentication flow, and how API requests are built and sent.

---

## 1. App overview

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand, TanStack React Query, Axios, Sonner (toasts).
- **API base URL:** Set via `NEXT_PUBLIC_API_URL` (e.g. in `.env`). All API calls use this base.

### Route groups

- **Public:** `/`, `/waitlist`, etc.
- **Auth (guest):** `(auth)` — `/login`, `/register`, `/verify-email`, `/onboard`, etc.
- **Protected:** `(protected)` — `/dashboard`, `/dashboard/*`, `/onboarding/success`. Require a valid auth token.

Access control can be enforced in **middleware** (if present): it reads the auth token cookie, optionally calls `/auth/me`, and redirects unauthenticated users away from protected paths and authenticated users away from auth pages (e.g. to `/dashboard`).

---

## 2. How requests are made

### 2.1 Layers

| Layer                     | Role                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`lib/api/types.ts`**    | Shared types: `TypeApiResponse<T>`, `ApiResponse<T>`, `User`, payload/response types per endpoint.                                                                                    |
| **`lib/api/client.ts`**   | Single Axios instance, interceptors (auth + errors), and helpers: `customFetch`, `useCustomFetchQuery`, `useCustomFetchMutation`, `createQueryKey`, `processError`, `showErrorToast`. |
| **`lib/api/requests.ts`** | Concrete API functions and hooks that call the client with specific URLs and types (e.g. `loginRequest`, `registerRequest`, `getCurrentUser`).                                        |

New endpoints: add **types** in `lib/api/types.ts`, **request functions/hooks** in `lib/api/requests.ts`; they automatically use the shared client (base URL, auth, error handling).

### 2.2 Base URL and Axios instance

- Base URL comes from `process.env.NEXT_PUBLIC_API_URL`.
- One Axios instance is created with that `baseURL`, a long timeout, and `Content-Type: application/json`.

All requests go through this instance, so they all pass through the same request and response interceptors.

### 2.3 Request interceptor (auth)

- Before each request, the client reads the auth token from the cookie (via `getToken()` from `lib/auth-cookie.ts`).
- If a token exists, it sets:
  - `Authorization: Bearer <token>`.
- So: **login/register** (no token yet) go without `Authorization`; **all other requests** after login send the token automatically.

### 2.4 Response interceptor (errors and toasts)

- On **error response** (4xx/5xx), the interceptor:
  - Uses `processError(error)` to get a **title** and **message** from the API body (or fallbacks).
  - Calls `showErrorToast(error, fallback)` so Sonner shows a toast with **title** and **description** (message).
- Handled statuses:
  - **401** → “Unauthorized” / “Please sign in again.”
  - **403** → “Access Denied”
  - **404** → “Not Found”
  - **5xx** → “Server Error” / “Please try again later.”
  - **Default** → “Error” / “Something went wrong.”
- If there is **no response** (e.g. network failure), it shows a “Network Error” toast with a short description.

### 2.5 API error shape

The client supports the backend error format:

```json
{
	"success": false,
	"error": {
		"message": "Validation failed",
		"code": "VALIDATION_ERROR",
		"details": ["Please provide a valid phone number"]
	}
}
```

- **`processError(err)`** returns `{ title, message }`:
  - If `response.data.error` exists: **title** = `error.message` (default “Validation failed”), **message** = `error.details` joined, or the same as title if no details.
  - Otherwise it derives a single message from `errors`, `message`, or generic fallback and returns `title: "Error"` and that message.
- **`showErrorToast(err, fallback)`** calls `toast.error(title, { description: message })`, using `fallback` when title or message is missing.

So every error toast has a **title** and a **message** (description).

---

## 3. Ways to call the API

### 3.1 `customFetch<T>(url, options?)`

- Low-level async function: runs one HTTP request (GET/POST/PATCH/PUT/DELETE) via the Axios instance.
- **Use for:** one-off calls (e.g. login, register, get current user) from event handlers or `useEffect`.
- **Returns:** `Promise<T>` (response body).
- **Example:**

```ts
const res = await customFetch<TypeApiResponse<LoginResponseData>>(
	"/auth/login",
	{
		method: "post",
		body: { email, password },
	}
);
```

All interceptors (auth header, error toasts) apply.

### 3.2 `useCustomFetchQuery<T>(url, options?)`

- Wraps **TanStack React Query** `useQuery` for **GET** requests.
- **Use for:** fetching data that should be cached, refetched, and tied to loading/error state.
- **Returns:** React Query result (`data`, `isLoading`, `error`, `refetch`, etc.). `data` is typed as `ApiResponse<T>`.
- **Options:** `queryKey`, `enabled`, `staleTime`, `gcTime`, `refetchOnWindowFocus`, `config`.
- On **failure**, it shows an error toast (via `showErrorToast`) and returns a fallback `{ status: false, message, data: undefined }` so the hook doesn’t throw.

### 3.3 `useCustomFetchMutation<T>(url, method, options?)`

- Wraps **TanStack React Query** `useMutation` for **POST / PUT / PATCH / DELETE**.
- **Use for:** form submits and other mutations.
- **Returns:** mutation object with `mutate`, `mutateAsync`, `mutateSync`, `isPending`, etc. `mutateAsync` returns `Promise<ApiResponse<T>>`.
- **Options:** `onSuccess`, `onError`, `invalidateQueries` (array of query keys to invalidate after success), `config`.
- Errors are still handled by the **response interceptor** (toasts); you can also use `onError` for custom logic.

### 3.4 `createQueryKey(baseKey, params?)`

- Helper to build React Query keys: `[baseKey]` or `[baseKey, params]`. Use with `useCustomFetchQuery` and `invalidateQueries`.

---

## 4. Where requests are defined

**File: `lib/api/requests.ts`**

- Imports `customFetch`, `useCustomFetchQuery`, `useCustomFetchMutation`, `createQueryKey` from `./client` and types from `./types`.
- Defines one function or hook per endpoint, e.g.:
  - **Auth:** `loginRequest`, `registerRequest`, `getCurrentUser`, `verifyOtpRequest`, `sendOtpRequest`, `forgotPasswordRequest`, `resetPasswordRequest`, `changePasswordRequest` (when present)
  - **2FA:** `useTwoFaStatusQuery`, `twoFaSetupRequest`, `twoFaConfirmRequest`, `useTwoFaDisableMutation`, `twoFaVerifyLoginRequest` — see below.
  - **Example:** `getExample`, `useExampleQuery`, `useCreateExampleMutation`

### 4.1 Two-factor authentication (2FA)

- **POST /auth/2fa/setup** — No body. Returns `qrCode` (data URL), `secret`, `backupCodes` (array), `message`. Used when enabling 2FA from Dashboard Settings > Security.
- **POST /auth/2fa/confirm** — Body: `secret`, `token` (6-digit code), `backupCodes` (one selected backup code string). Used to complete 2FA setup after the user scans the QR and selects a backup code.
- **POST /auth/2fa/verify-login** — Body: `preAuthToken`, `code` (6-digit string). Returns `user` and `token`. Used after login when the backend returns `requiresTwoFactor: true`; the app shows a modal for the 6-digit code, then calls this to complete sign-in (set token, user, redirect to dashboard).
- **GET /auth/2fa/status** — No body. Returns `enabled` (boolean). Used for the Settings Security toggle and after enable/disable.
- **DELETE /auth/2fa/disable** — Body: `password`. Used to turn off 2FA from Settings. The API client sends the body as `config.data` for DELETE requests.

The **login** flow: when `loginRequest` returns `data.requiresTwoFactor === true`, the app does not set the session token; it stores `preAuthToken` and shows a 2FA verification modal. After the user submits the 6-digit code, the app calls **POST /auth/2fa/verify-login** with `preAuthToken` and `code`. On success it sets the token and user, shows a success toast, and redirects to `/dashboard` (same as a normal login). The login response type is a union of standard login data and 2FA-required data so the client can branch on `requiresTwoFactor`.

The dashboard **Settings > Security** tab uses these in the “Two-factor authentication” section: a status-driven toggle, an enable modal (setup → QR + backup code selection → 6-digit token confirm), and a disable modal (password). Both modals set `closeOnOverlayClick={false}` while loading or submitting so users cannot close by clicking outside or pressing Escape.

To add a new endpoint:

1. Add any new **request/response types** in `lib/api/types.ts`.
2. In `lib/api/requests.ts`, add either:
   - A `customFetch`-based async function (e.g. `someRequest(body)`), or
   - A `useCustomFetchQuery` / `useCustomFetchMutation` hook (e.g. `useSomeQuery()`, `useSomeMutation()`).

URLs are **paths only** (e.g. `/auth/login`); the client prepends `NEXT_PUBLIC_API_URL`.

---

## 5. Auth and cookies

### 5.1 Token cookie

**File: `lib/auth-cookie.ts`**

- **Cookie name:** `flynt_token`.
- **Helpers:**
  - `getToken()` — read token (client-side).
  - `setToken(token)` — set token (e.g. after login), 7-day max-age, path `/`, SameSite Lax, Secure on HTTPS.
  - `clearToken()` — remove token (e.g. logout or after invalid session).

The **API client** uses `getToken()` in the request interceptor to send `Authorization: Bearer <token>` on every request after login.

### 5.2 Register data cookie

- **Cookie name:** `flynt_register_data`.
- **Helpers:** `setRegisterData(data)`, `getRegisterData()`, `clearRegisterData()`.
- Used to pass registration response (e.g. email, name) to the verify-email page; short-lived (e.g. 15 minutes).

### 5.3 Clear all auth storage

- **clearAllAuthStorage()** (in `lib/auth-cookie.ts`): Clears the token cookie, register-data cookie, `sessionStorage`, and `localStorage`. Use after verify-email success so the user is fully signed out before redirecting to login.

### 5.4 Auth store (Zustand)

**File: `stores/use-auth-store.ts`**

- **State:** `user: User | null`.
- **Actions:**
  - `setData(partial)` — set store fields (e.g. `setData({ user })`).
  - `fetchUser()` — GET `/auth/me` via `getCurrentUser()`; on success sets `user` from response; on failure clears user and token.

After **login**, the app sets the token with `setToken`, sets the user (e.g. from login response or by calling `fetchUser()`). If login returns `data.requiresTwoFactor === true`, the app does not set the token yet; it shows a 2FA modal, then after **POST /auth/2fa/verify-login** succeeds it sets the token and user and redirects to the dashboard. The **dashboard layout** (or similar) can call `fetchUser()` when a token exists so the UI has the current user. On **logout**, the app calls `clearToken()` and `setData({ user: null })`. After **verify-email success**, the app calls `clearAllAuthStorage()` and `setData({ user: null })` before redirecting to login.

---

## 6. Validation

**File: `lib/validations/auth.ts`**

- **Yup** schemas: `loginSchema`, `registerSchema` (and exported types).
- Used on **login** and **register** pages to validate before calling `loginRequest` / `registerRequest`; validation errors are shown on the inputs and the API is only called when validation passes.

---

## 7. Flow summary

1. **Login:** Form validated with `loginSchema` → `loginRequest({ email, password })` → on success: if `data.requiresTwoFactor` is true, store `preAuthToken` and show 2FA modal; on verify-login success, `setToken`, `setData({ user })`, toast, redirect to `/dashboard`. Otherwise (no 2FA): `setToken(data.token)`, `setData({ user: data.user })`, redirect to `/dashboard`.
2. **Register:** Form validated with `registerSchema` → `registerRequest(...)` → on success: `setRegisterData(data)`, redirect to `/verify-email`. Verify-email page can read email from `getRegisterData()` or query params.
3. **Protected pages:** If middleware is used, it checks the token and optionally `/auth/me`, then allows or redirects. On the client, the dashboard layout (or similar) calls `fetchUser()` when a token exists so the auth store has the current user.
4. **Any API call:** Uses the shared Axios instance → request interceptor adds `Bearer` token if present → backend responds → on error, response interceptor turns the body into a title + message and shows a Sonner toast, then rejects so callers can handle it too if needed.

This keeps auth, base URL, and error handling in one place and lets new features add only types and request functions/hooks in `types.ts` and `requests.ts`.

---

## 8. Themes and color system

- **Source of truth:** [app/globals.css](app/globals.css) defines CSS custom properties for **light** and **dark**.
- **Scopes:** `:root` and `.light` share the light palette; `.dark` overrides for dark mode. The root element gets class `light` or `dark` from [contexts/ThemeContext.tsx](contexts/ThemeContext.tsx).
- **Variables (concise list):**
  - **Backgrounds:** `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-elevated`
  - **Brand green:** `--green-primary`, `--green-hover`, `--green-glow`, `--green-secondary`, `--green-light`, `--green-dark`
  - **Text:** `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
  - **Semantic:** `--success`, `--warning`, `--error`, `--info`
  - **Borders / hover:** `--border-color`, `--border-hover`, `--border-subtle`, `--bg-hover`
- **Tailwind usage:** In globals.css, `@theme inline` maps these to the Tailwind v4 theme (e.g. `--color-bg-primary`, `--color-green-primary`). Utility classes used in the app include: `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-card`, `bg-bg-elevated`, `text-text-primary`, `text-text-secondary`, `text-text-muted`, `border-border-primary`, `border-border-subtle`, `bg-green-primary`, `text-green-primary`, `bg-green-hover`, `bg-hover`, `glow-green`.
- **Reference:** [docs/COLOR_PALETTE.css](docs/COLOR_PALETTE.css) holds additional brand/logo colors (e.g. deep-teal, bright-cyan), gradients, and usage examples (buttons, cards, badges).

---

## 9. Dark and light mode

- **Mechanism:** Class-based. `document.documentElement` has class `light` or `dark`; CSS variables in globals.css are scoped under `.light` and `.dark`, so switching the class flips the palette.
- **Tailwind:** [tailwind.config.ts](tailwind.config.ts) sets `darkMode: "class"`, so `dark:` variants apply when the root has class `dark`. Prefer theme-aware utilities (e.g. `bg-bg-primary`) so colors follow the variables; use `dark:` only when you need a one-off override.
- **ThemeProvider:** [contexts/ThemeContext.tsx](contexts/ThemeContext.tsx) provides `theme` and `toggleTheme`. On mount it reads `localStorage.getItem("theme")` or falls back to `prefers-color-scheme: dark`; it applies the class to `document.documentElement` and persists the choice to `localStorage`.
- **ThemeToggle:** [components/ThemeToggle.tsx](components/ThemeToggle.tsx) is a button that toggles between light and dark (moon/sun icon), updates the root class and localStorage. It can be used standalone or with `useTheme()` from ThemeContext where the provider is available.
- **Sonner:** [components/ThemeAwareToaster.tsx](components/ThemeAwareToaster.tsx) passes `theme` from `useTheme()` to the Toaster so toasts match the current light/dark theme.

---

## 10. Animation system

- **Framer Motion:** Used for UI motion across the app. Example: [components/ui/Button.tsx](components/ui/Button.tsx) uses `motion.button` with `whileHover`, `whileTap`, and a spring transition. Buttons, cards, modals, and landing components (e.g. Hero, CoreCapabilities, TrustStats) use `motion` from `framer-motion` for enter/exit and micro-interactions.
- **Tailwind animations:** [tailwind.config.ts](tailwind.config.ts) extends `animation` (e.g. `spin-slow`, `pulse-slow`) and `keyframes` (e.g. accordion-down/up). The **tailwindcss-animate** plugin is used for common animated utilities.
- **Global CSS:** In [app/globals.css](app/globals.css), a short transition is applied globally for `background-color`, `border-color`, `color`, `fill`, and `stroke` (150ms, cubic-bezier ease) so theme switches and hovers feel smooth.

---

## 11. Tailwind

- **Version:** Tailwind v4. The app uses PostCSS with `@tailwindcss/postcss`; in [app/globals.css](app/globals.css), `@import "tailwindcss"` and `@theme inline` expose the CSS variables to the Tailwind theme.
- **Config:** [tailwind.config.ts](tailwind.config.ts): `darkMode: "class"`; `content` paths for `pages`, `components`, `app`, `src`; `theme.extend` for colors (brand, semantic), fontFamily, fontSize, borderRadius, boxShadow, animation/keyframes.
- **Plugins:** `tailwindcss-animate`.
- **Convention:** Prefer theme-aware utilities (`bg-bg-primary`, `text-text-primary`, `border-border-primary`, `bg-green-primary`) so components work in both themes without extra `dark:` classes where the variables already switch.

---

## 12. Other useful info

- **Providers:** [components/Providers.tsx](components/Providers.tsx) wraps the app with `QueryClientProvider`, `ThemeProvider`, `DebtProvider`, and `ThemeAwareToaster`. Order matters: React Query and theme are outer so they are available everywhere.
- **Environment:** `NEXT_PUBLIC_API_URL` is used for the API base. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is used for Google Sign-In (Social OAuth); set it in `.env` or `.env.local` (client-side only—do not add a Google client secret). Any `NEXT_PUBLIC_*` variable is available on the client.
- **Modal:** [components/modal/Modal.tsx](components/modal/Modal.tsx) provides a reusable dialog with overlay, title, content, and optional footer. It supports `closeOnOverlayClick` (default `true`). When set to `false`, clicking the overlay or pressing Escape does not close the modal—use this during loading or submitting so users cannot dismiss the modal accidentally (e.g. Settings 2FA enable/disable modals pass `closeOnOverlayClick={false}` while a request is in progress).
- **Key files (short reference):**
  - **API:** `lib/api/types.ts`, `lib/api/client.ts`, `lib/api/requests.ts`
  - **Auth:** `lib/auth-cookie.ts`, `stores/use-auth-store.ts`
  - **Theme:** `contexts/ThemeContext.tsx`, `app/globals.css`, `components/ThemeToggle.tsx`, `components/ThemeAwareToaster.tsx`
  - **Validation:** `lib/validations/auth.ts`
  - **Modal:** `components/modal/Modal.tsx`

---

## 13. Responsive design

- **Dashboard layout:** The dashboard layout is responsive. On viewports below the `lg` breakpoint (1024px), the sidebar is hidden by default and can be opened via a hamburger menu button in the header. The sidebar appears as an overlay; a backdrop closes it when clicked, and navigation (route change) or a close control inside the sidebar also closes it. On `lg` and above, the sidebar is always visible and the main content has a left margin (`ml-64`). Main content area uses responsive padding (`p-4` on small screens, `p-6` from `sm` up). Body scroll is locked while the mobile sidebar is open.
- **Pages:** Dashboard pages use Tailwind breakpoints (`sm`, `md`, `lg`) and `max-w-7xl mx-auto` for content width. New dashboard UI should be built with mobile-first spacing and breakpoints to avoid horizontal overflow and keep tap targets adequate on small screens.
- **Key file:** Dashboard layout client component: [app/(protected)/dashboard/DashboardLayoutClient.tsx](<app/(protected)/dashboard/DashboardLayoutClient.tsx>).
