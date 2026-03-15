# Flynt App & API Guide

This guide explains how the Flynt app is structured, how users move through it, and how API calls are made — written for developers building on or extending Flynt.

---

## 1. App at a Glance

Flynt is built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. State is managed with **Zustand**, data fetching is handled by **TanStack React Query** and **Axios**, and notifications use **Sonner** toasts.

Your API base URL is set in your `.env` file as:

```
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### Pages and who can access them

| Area          | Routes                                                       | Who can access        |
| ------------- | ------------------------------------------------------------ | --------------------- |
| **Public**    | `/`, `/waitlist`                                             | Everyone              |
| **Auth only** | `/login`, `/register`, `/verify-email`                       | Logged-out users only |
| **Protected** | `/dashboard`, `/dashboard/*`, `/onboard`, `/onboard/success` | Logged-in users only  |

Unauthenticated users who try to visit a protected page are automatically redirected to login. Logged-in users who visit auth pages are redirected to the dashboard or to `/onboard` if they have not completed onboarding.

**Onboarding gate:** Logged-in users with **onboarding not completed** are redirected to `/onboard` when they try to access the dashboard (or other dashboard routes). Logged-in users with **onboarding completed** are not allowed on the onboard stepper (`/onboard`) and are redirected to the dashboard; they can still hit `/onboard/success` once after completing (then that page redirects to the dashboard). This is enforced in **middleware** (proxy) and optionally in layout components.

---

## 2. How API Requests Work

All API calls in Flynt flow through three files:

| File                  | What it does                                                                    |
| --------------------- | ------------------------------------------------------------------------------- |
| `lib/api/types.ts`    | TypeScript types for every request and response                                 |
| `lib/api/client.ts`   | The shared Axios instance — handles auth headers and error toasts automatically |
| `lib/api/requests.ts` | The actual API functions and hooks for each endpoint                            |

**When adding a new endpoint**, you only need to:

1. Add your types to `lib/api/types.ts`
2. Add your request function or hook to `lib/api/requests.ts`

The shared client handles the rest (base URL, auth token, error handling).

---

## 3. Authentication in Requests

### How the auth token is attached

Every request goes through the Axios instance in `lib/api/client.ts`. Before the request is sent, it automatically reads your auth token from the `flynt_token` cookie and attaches it as:

```
Authorization: Bearer <your-token>
```

- **No token** (e.g. on login/register) → request is sent without the header
- **Token present** (e.g. on dashboard) → header is added automatically

You don't need to pass the token manually — it's always handled for you.

### How errors are handled automatically

When an API call fails, the client catches the error and shows a Sonner toast with a clear title and message. You never need to write `catch` blocks just to show an error to the user.

| HTTP Status     | Toast title shown                     |
| --------------- | ------------------------------------- |
| 401             | Unauthorized — Please sign in again   |
| 403             | Access Denied                         |
| 404             | Not Found                             |
| 5xx             | Server Error — Please try again later |
| Network failure | Network Error                         |

The error format from the Flynt backend looks like this:

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

The client reads `error.message` as the toast title and `error.details` as the description.

---

## 4. Three Ways to Call the API

### `customFetch<T>` — one-off requests

Use this for a single call from an event handler, like submitting a form.

```ts
const res = await customFetch<TypeApiResponse<LoginResponseData>>(
	"/auth/login",
	{
		method: "post",
		body: { email, password },
	}
);
```

### `useCustomFetchQuery<T>` — fetching data in components

Use this when you want to load and cache data in a component (e.g. user profile, dashboard data). Built on TanStack React Query.

```ts
const { data, isLoading, refetch } =
	useCustomFetchQuery<MyData>("/some-endpoint");
```

Returns the standard React Query result — `data`, `isLoading`, `error`, `refetch`, etc.

### `useCustomFetchMutation<T>` — submitting or changing data

Use this for POST, PUT, PATCH, or DELETE calls — typically form submissions.

```ts
const { mutate, isPending } = useCustomFetchMutation<MyData>(
	"/some-endpoint",
	"post",
	{
		onSuccess: (data) => {
			/* handle success */
		},
		invalidateQueries: [createQueryKey("some-endpoint")],
	}
);
```

Pass `invalidateQueries` to automatically refresh related data after a successful mutation.

### `createQueryKey` — building React Query keys

A helper to build consistent query keys:

```ts
createQueryKey("users"); // → ["users"]
createQueryKey("users", { id }); // → ["users", { id }]
```

---

## 5. Adding a New Endpoint

1. **Define your types** in `lib/api/types.ts` (request body, response shape).
2. **Add your function or hook** in `lib/api/requests.ts`:
   - For one-off calls → use `customFetch`
   - For data you need to display → use `useCustomFetchQuery`
   - For form submissions or mutations → use `useCustomFetchMutation`

Use the path only (e.g. `/users/profile`) — the base URL is prepended automatically.

### Banking / Linked accounts

- **`GET /banking/linked-accounts`** — Returns the list of bank accounts linked to the current user. Requires auth (Bearer token). Response shape: `{ success: true, data: LinkedAccount[] }`. Each `LinkedAccount` includes `id`, `userId`, `bankName`, `accountNumber` (masked, e.g. `******3461`), `monoAccountId`, `balance`, `currency`, `institution`, `isActive`, `createdAt`, `updatedAt`.
- The dashboard uses this for the **Linked Accounts** section. Use the hook **`useLinkedAccountsQuery()`** from `lib/api/requests.ts`; invalidate with **`LINKED_ACCOUNTS_QUERY_KEY`** after linking or unlinking.
- **`POST /banking/link`** — Links a bank account after the user completes Mono Connect. Body: `{ monoCode: string }`. Response: `{ success: true, data: LinkedAccount, message }`. Use **`linkBankRequest({ monoCode })`**; after success, invalidate `LINKED_ACCOUNTS_QUERY_KEY` so the list refetches.
- **`DELETE /banking/linked-accounts/:id`** — Unlinks a bank account. Response: `{ success: true, data: { success: true }, message }`. Use **`unlinkBankAccountRequest(id)`**; after success, invalidate `LINKED_ACCOUNTS_QUERY_KEY`.
- Bank logos are resolved from the [Nigerian banks API](https://supermx1.github.io/nigerian-banks-api/data.json): the app fetches `data.json` (cached) and uses **`getBankLogoUrl(bankName)`** from `lib/banks/nigerian-banks.ts` to map `bankName`/`institution` to logo URLs (`https://supermx1.github.io/nigerian-banks-api/logos/{slug}.png`). Use the **`useNigerianBanks()`** hook for reactive logo resolution in components.

### Banking / Liquidity

- **`GET /banking/liquidity?sync=true`** — Returns aggregated liquidity across linked accounts. Requires auth. Response shape: `{ success: true, data: { totalBalance, currency, accounts: LiquidityAccount[], isLiveSynced } }`. Each `LiquidityAccount` has `id`, `bankName`, `accountNumber`, `balance`, `currency`, `logo`.
- The dashboard **Total Aggregated Liquidity** section uses **`useLiquidityQuery()`** from `lib/api/requests.ts`. The component **`TotalAggregatedLiquiditySection`** (`components/dashboard/TotalAggregatedLiquiditySection.tsx`) fetches this data, shows a loading skeleton or empty state when there are no accounts, and renders **`LiquidityTerminal`** with the balance and account breakdown when data is available. Invalidate with **`LIQUIDITY_QUERY_KEY`** if you add a refresh action.

---

## 6. Auth, Cookies & Session

### The auth token (`flynt_token`)

Managed by `lib/auth-cookie.ts`:

| Helper            | What it does                              |
| ----------------- | ----------------------------------------- |
| `getToken()`      | Read the current token                    |
| `setToken(token)` | Save the token after login (7-day expiry) |
| `clearToken()`    | Remove the token on logout                |

### Registration data (`flynt_register_data`)

A short-lived cookie (15 minutes) used to pass the user's email and name from the register page to the email verification page.

| Helper                  | What it does                       |
| ----------------------- | ---------------------------------- |
| `setRegisterData(data)` | Save registration details          |
| `getRegisterData()`     | Read them on the verify-email page |
| `clearRegisterData()`   | Clear after done                   |

### Clearing everything on logout or verification

`clearAllAuthStorage()` wipes the token, registration data, `sessionStorage`, and `localStorage` in one call. Use this after email verification so the user is fully signed out before redirecting to login.

### Initial user cookie (`flynt_initial_user`) and proxy

The middleware (proxy in `proxy.ts`) runs on protected and auth routes. When the user has a valid auth token:

- **If the `flynt_initial_user` cookie is missing** (e.g. first request after login): the proxy calls `GET /auth/me`, gets the user, encodes it, sets the `flynt_initial_user` cookie (7-day expiry, same as the token), and forwards the request with the user in the `x-flynt-user` header.
- **If the cookie is already present:** the proxy does **not** call `/auth/me`. It reads the user from the cookie, applies redirect logic (onboarding gate, auth vs protected), and passes the cookie value in the `x-flynt-user` header. The user object is therefore only fetched from the API when the cookie was missing; on reload and subsequent requests the app uses the cached user from the cookie.

Layouts (root and dashboard) read the user via `lib/auth-user-header.ts`: either from the `x-flynt-user` request header or from the `flynt_initial_user` cookie, and pass it as `initialUser` to client components.

### User state (Zustand store)

The auth store in `stores/use-auth-store.ts` holds the current user in memory:

- `setData({ user })` — update the user in state
- `fetchUser()` — calls `GET /auth/me` and updates state; clears user and token if the call fails

The dashboard layout does **not** call `fetchUser()` on mount. The root layout passes `initialUser` to `AuthHydrator`, and the dashboard layout passes `initialUser` to `DashboardLayoutClient`. Those components hydrate the store once with `initialUser` from the server (header/cookie) so that no client-side `/auth/me` request is made on load. The sidebar and header therefore show the user data that was provided by the proxy (from the cookie when present). After a full page reload, the user object in the UI is whatever was in the cookie; it is not re-fetched from the API unless something explicitly calls `fetchUser()` (e.g. after completing onboarding or updating profile).

---

## 7. Two-Factor Authentication (2FA)

### Logging in with 2FA

If a user has 2FA enabled, after entering their email/password, the API returns:

```json
{ "requiresTwoFactor": true, "preAuthToken": "..." }
```

The app stores the `preAuthToken`, shows a 6-digit code modal, then calls:

```
POST /auth/2fa/verify-login
Body: { preAuthToken, code }
```

On success, the token and user are saved, and the user is redirected to the dashboard — same as a normal login.

### Setting up 2FA (from Dashboard → Settings → Security)

| Step                                     | Endpoint                 | What happens                                          |
| ---------------------------------------- | ------------------------ | ----------------------------------------------------- |
| 1. Start setup                           | `POST /auth/2fa/setup`   | Returns a QR code, secret, and backup codes           |
| 2. User scans QR and picks a backup code | —                        | Done in the UI                                        |
| 3. Confirm setup                         | `POST /auth/2fa/confirm` | Body: `secret`, `token` (6-digit code), `backupCodes` |

### Checking 2FA status

```
GET /auth/2fa/status → { enabled: true | false }
```

Used by the Settings toggle to show whether 2FA is on or off.

### Turning off 2FA

```
DELETE /auth/2fa/disable
Body: { password }
```

> **Note:** The 2FA enable and disable modals use the shared Modal (see **§12 Modals and Dialogs**) with `closeOnOverlayClick={false}` while a request is in progress — users cannot accidentally dismiss them by clicking outside or pressing Escape.

---

## 8. Form Validation

Validation schemas live in `lib/validations/auth.ts` and use **Yup**:

- `loginSchema` — validates email and password before login
- `registerSchema` — validates all fields before registration

The API is only called after validation passes. Errors appear inline on the form inputs.

---

## 9. Full Login Flow (Step by Step)

1. User fills in the login form → `loginSchema` validates → `loginRequest({ email, password })` is called
2. **No 2FA:** Token and user are saved → redirect to `/dashboard`
3. **2FA required:** `preAuthToken` is stored → 6-digit code modal appears → `POST /auth/2fa/verify-login` → token and user saved → redirect to `/dashboard`

**Registration flow:**

1. Form validated → `registerRequest(...)` → `setRegisterData(data)` → redirect to `/verify-email`
2. Verify-email page reads email from cookie or query params

---

## 10. Themes: Light & Dark Mode

### How it works

The root `<html>` element has a class of either `light` or `dark`. All CSS variables switch automatically based on this class — defined in `app/globals.css`.

| Variable group | Examples                                                       |
| -------------- | -------------------------------------------------------------- |
| Backgrounds    | `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-elevated` |
| Brand green    | `--green-primary`, `--green-hover`, `--green-glow`             |
| Text           | `--text-primary`, `--text-secondary`, `--text-muted`           |
| Status         | `--success`, `--warning`, `--error`, `--info`                  |
| Borders        | `--border-color`, `--border-hover`, `--border-subtle`          |

### Tailwind usage

Prefer theme-aware utility classes so your component works in both themes automatically:

```html
<div class="bg-bg-primary text-text-primary border-border-color"></div>
```

Only use `dark:` for one-off overrides.

### ThemeProvider

`contexts/ThemeContext.tsx` reads the user's saved preference from `localStorage` (or falls back to system preference) and applies the class to `<html>`. Components can use:

```ts
const { theme, toggleTheme } = useTheme();
```

The `ThemeToggle` component in `components/ThemeToggle.tsx` is a ready-made button that switches between light and dark with a moon/sun icon.

---

## 11. Animations

- **Framer Motion** — Used for page transitions, modals, hover effects, and landing page components (`Hero`, `CoreCapabilities`, `TrustStats`, etc.). Buttons use `whileHover` and `whileTap` with spring transitions.
- **Tailwind animations** — Custom `spin-slow`, `pulse-slow` animations defined in `tailwind.config.ts` via the `tailwindcss-animate` plugin.
- **Global transitions** — `app/globals.css` applies a smooth 150ms transition to `background-color`, `border-color`, and `color` globally, so theme switching always feels fluid.

---

## 12. Modals and Dialogs

**All overlay dialogs and modals in the app must use the shared Modal component.** Do not build custom overlay/modal markup (e.g. ad-hoc `fixed inset-0` divs, custom backdrop, or duplicate focus/Escape handling). Using the shared system keeps behaviour consistent (accessibility, focus trap, Escape to close, overlay click to close) and avoids drift.

### The shared Modal component

| File                         | Purpose                                                                   |
| ---------------------------- | ------------------------------------------------------------------------- |
| `components/modal/Modal.tsx` | The single base modal implementation used for all dialogs                 |
| `components/modal/index.ts`  | Exports `Modal`, `ConnectBankSecureModal`, `ConfirmModal`, `AddCardModal` |

**Props:**

| Prop                  | Type                   | Description                                                                                                                                          |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`                | `boolean`              | Whether the modal is visible                                                                                                                         |
| `onClose`             | `() => void`           | Called when the user closes (overlay click or Escape)                                                                                                |
| `title`               | `string` (optional)    | Shown in the header bar                                                                                                                              |
| `children`            | `ReactNode`            | Main content (scrollable body)                                                                                                                       |
| `footer`              | `ReactNode` (optional) | Optional footer (e.g. action buttons)                                                                                                                |
| `ariaLabel`           | `string` (optional)    | Accessible name for the dialog (falls back to `title`)                                                                                               |
| `contentClassName`    | `string` (optional)    | Extra classes on the inner content wrapper (e.g. `max-w-md`)                                                                                         |
| `closeOnOverlayClick` | `boolean` (optional)   | If `false`, overlay click and Escape do not close. Default `true`. Use `false` while a request is in progress so the user cannot dismiss by mistake. |

**Behaviour:**

- Renders a backdrop, centres the panel, and traps focus when open.
- Closes on Escape and on backdrop click when `closeOnOverlayClick` is true.
- Restores focus to the previously focused element on close.
- Uses theme-aware styles (border, background, text) so it works in light and dark mode.

### How to implement a new modal

1. **Use the shared Modal.** Import `Modal` from `@/components/modal` or `@/components/modal/Modal`.
2. **Compose your content inside it.** Pass `title`, `children`, and optionally `footer` and `contentClassName`. Do not duplicate overlay, backdrop, or close behaviour.
3. **Control visibility with state.** The parent holds `open` (or derived from e.g. `selectedItem !== null`) and `onClose` (e.g. clear selection or set `open` to false).
4. **When a modal should not be dismissible** (e.g. while submitting), set `closeOnOverlayClick={false}` for the duration of the operation.

**Example:**

```tsx
import Modal from "@/components/modal/Modal";

// In your component:
const [isOpen, setIsOpen] = useState(false);

<Modal
	open={isOpen}
	onClose={() => setIsOpen(false)}
	title="My dialog"
	ariaLabel="My dialog"
	contentClassName="max-w-md"
>
	<p>Modal body content here.</p>
</Modal>;
```

### Existing modals that use the system

- **ConnectBankSecureModal** — Connect bank (Mono) flow; uses `Modal`.
- **ConfirmModal** — Confirm/cancel actions (e.g. unlink account); uses `Modal`.
- **AddCardModal** — Add card flow; uses `Modal`.
- **TransactionDetailModal** — Transaction details; uses `Modal` from `components/modal/Modal`.

Any new dialog (e.g. detail views, confirmations, forms in an overlay) must be implemented by composing the shared `Modal` in the same way.

---

## 13. Environment Variables

| Variable                       | Used for                 | Where                                         |
| ------------------------------ | ------------------------ | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | API base URL             | Client + server                               |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Sign-In           | Client only                                   |
| `NEXT_PUBLIC_MONO_PUBLIC_KEY`  | Mono Connect (link bank) | Client only; required for dashboard link flow |
| `WAITLIST_GOOGLE_SCRIPT_URL`   | Waitlist → Google Sheet  | Server only (never exposed to client)         |

The waitlist form posts to `/api/waitlist` (a Next.js API route), which forwards the submission to a Google Apps Script that writes to a Google Sheet. Set `WAITLIST_GOOGLE_SCRIPT_URL` in `.env.local`.

---

## 14. Key File Reference

| Area                                    | File                                                                                                                                                                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API types                               | `lib/api/types.ts`                                                                                                                                                                                                    |
| API client (Axios)                      | `lib/api/client.ts`                                                                                                                                                                                                   |
| API request functions                   | `lib/api/requests.ts`                                                                                                                                                                                                 |
| Linked accounts API                     | `useLinkedAccountsQuery`, `linkBankRequest`, `unlinkBankAccountRequest`, `LINKED_ACCOUNTS_QUERY_KEY` in `lib/api/requests.ts`; types in `lib/api/types.ts`                                                            |
| Liquidity API                           | `useLiquidityQuery`, `LIQUIDITY_QUERY_KEY` in `lib/api/requests.ts`; types in `lib/api/types.ts`                                                                                                                      |
| Total Aggregated Liquidity              | `components/dashboard/TotalAggregatedLiquiditySection.tsx` (uses `LiquidityTerminal` and `useLiquidityQuery`)                                                                                                         |
| Bank logo resolution                    | `lib/banks/nigerian-banks.ts` (`useNigerianBanks`, `getBankLogoUrl`)                                                                                                                                                  |
| Global fullscreen loader                | `contexts/GlobalLoaderContext.tsx` (`useGlobalLoader`, `showLoader`, `hideLoader`)                                                                                                                                    |
| Auth cookie helpers                     | `lib/auth-cookie.ts`                                                                                                                                                                                                  |
| User auth store                         | `stores/use-auth-store.ts`                                                                                                                                                                                            |
| Theme context                           | `contexts/ThemeContext.tsx`                                                                                                                                                                                           |
| Global styles + CSS vars                | `app/globals.css`                                                                                                                                                                                                     |
| Theme toggle button                     | `components/ThemeToggle.tsx`                                                                                                                                                                                          |
| Toast theme wrapper                     | `components/ThemeAwareToaster.tsx`                                                                                                                                                                                    |
| Form validation                         | `lib/validations/auth.ts`                                                                                                                                                                                             |
| Waitlist validation                     | `lib/validations/waitlist.ts`                                                                                                                                                                                         |
| Waitlist API route                      | `app/api/waitlist/route.ts`                                                                                                                                                                                           |
| Modal system (required for all dialogs) | `components/modal/Modal.tsx` — see **§12 Modals and Dialogs**. All overlay modals must use this component. Exports: `Modal`, `ConnectBankSecureModal`, `ConfirmModal`, `AddCardModal` in `components/modal/index.ts`. |
| Providers wrapper                       | `components/Providers.tsx`                                                                                                                                                                                            |
| Dashboard layout                        | `app/(protected)/dashboard/DashboardLayoutClient.tsx`                                                                                                                                                                 |

---

## 15. Responsive Design

The dashboard layout is fully responsive:

- **Below 1024px (`lg`):** Sidebar is hidden by default. A hamburger button in the header opens it as an overlay. A backdrop tap or navigating to a new page closes it. Body scroll is locked while it's open.
- **1024px and above:** Sidebar is always visible. Main content has a left margin of `ml-64`.

When building new dashboard pages, use `max-w-7xl mx-auto` for content width and Tailwind breakpoints (`sm`, `md`, `lg`) for spacing — mobile-first.

---

## 16. App Providers

`components/Providers.tsx` wraps the entire app in this order:

1. **QueryClientProvider** — React Query
2. **ThemeProvider** — light/dark mode
3. **GlobalLoaderProvider** — fullscreen loader (title/subtitle, trigger from anywhere via `useGlobalLoader()`)
4. **DebtProvider** — app-specific state
5. **ThemeAwareToaster** — Sonner toasts that match the current theme

Order matters: React Query and theme must be outer layers so every component can access them. The global loader is used during banking link/unlink and can be triggered from any component inside the provider.
