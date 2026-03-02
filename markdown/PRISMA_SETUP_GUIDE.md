# Prisma Setup Guide - Step by Step

Complete guide to setting up Prisma for Flynt Finance MVP.

---

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ PostgreSQL 15+ running (local or cloud)
- ✅ Project dependencies installed (`npm install`)

---

## Step 1: Verify Prisma Installation

Check if Prisma is already installed:

```bash
npx prisma --version
```

**Expected output:**
```
prisma                  : 6.19.2
@prisma/client          : Not found
```

If not installed, run:
```bash
npm install prisma @prisma/client
```

---

## Step 2: Setup PostgreSQL Database

### Option A: Local PostgreSQL (Mac)

```bash
# Install PostgreSQL (if not installed)
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb flynt_dev

# Test connection
psql flynt_dev
# Type \q to exit
```

### Option B: Docker

```bash
# Create docker-compose.yml (already exists in project)
docker-compose up -d

# Verify container is running
docker ps | grep postgres
```

### Option C: Cloud Database (Recommended for Demo)

**Neon (Free tier, instant setup):**
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project: "flynt-finance"
4. Copy connection string

**Supabase (Alternative):**
1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings → Database

---

## Step 3: Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Create the file
touch .env.local

# Open in editor
nano .env.local
```

Add the following (replace with your actual database URL):

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/flynt_dev"

# For Neon (cloud):
# DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/flynt_dev?sslmode=require"

# For Supabase (cloud):
# DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEMO_MODE="true"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

Copy the output and replace `your-secret-key-here`.

---

## Step 4: Verify Prisma Schema

Check that schema file exists:

```bash
cat prisma/schema.prisma
```

**Expected output:** Should show the complete schema with User, BankAccount, Transaction, etc.

If file doesn't exist or is incomplete, the schema is already in your project at:
`/Users/developer9/Documents/others/flynt-finance/prisma/schema.prisma`

---

## Step 5: Generate Prisma Client

Generate the Prisma Client (TypeScript types):

```bash
npm run db:generate
```

**Expected output:**
```
✔ Generated Prisma Client (v6.19.2) to ./node_modules/@prisma/client
```

This creates TypeScript types for your database models.

---

## Step 6: Push Schema to Database

Push the schema to create tables:

```bash
npm run db:push
```

**Expected output:**
```
🚀  Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client (v6.19.2)
```

**What this does:**
- Creates all tables (User, BankAccount, Transaction, Budget, VirtualCard, etc.)
- Creates indexes for performance
- Sets up foreign key relationships

**Verify tables were created:**
```bash
# For local PostgreSQL
psql flynt_dev -c "\dt"

# For Docker
docker exec -it flynt-finance-postgres-1 psql -U postgres -d flynt_dev -c "\dt"
```

**Expected output:**
```
                List of relations
 Schema |        Name         | Type  |  Owner   
--------+---------------------+-------+----------
 public | BankAccount         | table | postgres
 public | Budget              | table | postgres
 public | CardAuthorization   | table | postgres
 public | Insight             | table | postgres
 public | OtpCode             | table | postgres
 public | Transaction         | table | postgres
 public | User                | table | postgres
 public | VirtualCard         | table | postgres
```

---

## Step 7: Seed Demo Data

Populate database with demo data:

```bash
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

📧 Demo user: sarah.okafor@example.com
📱 Demo phone: +234 801 234 5678
```

---

## Step 8: Verify Data with Prisma Studio

Open Prisma Studio (database GUI):

```bash
npm run db:studio
```

**Opens:** http://localhost:5555

**What you'll see:**
- All tables listed on the left
- Click "User" → Should see Sarah Okafor
- Click "Transaction" → Should see 14 transactions
- Click "Budget" → Should see January budget
- Click "VirtualCard" → Should see card ending in 4242

---

## Step 9: Test Database Connection in Code

Create a test file to verify connection:

```bash
# Create test file
cat > test-db.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('✅ Database connected!');
  console.log('Users found:', users.length);
  console.log('Demo user:', users[0]?.name);
}

main()
  .catch((e) => {
    console.error('❌ Database connection failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Run test
node test-db.js
```

**Expected output:**
```
✅ Database connected!
Users found: 1
Demo user: Sarah Okafor
```

**Clean up:**
```bash
rm test-db.js
```

---

## Step 10: Start Development Server

Now start the app with database connected:

```bash
npm run dev
```

**Open:** http://localhost:3000/dashboard

The dashboard should now display real data from the database!

---

## Troubleshooting

### Error: "Can't reach database server"

**Check 1:** Is PostgreSQL running?
```bash
# Mac
brew services list | grep postgresql

# Docker
docker ps | grep postgres
```

**Check 2:** Is DATABASE_URL correct?
```bash
echo $DATABASE_URL
# Or check .env.local file
cat .env.local | grep DATABASE_URL
```

**Check 3:** Can you connect manually?
```bash
psql $DATABASE_URL
```

---

### Error: "Environment variable not found: DATABASE_URL"

**Solution:** Create `.env.local` file in project root with DATABASE_URL.

```bash
# Check if file exists
ls -la .env.local

# If not, create it
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/flynt_dev"' > .env.local
```

---

### Error: "Prisma Client not generated"

**Solution:** Regenerate the client:
```bash
npm run db:generate
```

---

### Error: "Table already exists"

**Solution:** Reset database and re-seed:
```bash
npm run db:reset
# This will:
# 1. Drop all tables
# 2. Re-create schema
# 3. Run seed script
```

---

### Error: "Port 5432 already in use"

**Solution:** Another PostgreSQL instance is running:
```bash
# Find process
lsof -i :5432

# Kill it
kill -9 <PID>

# Or use different port in DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5433/flynt_dev"
```

---

### Seed Script Fails

**Solution 1:** Check if tables exist:
```bash
psql $DATABASE_URL -c "\dt"
```

**Solution 2:** Reset and try again:
```bash
npm run db:reset
```

**Solution 3:** Manually delete data:
```bash
psql $DATABASE_URL -c "DELETE FROM \"User\";"
npm run db:seed
```

---

## Useful Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (no migration)
npm run db:push

# Create migration (production)
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database (drops all data!)
npm run db:reset

# Format schema file
npx prisma format
```

---

## Prisma Studio Guide

**Access:** http://localhost:5555 (after running `npm run db:studio`)

**Features:**
- View all tables
- Add/edit/delete records
- Run queries
- Export data

**Useful for:**
- Debugging data issues
- Manually testing scenarios
- Viewing relationships
- Quick data edits

---

## Database Schema Overview

### Tables Created

1. **User** - Demo users (Sarah Okafor)
2. **OtpCode** - OTP verification codes
3. **BankAccount** - Connected bank accounts
4. **Transaction** - All transactions (14 demo transactions)
5. **Budget** - Monthly budgets
6. **VirtualCard** - Virtual cards (1 demo card)
7. **CardAuthorization** - Card authorization history
8. **Insight** - AI-generated insights (3 demo insights)

### Relationships

```
User
 ├── BankAccount (1:many)
 │    └── Transaction (1:many)
 ├── Budget (1:many)
 │    └── VirtualCard (1:many)
 │         └── CardAuthorization (1:many)
 └── Insight (1:many)
```

---

## Next Steps After Setup

1. **Verify UI shows database data:**
   - Go to http://localhost:3000/dashboard
   - Check transactions match database
   - Verify budget numbers are correct

2. **Test Prisma Studio:**
   - Open http://localhost:5555
   - Edit a transaction amount
   - Refresh dashboard to see change

3. **Explore the data:**
   ```bash
   npm run db:studio
   ```

4. **Start building features:**
   - API routes can now use Prisma Client
   - Import from `@/lib/db`
   - Query database in server components

---

## Quick Reference

### Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Example (Local):**
```
postgresql://postgres:password@localhost:5432/flynt_dev
```

**Example (Neon):**
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/flynt_dev?sslmode=require
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_DEMO_MODE="true"
NEXTAUTH_SECRET="<generated-secret>"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Success Checklist

- [ ] PostgreSQL running
- [ ] `.env.local` file created with DATABASE_URL
- [ ] `npm run db:generate` completed
- [ ] `npm run db:push` created tables
- [ ] `npm run db:seed` populated data
- [ ] `npm run db:studio` opens successfully
- [ ] Can see 1 user (Sarah Okafor)
- [ ] Can see 14 transactions
- [ ] Can see 1 budget
- [ ] Can see 1 virtual card
- [ ] Dashboard displays data correctly

---

**You're ready to build! 🚀**

The database is set up, seeded with demo data, and connected to your Next.js app.
