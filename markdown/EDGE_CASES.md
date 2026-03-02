# Flynt Finance - Edge Cases & Caveats

## Critical Edge Cases

### 1. Transaction Processing

#### 1.1 Duplicate Transactions
**Scenario:** Bank API sends same transaction twice (webhook retry, sync overlap)

**Impact:** Budget incorrectly calculated, user sees duplicate

**Solution:**
```typescript
// Idempotency key based on transaction metadata
const idempotencyKey = `${accountId}_${amount}_${date}_${description}`;
const existing = await Transaction.findOne({ idempotencyKey });
if (existing) return existing; // Skip duplicate
```

**Edge Cases:**
- Legitimate duplicate transactions (two ₦5000 Uber rides same day)
- Partial duplicates (same amount, different merchant)
- Timing issues (transaction appears, disappears, reappears)

**Mitigation:**
- Use provider transaction ID as primary key
- 24-hour deduplication window
- Manual review for flagged duplicates

---

#### 1.2 Pending vs Settled Transactions
**Scenario:** Card authorized for ₦10,000, settles at ₦9,500 (tip removed)

**Impact:** Budget shows ₦10,000 spent, but only ₦9,500 actually charged

**Solution:**
```typescript
// Track both pending and settled amounts
interface Transaction {
  authorizedAmount: number;
  settledAmount: number | null;
  status: 'pending' | 'settled' | 'cancelled';
}

// Budget calculation uses settled when available
const spent = transactions
  .map(t => t.settledAmount ?? t.authorizedAmount)
  .reduce((sum, amt) => sum + amt, 0);
```

**Edge Cases:**
- Authorization expires (7 days typical)
- Partial settlement (₦10k authorized, ₦8k settled, ₦2k refunded)
- Multiple settlements (hotel pre-auth + final charge)

**Mitigation:**
- Release pending amounts after 7 days
- Show pending separately in UI
- Notify user of settlement differences

---

#### 1.3 Refunds & Reversals
**Scenario:** User returns item, merchant issues refund

**Impact:** Budget should be credited back

**Solution:**
```typescript
// Credit refund to original budget period
if (transaction.type === 'credit' && transaction.isRefund) {
  const originalTxn = await findOriginalTransaction(transaction);
  const originalBudget = await Budget.findByDate(originalTxn.date);
  
  if (originalBudget) {
    originalBudget.spent[originalTxn.category] -= transaction.amount;
    await originalBudget.save();
  }
}
```

**Edge Cases:**
- Refund in different budget period (bought in January, refunded in February)
- Partial refunds (₦10k purchase, ₦3k refund)
- Refund to different account (original card expired)
- Merchant credit vs cash refund

**Mitigation:**
- Track refund-to-original-transaction relationship
- Allow budget period adjustments
- Show refunds clearly in transaction history

---

#### 1.4 Currency Conversion
**Scenario:** User shops on Amazon (USD), card in NGN

**Impact:** Amount charged differs from authorization due to FX rate changes

**Solution:**
```typescript
interface CardTransaction {
  amountLocal: number;        // USD amount
  amountBilling: number;      // NGN amount
  currencyLocal: string;      // 'USD'
  currencyBilling: string;    // 'NGN'
  exchangeRate: number;       // Rate at settlement
  fxMarkup: number;          // 2% markup
}

// Deduct NGN equivalent from budget
budget.spent.discretionary += transaction.amountBilling;
```

**Edge Cases:**
- Rate changes between authorization and settlement
- Multi-currency transactions (flight with taxes in different currencies)
- Dynamic currency conversion (merchant offers conversion)

**Mitigation:**
- Show both amounts in UI
- Warn users about FX fees
- Lock in rate at authorization (if provider supports)

---

### 2. Budget Management

#### 2.1 Budget Period Transitions
**Scenario:** User makes purchase at 11:59 PM on last day of month

**Impact:** Which budget period does it belong to?

**Solution:**
```typescript
// Use transaction date, not authorization date
const budgetPeriod = getBudgetPeriod(transaction.date);

// Handle midnight edge case
if (isWithinMinutesOfMidnight(transaction.date, 5)) {
  // Flag for manual review
  await flagTransaction(transaction.id, 'midnight_boundary');
}
```

**Edge Cases:**
- Timezone differences (user in Lagos, merchant in New York)
- Pending transaction crosses boundary
- Budget period changes (weekly to monthly)

**Mitigation:**
- Use user's timezone consistently
- Grace period for boundary transactions
- Clear communication in UI

---

#### 2.2 Over-Allocation Prevention
**Scenario:** User tries to allocate ₦150k when income is ₦100k

**Impact:** Budget math breaks, overspending inevitable

**Solution:**
```typescript
// Validate total allocation <= income
const validateBudget = (budget: Budget) => {
  const total = Object.values(budget.allocations).reduce((a, b) => a + b, 0);
  
  if (total > budget.totalIncome) {
    throw new Error(`Cannot allocate ₦${total} when income is ₦${budget.totalIncome}`);
  }
};
```

**Edge Cases:**
- Income changes mid-period (bonus, salary increase)
- Multiple income sources (salary + side hustle)
- Irregular income (freelancers)

**Mitigation:**
- Lock allocations once set
- Allow income updates with re-allocation
- Suggest percentage-based allocations

---

#### 2.3 Negative Balance
**Scenario:** Multiple pending transactions settle after budget exhausted

**Impact:** Budget shows -₦5,000 discretionary

**Solution:**
```typescript
// Allow negative balance, carry over to next period
if (budget.spent.discretionary > budget.allocations.discretionary) {
  const overage = budget.spent.discretionary - budget.allocations.discretionary;
  
  // Deduct from next period
  const nextBudget = await getNextBudget(budget.userId);
  nextBudget.allocations.discretionary -= overage;
  
  // Notify user
  await sendNotification({
    type: 'budget_overage',
    amount: overage,
    category: 'discretionary'
  });
}
```

**Edge Cases:**
- Multiple negative categories
- Overage exceeds next period's allocation
- User deletes budget before carryover

**Mitigation:**
- Cap carryover at 50% of next period
- Show clear warning in UI
- Allow manual adjustment

---

#### 2.4 Budget Deletion
**Scenario:** User deletes active budget with virtual cards attached

**Impact:** Cards have no budget to check against

**Solution:**
```typescript
// Prevent deletion of active budgets with cards
const deleteBudget = async (budgetId: string) => {
  const cards = await VirtualCard.find({ budgetId, status: 'active' });
  
  if (cards.length > 0) {
    throw new Error('Cannot delete budget with active cards. Freeze cards first.');
  }
  
  // Soft delete
  await Budget.update({ id: budgetId }, { isActive: false, deletedAt: new Date() });
};
```

**Edge Cases:**
- Budget deleted during transaction authorization
- Historical data loss
- Reporting breaks

**Mitigation:**
- Soft delete only
- Freeze cards automatically
- Maintain audit trail

---

### 3. Virtual Card Operations

#### 3.1 Concurrent Authorization Requests
**Scenario:** User makes two purchases simultaneously (online + in-store)

**Impact:** Both might be approved if budget check isn't atomic

**Solution:**
```typescript
// Use Redis distributed lock
const authorizeTransaction = async (cardId: string, amount: number) => {
  const lock = await redis.lock(`card:${cardId}`, 5000); // 5 second timeout
  
  try {
    const budget = await getBudget(cardId);
    const remaining = budget.allocated - budget.spent;
    
    if (amount > remaining) {
      return { approved: false, reason: 'insufficient_budget' };
    }
    
    // Atomic update
    await Budget.increment({ id: budget.id }, { spent: amount });
    return { approved: true };
  } finally {
    await lock.unlock();
  }
};
```

**Edge Cases:**
- Lock timeout during slow database query
- Race condition between lock acquisition
- Multiple cards on same budget

**Mitigation:**
- Pessimistic locking
- Transaction isolation level: SERIALIZABLE
- Retry logic with exponential backoff

---

#### 3.2 Card Decline Scenarios
**Scenario:** Card declined for legitimate purchase

**Impact:** User frustration, potential churn

**Solution:**
```typescript
// Provide clear decline reasons
enum DeclineReason {
  INSUFFICIENT_BUDGET = 'Not enough budget in this category',
  CARD_FROZEN = 'Card is frozen. Unfreeze in app.',
  CARD_EXPIRED = 'Card has expired. Request new card.',
  SUSPICIOUS_ACTIVITY = 'Unusual transaction pattern detected',
  TECHNICAL_ERROR = 'Technical issue. Try again or use backup card.'
}

// Allow instant override
const overrideDecline = async (transactionId: string) => {
  // Temporarily increase budget
  await Budget.increment({ id: budgetId }, { allocated: amount });
  
  // Retry authorization
  return await retryAuthorization(transactionId);
};
```

**Edge Cases:**
- Decline at critical moment (gas station, hospital)
- Merchant retries automatically (multiple declines)
- User doesn't have app access

**Mitigation:**
- SMS notification with override link
- Emergency override code
- Fallback to backup card

---

#### 3.3 Card Number Exposure
**Scenario:** Card details leaked, fraudulent charges

**Impact:** Unauthorized spending, user liability

**Solution:**
```typescript
// Encrypt card details at rest
const encryptCardDetails = (cardNumber: string, cvv: string) => {
  const key = process.env.ENCRYPTION_KEY;
  return {
    cardNumber: encrypt(cardNumber, key),
    cvv: encrypt(cvv, key),
    lastFour: cardNumber.slice(-4) // Store for display
  };
};

// Fraud detection
const detectFraud = async (transaction: Transaction) => {
  const signals = [
    transaction.amount > 10 * averageTransaction,
    transaction.merchant.country !== 'NG',
    transaction.time.hour < 6 || transaction.time.hour > 23,
    multipleDeclinedAttempts(transaction.cardId)
  ];
  
  if (signals.filter(Boolean).length >= 2) {
    await freezeCard(transaction.cardId);
    await notifyUser('suspicious_activity');
  }
};
```

**Edge Cases:**
- False positives (legitimate international purchase)
- User traveling abroad
- Merchant name mismatch

**Mitigation:**
- Travel mode (disable fraud checks)
- Whitelist merchants
- Instant unfreeze option

---

#### 3.4 Card Expiry
**Scenario:** Virtual card expires, user has recurring subscriptions

**Impact:** Subscriptions fail, services interrupted

**Solution:**
```typescript
// Auto-renew cards 30 days before expiry
const renewExpiringCards = async () => {
  const expiringCards = await VirtualCard.find({
    expiryDate: { $lte: addDays(new Date(), 30) },
    status: 'active'
  });
  
  for (const card of expiringCards) {
    const newCard = await issueCard({
      userId: card.userId,
      budgetId: card.budgetId,
      cardType: card.cardType
    });
    
    // Notify user to update subscriptions
    await notifyUser({
      type: 'card_renewal',
      oldCard: card.lastFour,
      newCard: newCard.lastFour
    });
  }
};
```

**Edge Cases:**
- User doesn't update subscription
- Multiple subscriptions on same card
- Card renewal fails

**Mitigation:**
- 60-day advance notice
- List affected subscriptions
- Keep old card active for 30 days

---

### 4. Bank Integration

#### 4.1 Bank API Downtime
**Scenario:** Okra API is down, transactions not syncing

**Impact:** Stale data, incorrect insights

**Solution:**
```typescript
// Multi-provider failover
const syncTransactions = async (userId: string) => {
  const providers = ['okra', 'mono'];
  
  for (const provider of providers) {
    try {
      const transactions = await bankAPI[provider].getTransactions(userId);
      return transactions;
    } catch (error) {
      logger.warn(`${provider} failed, trying next provider`);
      continue;
    }
  }
  
  throw new Error('All bank providers unavailable');
};
```

**Edge Cases:**
- Both providers down simultaneously
- Partial data sync (some accounts succeed, others fail)
- Sync loop (retry storm)

**Mitigation:**
- Exponential backoff
- Circuit breaker pattern
- Manual sync button
- Cached data with staleness indicator

---

#### 4.2 Bank Account Disconnection
**Scenario:** User revokes bank access, or bank blocks Flynt

**Impact:** No transaction data, app becomes useless

**Solution:**
```typescript
// Detect disconnection
const checkBankConnection = async (accountId: string) => {
  try {
    await bankAPI.getBalance(accountId);
  } catch (error) {
    if (error.code === 'UNAUTHORIZED') {
      await BankAccount.update({ id: accountId }, { 
        isActive: false,
        disconnectedAt: new Date(),
        disconnectReason: 'unauthorized'
      });
      
      // Freeze associated cards
      await VirtualCard.update({ accountId }, { status: 'frozen' });
      
      // Notify user
      await sendNotification({
        type: 'bank_disconnected',
        action: 'reconnect_bank'
      });
    }
  }
};
```

**Edge Cases:**
- Temporary disconnection (bank maintenance)
- Permanent disconnection (account closed)
- Partial disconnection (read access lost, not write)

**Mitigation:**
- Daily connection health check
- Reconnection flow in app
- Grace period before freezing cards

---

#### 4.3 Transaction Categorization Errors
**Scenario:** AI categorizes Uber as "Food" instead of "Transport"

**Impact:** Wrong budget bucket, incorrect insights

**Solution:**
```typescript
// Allow user correction, improve model
const correctCategory = async (transactionId: string, newCategory: string) => {
  const transaction = await Transaction.findById(transactionId);
  
  // Store correction for training
  await TrainingData.create({
    description: transaction.description,
    merchant: transaction.merchant,
    amount: transaction.amount,
    oldCategory: transaction.category,
    newCategory: newCategory,
    userId: transaction.userId
  });
  
  // Update transaction
  transaction.category = newCategory;
  transaction.categoryConfidence = 1.0; // User-confirmed
  await transaction.save();
  
  // Retrain model weekly
  scheduleJob('retrain_model', '0 0 * * 0'); // Every Sunday
};
```

**Edge Cases:**
- Merchant name ambiguity ("Shell" = gas or groceries?)
- User-specific categories (gym membership = health or discretionary?)
- Bulk corrections (change all Uber to Transport)

**Mitigation:**
- Confidence threshold (< 0.7 = ask user)
- Learn from corrections
- Category suggestions, not enforcement

---

### 5. AI/ML Issues

#### 5.1 Model Drift
**Scenario:** Spending patterns change, model accuracy drops

**Impact:** Wrong predictions, bad insights

**Solution:**
```typescript
// Monitor model performance
const monitorModelAccuracy = async () => {
  const recentCorrections = await TrainingData.find({
    createdAt: { $gte: subDays(new Date(), 7) }
  });
  
  const accuracy = 1 - (recentCorrections.length / totalPredictions);
  
  if (accuracy < 0.85) {
    logger.alert('Model accuracy dropped to ' + accuracy);
    await triggerRetraining();
  }
};

// Retrain with recent data
const retrain = async () => {
  const trainingData = await TrainingData.find({
    createdAt: { $gte: subMonths(new Date(), 6) }
  });
  
  const model = await trainModel(trainingData);
  await deployModel(model);
};
```

**Edge Cases:**
- Seasonal changes (December spending spike)
- Life events (new baby, job loss)
- Economic changes (inflation, recession)

**Mitigation:**
- Weekly retraining
- Per-user model fine-tuning
- Fallback to rule-based system

---

#### 5.2 Cold Start Problem
**Scenario:** New user has no transaction history

**Impact:** No insights, no predictions

**Solution:**
```typescript
// Use population averages + user inputs
const generateColdStartInsights = async (userId: string) => {
  const user = await User.findById(userId);
  const similarUsers = await User.find({
    monthlyIncomeRange: user.monthlyIncomeRange,
    country: user.country
  });
  
  // Average spending by category
  const avgSpending = await Transaction.aggregate([
    { $match: { userId: { $in: similarUsers.map(u => u.id) } } },
    { $group: { _id: '$category', avg: { $avg: '$amount' } } }
  ]);
  
  return {
    type: 'cold_start',
    message: `Users like you typically spend ₦${avgSpending.food.avg} on food`,
    confidence: 0.5
  };
};
```

**Edge Cases:**
- No similar users (unique income/location)
- User rejects population insights
- Privacy concerns (don't want to be compared)

**Mitigation:**
- Generic insights first week
- Rapid learning from first transactions
- Opt-out of comparisons

---

### 6. Security & Fraud

#### 6.1 Account Takeover
**Scenario:** Attacker gains access to user account

**Impact:** Unauthorized card creation, spending

**Solution:**
```typescript
// Detect suspicious activity
const detectAccountTakeover = async (userId: string, request: Request) => {
  const signals = [
    newDeviceFingerprint(request),
    newIPAddress(request),
    newLocation(request),
    passwordChanged(userId),
    emailChanged(userId),
    multipleFailedLogins(userId)
  ];
  
  const riskScore = signals.filter(Boolean).length;
  
  if (riskScore >= 3) {
    // Lock account
    await User.update({ id: userId }, { isLocked: true });
    
    // Freeze all cards
    await VirtualCard.update({ userId }, { status: 'frozen' });
    
    // Require re-verification
    await sendOTP(userId, 'account_verification');
  }
};
```

**Edge Cases:**
- Legitimate device change (new phone)
- VPN usage (IP changes)
- Shared devices (family computer)

**Mitigation:**
- Risk-based authentication
- Step-up verification (biometrics)
- Account recovery flow

---

#### 6.2 Phishing Attacks
**Scenario:** User receives fake email asking for card details

**Impact:** Credentials stolen, account compromised

**Solution:**
```typescript
// Educate users
const securityReminders = [
  'Flynt will never ask for your card CVV',
  'Always check the URL: flynt.finance',
  'Enable biometric login for extra security'
];

// Detect phishing attempts
const detectPhishing = async (email: string) => {
  const suspiciousPatterns = [
    /verify.*account/i,
    /urgent.*action/i,
    /click.*here/i,
    /suspended.*account/i
  ];
  
  if (suspiciousPatterns.some(p => p.test(email.body))) {
    await reportPhishing(email);
  }
};
```

**Edge Cases:**
- Sophisticated phishing (exact brand replica)
- SMS phishing (smishing)
- Voice phishing (vishing)

**Mitigation:**
- DMARC/SPF/DKIM email authentication
- In-app notifications only
- Security awareness training

---

### 7. Regulatory & Compliance

#### 7.1 KYC Verification Failure
**Scenario:** User's BVN doesn't match provided name

**Impact:** Account limited, can't issue cards

**Solution:**
```typescript
// Tiered access
const enforceKYCLimits = async (userId: string) => {
  const user = await User.findById(userId);
  
  const limits = {
    tier1: { dailyLimit: 50000, cardLimit: 0 },    // Phone only
    tier2: { dailyLimit: 200000, cardLimit: 1 },   // + BVN
    tier3: { dailyLimit: 5000000, cardLimit: 5 }   // + ID + Address
  };
  
  return limits[user.kycTier];
};
```

**Edge Cases:**
- Name mismatch (married name, nickname)
- BVN linked to different phone
- Expired ID documents

**Mitigation:**
- Manual review process
- Document upload option
- Clear error messages

---

#### 7.2 Transaction Limits
**Scenario:** User tries to spend ₦6M in one day (exceeds CBN limit)

**Impact:** Transaction declined by regulator, not Flynt

**Solution:**
```typescript
// Enforce regulatory limits
const checkRegulatoryLimits = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  const todaySpending = await getTodaySpending(userId);
  
  const limits = {
    tier1: 50000,
    tier2: 200000,
    tier3: 5000000
  };
  
  if (todaySpending + amount > limits[user.kycTier]) {
    return {
      approved: false,
      reason: 'daily_limit_exceeded',
      limit: limits[user.kycTier],
      spent: todaySpending
    };
  }
};
```

**Edge Cases:**
- Limit resets at midnight (timezone issues)
- Multiple accounts (circumventing limits)
- Business vs personal limits

**Mitigation:**
- Clear limit display in app
- Upgrade KYC tier prompt
- Split large purchases

---

### 8. User Experience Edge Cases

#### 8.1 Offline Mode
**Scenario:** User has no internet, needs to check budget

**Impact:** App unusable

**Solution:**
```typescript
// Cache critical data
const cacheStrategy = {
  budget: { ttl: 3600, staleWhileRevalidate: true },
  transactions: { ttl: 1800, staleWhileRevalidate: true },
  cards: { ttl: 7200, staleWhileRevalidate: true }
};

// Offline-first architecture
const getBudget = async (userId: string) => {
  try {
    const budget = await api.getBudget(userId);
    await cache.set(`budget:${userId}`, budget);
    return budget;
  } catch (error) {
    const cached = await cache.get(`budget:${userId}`);
    if (cached) {
      return { ...cached, isStale: true };
    }
    throw error;
  }
};
```

**Edge Cases:**
- Stale data (budget changed, user doesn't know)
- Offline actions (queue for sync)
- Conflict resolution (offline edit + online edit)

**Mitigation:**
- Clear staleness indicators
- Sync queue with retry
- Last-write-wins conflict resolution

---

#### 8.2 Timezone Issues
**Scenario:** User travels to different timezone

**Impact:** Budget period confusion, transaction times wrong

**Solution:**
```typescript
// Store all times in UTC, display in user timezone
const formatTransactionTime = (transaction: Transaction, userTimezone: string) => {
  return format(transaction.date, 'PPpp', { 
    timeZone: userTimezone 
  });
};

// Budget period based on user timezone
const getCurrentBudgetPeriod = (userId: string) => {
  const user = await User.findById(userId);
  const now = utcToZonedTime(new Date(), user.timezone);
  return getBudgetPeriod(now);
};
```

**Edge Cases:**
- Daylight saving time transitions
- Crossing date line
- Timezone auto-detection wrong

**Mitigation:**
- Always store UTC
- Allow manual timezone override
- Test DST transitions

---

### 9. Performance Edge Cases

#### 9.1 Large Transaction History
**Scenario:** User has 10,000+ transactions

**Impact:** Slow queries, UI lag

**Solution:**
```typescript
// Pagination + indexing
const getTransactions = async (userId: string, page: number = 1) => {
  const limit = 50;
  const offset = (page - 1) * limit;
  
  return await Transaction.find({ userId })
    .sort({ date: -1 })
    .skip(offset)
    .limit(limit)
    .lean(); // Don't hydrate Mongoose models
};

// Database indexes
db.transactions.createIndex({ userId: 1, date: -1 });
db.transactions.createIndex({ userId: 1, category: 1, date: -1 });
```

**Edge Cases:**
- Infinite scroll (memory leak)
- Search across all transactions (slow)
- Export all data (timeout)

**Mitigation:**
- Virtual scrolling
- Elasticsearch for search
- Background export job

---

#### 9.2 Webhook Storms
**Scenario:** Bank sends 1000 webhooks in 1 second

**Impact:** Server overload, dropped requests

**Solution:**
```typescript
// Rate limiting + queue
const webhookHandler = async (req: Request, res: Response) => {
  // Acknowledge immediately
  res.status(200).send('OK');
  
  // Queue for processing
  await queue.add('process_webhook', {
    provider: req.body.provider,
    data: req.body,
    receivedAt: new Date()
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
};

// Process queue with concurrency limit
queue.process('process_webhook', 10, async (job) => {
  await processWebhook(job.data);
});
```

**Edge Cases:**
- Duplicate webhooks (idempotency)
- Out-of-order webhooks (transaction before account)
- Webhook replay attacks

**Mitigation:**
- Idempotency keys
- Webhook signature verification
- Timestamp validation

---

## Testing Strategy for Edge Cases

### Unit Tests
```typescript
describe('Budget Allocation', () => {
  it('should prevent over-allocation', () => {
    expect(() => {
      createBudget({ income: 100000, allocations: { total: 150000 } });
    }).toThrow('Cannot allocate more than income');
  });
  
  it('should handle negative balance', () => {
    const budget = createBudget({ income: 100000, allocations: { discretionary: 50000 } });
    budget.spend('discretionary', 60000);
    expect(budget.spent.discretionary).toBe(60000);
    expect(budget.remaining.discretionary).toBe(-10000);
  });
});
```

### Integration Tests
```typescript
describe('Card Authorization', () => {
  it('should handle concurrent requests', async () => {
    const card = await createCard({ budget: 10000 });
    
    // Simulate 2 simultaneous purchases
    const [result1, result2] = await Promise.all([
      authorizeTransaction(card.id, 6000),
      authorizeTransaction(card.id, 6000)
    ]);
    
    // Only one should succeed
    expect([result1.approved, result2.approved]).toContain(false);
  });
});
```

### E2E Tests
```typescript
test('Budget period transition', async ({ page }) => {
  // Set system time to 11:58 PM
  await page.clock.setTime('2026-01-31T23:58:00');
  
  // Make purchase
  await page.goto('/cards');
  await page.click('[data-testid="primary-card"]');
  await page.fill('[data-testid="amount"]', '5000');
  await page.click('[data-testid="authorize"]');
  
  // Verify charged to correct period
  await page.goto('/budget');
  expect(await page.textContent('[data-testid="january-spent"]')).toContain('5000');
});
```

---

## Monitoring & Alerts

### Critical Alerts
- Card authorization latency > 500ms
- Transaction sync failure rate > 5%
- Model accuracy < 85%
- Bank API downtime
- Fraud detection triggered

### Metrics to Track
- Edge case frequency (how often each occurs)
- Resolution time (how long to fix)
- User impact (how many users affected)
- False positive rate (incorrect edge case detection)

---

**Last Updated:** January 31, 2026  
**Maintained By:** Engineering Team
