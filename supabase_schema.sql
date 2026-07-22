-- ============================================================
-- BULL RUN APEX AI — SUPABASE SCHEMA MIGRATION
-- Founded by Himanshu Bhmniya | bullrunapex@gmail.com
-- Project: ftebjjgbtwpfwyyelvei.supabase.co
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id                      SERIAL PRIMARY KEY,
  name                    TEXT,
  email                   TEXT UNIQUE NOT NULL,
  password_hash           TEXT NOT NULL,
  role                    TEXT NOT NULL DEFAULT 'user',
  two_fa_enabled          BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_secret           TEXT,
  stripe_customer_id      TEXT,
  subscription_status     TEXT NOT NULL DEFAULT 'free',
  subscription_tier       TEXT NOT NULL DEFAULT 'free',
  affiliate_code          TEXT,
  referred_by             TEXT,
  balance                 NUMERIC NOT NULL DEFAULT 100000.00,
  bio                     TEXT,
  avatar_url              TEXT,
  timezone                TEXT DEFAULT 'UTC',
  currency                TEXT DEFAULT 'USD',
  theme                   TEXT DEFAULT 'dark',
  language                TEXT DEFAULT 'en',
  email_notifications     BOOLEAN NOT NULL DEFAULT TRUE,
  telegram_notifications  BOOLEAN NOT NULL DEFAULT FALSE,
  discord_notifications   BOOLEAN NOT NULL DEFAULT FALSE,
  telegram_chat_id        TEXT,
  beta_features           BOOLEAN NOT NULL DEFAULT FALSE,
  ai_memory_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  market        TEXT NOT NULL,
  type          TEXT NOT NULL,
  size          NUMERIC NOT NULL,
  leverage      INTEGER NOT NULL DEFAULT 1,
  entry_price   NUMERIC NOT NULL,
  exit_price    NUMERIC,
  stop_loss     NUMERIC,
  take_profit   NUMERIC,
  pnl           NUMERIC,
  status        TEXT NOT NULL DEFAULT 'OPEN',
  emotion       TEXT,
  mistake       TEXT,
  ai_feedback   TEXT,
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  closed_at     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  amount          NUMERIC NOT NULL,
  avg_buy_price   NUMERIC NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  type            TEXT NOT NULL,
  trigger_value   NUMERIC NOT NULL,
  status          TEXT NOT NULL DEFAULT 'PENDING',
  channel         TEXT NOT NULL DEFAULT 'EMAIL',
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id          TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  model       TEXT DEFAULT 'Gemini 1.5 Pro',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL,
  content     TEXT NOT NULL,
  media_url   TEXT,
  media_type  TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_memory (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key         TEXT NOT NULL,
  value       TEXT NOT NULL,
  category    TEXT DEFAULT 'general',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'OPEN',
  rating      INTEGER,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feature_flags (
  id               SERIAL PRIMARY KEY,
  name             TEXT UNIQUE NOT NULL,
  enabled          BOOLEAN NOT NULL DEFAULT FALSE,
  description      TEXT,
  rollout_percent  INTEGER DEFAULT 100,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_versions (
  id          SERIAL PRIMARY KEY,
  version     TEXT NOT NULL,
  title       TEXT NOT NULL,
  changelog   TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'patch',
  is_latest   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  message      TEXT NOT NULL,
  category     TEXT DEFAULT 'general',
  status       TEXT NOT NULL DEFAULT 'OPEN',
  admin_reply  TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action      TEXT NOT NULL,
  ip_address  TEXT,
  details     TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'system',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed initial data
INSERT INTO app_versions (version, title, changelog, type, is_latest) VALUES
('5.0.0', 'Major Platform Launch', '- Complete UI overhaul
- TradingView integration
- Multi-model AI
- SMC engine
- Behavioral journal
- Settings page
- Feature flags', 'major', true),
('4.8.2', 'Security & Performance', '- Rate limiting
- XSS protection
- 2FA support
- OAuth Google & GitHub', 'minor', false)
ON CONFLICT DO NOTHING;

INSERT INTO feature_flags (name, enabled, description, rollout_percent) VALUES
('ai_voice_chat', true, 'Voice input for AI chat', 100),
('ai_image_upload', true, 'Image upload and analysis', 100),
('ai_pdf_upload', true, 'PDF document analysis', 100),
('paper_trading_v2', true, 'Enhanced paper trading with balance top-up', 100)
ON CONFLICT DO NOTHING;

-- Confirmation
SELECT 'Schema migration complete.' AS status, COUNT(*) AS tables
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

