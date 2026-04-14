-- Link providers to the owner email that claimed them (populated on claim approval)
ALTER TABLE providers ADD COLUMN IF NOT EXISTS claimed_by_email text;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS claimed_at timestamptz;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS special_offer text;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS gallery_images text[];

CREATE INDEX IF NOT EXISTS idx_providers_claimed_by ON providers(claimed_by_email);

-- Track who approved which claim and when
ALTER TABLE claim_requests ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE claim_requests ADD COLUMN IF NOT EXISTS approved_by text;
