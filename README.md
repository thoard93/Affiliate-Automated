# 🚀 Affiliate Automated

**TikTok Shop Commission Maximizer Platform**

A full-stack platform for managing TikTok Shop affiliate creators with exclusive boosted commission rates. Built for Market Mix Media LLC's "Affiliate Automated" MCN.

![Affiliate Automated](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [TikTok Shop API Setup](#-tiktok-shop-api-setup)
- [Discord Bot Setup](#-discord-bot-setup)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)

## ✨ Features

### Creator Dashboard
- 📊 Real-time earnings tracking
- 📦 Browse 213+ boosted commission products
- 🔗 One-click deep links to add products to showcase
- 📈 Performance analytics per product
- 🔔 Notification preferences

### Admin Panel
- 👥 Creator management with approval workflow
- 📦 Product catalog with commission rate management
- 💰 Commission tracking and payout management
- 📊 Platform analytics and reporting
- 🔄 TikTok Shop API sync controls

### Discord Bot
- `/connect` - Connect TikTok Shop account
- `/status` - Check connection and earnings
- `/products` - Browse boosted products
- `/earnings` - View earnings summary
- `/alerts` - Manage notifications
- 🔔 Real-time sale notifications
- 🆕 New product alerts

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Custom Design System |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Discord OAuth) |
| Bot | Discord.js v14 |
| API | TikTok Shop Partner API |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Creator Dashboard                        │
│  (Next.js + React)                                         │
├─────────────────────────────────────────────────────────────┤
│                      Admin Panel                            │
│  (Next.js + React)                                         │
├──────────────────────┬──────────────────────────────────────┤
│    Discord Bot       │         API Routes                   │
│  (Discord.js)        │  (Next.js API + TikTok Shop API)    │
├──────────────────────┴──────────────────────────────────────┤
│                    PostgreSQL Database                      │
│  (Prisma ORM)                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Discord Application (for OAuth + Bot)
- TikTok Shop Partner API Access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/affiliate-automated.git
   cd affiliate-automated
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations (production)
   npm run db:migrate
   ```

5. **Create admin user**
   ```bash
   npx ts-node scripts/create-admin.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Start the Discord bot** (separate terminal)
   ```bash
   npm run discord
   ```

Visit `http://localhost:3000` to see the application.

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_automated"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Discord
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_GUILD_ID=your-guild-id

# TikTok Shop
TIKTOK_APP_KEY=your-app-key
TIKTOK_APP_SECRET=your-app-secret
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/tiktok/callback
```

See `.env.example` for all available options.

## 💾 Database Setup

### Local PostgreSQL

```bash
# Create database
createdb affiliate_automated

# Push schema
npm run db:push

# Open Prisma Studio (optional)
npm run db:studio
```

### Cloud Options

- **Railway**: One-click PostgreSQL deployment
- **Supabase**: Managed PostgreSQL with real-time
- **Neon**: Serverless PostgreSQL

## 📱 TikTok Shop API Setup

1. **Apply for Partner API Access**
   - Visit [TikTok Shop Partner Center](https://partner.tiktokshop.com/)
   - Apply for Open API access
   - Wait for approval (typically 2-5 business days)

2. **Create an Application**
   - Go to Developer Portal
   - Create new application
   - Request scopes: `affiliate.read`, `affiliate.write`, `product.read`, `order.read`

3. **Configure OAuth**
   - Add redirect URI: `https://yourdomain.com/api/auth/tiktok/callback`
   - Note your App Key and App Secret

4. **API Capabilities**
   - ✅ Create/manage Open Collaborations
   - ✅ Send Targeted Collaboration Invites (1,000/day)
   - ✅ Creator Search & Discovery
   - ✅ Affiliate Link Generation
   - ✅ Order Tracking
   - ❌ Auto-add to showcase (not available via API)

## 🤖 Discord Bot Setup

1. **Create Discord Application**
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Go to Bot → Add Bot
   - Enable: Server Members Intent, Message Content Intent

2. **Configure OAuth2**
   - Add redirect: `https://yourdomain.com/api/auth/callback/discord`
   - Scopes: `identify`, `email`, `guilds`

3. **Invite Bot to Server**
   - OAuth2 → URL Generator
   - Scopes: `bot`, `applications.commands`
   - Permissions: Send Messages, Use Slash Commands, Embed Links

4. **Register Commands**
   Commands are auto-registered on bot startup.

## 🚢 Deployment

### Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway (Recommended for Full Stack)

1. Connect GitHub repo
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### Docker

```bash
# Build
docker build -t affiliate-automated .

# Run
docker run -p 3000:3000 --env-file .env affiliate-automated
```

## 📚 API Reference

### Authentication

All API routes require authentication via NextAuth.js session.

### Endpoints

#### Products

```
GET  /api/products          - List products
POST /api/products          - Import products (admin)
GET  /api/products/:id      - Get product details
```

#### Creators

```
GET  /api/creators          - List creators (admin)
GET  /api/creators/:id      - Get creator details
PUT  /api/creators/:id      - Update creator
```

#### Commissions

```
GET  /api/commissions       - List commission events
POST /api/commissions/sync  - Sync from TikTok Shop
```

## 📁 Project Structure

```
affiliate-automated/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Creator dashboard
│   │   ├── admin/             # Admin panel
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── admin/            # Admin components
│   │   ├── creator/          # Creator components
│   │   └── shared/           # Shared components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # NextAuth config
│   │   ├── db.ts             # Prisma client
│   │   ├── tiktok.ts         # TikTok API client
│   │   └── utils.ts          # Helper functions
│   ├── hooks/                 # React hooks
│   └── types/                 # TypeScript types
├── discord-bot/               # Discord bot
│   └── index.js              # Bot entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                    # Static assets
└── package.json
```

## 🎨 Design System

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Orange | `#FF6B00` | Primary actions, highlights |
| Gold | `#FFD700` | Premium features, badges |
| Dark | `#1A1A1A` | Background |
| Success | `#00C853` | Positive states |

### Components

Pre-built components with Affiliate Automated branding:
- `btn-primary` / `btn-secondary` / `btn-ghost`
- `card` / `card-interactive`
- `badge-orange` / `badge-gold` / `badge-success`
- `input-field`
- `stat-card`
- `table-container`

## 🔧 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run discord      # Start Discord bot
```

## 📄 License

Proprietary - Market Mix Media LLC

## 🤝 Support

- Discord: [Affiliate Automated Community](https://discord.gg/affiliateautomated)
- Email: support@affiliateautomated.com

---

Built with ❤️ by Market Mix Media LLC
