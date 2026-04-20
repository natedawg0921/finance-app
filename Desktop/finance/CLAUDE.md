# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # Run ESLint

# Database
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to SQLite
npx prisma db seed   # Seed with sample data (clears existing first)
npx prisma studio    # Browse database in browser UI
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Prisma 5 (SQLite), Base UI, Recharts, yahoo-finance2 v3

### Data Flow

All data mutations use **Server Actions** (`app/actions/`) — there are no API routes. Server components call actions directly; client components call them via `useTransition()`. After mutations, `revalidatePath()` triggers revalidation on affected pages.

```
Server Component (page.tsx)
  └─ Server Action (app/actions/*.ts)
      └─ Prisma (lib/prisma.ts → prisma/dev.db)

Client Component (form/table)
  └─ Server Action called via useTransition()
      └─ revalidatePath() → re-renders affected pages
```

### Key Conventions

- **Server vs Client split:** Pages and data-fetching components are server components. Forms, tables with delete buttons, charts, and navigation are `"use client"`.
- **Imports:** Use `@/` path alias (maps to project root). E.g., `@/lib/prisma`, `@/components/sidebar`.
- **UI components:** `components/ui/` holds Base UI wrappers. Add new ones there when needed.
- **Stock prices:** `lib/finance.ts` → `fetchStockPrices(tickers: string[])` — fetches in parallel, returns `Map<ticker, price>`, falls back to `0` on error.
- **Prisma singleton:** Always import from `@/lib/prisma`, never instantiate `PrismaClient` directly in components.

### Database Models

```
Transaction: id, type ("INCOME"|"EXPENSE"), amount, category, date, note?, createdAt, updatedAt
PortfolioItem: id, ticker (unique), shares, createdAt, updatedAt
```

## Critical Gotchas

- **yahoo-finance2 v3:** Must use `new YahooFinance()` instance — the default export's `.quote()` returns `never`.
- **Base UI (NOT Radix):** `@base-ui/react` is the component primitive library. `Select.Root` `onValueChange` signature is `(value: string | null, eventDetails) => void`.
- **Prisma v5 (NOT v7):** `prisma.config.ts` is excluded in `tsconfig.json`. Import PrismaClient only from `@prisma/client`.
- **Turbopack root:** `next.config.ts` sets `turbopack.root: path.resolve(__dirname)` to avoid conflict with `/Users/nandrus/package-lock.json`. Do not remove this.
- **Recharts Tooltip:** `formatter` callback types require `(value: ValueType | undefined) => ...`; use `Number(value)` cast.
- **Seeding:** Uses `ts-node` (CommonJS mode) per `package.json` `prisma.seed` script — not `tsx`.
