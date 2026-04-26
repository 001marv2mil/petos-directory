-- Add featured flag to providers table.
-- Set to true when a featured_payment with status='active' exists for this provider.
-- The stripe-webhook handler updates this in real-time on payment/cancellation.

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Backfill: mark any providers that already have an active featured_payment
UPDATE providers p
SET featured = true
FROM featured_payments fp
WHERE fp.provider_id = p.id
  AND fp.status = 'active';

-- Index for fast category-page queries that sort featured first
CREATE INDEX IF NOT EXISTS idx_providers_featured ON providers (featured) WHERE featured = true;
