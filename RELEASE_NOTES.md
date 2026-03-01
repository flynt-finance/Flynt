# Release Notes

## Version: Post-Merge 8eceada

**Release Date:** March 1, 2026

---

## New Features

### Authentication

- **Login**: Implemented login with validation (Yup schema), error handling, and API integration.
- **Registration & Email Verification**: Enhanced registration and verify-email pages with improved validation, API integration, and user feedback (toasts, loading states).
- **Forgot Password & Reset Password**: Added forgot-password and reset-password flows with validation schemas and API integration.
- **Change Password**: Added change-password functionality in settings with validation schema and API integration.
- **Two-Factor Authentication (2FA)**:
  - **Setup & Disable**: 2FA setup, confirmation, and disable options in settings; Modal component enhanced with close-behavior control.
  - **Login OTP**: 2FA verification in login flow with modal for OTP input and API integration for verification.
- **Google Sign-In**: Integrated Google Sign-In with OAuth provider; authentication flow clears cookies on logout; UI components updated for better experience.

### Dashboard & Layout

- **Responsive Sidebar**: Enhanced dashboard layout with sidebar toggle and backdrop for mobile views.
- **Settings Page**: New dashboard settings page with security section (change password, 2FA setup/disable).
- **Protected Routes**: Dashboard and related pages moved under `(protected)` route group with server-side auth (cookie/header) and client layout.

---

## Technical Improvements

### API & Data Layer

- **API Client**: New `lib/api/client.ts` with Axios instance, auth interceptor (Bearer token from cookie), and centralized error handling with Sonner toasts.
- **Request Layer**: `lib/api/requests.ts` and `lib/api/types.ts` for typed auth and 2FA endpoints (login, register, verify-email, forgot/reset/change password, 2FA setup/confirm/disable/verify-login, Google OAuth).
- **Auth Helpers**: `lib/auth-cookie.ts` for token read/clear and `lib/auth-user-header.ts` for initial user from cookie/headers in server layout.

### Architecture

- **Middleware Removed**: Auth handling moved from middleware into layout components and API layer; protected layout reads user from cookie/headers and passes to client.
- **Validation**: Yup used for auth form schemas in `lib/validations/auth.ts`.
- **State**: Zustand stores added — `stores/use-auth-store.ts` and `stores/use-app-store.ts`.
- **Auth Hydration**: `components/AuthHydrator.tsx` and `Providers.tsx` updates for auth state and Google OAuth provider.

### Dependencies

- **Added**: axios, @tanstack/react-query, zustand, yup; @react-oauth/google for Google Sign-In.
- **Config**: `next.config.ts` updated; `proxy.ts` added for local API proxying.

---

## Bug Fixes

- **2FA Section Layout**: Improved layout of the two-factor authentication section on the settings page for better responsiveness and alignment.

---

## Files Modified

### Auth Pages

- `app/(auth)/forgot-password/page.tsx` - New forgot-password page
- `app/(auth)/login/page.tsx` - Login with validation and API
- `app/(auth)/register/page.tsx` - Registration and validation
- `app/(auth)/verify-email/page.tsx` - Email verification flow

### Protected Dashboard

- `app/(protected)/dashboard/DashboardLayoutClient.tsx` - Client layout with sidebar and auth
- `app/(protected)/dashboard/layout.tsx` - Server layout with initial user from cookie/headers
- `app/(protected)/dashboard/page.tsx` - Dashboard home
- `app/(protected)/dashboard/settings/page.tsx` - Settings (password, 2FA)
- `app/(protected)/dashboard/budget/page.tsx` - Moved from `app/dashboard/`
- `app/(protected)/dashboard/cards/page.tsx` - Moved from `app/dashboard/`
- `app/(protected)/dashboard/debts/page.tsx` - Moved from `app/dashboard/`
- `app/(protected)/dashboard/insights/page.tsx` - Moved from `app/dashboard/`
- `app/(protected)/dashboard/transactions/page.tsx` - Moved from `app/dashboard/`
- `app/(protected)/onboarding/success/page.tsx` - Moved from `app/onboarding/`

### Removed (replaced by protected layout)

- `app/dashboard/layout.tsx` - Removed
- `app/dashboard/page.tsx` - Removed

### API & Auth Lib

- `lib/api/client.ts` - New API client
- `lib/api/requests.ts` - New request functions and hooks
- `lib/api/types.ts` - New API types
- `lib/auth-cookie.ts` - New token cookie helpers
- `lib/auth-user-header.ts` - New server auth header/cookie helpers
- `lib/validations/auth.ts` - New auth validation schemas

### Components

- `components/AuthHydrator.tsx` - New auth hydration
- `components/auth/GoogleSignInButton.tsx` - New Google Sign-In button
- `components/modal/Modal.tsx` - Close behavior control for 2FA modals
- `components/Providers.tsx` - Google OAuth and auth provider updates

### State & Config

- `stores/use-app-store.ts` - New app store
- `stores/use-auth-store.ts` - New auth store
- `app/globals.css` - Style updates
- `app/layout.tsx` - Layout updates for auth/providers
- `next.config.ts` - Config updates
- `package.json` - New dependencies; package-lock.json removed

### Documentation

- `markdown/APP_AND_API_GUIDE.md` - New app and API guide
- Documentation files moved into `markdown/`: BRAND_GUIDE.md, DEBT_NOTE.md, EDGE_CASES.md, guideline.md, IMPLEMENTATION_PLAN.md, MVP_DEMO_PLAN.md, MVP_SETUP.md, PRISMA_SETUP_GUIDE.md, PROJECT_STRUCTURE.md, TECH_STACK.md

### Other

- `proxy.ts` - New dev proxy for API

---

## Statistics

- **Commits:** 13
- **Files Changed:** 45
- **Lines Added:** ~5,335
- **Lines Removed:** ~9,957 (includes package-lock.json and doc moves)
