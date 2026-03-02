# Flynt Finance - MVP Demo Plan for Investors

## Executive Summary

**Goal:** Build a functional, investor-ready MVP in **4-6 weeks** that demonstrates core value proposition while maintaining production-grade architecture for easy scaling.

**Demo Duration:** 10-15 minutes
**Target:** Seed investors, potential partners
**Key Message:** "AI-powered spending control that prevents overspending before it happens"

---

## MVP Scope: The "Wow Moment" Features

### ✅ Must-Have (Core Demo)

1. **Onboarding Flow** (2 minutes)
   - Phone/email signup with OTP
   - Quick profile setup
   - Bank connection (demo mode with realistic data)

2. **Transaction Intelligence** (3 minutes)
   - Auto-categorized transaction history
   - Visual spending breakdown by category
   - "Money leaks" detection (subscriptions, recurring charges)

3. **Budget Creation** (2 minutes)
   - AI-suggested budget allocation
   - Interactive sliders for adjustment
   - Visual representation of budget split

4. **Virtual Card Magic** (3 minutes)
   - Instant card creation
   - Real-time authorization demo
   - **Card decline with clear explanation** (the "wow" moment)
   - Budget enforcement visualization

5. **Predictive Insights** (2 minutes)
   - "You'll exceed food budget in 4 days" alert
   - Subscription detection notification
   - Spending trend predictions

6. **Dashboard Overview** (2 minutes)
   - Clean, modern UI
   - Real-time budget status
   - Quick actions (freeze card, adjust budget)

### ❌ Exclude from MVP Demo

- Marketplace (not core differentiator)
- Investment suggestions (future feature)
- Multiple bank accounts (use single account)
- Credit score (regulatory complexity)
- Mobile app (web demo sufficient)
- Real payment processing (demo mode)

---

## Technical Architecture (MVP)

### Simplified Stack

```
┌─────────────────────────────────────────┐
│         Next.js Web App                  │
│  (Frontend + API Routes as BFF)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Backend Services                 │
│  ┌──────────┐  ┌──────────┐            │
│  │ Auth API │  │ Core API │            │
│  └──────────┘  └──────────┘            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Layer                       │
│  ┌──────────┐  ┌──────────┐            │
│  │PostgreSQL│  │  Redis   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

**Simplifications:**
- Single monorepo (not microservices)
- Demo mode for bank/card APIs (no real integrations yet)
- Rule-based categorization (ML later)
- In-memory job queue (not Celery)

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Zustand (state)
- React Query (data fetching)

**Backend:**
- Next.js API Routes (BFF pattern)
- Prisma ORM
- PostgreSQL 15
- Redis 7

**Demo Mode:**
- Mock bank API responses
- Simulated card authorization
- Pre-seeded realistic data

---

## Database Schema (MVP)

```prisma
// schema.prisma

model User {
  id                String   @id @default(cuid())
  phone             String   @unique
  email             String?  @unique
  name              String
  country           String   @default("Nigeria")
  monthlyIncome     Int?
  savingsPriority   String?  // 'low' | 'medium' | 'high'
  riskTolerance     String?  // 'low' | 'medium' | 'high'
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  accounts          BankAccount[]
  budgets           Budget[]
  cards             VirtualCard[]
  insights          Insight[]
}

model BankAccount {
  id            String   @id @default(cuid())
  userId        String
  accountName   String
  accountNumber String
  bankName      String
  balance       Int      // in kobo
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  transactions  Transaction[]
}

model Transaction {
  id              String   @id @default(cuid())
  accountId       String
  amount          Int      // in kobo
  type            String   // 'debit' | 'credit'
  category        String
  description     String
  merchant        String?
  date            DateTime
  isRecurring     Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  account         BankAccount @relation(fields: [accountId], references: [id])
  
  @@index([accountId, date])
}

model Budget {
  id                  String   @id @default(cuid())
  userId              String
  period              String   // 'monthly'
  totalIncome         Int      // in kobo
  essentials          Int      // allocated amount
  discretionary       Int      // allocated amount
  savings             Int      // allocated amount
  essentialsSpent     Int      @default(0)
  discretionarySpent  Int      @default(0)
  startDate           DateTime
  endDate             DateTime
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())
  
  user                User     @relation(fields: [userId], references: [id])
  cards               VirtualCard[]
}

model VirtualCard {
  id              String   @id @default(cuid())
  userId          String
  budgetId        String
  cardType        String   // 'primary' | 'category'
  category        String?  // 'discretionary' | 'essentials'
  lastFour        String
  allocatedAmount Int      // in kobo
  spentAmount     Int      @default(0)
  status          String   @default("active") // 'active' | 'frozen'
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id])
  budget          Budget   @relation(fields: [budgetId], references: [id])
  authorizations  CardAuthorization[]
}

model CardAuthorization {
  id          String   @id @default(cuid())
  cardId      String
  amount      Int      // in kobo
  merchant    String
  approved    Boolean
  declineReason String?
  createdAt   DateTime @default(now())
  
  card        VirtualCard @relation(fields: [cardId], references: [id])
}

model Insight {
  id          String   @id @default(cuid())
  userId      String
  type        String   // 'warning' | 'info' | 'success'
  category    String   // 'spending' | 'subscription' | 'prediction'
  title       String
  message     String
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## Demo Flow Script

### Scene 1: The Problem (30 seconds)
**Narrator:** "Meet Sarah. She earns ₦300,000 monthly but always runs out of money by day 20."

**Screen:** Show messy bank statement, confused user

### Scene 2: Onboarding (2 minutes)
**Action:**
1. Sign up with phone number
2. Enter OTP (pre-filled for demo)
3. Quick profile: Name, income range
4. Connect bank (instant in demo mode)

**Screen:** Clean, modern UI with progress indicators

### Scene 3: Intelligence (3 minutes)
**Action:**
1. Show transaction history (auto-categorized)
2. Highlight spending breakdown chart
3. Surface insight: "You spent ₦45,000 on food delivery last month"
4. Detect subscriptions: "Found 3 subscriptions totaling ₦12,000/month"

**Screen:** Beautiful data visualizations, clear insights

### Scene 4: Budget Setup (2 minutes)
**Action:**
1. Flynt suggests: 50% essentials, 30% discretionary, 20% savings
2. User adjusts sliders
3. Confirm allocation
4. Show budget dashboard

**Screen:** Interactive, intuitive controls

### Scene 5: The Magic - Virtual Card (4 minutes)
**Action:**
1. Create virtual card for discretionary spending
2. Allocate ₦90,000 to card
3. **Demo transaction 1:** ₦5,000 purchase → Approved ✅
4. Budget updates in real-time
5. **Demo transaction 2:** ₦100,000 purchase → Declined ❌
6. Show clear message: "This would exceed your discretionary budget by ₦15,000"
7. Option to adjust budget or use different card

**Screen:** Card animation, real-time updates, clear feedback

**Investor Reaction:** "Wait, it actually stops you from overspending?"

### Scene 6: Predictions (2 minutes)
**Action:**
1. Show insight: "At current rate, you'll exceed food budget in 4 days"
2. Suggestion: "Consider cooking at home 2x this week to save ₦8,000"
3. Show spending trend chart with prediction line

**Screen:** Predictive analytics, actionable recommendations

### Scene 7: Results (1 minute)
**Action:**
1. Show Sarah's progress: "Saved ₦60,000 in first month"
2. Budget adherence: 85%
3. Money leaks eliminated: ₦12,000/month

**Screen:** Success metrics, testimonial-style

---

## Implementation Phases (4-6 Weeks)

### Week 1: Foundation
**Tasks:**
- [ ] Project setup (Next.js, Prisma, PostgreSQL)
- [ ] Database schema and migrations
- [ ] Authentication (phone + OTP)
- [ ] Basic UI components (buttons, cards, inputs)

**Deliverable:** Working auth flow

### Week 2: Data Layer
**Tasks:**
- [ ] Demo bank data seeder (realistic transactions)
- [ ] Transaction categorization (rule-based)
- [ ] Spending analytics calculations
- [ ] Subscription detection logic

**Deliverable:** Transaction history with categories

### Week 3: Budget & Cards
**Tasks:**
- [ ] Budget creation flow
- [ ] Budget allocation logic
- [ ] Virtual card creation
- [ ] Card authorization simulator
- [ ] Real-time budget updates

**Deliverable:** Working card authorization demo

### Week 4: Intelligence & UI Polish
**Tasks:**
- [ ] Insight generation engine
- [ ] Spending predictions (simple algorithm)
- [ ] Dashboard with charts
- [ ] UI polish and animations
- [ ] Demo mode toggle

**Deliverable:** Complete demo flow

### Week 5-6: Testing & Refinement
**Tasks:**
- [ ] User testing with 5-10 people
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Demo script rehearsal
- [ ] Deployment to production URL

**Deliverable:** Investor-ready demo

---

## File Structure

```
flynt-finance/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── transactions/
│   │   ├── budget/
│   │   ├── cards/
│   │   └── insights/
│   ├── api/
│   │   ├── auth/
│   │   ├── transactions/
│   │   ├── budget/
│   │   ├── cards/
│   │   └── insights/
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn components
│   ├── auth/
│   ├── dashboard/
│   ├── budget/
│   ├── cards/
│   └── insights/
├── lib/
│   ├── db.ts            # Prisma client
│   ├── auth.ts          # Auth utilities
│   ├── demo.ts          # Demo mode helpers
│   ├── categorize.ts    # Transaction categorization
│   └── insights.ts      # Insight generation
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts          # Demo data
└── public/
    └── logo.png
```

---

## Key Features Implementation

### 1. Demo Mode Toggle

```typescript
// lib/demo.ts
export const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

export const getDemoUser = () => ({
  id: 'demo-user',
  name: 'Sarah Okafor',
  phone: '+234 801 234 5678',
  monthlyIncome: 300000,
});

export const getDemoTransactions = () => [
  {
    amount: -5000,
    category: 'Food',
    merchant: 'Uber Eats',
    date: new Date('2026-01-25'),
  },
  // ... more realistic transactions
];
```

### 2. Rule-Based Categorization

```typescript
// lib/categorize.ts
const CATEGORY_RULES = {
  food: ['uber eats', 'jumia food', 'restaurant', 'kfc', 'dominos'],
  transport: ['uber', 'bolt', 'taxi', 'fuel', 'petrol'],
  bills: ['dstv', 'gotv', 'electricity', 'water', 'internet'],
  subscriptions: ['netflix', 'spotify', 'apple', 'youtube premium'],
  shopping: ['jumia', 'konga', 'amazon', 'shoprite'],
};

export const categorizeTransaction = (description: string): string => {
  const lower = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
};
```

### 3. Card Authorization Logic

```typescript
// app/api/cards/authorize/route.ts
export async function POST(request: Request) {
  const { cardId, amount, merchant } = await request.json();
  
  const card = await prisma.virtualCard.findUnique({
    where: { id: cardId },
    include: { budget: true },
  });
  
  if (!card) {
    return NextResponse.json({ approved: false, reason: 'Card not found' });
  }
  
  const remaining = card.allocatedAmount - card.spentAmount;
  
  if (amount > remaining) {
    await prisma.cardAuthorization.create({
      data: {
        cardId,
        amount,
        merchant,
        approved: false,
        declineReason: `Insufficient budget. ₦${(remaining / 100).toFixed(2)} remaining.`,
      },
    });
    
    return NextResponse.json({
      approved: false,
      reason: `This would exceed your ${card.category} budget by ₦${((amount - remaining) / 100).toFixed(2)}`,
      remaining: remaining / 100,
    });
  }
  
  // Approve and update
  await prisma.$transaction([
    prisma.cardAuthorization.create({
      data: { cardId, amount, merchant, approved: true },
    }),
    prisma.virtualCard.update({
      where: { id: cardId },
      data: { spentAmount: { increment: amount } },
    }),
  ]);
  
  return NextResponse.json({ approved: true });
}
```

### 4. Insight Generation

```typescript
// lib/insights.ts
export const generateInsights = async (userId: string) => {
  const budget = await getCurrentBudget(userId);
  const transactions = await getRecentTransactions(userId);
  
  const insights: Insight[] = [];
  
  // Spending velocity check
  const daysInPeriod = differenceInDays(budget.endDate, budget.startDate);
  const daysElapsed = differenceInDays(new Date(), budget.startDate);
  const expectedSpent = (budget.discretionary * daysElapsed) / daysInPeriod;
  
  if (budget.discretionarySpent > expectedSpent * 1.2) {
    const daysRemaining = differenceInDays(budget.endDate, new Date());
    insights.push({
      type: 'warning',
      category: 'prediction',
      title: 'Budget Alert',
      message: `At current rate, you'll exceed discretionary budget in ${daysRemaining} days`,
    });
  }
  
  // Subscription detection
  const subscriptions = detectSubscriptions(transactions);
  if (subscriptions.length > 0) {
    const total = subscriptions.reduce((sum, s) => sum + s.amount, 0);
    insights.push({
      type: 'info',
      category: 'subscription',
      title: 'Subscriptions Found',
      message: `${subscriptions.length} subscriptions totaling ₦${(total / 100).toFixed(2)}/month`,
    });
  }
  
  return insights;
};
```

---

## UI Components (Key Screens)

### Dashboard Overview

```typescript
// app/(dashboard)/overview/page.tsx
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const budget = await getCurrentBudget(user.id);
  const insights = await generateInsights(user.id);
  
  return (
    <div className="space-y-6">
      <BudgetSummaryCard budget={budget} />
      <SpendingChart budget={budget} />
      <InsightsFeed insights={insights} />
      <QuickActions />
    </div>
  );
}
```

### Virtual Card Display

```typescript
// components/cards/VirtualCard.tsx
export function VirtualCard({ card }: { card: VirtualCard }) {
  const remaining = card.allocatedAmount - card.spentAmount;
  const percentUsed = (card.spentAmount / card.allocatedAmount) * 100;
  
  return (
    <div className="relative aspect-[1.586] rounded-xl bg-gradient-to-br from-brand-deep-teal to-brand-teal p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">Flynt Card</p>
          <p className="text-xs opacity-60 mt-1">{card.category}</p>
        </div>
        <Badge variant={card.status === 'active' ? 'success' : 'default'}>
          {card.status}
        </Badge>
      </div>
      
      <div className="mt-8">
        <p className="text-xs opacity-60">Available Balance</p>
        <p className="text-3xl font-bold mt-1">
          ₦{(remaining / 100).toLocaleString()}
        </p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Spent</span>
          <span>{percentUsed.toFixed(0)}%</span>
        </div>
        <Progress value={percentUsed} className="h-1" />
      </div>
      
      <div className="mt-6 font-mono text-lg tracking-wider">
        •••• •••• •••• {card.lastFour}
      </div>
    </div>
  );
}
```

---

## Demo Data Seeding

```typescript
// prisma/seed.ts
async function main() {
  // Create demo user
  const user = await prisma.user.create({
    data: {
      phone: '+2348012345678',
      email: 'sarah@example.com',
      name: 'Sarah Okafor',
      country: 'Nigeria',
      monthlyIncome: 30000000, // ₦300,000 in kobo
      savingsPriority: 'medium',
      riskTolerance: 'medium',
    },
  });
  
  // Create bank account
  const account = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      accountName: 'Sarah Okafor',
      accountNumber: '0123456789',
      bankName: 'GTBank',
      balance: 8500000, // ₦85,000
    },
  });
  
  // Create realistic transactions
  const transactions = [
    { amount: -500000, category: 'Food', merchant: 'Uber Eats', date: '2026-01-25' },
    { amount: -200000, category: 'Transport', merchant: 'Uber', date: '2026-01-24' },
    { amount: -1500000, category: 'Bills', merchant: 'DSTV', date: '2026-01-23' },
    // ... more transactions
  ];
  
  for (const txn of transactions) {
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        ...txn,
        type: txn.amount < 0 ? 'debit' : 'credit',
        description: txn.merchant,
        date: new Date(txn.date),
      },
    });
  }
  
  // Create budget
  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      period: 'monthly',
      totalIncome: 30000000,
      essentials: 15000000,
      discretionary: 9000000,
      savings: 6000000,
      essentialsSpent: 5000000,
      discretionarySpent: 3000000,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    },
  });
  
  // Create virtual card
  await prisma.virtualCard.create({
    data: {
      userId: user.id,
      budgetId: budget.id,
      cardType: 'primary',
      category: 'discretionary',
      lastFour: '4242',
      allocatedAmount: 9000000,
      spentAmount: 3000000,
    },
  });
}
```

---

## Deployment Strategy

### Development
```bash
npm run dev
# http://localhost:3000
```

### Production (Vercel)
```bash
# Connect to Vercel
vercel link

# Deploy
vercel --prod

# Custom domain
flynt-demo.vercel.app
```

### Environment Variables
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_DEMO_MODE=true
```

---

## Investor Presentation Checklist

### Before Demo
- [ ] Seed database with realistic data
- [ ] Test all flows end-to-end
- [ ] Ensure fast loading (< 2s)
- [ ] Check mobile responsiveness
- [ ] Prepare backup (video recording)

### During Demo
- [ ] Start with the problem statement
- [ ] Show smooth onboarding
- [ ] Highlight auto-categorization
- [ ] **Emphasize the card decline moment**
- [ ] Show predictive insights
- [ ] End with results/metrics

### After Demo
- [ ] Share live demo link
- [ ] Provide GitHub access (if requested)
- [ ] Send technical documentation
- [ ] Schedule follow-up

---

## Success Metrics for MVP

### Technical
- [ ] Page load < 2 seconds
- [ ] Zero errors in demo flow
- [ ] Works on mobile + desktop
- [ ] Smooth animations

### Business
- [ ] Clearly demonstrates value prop
- [ ] Investors understand the "magic"
- [ ] Questions focus on scale, not concept
- [ ] Positive feedback on UX

---

## Extensibility Plan

**This MVP is production-ready because:**

1. **Clean Architecture:** Separation of concerns, easy to add services
2. **Type Safety:** TypeScript prevents runtime errors
3. **Database Schema:** Designed for scale, easy to extend
4. **API Design:** RESTful, versioned, documented
5. **Component Library:** Reusable, consistent UI
6. **Demo Mode:** Toggle for real integrations later

**Post-MVP Extensions:**
- Replace demo mode with real Okra/Paystack APIs
- Add ML categorization model
- Implement background jobs (Bull)
- Add mobile app (React Native)
- Scale infrastructure (ECS, Redis Cluster)

---

## Budget & Timeline

**Development Time:** 4-6 weeks
**Team:** 3-4 developers (full-stack, designer)
**Cost:** $20k-30k (if outsourced)

**Breakdown:**
- Week 1: Foundation ($5k)
- Week 2: Data layer ($5k)
- Week 3: Cards & budget ($7k)
- Week 4: Polish & testing ($5k)
- Weeks 5-6: Refinement ($8k)

---

## Next Steps

1. **Approve scope** - Confirm MVP features
2. **Assign team** - 3-4 developers + designer
3. **Setup infrastructure** - Vercel, PostgreSQL, GitHub
4. **Week 1 kickoff** - Start with auth flow
5. **Weekly demos** - Show progress to stakeholders
6. **Week 4 review** - Full demo rehearsal
7. **Investor pitch** - Schedule presentations

---

**This MVP will demonstrate that Flynt isn't just another budget tracker—it's a spending control system that actually works.**
