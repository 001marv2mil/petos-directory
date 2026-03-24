# PetOS Directory — Setup Guide

## Quick Start

### 1. Create your `.env.local` file

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
# Frontend (Vite) — public anon key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Scripts only — service role key (NEVER prefix with VITE_)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these from your Supabase project: **Project Settings → API**

---

### 2. Run the database migrations

In your Supabase dashboard, go to **SQL Editor** and run both migration files in order:

1. `supabase/migrations/20240101000000_create_providers.sql`
2. `supabase/migrations/20240101000001_create_indexes.sql`

Or using Supabase CLI:
```bash
supabase db push
```

---

### 3. Seed the database

This generates ~25 realistic providers per city × category across 50+ cities:

```bash
npm run seed
```

Expected output: ~8,750+ provider rows in your `providers` table.

---

### 4. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Ingesting Real Data (Google Places API)

When you have a Google Places API key:

1. Add to `.env.local`:
   ```env
   GOOGLE_PLACES_API_KEY=your-key-here
   ```

2. Enable the **Places API** in Google Cloud Console

3. Run the ingestion:
   ```bash
   npm run ingest
   ```

   Or target a specific city/category:
   ```bash
   npx tsx --env-file=.env.local scripts/ingest-providers.ts --city=Tampa --category=veterinarians
   ```

The ingestion script upserts by Google `place_id` — it does **not** delete seed data. Real Places data will naturally replace seed data over time as you re-run it.

---

## Routes

| URL | Description |
|-----|-------------|
| `/` | Homepage — search + city grid + category grid |
| `/search` | Search results (use `?city=Tampa&state=FL&category=groomers`) |
| `/:state/:city/:category` | Canonical category pages (e.g. `/fl/tampa/veterinarians`) |
| `/provider/:slug` | Individual provider profile |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | All 50+ cities and 7 categories |
| `src/hooks/useProviders.ts` | Search + fallback logic |
| `supabase/migrations/` | Database schema |
| `scripts/seed-providers.ts` | Generate placeholder data |
| `scripts/ingest-providers.ts` | Google Places pipeline |
| `.env.local` | Your secrets (git-ignored) |
