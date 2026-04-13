-- Track views and clicks per provider listing
CREATE TABLE IF NOT EXISTS provider_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  event_type text NOT NULL,  -- 'view', 'click_phone', 'click_website', 'click_directions'
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_provider ON provider_analytics(provider_id);
CREATE INDEX idx_analytics_created ON provider_analytics(created_at);
CREATE INDEX idx_analytics_event ON provider_analytics(event_type);
