-- Pet owner newsletter signups (email list for future monetization)
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  city text,
  state text,
  category text,
  source text,              -- e.g. 'provider_page', 'homepage', 'exit_intent'
  referrer_slug text,       -- the provider slug they signed up from (if any)
  status text NOT NULL DEFAULT 'active',  -- active, unsubscribed
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_city ON newsletter_signups(city);
CREATE INDEX IF NOT EXISTS idx_newsletter_state ON newsletter_signups(state);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_signups(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_signups(created_at);
