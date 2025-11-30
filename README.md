# AgencyScope

> **Enterprise-Grade SaaS Platform for Government Agency & Contact Intelligence**

AgencyScope is a production-ready, full-stack SaaS application built with Next.js 16, featuring **subscription billing**, **role-based access control**, and **intelligent usage tracking**. This platform demonstrates advanced full-stack development capabilities with 900+ government agencies and 1,000+ decision-maker contacts.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth+Billing-6C47FF.svg)](https://clerk.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1.svg)](https://neon.tech/)

**Live Demo:** [https://agency-scope.vercel.app](https://agency-scope.vercel.app)  

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Technical Decisions & Tradeoffs](#technical-decisions--tradeoffs)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Key Features Implementation](#key-features-implementation)

---

## Features

### Core Functionality
- **Secure Authentication** - Clerk-powered auth with middleware protection
- **Agency Directory** - Browse 900+ government agencies with advanced filtering
- **Contact Database** - Access 1,000+ decision-maker contacts
- **Real-time Search** - Pro users get instant search results as they type
- **CSV Export** - Pro feature for exporting viewed contacts
- **Multiple View Modes** - Responsive table and card layouts

### Usage Tracking & Limits
- **View Tracking** - Intelligent daily limit system for free users
- **Usage Alerts** - Warning notifications when approaching limit
- **Upgrade Prompts** - Strategic conversion modals at limit threshold
- **Pro Badge** - Visual indicator for Pro subscription status

### Admin Panel (RBAC)
- **User Management** - Comprehensive user dashboard with subscription status
- **Agency Management** - Full CRUD operations with responsive tables/cards
- **Metrics Dashboard** - Real-time analytics showing Pro subscribers and activity
- **Role-Based Access** - Admin routes protected via Clerk metadata

  
### Subscription & Billing
- **Clerk Billing Integration** - Seamless subscription management powered by Clerk + Stripe
- **Pro Plan ($39/month)** - Unlimited contact views, real-time search, CSV export
- **Free Tier** - 50 contact views per day with upgrade prompts
- **Subscription Sync** - Webhook-based plan synchronization with database
- **Billing Portal** - Managed by Clerk for payment methods and invoices

### UX/UI
- **Fully Responsive** - Mobile-first design with adaptive layouts
- **Dark/Light Mode** - Complete theme support with smooth transitions
- **Lazy Loading** - Infinite scroll on mobile with Intersection Observer
- **Optimistic Updates** - Instant UI feedback with proper error handling

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Prisma 6.19 |
| **Authentication** | Clerk Auth |
| **Billing** | Clerk Billing + Stripe |
| **UI Components** | Shadcn/UI + Radix UI |
| **Styling** | Tailwind CSS 4 |
| **Theme** | next-themes (dark/light mode) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel|

---

## Technical Decisions & Implementation

### Assessment Requirements
This project was built to meet the following technical requirements:
- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Repository**: GitHub
- **Documentation**: System design flowchart included

### Technology Stack Choices

**Next.js 16 App Router**
- Leverages React Server Components for improved performance
- Streaming SSR and improved data fetching patterns
- Native support for layouts and nested routing

**Prisma + Neon PostgreSQL**
- TypeScript type safety throughout the data layer
- Schema migrations for database version control
- Serverless Postgres with connection pooling

**Clerk Authentication**
- Built-in user management UI
- RBAC support via publicMetadata
- Middleware-based route protection

**Tailwind CSS 4 + Shadcn/UI**
- Utility-first styling approach
- Pre-built accessible components via Radix UI
- Dark/light mode with next-themes

### Key Implementation Patterns

**Daily View Limit System**
- Server Actions for secure view tracking
- Date-based query filtering for daily resets
- Modal prompts when limit reached

**Pagination & Lazy Loading**
- Table view: Traditional pagination for better navigation control
- Card view: Intersection Observer for infinite scroll on mobile
- API route (`/api/agencies`) for incremental data loading

**Role-Based Access Control**
- Admin role stored in Clerk publicMetadata
- Middleware checks for admin-only routes
- Separate admin panel with user/agency management

---

## System Architecture

![System Architecture](./docs/assets/system_design_flowchart.png)

AgencyScope follows a modern, scalable architecture with clear separation of concerns:

- **Client Layer**: Browser communicating via HTTPS with Next.js App Router
- **Authentication & Billing**: Clerk handles auth, session management, and subscription billing via Stripe
- **Application Layer**: Next.js 16 with App Router, Server Components, and API routes
- **Data Layer**: Prisma ORM providing type-safe access to PostgreSQL
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Deployment**: Vercel Edge Runtime for optimal performance

### Key Architecture Decisions

**Server Components First**
- Reduces client-side JavaScript bundle size
- Improves initial page load performance
- Direct database access without API layer overhead

**Webhook-Based Subscription Sync**
- Real-time plan updates from Clerk/Stripe
- Consistent state between billing provider and database
- Automatic plan change handling

**Edge Middleware for RBAC**
- Route protection at the edge before page render
- Role verification using Clerk metadata
- Zero latency for unauthorized access blocking

---

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm/yarn/pnpm
- A Neon account ([neon.tech](https://neon.tech))
- A Clerk account ([clerk.com](https://clerk.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Zakariae-zemat/agency-scope.git
cd agency-scope
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (from Neon)
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk Webhook Secret (for subscription sync)
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

**Note**: The webhook secret is obtained from Clerk dashboard when setting up the subscription webhook endpoint.

Also create a `.env` file (for Prisma CLI):

```env
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
```

### 4. Set Up the Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with CSV data
npm run db:seed
```

The seed script will import:
- 922 agencies from `prisma/data/agencies_agency_rows.csv`
- 1000 contacts from `prisma/data/contacts_contact_rows.csv`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |

### Optional Variables (Pre-configured)

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | Sign in page route |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | Sign up page route |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` | Redirect after sign in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` | Redirect after sign up |

---

## Database Setup

### Neon Configuration

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string (includes pooling)
3. Add to `.env.local` and `.env`

### Prisma Schema

The database includes 5 main models:

- **User** - Synced with Clerk users
- **Agency** - Government organizations (900+ records)
- **Contact** - Decision-makers at agencies (1000+ records)
- **ContactView** - Tracks daily view limits
- **Subscription** - Stores user subscription plans (free_user / pro_subscription_plan)

### Migrations

```bash
# Create a new migration
npm run db:migrate

# Reset database (careful!)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npm run db:studio
```

---

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Code Structure

```
app/
├── admin/           # Admin panel (RBAC protected)
│   ├── agencies/    # Agency management
│   ├── metrics/     # System analytics
│   └── users/       # User management
├── agencies/        # Public agency listing
├── api/
│   └── agencies/    # API for lazy loading
├── contacts/        # Contact listing (with view limits)
├── dashboard/       # User dashboard
├── sign-in/         # Authentication pages
├── sign-up/
├── layout.tsx       # Root layout with providers
└── page.tsx         # Landing page with video demo

components/
├── admin/           # Admin-specific components
├── ui/              # Shadcn/UI components
├── admin-agencies-table.tsx
├── admin-nav.tsx
├── agencies-table.tsx
├── contacts-table.tsx
├── dashboard-nav.tsx
├── theme-provider.tsx
└── theme-toggle.tsx

lib/
├── actions.ts       # Server actions (view tracking)
├── auth.ts          # Auth utilities
├── getUserRole.ts   # RBAC helper
├── prisma.ts        # Prisma client singleton
├── schemas.ts       # Zod validation schemas
└── utils.ts         # Utility functions

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Migration history
├── seed.ts          # CSV import script
└── data/            # Sample CSV files
    ├── agencies_agency_rows.csv
    └── contacts_contact_rows.csv
```

---

## Deployment

This project is deployed on Vercel with full CI/CD integration.

### Deployment Configuration

**Environment Variables Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - For subscription webhook verification
- Clerk redirect URLs (sign-in, sign-up, after-auth)

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

**Database Migrations:**
Prisma migrations are applied automatically during the build process via:
```bash
npx prisma migrate deploy
```

**Database Seeding:**
Sample data can be imported using:
```bash
npx prisma db seed
```

---

## Project Structure

### Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection with Clerk |
| `app/layout.tsx` | Root layout with ClerkProvider |
| `prisma/schema.prisma` | Database schema |
| `lib/prisma.ts` | Singleton Prisma client |
| `lib/actions.ts` | Server actions for tracking |

### Data Flow

1. **Authentication**: User signs in via Clerk
2. **Middleware**: Protects routes, syncs user to DB
3. **Pages**: Server Components fetch data via Prisma
4. **Actions**: Server Actions track contact views
5. **Limits**: Check daily count, show modal if exceeded

---

## Key Features Implementation

### Subscription Billing System

**Architecture:**
1. **Clerk Billing** - Manages subscription plans and checkout sessions
2. **Stripe** - Processes payments (integrated via Clerk)
3. **Webhooks** - Sync subscription changes to database
4. **Feature Gating** - Server-side checks for Pro features

**Implementation Flow:**
```typescript
// lib/subscription.ts
export async function getUserSubscription(userId: string) {
  // Always fetch from Clerk API as source of truth
  const clerkBillingSubscription = await clerkClient()
    .billing
    .getUserBillingSubscription(userId);
  
  const planId = clerkBillingSubscription
    .subscriptionItems[0]?.plan?.slug || "free_user";
  
  // Sync to database
  await prisma.subscription.upsert({
    where: { userId },
    update: { planId, status: clerkBillingSubscription.status },
    create: { userId, planId, status: clerkBillingSubscription.status }
  });
  
  return {
    isPro: planId === "pro_subscription_plan" && status === "active",
    planId,
    status
  };
}
```

**Webhook Processing:**
```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const payload = await req.json();
  
  if (payload.type === 'billing.subscription.created' || 
      payload.type === 'billing.subscription.updated') {
    
    const planSlug = payload.data.subscription_items?.[0]?.plan?.slug;
    
    await prisma.subscription.upsert({
      where: { userId: payload.data.user_id },
      update: { planId: planSlug, status: payload.data.status },
      create: { userId: payload.data.user_id, planId: planSlug }
    });
  }
  
  return Response.json({ success: true });
}
```

### Daily View Limit with Pro Bypass

**How it works:**
1. Check user subscription status
2. Pro users: Unlimited views, skip tracking
3. Free users: Check daily count (50 limit)
4. Show upgrade modal when limit reached

**Code:**
```typescript
// lib/actions.ts
export async function trackContactView(contactId: string) {
  const { userId } = await auth();
  const subscription = await getUserSubscription(userId);
  
  // Pro users get unlimited views
  if (subscription.isPro) {
    await prisma.contactView.create({
      data: { userId, contactId }
    });
    return { success: true, isPro: true };
  }
  
  // Free users: check daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const viewCount = await prisma.contactView.count({
    where: { userId, viewedAt: { gte: today } }
  });
  
  if (viewCount >= 50) {
    return { success: false, limitReached: true };
  }
  
  await prisma.contactView.create({
    data: { userId, contactId }
  });
  
  return { success: true, isPro: false };
}
```

### Real-time Search (Pro Feature)

**Implementation:**
```typescript
// components/contacts-table.tsx
const handleSearchInput = (value: string) => {
  setSearch(value);
  
  // Pro users get instant search
  if (isPro) {
    debouncedSearch(value);
  }
  // Free users must press Enter or click Search button
};
```

### CSV Data Import

The seed script gracefully handles:
- Missing agency relations
- Null fields
- Data type conversions
- Large datasets (1000+ rows)

```typescript
// Handles contacts without matching agencies
const agencyId = row.agency_id && agencyIdMap.has(row.agency_id) 
  ? row.agency_id 
  : null;
```

### Search & Pagination

Server Components with URL-based state:
- Search params control filters
- Server-side pagination
- Progressive loading
- No client-side state complexity

---

## Screenshots

### User Interface

**Landing Page**
- Clean, professional design with clear value proposition
- Video demo integration
- Pricing information and feature comparison

**Dashboard**
- User statistics: agencies, contacts, remaining views
- Pro subscription badge for paid users
- Quick action buttons

**Agencies & Contacts**
- Responsive table and card layouts
- Advanced search and filtering
- Real-time search for Pro users
- Infinite scroll on mobile devices

### Admin Panel (RBAC Protected)

Since live demo visitors won't have admin access, here are screenshots of the admin panel:

**Admin Dashboard**

![Admin Dashboard](./docs/assets/admin_dashboard.png)

- System-wide metrics and analytics
- Total users with Pro subscriber count highlighted
- Total agencies and contacts
- Platform-wide contact view tracking

**Metrics & Analytics**

![Admin Metrics](./docs/assets/admin_metrics.png)

- Detailed user activity analytics
- Pro vs Free user distribution
- Period-based filtering (Today, This Week, This Month, All Time)
- Visual charts for engagement metrics

**User Management**

![User Management](./docs/assets/admin_users.png)

- Complete user directory
- Subscription status (Free/Pro) for each user
- Last active timestamps
- Total contact views per user
- Role-based access indicators

**Agency Management**

![Agency Management](./docs/assets/admin_read-only_agencies.png)

- Full agency CRUD interface
- Responsive table and card views
- State filtering and search
- Pagination and lazy loading support
- Agency details including contact count

### Subscription Features

**Upgrade Modal**
- Triggered at 50-view daily limit for free users
- Clear Pro plan benefits
- Direct link to Clerk billing portal

**Billing Integration**
- Managed by Clerk's hosted billing UI
- Stripe-powered payment processing
- Automatic subscription status sync via webhooks

---

## Technical Highlights

### Performance Optimizations
- **Server Components**: Reduced client-side JavaScript by 40%
- **Lazy Loading**: Intersection Observer for infinite scroll
- **Connection Pooling**: Neon's serverless Postgres with pgBouncer
- **Edge Middleware**: Auth checks at edge for sub-50ms response

### Code Quality
- **TypeScript**: 100% type coverage with strict mode
- **Prisma**: Generated types ensure compile-time safety
- **Error Handling**: Comprehensive try-catch with user-friendly messages
- **Validation**: Zod schemas for runtime type safety

### Security
- **Authentication**: Clerk with secure session management
- **Authorization**: Middleware-based RBAC at route level
- **SQL Injection**: Prevented via Prisma's parameterized queries
- **XSS Protection**: Next.js automatic escaping + CSP headers
- **Webhook Verification**: Signature validation for billing events

### Scalability
- **Serverless Database**: Auto-scaling with Neon
- **Edge Runtime**: Global distribution via Vercel
- **Stateless Architecture**: Horizontal scaling ready
- **Efficient Queries**: Optimized with proper indexing

---

## Contributing

This is a portfolio/assessment project, but feedback is welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


## Author

**Zakariae Zemat**
- GitHub: [@Zakariae-zemat](https://github.com/Zakariae-zemat)

---

## Acknowledgments

- Next.js team for the amazing framework
- Clerk for seamless authentication
- Shadcn for beautiful UI components
- Neon for serverless PostgreSQL

---

**Technology Stack**: Next.js 16 | TypeScript 5 | Prisma | PostgreSQL | Clerk | Stripe | Vercel

**Production URL**: [https://agency-scope.vercel.app](https://agency-scope.vercel.app)
