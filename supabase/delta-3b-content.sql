-- ============================================================================
-- DELTA 3b — Content Editor + Email Templates
-- ============================================================================
BEGIN;

-- ============================================================================
-- 1. content_blocks — keyed JSON store for editable landing content + widgets
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_blocks (
  key         text PRIMARY KEY,
  content     jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users ON DELETE SET NULL
);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_blocks read"  ON content_blocks;
DROP POLICY IF EXISTS "content_blocks write" ON content_blocks;
CREATE POLICY "content_blocks read"  ON content_blocks FOR SELECT USING (true);
CREATE POLICY "content_blocks write" ON content_blocks FOR ALL   USING (is_sysadmin()) WITH CHECK (is_sysadmin());

GRANT SELECT                       ON content_blocks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE       ON content_blocks TO authenticated;


-- ============================================================================
-- 2. email_templates — subject + body with {{variable}} substitution
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  key         text PRIMARY KEY,
  label       text NOT NULL,
  description text,
  subject     text NOT NULL DEFAULT '',
  body        text NOT NULL DEFAULT '',
  active      boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users ON DELETE SET NULL
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_templates sysadmin" ON email_templates;
CREATE POLICY "email_templates sysadmin" ON email_templates
  FOR ALL USING (is_sysadmin()) WITH CHECK (is_sysadmin());

GRANT SELECT, INSERT, UPDATE, DELETE ON email_templates TO authenticated;


-- ============================================================================
-- 3. Seed default email templates
-- ============================================================================
INSERT INTO email_templates (key, label, description, subject, body) VALUES
(
  'invite',
  'Invite user',
  'Sent when sysadmin invites a new paying user. Awaits custom SMTP to go live — Supabase default reset email is used until then.',
  'You''re invited to BakerNomics',
  E'Hi {{name}},\n\nYou''ve been invited to BakerNomics — the costing tool for artisan bakers.\n\nYour account is ready. Click below to set your password and get started:\n\n{{action_link}}\n\nIf you have any questions, just reply to this email.\n\nCheers,\n{{sender_name}}'
),
(
  'welcome',
  'Welcome (trial)',
  'Sent right after trial signup. Awaits custom SMTP to go live.',
  'Welcome to BakerNomics 🎂',
  E'Hi {{name}},\n\nWelcome to BakerNomics! Your 14-day free trial is now active.\n\nHere''s what to do first:\n1. Add your key ingredients with their purchase prices\n2. Create your first recipe with a BOM\n3. See the automatic cost-per-portion and suggested price\n\nIf you get stuck, reply to this email — I''m happy to help.\n\nHappy baking,\n{{sender_name}}'
),
(
  'trial_expiring',
  'Trial expiring soon',
  'Sent 3 days before trial expiry to encourage subscription.',
  'Your BakerNomics trial ends in {{days_left}} days',
  E'Hi {{name}},\n\nYour BakerNomics free trial ends on {{end_date}} — that''s {{days_left}} days from now.\n\nTo keep using your recipes, ingredients, and costings, subscribe here:\n\n{{subscription_link}}\n\nRM149 for a full year. No credit card — pay via DuitNow or bank transfer.\n\nCheers,\n{{sender_name}}'
),
(
  'subscription_expiring',
  'Subscription expiring soon',
  'Sent 14 days before subscription end date.',
  'Your BakerNomics subscription renews on {{end_date}}',
  E'Hi {{name}},\n\nYour BakerNomics subscription expires on {{end_date}} — {{days_left}} days from now.\n\nRenew here to keep uninterrupted access:\n\n{{subscription_link}}\n\nRM149 for another full year.\n\nCheers,\n{{sender_name}}'
)
ON CONFLICT (key) DO NOTHING;

COMMIT;
