Below is a **clear, MVP-focused breakdown of Flynt’s features and user flow**, from **onboarding → daily usage**, designed to be realistic for an MVP (no fluff, no overbuilding).

---

# Flynt MVP

**Features & User Flow (Onboarding → Active Use)**

## 1. Onboarding Flow (Day 0)

### 1.1 Account Creation

**Goal:** Fast entry, low friction

* Phone number or email signup
* OTP verification
* Basic profile setup:

  * Name
  * Country (Nigeria default)
  * Employment status (optional)
  * Monthly income range (bands, not exact)

**Why MVP:**
Enough data to personalize insights without scaring users off.

---

### 1.2 Financial Connection (Core)

**Goal:** Give Flynt visibility into money flow

* Connect bank account(s)
* Connect debit card(s)
* Read-only access initially:

  * Transaction history
  * Current balance

**Behind the scenes (MVP):**

* Transaction ingestion
* Basic categorization (AI + rules)
* Cash-flow snapshot

---

### 1.3 Spend Personality Setup

**Goal:** Enable predictive logic

* User selects:

  * Savings priority (Low / Medium / High)
  * Risk tolerance (Low / Medium / High)
* Quick prompts:

  * “What drains your money most?” (subscriptions, food, transport, impulse buys)

**MVP Benefit:**
Feeds AI models without long questionnaires.

---

## 2. Financial Intelligence Layer (Week 1 Use)

### 2.1 Transaction Categorization

**What users see:**

* Real-time categorized spending
* Monthly breakdown by category
* “Top 3 money leaks” surfaced automatically

**MVP Scope:**

* Categories: Food, Transport, Bills, Subscriptions, Shopping, Savings
* Editable categories (manual correction improves model)

---

### 2.2 AI Insights Feed

**What users see:**

* Simple, actionable cards:

  * “You’re likely to overspend on food this week”
  * “Your subscriptions consumed 18% of discretionary income”

**Key Rule:**
No long explanations—**one insight, one action**.

---

## 3. Budget Allocation & Control (Core MVP Differentiator)

### 3.1 Smart Budget Setup

**Flow:**

* Flynt auto-suggests budget split:

  * Essentials
  * Discretionary
  * Savings
* User adjusts sliders
* Confirms allocation

**Behind the scenes:**

* Budget logic locked to income
* Prevents over-allocation

---

### 3.2 Virtual Card Issuance (MVP Must-Have)

**What happens:**

* Flynt generates:

  * One primary virtual card
  * Optional category-based cards (e.g. Food card)

**Key Behavior:**

* Cards can only spend what’s allocated
* Declines transactions that exceed budget

**This is the “Flynt moment.”**

---

## 4. Daily Usage Flow (Weeks 1–4)

### 4.1 Spend → Enforced Control

* User attempts purchase
* Flynt checks:

  * Budget bucket
  * Remaining allocation
* Outcome:

  * Approved (within budget)
  * Declined + explanation (budget exceeded)

---

### 4.2 Leakage Detection (Predictive, Not Reactive)

**MVP Logic:**

* Detects:

  * Recurring subscriptions
  * Rapid discretionary burn
* Sends alerts:

  * “If you continue, you’ll exceed discretionary budget in 4 days”

---

## 5. Marketplace Price Intelligence (MVP Lite)

### 5.1 Product Search

**User flow:**

* Search product (e.g. “iPhone 13”)
* Flynt shows:

  * 3–5 verified merchants
  * Price range
  * Trust score

**MVP Scope:**

* Electronics & digital services only
* Affiliate-linked merchants

---

### 5.2 Purchase Guidance

* “Best value” badge
* Estimated savings vs average market price
* One-tap redirect to merchant

**Why MVP-lite:**
Validates behavior before scaling marketplace depth.

---

## 6. Savings → Investing Bridge (Soft MVP)

### 6.1 Excess Cash Detection

* Flynt identifies unspent discretionary balance
* Weekly or monthly prompt:

  * “₦45,000 unused. Invest?”

---

### 6.2 Investment Suggestions (Non-Execution)

**MVP Approach:**

* No in-app trading yet
* Suggestions only:

  * Nigerian stocks / ETFs
  * Risk-aligned recommendations
* Redirect to partner platforms

**Reason:**
Avoid early regulatory and execution complexity.

---

## 7. Credit Visibility (Optional MVP Add-On)

* Soft credit score display
* Simple explanation:

  * What affects it
  * How Flynt improves it (lower utilization, controlled spending)

---

## 8. MVP Feature Summary (What Ships First)

### Must-Have (Non-Negotiable)

* Bank & card connections
* Transaction categorization
* AI insights (basic)
* Budget allocation
* Virtual card with enforced limits

### Should-Have

* Leakage prediction
* Subscription detection
* Excess cash prompts

---