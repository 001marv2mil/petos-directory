-- Pets table — links auth users to their pets
create table if not exists public.pets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null, -- dog, cat, bird, rabbit, reptile, other
  breed       text,
  birthday    date,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.pets enable row level security;

create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pets"
  on public.pets for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  using (auth.uid() = user_id);

create policy "Users can update their own pets"
  on public.pets for update
  using (auth.uid() = user_id);
