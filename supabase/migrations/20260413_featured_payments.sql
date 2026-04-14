-- Track businesses that paid for featured listing
CREATE TABLE IF NOT EXISTS featured_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'active',  -- active, cancelled
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_featured_provider ON featured_payments(provider_id);
CREATE INDEX IF NOT EXISTS idx_featured_status ON featured_payments(status);
