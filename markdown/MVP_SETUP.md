# Flynt Finance MVP - Setup Guide

## Quick Start (5 Minutes)

This guide will get your investor-ready MVP demo running locally.

---

## Prerequisites

- **Node.js** 20+ installed
- **PostgreSQL** 15+ (or Docker)
- **Git** for version control

---

## Step 1: Environment Setup

Create a `.env.local` file in the project root:

```bash
# Database (use your local PostgreSQL or a cloud provider)
DATABASE_URL="postgresql://postgres:password@localhost:5432/flynt_dev"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE="true"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14 (React framework)
- Prisma (database ORM)
- TailwindCSS (styling)
- TypeScript (type safety)
- All required packages

---

## Step 3: Setup Database

### Option A: Local PostgreSQL

```bash
# Start PostgreSQL (if not running)
brew services start postgresql@15

# Create database
createdb flynt_dev
```

### Option B: Docker

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: flynt_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start database
docker-compose up -d
```

---

## Step 4: Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

**Expected output:**
```
🌱 Seeding database...
✅ Created demo user: Sarah Okafor
✅ Created bank account
✅ Created 14 transactions
✅ Created budget
✅ Created virtual card
✅ Created 3 insights
🎉 Database seeded successfully!
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo User Credentials

**Phone:** +234 801 234 5678  
**Email:** sarah.okafor@example.com  
**Name:** Sarah Okafor

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database |

---

## Project Structure

```
flynt-finance/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── demo.ts           # Demo data
│   ├── categorize.ts     # Transaction categorization
│   └── insights.ts       # Insight generation
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── public/               # Static assets
└── docs/                 # Documentation
```

---

## Demo Flow

### 1. Onboarding (Simulated)
- User signup with phone/email
- OTP verification (auto-filled in demo)
- Profile setup

### 2. Dashboard
- View transaction history (14 demo transactions)
- See spending breakdown by category
- View budget status

### 3. Budget Management
- Current budget: ₦300,000/month
- Essentials: ₦150,000 (₦51,500 spent)
- Discretionary: ₦90,000 (₦33,000 spent)
- Savings: ₦60,000

### 4. Virtual Card Demo
- Card number: •••• •••• •••• 4242
- Allocated: ₦90,000
- Spent: ₦33,000
- Remaining: ₦57,000

### 5. Card Authorization Simulator
Test the "wow moment":
- **Approved transaction:** ₦5,000 (within budget)
- **Declined transaction:** ₦100,000 (exceeds budget)

### 6. Insights
- "At current rate, you'll exceed food budget in 4 days"
- "3 subscriptions found totaling ₦2,050/month"
- "You're 15% under budget this month"

---

## Database Schema

### Key Tables

**Users**
- id, phone, email, name, monthlyIncome
- savingsPriority, riskTolerance

**BankAccount**
- id, userId, accountName, accountNumber
- bankName, balance

**Transaction**
- id, accountId, amount, type, category
- description, merchant, date, isRecurring

**Budget**
- id, userId, period, totalIncome
- essentials, discretionary, savings
- essentialsSpent, discretionarySpent

**VirtualCard**
- id, userId, budgetId, cardType
- lastFour, allocatedAmount, spentAmount, status

**CardAuthorization**
- id, cardId, amount, merchant
- approved, declineReason

**Insight**
- id, userId, type, category
- title, message, isRead

---

## Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Prisma Client Not Generated

```bash
# Regenerate client
npm run db:generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Seed Script Fails

```bash
# Reset database
npm run db:reset

# Re-seed
npm run db:seed
```

---

## Viewing Database

### Prisma Studio (Recommended)

```bash
npm run db:studio
```

Opens GUI at [http://localhost:5555](http://localhost:5555)

### psql CLI

```bash
psql $DATABASE_URL

# List tables
\dt

# View users
SELECT * FROM "User";

# View transactions
SELECT * FROM "Transaction" LIMIT 10;
```

---

## Next Steps

### Phase 1: Core UI (Week 1-2)
- [ ] Create dashboard layout
- [ ] Build transaction list component
- [ ] Create budget visualization
- [ ] Design virtual card component

### Phase 2: Functionality (Week 3-4)
- [ ] Implement card authorization API
- [ ] Build budget allocation flow
- [ ] Create insights feed
- [ ] Add real-time updates

### Phase 3: Polish (Week 5-6)
- [ ] Add animations and transitions
- [ ] Optimize performance
- [ ] Test on multiple devices
- [ ] Prepare investor demo script

---

## Demo Checklist

Before showing to investors:

- [ ] Database seeded with realistic data
- [ ] All pages load in < 2 seconds
- [ ] Card authorization demo works flawlessly
- [ ] Insights are relevant and clear
- [ ] UI is polished and professional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Have backup (video recording)

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

### Environment Variables (Vercel)

Add in Vercel dashboard:
- `DATABASE_URL` (use Neon, Supabase, or Railway)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_DEMO_MODE=true`

---

## Support

**Issues?** Check:
1. Node.js version (20+)
2. PostgreSQL running
3. Environment variables set
4. Dependencies installed

**Still stuck?**
- Check `docs/` for detailed guides
- Review error logs
- Ensure database is accessible

---

## Success Metrics

Your MVP is ready when:
- ✅ Demo user can log in
- ✅ Transactions display correctly
- ✅ Budget shows accurate data
- ✅ Card authorization works
- ✅ Insights are generated
- ✅ UI is polished and fast

---

**You're ready to wow investors! 🚀**
