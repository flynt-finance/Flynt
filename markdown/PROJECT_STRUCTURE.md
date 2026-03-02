# Flynt Finance - Project Structure

## Monorepo Architecture

```
flynt-finance/
├── apps/
│   ├── web/                    # Next.js web application
│   ├── mobile/                 # React Native mobile app
│   └── admin/                  # Admin dashboard
├── services/
│   ├── auth-api/              # Authentication service
│   ├── core-api/              # Core business logic API
│   ├── card-api/              # Virtual card service
│   ├── ai-service/            # ML/AI service (Python)
│   └── webhook-service/       # Webhook processing
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── types/                 # Shared TypeScript types
│   ├── utils/                 # Shared utilities
│   ├── config/                # Shared configuration
│   └── database/              # Database schemas & migrations
├── infrastructure/
│   ├── terraform/             # Infrastructure as Code
│   ├── docker/                # Docker configurations
│   └── k8s/                   # Kubernetes manifests (future)
├── docs/
│   ├── api/                   # API documentation
│   ├── architecture/          # Architecture diagrams
│   └── guides/                # Development guides
└── scripts/
    ├── setup/                 # Setup scripts
    ├── deploy/                # Deployment scripts
    └── seed/                  # Database seeding
```

---

## Detailed Structure

### `/apps/web` - Web Application

```
web/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth routes group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify/
│   │   ├── (dashboard)/      # Dashboard routes group
│   │   │   ├── overview/
│   │   │   ├── transactions/
│   │   │   ├── budgets/
│   │   │   ├── cards/
│   │   │   ├── insights/
│   │   │   └── marketplace/
│   │   ├── api/              # API routes (BFF pattern)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── features/         # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── budget/
│   │   │   ├── cards/
│   │   │   ├── transactions/
│   │   │   └── insights/
│   │   └── layouts/          # Layout components
│   ├── lib/
│   │   ├── api/              # API client
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand stores
│   │   ├── utils/            # Utility functions
│   │   └── validations/      # Zod schemas
│   ├── styles/
│   │   └── globals.css       # Global styles + Tailwind
│   └── types/
│       └── index.ts          # Type definitions
├── public/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### `/apps/mobile` - Mobile Application

```
mobile/
├── src/
│   ├── screens/              # Screen components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Budget/
│   │   ├── Cards/
│   │   └── Profile/
│   ├── components/           # Reusable components
│   │   ├── ui/
│   │   └── features/
│   ├── navigation/           # React Navigation
│   │   ├── AuthNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── services/             # API services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── store/                # State management
│   │   ├── auth.ts
│   │   ├── budget.ts
│   │   └── transactions.ts
│   ├── utils/
│   ├── hooks/
│   ├── constants/
│   └── types/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

### `/services/auth-api` - Authentication Service

```
auth-api/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── otp.service.ts
│   │   └── jwt.service.ts
│   ├── models/               # Database models
│   │   ├── user.model.ts
│   │   └── session.model.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── types/
│   └── app.ts                # Express app
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── Dockerfile
├── tsconfig.json
└── package.json
```

### `/services/core-api` - Core API Service

```
core-api/
├── src/
│   ├── controllers/
│   │   ├── transaction.controller.ts
│   │   ├── budget.controller.ts
│   │   ├── account.controller.ts
│   │   └── insight.controller.ts
│   ├── services/
│   │   ├── transaction.service.ts
│   │   ├── budget.service.ts
│   │   ├── categorization.service.ts
│   │   ├── bank.service.ts
│   │   └── insight.service.ts
│   ├── models/
│   │   ├── transaction.model.ts
│   │   ├── budget.model.ts
│   │   ├── account.model.ts
│   │   └── insight.model.ts
│   ├── integrations/         # External API integrations
│   │   ├── okra.client.ts
│   │   ├── mono.client.ts
│   │   └── ai-service.client.ts
│   ├── jobs/                 # Background jobs
│   │   ├── sync-transactions.job.ts
│   │   ├── generate-insights.job.ts
│   │   └── detect-subscriptions.job.ts
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── app.ts
├── tests/
├── Dockerfile
└── package.json
```

### `/services/card-api` - Card Service

```
card-api/
├── src/
│   ├── controllers/
│   │   ├── card.controller.ts
│   │   └── authorization.controller.ts
│   ├── services/
│   │   ├── card.service.ts
│   │   ├── authorization.service.ts
│   │   ├── budget-check.service.ts
│   │   └── decline.service.ts
│   ├── models/
│   │   ├── card.model.ts
│   │   └── transaction.model.ts
│   ├── integrations/
│   │   ├── paystack.client.ts
│   │   └── flutterwave.client.ts
│   ├── middleware/
│   ├── routes/
│   └── app.ts
├── tests/
├── Dockerfile
└── package.json
```

### `/services/ai-service` - AI/ML Service (Python)

```
ai-service/
├── src/
│   ├── api/
│   │   ├── main.py           # FastAPI app
│   │   ├── routes/
│   │   │   ├── categorization.py
│   │   │   ├── prediction.py
│   │   │   └── insights.py
│   │   └── dependencies.py
│   ├── models/
│   │   ├── categorization/
│   │   │   ├── model.py
│   │   │   ├── train.py
│   │   │   └── predict.py
│   │   ├── prediction/
│   │   │   ├── model.py
│   │   │   └── forecast.py
│   │   └── anomaly/
│   │       ├── detector.py
│   │       └── alerts.py
│   ├── data/
│   │   ├── preprocessing.py
│   │   ├── features.py
│   │   └── loaders.py
│   ├── utils/
│   │   ├── logger.py
│   │   └── metrics.py
│   └── config/
│       └── settings.py
├── notebooks/                # Jupyter notebooks for experimentation
├── tests/
├── requirements.txt
├── Dockerfile
└── pyproject.toml
```

### `/packages/ui` - Shared UI Components

```
ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── index.ts
│   ├── styles/
│   │   ├── tokens.css        # Design tokens
│   │   └── global.css
│   └── index.ts
├── package.json
└── tsconfig.json
```

### `/packages/types` - Shared Types

```
types/
├── src/
│   ├── api/
│   │   ├── auth.types.ts
│   │   ├── transaction.types.ts
│   │   ├── budget.types.ts
│   │   └── card.types.ts
│   ├── models/
│   │   ├── user.types.ts
│   │   ├── account.types.ts
│   │   └── insight.types.ts
│   ├── enums/
│   │   ├── status.enum.ts
│   │   └── category.enum.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### `/packages/database` - Database Package

```
database/
├── src/
│   ├── migrations/           # SQL migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_cards.sql
│   │   └── ...
│   ├── seeds/                # Seed data
│   │   ├── users.seed.ts
│   │   └── categories.seed.ts
│   ├── schemas/              # Prisma/TypeORM schemas
│   │   └── schema.prisma
│   └── client.ts             # Database client
├── package.json
└── tsconfig.json
```

### `/infrastructure/terraform` - Infrastructure as Code

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
├── modules/
│   ├── vpc/
│   ├── ecs/
│   ├── rds/
│   ├── redis/
│   ├── s3/
│   └── monitoring/
├── main.tf
├── variables.tf
└── outputs.tf
```

---

## Development Workflow

### 1. Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start databases (Docker)
docker-compose up -d postgres redis

# Run migrations
npm run db:migrate

# Start all services
npm run dev

# Web: http://localhost:3000
# Auth API: http://localhost:4001
# Core API: http://localhost:4002
# Card API: http://localhost:4003
# AI Service: http://localhost:8000
```

### 2. Testing

```bash
# Run all tests
npm run test

# Run specific service tests
npm run test:auth-api
npm run test:core-api

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### 3. Building

```bash
# Build all services
npm run build

# Build specific service
npm run build:web
npm run build:auth-api

# Docker build
docker build -t flynt/auth-api ./services/auth-api
```

### 4. Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Rollback
npm run rollback:production
```

---

## Environment Variables

### Web App (`.env.local`)

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4002

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your-token
```

### Auth API (`.env`)

```bash
# Server
PORT=4001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flynt_auth

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# SMS
TERMII_API_KEY=your-key
TERMII_SENDER_ID=Flynt

# Email
SENDGRID_API_KEY=your-key
SENDGRID_FROM_EMAIL=noreply@flynt.finance
```

### Core API (`.env`)

```bash
# Server
PORT=4002
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flynt_core

# Redis
REDIS_URL=redis://localhost:6379

# External APIs
OKRA_SECRET_KEY=your-key
OKRA_PUBLIC_KEY=your-key
MONO_SECRET_KEY=your-key

# AI Service
AI_SERVICE_URL=http://localhost:8000
```

### Card API (`.env`)

```bash
# Server
PORT=4003
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/flynt_cards

# Redis
REDIS_URL=redis://localhost:6379

# Paystack
PAYSTACK_SECRET_KEY=your-key
PAYSTACK_PUBLIC_KEY=your-key

# Flutterwave
FLUTTERWAVE_SECRET_KEY=your-key
FLUTTERWAVE_PUBLIC_KEY=your-key
```

---

## Database Schema Overview

### Users Database

```sql
-- users
id, phone, email, name, country, employment_status, 
monthly_income_range, savings_priority, risk_tolerance, 
kyc_status, created_at, updated_at

-- sessions
id, user_id, token, device_info, expires_at, created_at

-- otp_codes
id, user_id, code, type, expires_at, verified_at, created_at
```

### Core Database

```sql
-- bank_accounts
id, user_id, provider, account_id, account_name, 
account_number, bank_name, balance, currency, 
is_active, last_synced_at, created_at

-- transactions
id, user_id, account_id, amount, currency, type, 
category, category_confidence, description, merchant, 
date, balance, is_recurring, metadata, created_at

-- budgets
id, user_id, period, total_income, allocations (jsonb), 
spent (jsonb), start_date, end_date, is_active, created_at

-- insights
id, user_id, type, category, title, message, 
actionable, action, metadata (jsonb), is_read, created_at

-- subscriptions
id, user_id, merchant, amount, frequency, 
next_charge_date, is_active, detected_at
```

### Cards Database

```sql
-- virtual_cards
id, user_id, budget_id, card_type, category, 
provider, card_number (encrypted), cvv (encrypted), 
expiry_date, allocated_amount, spent_amount, 
status, created_at, updated_at

-- card_transactions
id, card_id, amount, currency, merchant, 
description, status, authorization_code, 
settled_at, created_at
```

---

## API Documentation

All APIs follow OpenAPI 3.0 specification.

**Documentation URLs:**
- Auth API: http://localhost:4001/docs
- Core API: http://localhost:4002/docs
- Card API: http://localhost:4003/docs
- AI Service: http://localhost:8000/docs

---

## Monitoring & Logging

### Logging Structure

```json
{
  "timestamp": "2026-01-31T12:00:00Z",
  "level": "info",
  "service": "core-api",
  "traceId": "abc123",
  "userId": "user_123",
  "message": "Transaction categorized",
  "metadata": {
    "transactionId": "txn_456",
    "category": "food",
    "confidence": 0.92
  }
}
```

### Metrics to Track

**Application Metrics:**
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users (DAU, MAU)

**Business Metrics:**
- Signups per day
- Bank connections per day
- Cards issued per day
- Transactions processed
- Budget adherence rate

**Infrastructure Metrics:**
- CPU usage (%)
- Memory usage (%)
- Database connections
- Redis hit rate
- API latency

---

## Security Checklist

- [ ] All secrets in environment variables (not code)
- [ ] Database credentials rotated monthly
- [ ] API keys have rate limits
- [ ] All endpoints have authentication
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.3 for all connections
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection enabled
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] Dependency scanning (Snyk/Dependabot)
- [ ] Regular security audits
- [ ] Incident response plan documented

---

## Git Workflow

### Branch Strategy

```
main                    # Production
├── staging            # Staging environment
└── develop            # Development
    ├── feature/auth-flow
    ├── feature/card-issuance
    └── bugfix/transaction-sync
```

### Commit Convention

```
feat: Add virtual card creation endpoint
fix: Resolve transaction categorization bug
docs: Update API documentation
refactor: Optimize budget calculation logic
test: Add unit tests for auth service
chore: Update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

---

**Last Updated:** January 31, 2026
