# System Architecture

## Overview

AgencyScope is a modern SaaS platform built with Next.js 16, providing authenticated access to government agency and contact data with daily view limits and upgrade capabilities.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser] -->|HTTPS| B[Next.js App Router]
    end

    subgraph "Authentication Layer"
        B --> C[Clerk Auth]
        C -->|JWT| D[Middleware]
    end

    subgraph "Application Layer"
        D --> E[Public Routes]
        D --> F[Protected Routes]
        E --> G[Landing Page]
        E --> H[Sign In/Up]
        F --> I[Dashboard]
        F --> J[Agencies]
        F --> K[Contacts]
        F --> L[Upgrade]
    end

    subgraph "Data Layer"
        I --> M[Prisma ORM]
        J --> M
        K --> M
        M --> N[(Neon PostgreSQL)]
    end

    subgraph "Business Logic"
        K --> O[Contact View Tracking]
        O --> P{Views < 50?}
        P -->|Yes| Q[Record View]
        P -->|No| R[Show Upgrade Modal]
        Q --> M
    end

    subgraph "Data Seeding"
        S[CSV Files] --> T[Seed Script]
        T --> N
    end

    style C fill:#6366f1
    style M fill:#10b981
    style N fill:#0ea5e9
    style O fill:#f59e0b
