-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Drop existing type if re-running
drop type if exists provider_category cascade;

create type provider_category as enum (
  'veterinarians',
  'emergency_vets',
  'groomers',
  'boarding',
  'daycare',
  'trainers',
  'pet_pharmacies'
);

-- Main providers table
create table if not exists public.providers (
  id              uuid primary key default uuid_generate_v4(),
  source          text not null default 'seed',   -- 'seed' | 'google_places' | 'manual'
  source_id       text,                           -- Google place_id
  slug            text not null,
  business_name   text not null,
  category        provider_category not null,
  subcategory     text,
  address         text not null,
  city            text not null,
  state           text not null,                  -- 2-letter abbreviation (FL, TX, etc.)
  zip             text,
  lat             numeric(10, 7),
  lng             numeric(10, 7),
  phone           text,
  website         text,
  rating          numeric(2, 1) check (rating >= 1.0 and rating <= 5.0),
  review_count    integer default 0,
  hours           jsonb,
  description     text,
  services        text[] default '{}',
  hero_image      text,
  gallery_images  text[] default '{}',
  emergency       boolean not null default false,
  verified        boolean not null default false,
  last_synced_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint providers_slug_unique unique (slug),
  constraint providers_source_id_unique unique (source, source_id)
);

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists providers_updated_at on public.providers;
create trigger providers_updated_at
  before update on public.providers
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.providers enable row level security;

-- Drop existing policies before recreating
drop policy if exists "providers_public_read" on public.providers;
drop policy if exists "providers_service_write" on public.providers;

-- Public read (anon key can read all providers)
create policy "providers_public_read"
  on public.providers for select
  using (true);

-- Service role has full write access (ingestion scripts)
create policy "providers_service_write"
  on public.providers for all
  using (auth.role() = 'service_role');
