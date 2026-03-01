# Flynt Finance

A personal finance and budgeting web app built with Next.js. Manage linked accounts, transactions, budget, cards, debts, and insights from a single dashboard with secure authentication.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State & Data:** Zustand, TanStack React Query, Axios
- **Validation:** Yup, Zod
- **Database:** Prisma (ORM)
- **Auth:** Cookie-based tokens, optional Google OAuth (Sign-In)

## Features

- **Landing:** Hero, how it works, core capabilities, product preview, waitlist CTA
- **Auth:** Login, register, email verification, forgot/reset password, change password, two-factor authentication (setup, disable, OTP at login), Google Sign-In
- **Dashboard (protected):** Overview with linked accounts, transactions, budget, cards, debts, insights; responsive sidebar; settings (security: change password, 2FA)

## Project Structure

- **Route groups:** `app/(auth)/` — login, register, verify-email, forgot-password; `app/(protected)/` — dashboard and all authenticated pages
- **API layer:** `lib/api/client.ts` (Axios + interceptors), `lib/api/requests.ts`, `lib/api/types.ts`
- **Auth:** `lib/auth-cookie.ts`, `lib/auth-user-header.ts`; `lib/validations/auth.ts` for form schemas
- **State:** `stores/use-auth-store.ts`, `stores/use-app-store.ts`

See [markdown/APP_AND_API_GUIDE.md](markdown/APP_AND_API_GUIDE.md) for request flow and API usage.

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or bun

### Install and run

```bash
git clone <repo-url>
cd Flynt
npm install
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment variables](#environment-variables)), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start dev server (Turbopack) |
| `npm run build`       | Production build             |
| `npm run start`       | Start production server      |
| `npm run lint`        | Run ESLint                   |
| `npm run db:generate` | Prisma generate              |
| `npm run db:push`     | Prisma db push               |
| `npm run db:migrate`  | Prisma migrate dev           |
| `npm run db:seed`     | Seed database                |
| `npm run db:studio`   | Open Prisma Studio           |
| `npm run db:reset`    | Reset database               |

## Environment Variables

Create `.env.local` from `.env.example`:

| Variable                       | Required | Description                                                                     |
| ------------------------------ | -------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Yes      | Backend API base URL (e.g. `https://your-api.com/api/v1`)                       |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No       | Google OAuth client ID for Sign-In (client-side only; do not add client secret) |

For full app and API behavior, see [markdown/APP_AND_API_GUIDE.md](markdown/APP_AND_API_GUIDE.md).

## Documentation

- [App and API guide](markdown/APP_AND_API_GUIDE.md) — request flow, auth, API client usage
- [Tech stack](markdown/TECH_STACK.md) — frontend and backend stack details
- [Project structure](markdown/PROJECT_STRUCTURE.md) — repo layout and conventions

## Deploy

You can deploy the Next.js app to [Vercel](https://vercel.com) or any Node-compatible host. Set the same environment variables in your deployment dashboard. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
