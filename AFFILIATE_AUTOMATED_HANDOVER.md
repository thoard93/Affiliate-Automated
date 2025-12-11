# Affiliate Automated - Complete Project Handover Document

**Date:** December 11, 2025  
**Prepared For:** Gemini (Google AI)  
**Project Owner:** Thomas (thoard93)  
**Business Partner:** Chase @ P&P (Market Mix Media LLC)

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Credentials & API Keys](#credentials--api-keys)
4. [Current Deployment Status](#current-deployment-status)
5. [Database Schema](#database-schema)
6. [Key Files & Code](#key-files--code)
7. [Product Import System](#product-import-system)
8. [TikTok API Integration](#tiktok-api-integration)
9. [Brand Outreach Feature](#brand-outreach-feature)
10. [Pending Tasks](#pending-tasks)
11. [Known Issues](#known-issues)

---

## PROJECT OVERVIEW

### What is Affiliate Automated?

Affiliate Automated (AA) is an MCN (Multi-Channel Network) platform for TikTok Shop affiliate creators. The platform helps 218+ creators earn higher commission rates on TikTok Shop products.

### Business Model

- AA negotiates boosted commission rates with TikTok Shop brands/sellers
- Creators join AA through Discord OAuth
- AA provides products with rates 5-10% higher than open collaboration rates
- Platform tracks creator performance and earnings

### Key Stakeholders

| Person | Role | Contact Method |
|--------|------|----------------|
| Thomas (thoard93) | Developer/Technical Lead | Discord: Thoard Burger - Xtra sauce |
| Chase @ P&P | Business Partner / MCN Manager | Discord |

---

## TECHNICAL ARCHITECTURE

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend | Next.js API Routes |
| Database | PostgreSQL (hosted on Render) |
| ORM | Prisma |
| Auth | NextAuth.js with Discord OAuth |
| Bot | Discord.js |
| Hosting | Render.com |
| Repository | GitHub |

### URLs

| Resource | URL |
|----------|-----|
| **Live Site** | https://affiliate-automated-api.onrender.com |
| **Admin Panel** | https://affiliate-automated-api.onrender.com/admin |
| **Products Page** | https://affiliate-automated-api.onrender.com/admin/products |
| **Import Page** | https://affiliate-automated-api.onrender.com/admin/products/import |
| **GitHub Repo** | https://github.com/thoard93/Affiliate-Automated |

### Project Structure

```
Affiliate-Automated/
├── discord-bot/           # Discord bot for notifications
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/               # Utility scripts
├── src/
│   ├── app/
│   │   ├── admin/         # Admin panel pages
│   │   │   ├── brands/    # Brand outreach page
│   │   │   ├── creators/  # Creator management
│   │   │   ├── products/  # Product catalog + import
│   │   │   ├── commissions/ # Placeholder
│   │   │   ├── settings/  # Placeholder
│   │   │   ├── layout.tsx # Admin sidebar layout
│   │   │   └── page.tsx   # Admin dashboard
│   │   ├── api/           # API routes
│   │   │   ├── admin/
│   │   │   │   └── products/
│   │   │   │       ├── route.ts       # GET products
│   │   │   │       └── import/
│   │   │   │           └── route.ts   # POST import CSV
│   │   │   └── ...
│   │   ├── auth/
│   │   │   └── signin/    # Discord OAuth login
│   │   ├── dashboard/     # Creator dashboard
│   │   └── page.tsx       # Homepage
│   └── lib/               # Utilities
├── public/                # Static assets
└── package.json
```

---

## CREDENTIALS & API KEYS

### Discord OAuth (Production)

```
DISCORD_CLIENT_ID=1312854133222965268
DISCORD_CLIENT_SECRET=1rR2FhOuq7IINzWvUmQ4VlpHVXBYDJxo
```

### Discord Bot

```
DISCORD_BOT_TOKEN=[REDACTED]
Bot Name: Brand Hunter Bot (repurposed for AA)
```

### TikTok Shop Partner API (PENDING APPROVAL)

```
TIKTOK_APP_KEY=6i8139mvgv8ss
TIKTOK_APP_SECRET=4e7ff8f8d245a971a79d2c1068a9a6f544d87f99
Service ID: 7579802912634078989
App Name: AA Comms Bot Attempt #1
Redirect URL: https://affiliate-automated-api.onrender.com/api/tiktok/callback
Status: Draft - Waiting for scope approval
```

**TikTok API Scopes Applied (Under Review):**
1. `creator.affiliate_collaboration.read` - Read Creator Affiliate Collaborations
2. `seller.creator_marketplace.read` - Read Creator Marketplace
3. `creator.showcase.read` - Read Showcase Products
4. `creator.showcase.write` - Manage Showcase Products
5. `partner.tap_campaign.link.write` - Manage Product Promote Links

### Database (Render PostgreSQL)

```
DATABASE_URL=postgresql://[stored in Render environment variables]
```

*Note: The actual connection string is in Render's environment variables. Access via Render Dashboard → affiliate-automated-api → Environment.*

### NextAuth

```
NEXTAUTH_SECRET=[generated secret in Render env vars]
NEXTAUTH_URL=https://affiliate-automated-api.onrender.com
```

---

## CURRENT DEPLOYMENT STATUS

### Render Service Configuration

| Setting | Value |
|---------|-------|
| Service Name | affiliate-automated-api |
| Instance Type | Free tier |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Auto-Deploy | Yes (on GitHub push to main) |

### Environment Variables (Set in Render)

```
DATABASE_URL=<PostgreSQL connection string>
DISCORD_CLIENT_ID=1312854133222965268
DISCORD_CLIENT_SECRET=1rR2FhOuq7IINzWvUmQ4VlpHVXBYDJxo
NEXTAUTH_SECRET=<generated>
NEXTAUTH_URL=https://affiliate-automated-api.onrender.com
TIKTOK_APP_KEY=6i8139mvgv8ss
TIKTOK_APP_SECRET=4e7ff8f8d245a971a79d2c1068a9a6f544d87f99
```

### What's Working ✅

- Homepage with AA branding
- Discord OAuth login
- Creator dashboard (mock data)
- Admin panel with sidebar navigation
- Products list page (`/admin/products`)
- Products import page (`/admin/products/import`)
- Brands outreach page (`/admin/brands`)
- Creators management page (`/admin/creators`)
- Commissions placeholder page
- Settings placeholder page
- 10 test products in database
- Official AA logo across all pages

### What's Not Working ❌

- Export button on Creators page (no functionality)
- Invite Creator button (no functionality)
- Notification bell (no functionality)
- TikTok API integration (pending approval)
- Full 6,700 product import (not done yet)
- Real earnings data (using mock data)

---

## DATABASE SCHEMA

### Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(CREATOR)
  status        Status    @default(PENDING)
  discordId     String?   @unique
  discordTag    String?
  tiktokId      String?
  creatorId     String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Product {
  id                String   @id @default(cuid())
  tiktokProductId   String   @unique
  name              String
  category          String
  shopName          String?
  openCollabRate    Float
  aaCommissionRate  Float
  bonusRate         Float    @default(0)
  priceMin          Float?
  priceMax          Float?
  stockCount        Int      @default(0)
  freeSampleAvailable Boolean @default(false)
  imageUrl          String?
  productUrl        String?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Brand {
  id              String   @id @default(cuid())
  name            String
  shopCode        String?  @unique
  contactEmail    String?
  contactName     String?
  status          BrandStatus @default(NOT_CONTACTED)
  lastContactedAt DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Role {
  CREATOR
  ADMIN
  SUPER_ADMIN
}

enum Status {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum BrandStatus {
  NOT_CONTACTED
  CONTACTED
  IN_NEGOTIATION
  PARTNERED
  DECLINED
}
```

### Current Database Contents

- **Users:** Thomas (thoard93) as SUPER_ADMIN + test creators
- **Products:** 10 test products imported manually
- **Brands:** Empty (ready for brand outreach feature)

---

## KEY FILES & CODE

### Admin Products API Route

**File:** `src/app/api/admin/products/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Products Import API Route

**File:** `src/app/api/admin/products/import/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { csvData } = await request.json();
  const lines = csvData.split('\n').slice(3); // Skip header rows
  let imported = 0, errors = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const cols = line.split(',');
      const productId = cols[1]?.replace(/"/g, '').trim();
      const category = cols[3]?.replace(/"/g, '').trim() || 'Other';
      const name = cols[5]?.replace(/"/g, '').trim();
      const openStr = cols[9]?.replace(/"/g, '').trim();
      
      if (!productId || productId.length < 10 || !name) { errors++; continue; }
      
      let openRate = openStr?.includes('%') ? parseFloat(openStr) / 100 : parseFloat(openStr) || 0.1;
      const aaRate = Math.min(openRate + 0.1, 0.5); // +10% boost, cap at 50%

      await prisma.product.upsert({
        where: { tiktokProductId: productId },
        update: { name: name.substring(0, 255), category, openCollabRate: openRate, aaCommissionRate: aaRate },
        create: { 
          tiktokProductId: productId, 
          name: name.substring(0, 255), 
          category, 
          openCollabRate: openRate, 
          aaCommissionRate: aaRate, 
          bonusRate: 0, 
          priceMin: 0, 
          priceMax: 0, 
          stockCount: 1000, 
          freeSampleAvailable: false 
        }
      });
      imported++;
    } catch { errors++; }
  }
  return NextResponse.json({ imported, errors, total: lines.length });
}
```

### Commission Calculation Logic

```javascript
// Core products: +10% boost above open rate
// Other products: +5% boost above open rate
// Cap at 50% maximum

const productTag = cols[10]?.trim(); // "Core" or "Other"
const boostAmount = productTag === 'Core' ? 0.10 : 0.05;
const aaRate = Math.min(openRate + boostAmount, 0.50);
```

---

## PRODUCT IMPORT SYSTEM

### CSV File Details

**File:** `_External__Q4_2025_TSP_Core_Product_Pool_-_Q4_2025_Campaign_Product_Pool.csv`
**Total Rows:** 6,706 products
**Source:** ByteDance/TikTok Q4 2025 TSP Campaign

### CSV Column Structure (Row 3 = Headers)

| Index | Column Name | Description |
|-------|-------------|-------------|
| 0 | Date | Date added |
| 1 | Product Id | TikTok product ID (19 digits) |
| 2 | Category | Product category type |
| 3 | First Category | Main category |
| 4 | Second Category | Sub category |
| 5 | Product Name | Full product name |
| 6 | detail_url | TikTok product URL |
| 7 | Shop Name | Seller shop name |
| 8 | Shop Code | Unique shop identifier |
| 9 | Open Commission | Current open collab rate (e.g., "10%") |
| 10 | Product Tag | "Core" or "Other" |
| 11+ | Various eligibility flags | SPS Score, Q4 Incentive, etc. |

### Import Process

1. Go to: `https://affiliate-automated-api.onrender.com/admin/products/import`
2. Upload the CSV file
3. Click "Start Import"
4. System parses CSV, calculates AA rates, upserts to database
5. Results show: imported count, errors, total

### Currently Imported (10 Test Products)

1. 3-Pack Black Triangle Shower Caddy (Kitchenware, 10% → 20%)
2. Medicube Glass Glow Skincare Set (Beauty, 15% → 25%)
3. Tarte CC Undereye Corrector (Beauty, 15% → 25%)
4. Crocs Adult Classic Clogs (Shoes, 10% → 20%)
5. Neuro Energy Caffeine Gum (Health, 15% → 25%)
6. GNC Womens 30+ Vitapak (Health, 22% → 32%)
7. Remineralizing Gum Oral Care (Health, 17% → 27%)
8. OQQ Womens Casual Pants (Fashion, 8% → 18%)
9. Rock-Green Polarized Sunglasses (Accessories, 16% → 26%)
10. OQQ 3-Piece Bodysuits (Fashion, 8% → 18%)

---

## TIKTOK API INTEGRATION

### Current Status: PENDING APPROVAL

The TikTok Shop Partner API app has been created but scopes are under review.

### Partner Center Access

- **URL:** https://partner.us.tiktokshop.com
- **Account:** Affiliate Automated (logged in as thoard93)

### API Endpoints Available (After Approval)

| Endpoint | Purpose |
|----------|---------|
| GET Showcase Products | Pull creator's current showcase |
| POST Creator Search Open Collaboration | Search products with commission rates |
| POST Search Target Collaborations | Get targeted collab products |
| POST Search Creator Affiliate Orders | Track sales/commissions |
| GET Creator Sample Application | Sample request details |

### Key Features to Build After API Approval

1. **Auto-sync products** - Pull real commission rates, stock levels daily
2. **Creator showcase sync** - See what products creators have added
3. **Order tracking** - Track sales and commissions per creator
4. **Deep link generation** - Create add-to-showcase links

---

## BRAND OUTREACH FEATURE

### Chase's Request

Automate outreach to TikTok Shop brands/sellers to negotiate higher commission rates for AA creators.

### Research Findings

**TikTok Partner Center has built-in tools:**

1. **Service Proposals** - Send partnership proposals to sellers within TikTok
   - URL: `partner.us.tiktokshop.com/seller/contract/create`
   - Select seller by shop name or shop code
   - Seller receives proposal in their dashboard
   - NO API available for automation

2. **Seller Leads Pool** - TikTok-provided list of potential sellers
   - Visible in Partner Center sidebar
   - Needs exploration to understand capabilities

3. **Seller Management** - Manage existing partnerships
   - Track authorized sellers
   - View service orders

### Automation Options Explored

| Option | Feasibility | Notes |
|--------|-------------|-------|
| TikTok Partner API | ❌ Not possible | No endpoints for service proposals or seller discovery |
| External Email (Smartlead/Instantly) | ✅ Works | $39-97/mo, requires domain warmup, CAN-SPAM compliance |
| Browser Automation | ⚠️ Risky | Could violate ToS, account ban risk |
| Manual with Workflow Helper | ✅ Safe | Build tool to queue sellers, pre-fill forms |

### Recommended Approach

**Use TikTok's built-in Service Proposal system** with a workflow helper tool:

1. Store queue of shop names/codes to contact
2. Track outreach status (not contacted, contacted, in negotiation, partnered, declined)
3. Open TikTok proposal page with pre-filled data
4. Admin clicks submit manually
5. Log responses and follow-ups

This stays within TikTok's ecosystem and has higher response rates than cold email.

---

## PENDING TASKS

### High Priority

| Task | Status | Notes |
|------|--------|-------|
| Import full 6,700 product CSV | ⏳ Ready | Use `/admin/products/import` |
| Wait for TikTok API approval | ⏳ Waiting | Check Partner Center for status |
| Build brand outreach workflow | 📋 Planned | Chase's request |

### Medium Priority

| Task | Status | Notes |
|------|--------|-------|
| Make Export button functional | 📋 Planned | Export creator list to CSV |
| Make Invite Creator button work | 📋 Planned | Generate Discord invite link |
| Add notification system | 📋 Planned | New products, approvals, etc. |
| Real earnings data integration | 📋 Planned | Depends on TikTok API |

### Low Priority

| Task | Status | Notes |
|------|--------|-------|
| Admin redirect for admin users | 📋 Planned | Auto-redirect to /admin instead of /dashboard |
| Product edit functionality | 📋 Planned | Edit individual product details |
| Bulk product updates | 📋 Planned | Update multiple products at once |
| Performance analytics | 📋 Planned | Charts, trends, reports |

---

## KNOWN ISSUES

### 1. Prisma Import Path

**Issue:** Some API routes use `@/lib/prisma` which doesn't exist.
**Solution:** Import directly from `@prisma/client`:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

### 2. Logo Image Reference

**Issue:** Logo must use full GitHub raw URL, not local path.
**Solution:** Use this URL for the logo:

```
https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg
```

### 3. CSV Parsing

**Issue:** Product names with commas break simple split parsing.
**Solution:** Current import handles basic cases. May need proper CSV parser for edge cases:

```bash
npm install csv-parse
```

### 4. Render Cold Starts

**Issue:** Free tier sleeps after 15 mins of inactivity.
**Solution:** First request after sleep takes 30-60 seconds. Consider upgrading to paid tier for production.

---

## USEFUL COMMANDS

### Local Development

```bash
# Clone repo
git clone https://github.com/thoard93/Affiliate-Automated.git
cd Affiliate-Automated

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with credentials from Render

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Database Operations (via Render Shell)

```bash
# Access Render shell
# Dashboard → affiliate-automated-api → Shell

# Check products count
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.product.count().then(console.log)"

# List all products
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.product.findMany().then(console.log)"

# Check users
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.user.findMany().then(console.log)"
```

### Deployment

```bash
# Push to GitHub (auto-deploys to Render)
git add .
git commit -m "Your message"
git push origin main

# Check build status in Render dashboard
```

---

## CONTACT & RESOURCES

### Thomas's Other Projects

- **Brand Hunter** - TikTok Shop product discovery platform
- **TikTok Accounts:** DATBURGERSHOP93, DEALMANIAC93, Dealrush93, GYMGOER1993, thoardyr_finds
- **Location:** Griffin, Georgia

### Key Links

| Resource | URL |
|----------|-----|
| Render Dashboard | https://dashboard.render.com |
| GitHub Repo | https://github.com/thoard93/Affiliate-Automated |
| TikTok Partner Center | https://partner.us.tiktokshop.com |
| TikTok API Docs | https://partner.tiktokshop.com/docv2 |
| Discord Server | https://discord.gg/affiliateautomated |

---

## SUMMARY FOR GEMINI

**What this project is:** A web platform for managing TikTok Shop affiliate creators and their boosted commission rates.

**Current state:** Working platform with auth, admin panel, and product management. Needs TikTok API integration and brand outreach automation.

**Immediate next steps:**
1. Import full 6,700 product CSV via the import page
2. Wait for TikTok API scope approval
3. Build brand outreach workflow using TikTok's Service Proposal system

**Key constraint:** TikTok's Partner API cannot automate seller outreach. Must use their manual Service Proposal system or external email tools.

---

*Document generated: December 11, 2025*
*Last Claude session: Platform fixes, logo updates, brand outreach research*
