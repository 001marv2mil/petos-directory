-- Performance indexes for the providers table

-- Primary lookup: city + category (most common query pattern)
create index if not exists idx_providers_city_category
  on public.providers (lower(city), category);

-- State + city + category (canonical URL pattern)
create index if not exists idx_providers_state_city_category
  on public.providers (lower(state), lower(city), category);

-- Slug lookup (for profile pages)
create index if not exists idx_providers_slug
  on public.providers (slug);

-- ZIP code lookup
create index if not exists idx_providers_zip
  on public.providers (zip);

-- Full-text search on business name (requires pg_trgm extension)
create index if not exists idx_providers_name_trgm
  on public.providers using gin (business_name gin_trgm_ops);

-- Geo proximity queries (lat/lng bounding box)
create index if not exists idx_providers_lat_lng
  on public.providers (lat, lng);

-- Rating sort (most queries order by rating desc)
create index if not exists idx_providers_rating
  on public.providers (rating desc nulls last);

-- Emergency filter
create index if not exists idx_providers_emergency
  on public.providers (emergency) where emergency = true;

-- State + category (for fallback queries)
create index if not exists idx_providers_state_category
  on public.providers (lower(state), category);

-- Source tracking (for ingestion dedup)
create index if not exists idx_providers_source_id
  on public.providers (source, source_id);

-- Full-text search SQL function using trigrams
create or replace function public.search_providers_by_name(
  search_query text,
  p_city text default null,
  p_state text default null,
  p_category text default null,
  p_limit integer default 24
) returns setof public.providers as $$
  select * from public.providers
  where
    (p_city is null or lower(city) = lower(p_city))
    and (p_state is null or lower(state) = lower(p_state))
    and (p_category is null or category::text = p_category)
    and business_name ilike '%' || search_query || '%'
  order by
    rating desc nulls last,
    review_count desc
  limit p_limit;
$$ language sql stable;
