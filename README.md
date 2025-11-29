# AgencyScope

> **A modern SaaS platform for browsing government agency and contact data**

AgencyScope is a contact data platform built with Next.js 16, Prisma, and Clerk authentication. It demonstrates key SaaS features including authentication, role-based access control, usage limits, and a professional admin panel. The platform uses sample government agency data imported from CSV files.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF.svg)](https://clerk.com/)

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
- **Agency Directory** - Browse sample government agency dataset (900+ records imported from CSV)
- **Contact Database** - Access sample contact records (1000+ entries)
- **Dashboard** - User stats and quick actions
- **Search & Filters** - Filter by name, state, department
- **Multiple Views** - Table view with pagination, card view with infinite scroll

### Usage Tracking System
- **Daily Limit** - 50 contact views per day for free tier users
- **View Counter** - Track remaining views
- **Alerts** - Warning when approaching limit
- **Upgrade Modal** - Prompt when limit reached

### Admin Panel (RBAC)
- **User Management** - View all users with activity tracking and period filters
- **Agency Management** - View agencies with table/card views (pagination and lazy loading)
- **Metrics Dashboard** - System-wide analytics and user activity
- **Role-Based Access** - Admin-only routes protected via Clerk metadata

### UX/UI
- **Dark/Light Mode** - Complete theme support across all pages
- **Responsive Design** - Mobile-first approach
- **Modern Animations** - Framer Motion for smooth transitions
- **Pagination & Lazy Loading** - Table view with pagination, card view with infinite scroll

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | Neon PostgreSQL (Serverless) |
| **ORM** | Prisma 6.19 |
| **Authentication** | Clerk |
| **UI Components** | Shadcn/UI + Radix UI |
| **Styling** | Tailwind CSS 4 |
| **Theme** | next-themes (dark/light mode) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

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

![System Architecture](./docs/assets/diagram-export-11-29-2025-10_08_20-PM.png)

AgencyScope follows a modern, scalable architecture with clear separation between client, server, authentication, and data layers. The system uses Next.js App Router for routing and rendering, Clerk for authentication and RBAC, Prisma ORM for type-safe database access, and Neon PostgreSQL for serverless data storage. Sample data is imported via CSV files during database seeding.

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
```

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

The database includes 4 main models:

- **User** - Synced with Clerk users
- **Agency** - Government organizations
- **Contact** - Decision-makers at agencies
- **ContactView** - Tracks daily view limits

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

This project is deployed on Vercel as per the assessment requirements.

### Deployment Configuration

**Environment Variables Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
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

### Daily View Limit

**How it works:**
1. User clicks "View Details" on a contact
2. Server action checks today's view count
3. If < 50: Record view, show contact info
4. If >= 50: Show upgrade modal

**Code:**
```typescript
// lib/actions.ts
export async function trackContactView(contactId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const viewCount = await prisma.contactView.count({
    where: { userId: user.id, viewedAt: { gte: today } }
  });
  
  if (viewCount >= 50) {
    return { success: false, limitReached: true };
  }
  
  await prisma.contactView.create({
    data: { userId: user.id, contactId }
  });
  
  return { success: true };
}
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

### Landing Page
Clean, modern landing page with clear value proposition and CTA buttons.

### Dashboard
User stats showing total agencies, contacts, and remaining daily views.

### Agencies Page
Table and card views with search, state filters, pagination, and infinite scroll for cards.

### Contacts Page
Contact listing with view tracking, upgrade prompts, and contact details modal.

### Admin Panel
User management, agency CRUD operations, and system metrics with role-based access control.

### Upgrade Modal
Appears when daily limit is reached, encouraging users to upgrade.

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

Built with ❤️ using Next.js, TypeScript, Prisma, and Clerk
