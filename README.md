# AgencyScope

> **A production-quality SaaS platform for accessing government agency and contact intelligence**

AgencyScope is a modern contact intelligence platform that provides authenticated access to verified government agencies and their key decision-makers. Built with Next.js 16, Prisma, and Clerk authentication, it features daily view limits, real-time tracking, and a clean, professional UI.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF.svg)](https://clerk.com/)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Key Features Implementation](#-key-features-implementation)

---

## Features

### Core Functionality
- **Secure Authentication** - Clerk-powered auth with middleware protection
- **Agency Directory** - Browse 900+ verified government agencies
- **Contact Database** - Access 1000+ key decision-makers
- **Smart Dashboard** - Real-time stats and quick actions
- **Advanced Search** - Filter by name, state, department, and more
- **Pagination** - Smooth navigation through large datasets

### Daily Limit System
- **50 Views/Day** - Free tier with daily contact view limits
- **Usage Tracking** - Real-time remaining views counter
- **Smart Alerts** - Warning when approaching limit
- **Upgrade Modal** - Seamless upgrade prompts when limit reached

### UX/UI
- **Modern Design** - Clean, professional SaaS aesthetic
- **Fully Responsive** - Works on all devices
- **Fast Performance** - Optimized with Next.js 16 App Router
- **Intuitive Navigation** - Clear user flows and CTAs

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
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## Architecture

AgencyScope follows a modern, scalable architecture:

```mermaid
graph TB
    A[Client Browser] --> B[Next.js App]
    B --> C[Clerk Auth]
    C --> D[Protected Routes]
    D --> E[Prisma ORM]
    E --> F[(Neon PostgreSQL)]
    G[CSV Data] --> H[Seed Script]
    H --> F
```

See [detailed architecture documentation](./docs/architecture.md) for more information.

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
├── (auth)/
│   ├── sign-in/     # Authentication pages
│   └── sign-up/
├── dashboard/       # Protected dashboard
├── agencies/        # Agency listing
├── contacts/        # Contact listing (with limits)
└── upgrade/         # Upgrade page

components/
├── ui/              # Shadcn components
├── dashboard-nav.tsx
├── agencies-table.tsx
└── contacts-table.tsx

lib/
├── prisma.ts        # Prisma client
├── auth.ts          # Auth utilities
├── actions.ts       # Server actions
└── utils.ts         # Helpers

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Migration history
├── seed.ts          # Data seeding script
└── data/            # CSV files
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build the Next.js app
- Run Prisma migrations
- Connect to Neon database

### Environment Variables on Vercel

Add all variables from `.env.local` to Vercel's environment settings.

### Database Migration on Deploy

Vercel automatically runs:
```bash
npx prisma migrate deploy
```

To seed production database:
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
Real-time stats showing total agencies, contacts, and remaining daily views.

### Agencies Page
Sortable table with search, state filters, and pagination.

### Contacts Page
Contact listing with view tracking, upgrade prompts, and contact details modal.

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
