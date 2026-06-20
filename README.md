# FoodERP — Restaurant Management Demo

A full-featured restaurant ERP portfolio demo. No backend, no database — all data lives in JSON files under `data/`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand v5 (with `persist`) |
| Animation | Framer Motion v12 |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Language | TypeScript 5 |

## Features

- **POS** — Point-of-sale with cart, table selection, discount, payment
- **Kitchen Display** — Real-time order board with status advancement
- **Delivery** — Order tracking with status timeline
- **Menu** — Grid/table view, category filter, Unsplash images
- **Inventory** — Stock tracking with low-stock alerts
- **Employees** — Staff roster with role badges and performance ratings
- **Loyalty** — Member tiers (Bronze → Diamond), points, progress bars
- **Purchases** — Supplier orders with status tracking
- **Tables** — Table status map with real-time availability
- **Analytics** — Revenue trends, category breakdown, peak hours, CSV export
- **Notifications** — Bell panel with read/unread state (Framer Motion)
- **Theme** — Dark / Light mode toggle
- **i18n** — English, O'zbekcha, Русский

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and select any role on the login screen — no password required.

## Project Structure

```
app/            Next.js App Router pages
components/     UI components (layout, domain, shared)
context/        React context (i18n)
data/           JSON data files (single source of truth)
hooks/          Custom hooks
lib/            Utilities (i18n resolver, cn, etc.)
locales/        Translation files (en / uz / ru)
public/         Static assets and SVG illustrations
services/       Data access layer (reads JSON, returns typed data)
store/          Zustand store
types/          TypeScript type definitions
```

## Architecture Notes

- No API routes — `services/` functions read from `data/*.json` via `fetch('/data/...')`
- Zustand `persist` stores cart, auth, theme, notifications in `localStorage`
- Hydration safety: all persisted-state-dependent UI uses `mounted` guard to match SSR output
- Page transitions: `AnimatePresence` in `Layout.tsx` wraps `<main>` keyed by pathname
