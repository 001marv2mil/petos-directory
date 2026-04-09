create table if not exists public.claim_requests (
  id            uuid primary key default uuid_generate_v4(),
  provider_id   uuid not null references public.providers(id) on delete cascade,
  business_name text not null,
  owner_name    text not null,
  owner_email   text not null,
  owner_phone   text,
  role          text not null, -- owner, manager, employee
  message       text,
  status        text not null default 'pending', -- pending, approved, rejected
  created_at    timestamptz not null default now()
);

alter table public.claim_requests enable row level security;

-- Anyone can submit a claim
create policy "Anyone can submit a claim"
  on public.claim_requests for insert
  with check (true);

-- Only service role can read/update claims
create policy "Service role can manage claims"
  on public.claim_requests for all
  using (auth.role() = 'service_role');
