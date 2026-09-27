-- TalentHub MVP schema.
-- A cut-down realisation of the model in Chapter Three, carrying the entities
-- the escrow path actually needs. Money is stored in minor units (kobo, pesewas,
-- cents) as INTEGER; no floating point appears anywhere in the financial path.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id            TEXT PRIMARY KEY,
  email              TEXT NOT NULL UNIQUE,
  password_hash      TEXT NOT NULL,
  role               TEXT NOT NULL CHECK (role IN ('creator','brand','admin')),
  status             TEXT NOT NULL DEFAULT 'active',
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  profile_id          TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL UNIQUE REFERENCES users(user_id),
  display_name        TEXT NOT NULL,
  biography           TEXT,
  country_code        TEXT NOT NULL,
  city                TEXT,
  primary_discipline  TEXT NOT NULL,
  languages           TEXT,                                  -- csv: English,Yoruba
  engagement_modes    TEXT NOT NULL DEFAULT 'commission',   -- csv: reach,commission
  day_rate_minor      INTEGER,
  currency_code       TEXT NOT NULL DEFAULT 'NGN',
  availability        TEXT NOT NULL DEFAULT 'available',
  kyc_status          TEXT NOT NULL DEFAULT 'unverified',
  mean_rating         REAL,
  completed_contracts INTEGER NOT NULL DEFAULT 0,
  published_at        TEXT
);

CREATE TABLE IF NOT EXISTS brand_profiles (
  brand_id     TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL UNIQUE REFERENCES users(user_id),
  legal_name   TEXT NOT NULL,
  trading_name TEXT,
  country_code TEXT NOT NULL,
  sector       TEXT,
  website      TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  skill_id   TEXT PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  discipline TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id  TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  skill_id    TEXT NOT NULL REFERENCES skills(skill_id),
  proficiency TEXT NOT NULL DEFAULT 'intermediate',
  PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  item_id       TEXT PRIMARY KEY,
  profile_id    TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  title         TEXT NOT NULL,
  description   TEXT,
  media_type    TEXT NOT NULL DEFAULT 'image',
  role_played   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- metrics_source is the point of the whole table: a figure is either confirmed
-- by the platform's API or merely claimed by the creator, and the interface
-- never shows one as though it were the other.
CREATE TABLE IF NOT EXISTS social_accounts (
  social_account_id TEXT PRIMARY KEY,
  profile_id        TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  platform          TEXT NOT NULL,
  handle            TEXT NOT NULL,
  follower_count    INTEGER,
  engagement_rate   REAL,
  metrics_source    TEXT NOT NULL DEFAULT 'self_declared'
                      CHECK (metrics_source IN ('api_verified','self_declared')),
  last_refreshed_at TEXT,
  UNIQUE (profile_id, platform)
);

CREATE TABLE IF NOT EXISTS briefs (
  brief_id         TEXT PRIMARY KEY,
  brand_id         TEXT NOT NULL REFERENCES brand_profiles(brand_id),
  engagement_mode  TEXT NOT NULL CHECK (engagement_mode IN ('reach','commission')),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  required_skills  TEXT,
  budget_min_minor INTEGER,
  budget_max_minor INTEGER,
  currency_code    TEXT NOT NULL DEFAULT 'NGN',
  closes_at        TEXT,
  status           TEXT NOT NULL DEFAULT 'published'
                     CHECK (status IN ('draft','published','closed','withdrawn')),
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applications (
  application_id     TEXT PRIMARY KEY,
  brief_id           TEXT NOT NULL REFERENCES briefs(brief_id),
  creator_id         TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  cover_note         TEXT,
  proposed_fee_minor INTEGER NOT NULL,
  status             TEXT NOT NULL DEFAULT 'submitted'
                       CHECK (status IN ('submitted','shortlisted','rejected','awarded')),
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (brief_id, creator_id)              -- FR-23: one application per creator
);

CREATE TABLE IF NOT EXISTS contracts (
  contract_id        TEXT PRIMARY KEY,
  brief_id           TEXT NOT NULL REFERENCES briefs(brief_id),
  creator_id         TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  brand_id           TEXT NOT NULL REFERENCES brand_profiles(brand_id),
  agreed_fee_minor   INTEGER NOT NULL,
  commission_rate    REAL NOT NULL DEFAULT 0.10,
  currency_code      TEXT NOT NULL DEFAULT 'NGN',
  status             TEXT NOT NULL DEFAULT 'pending_acceptance'
                       CHECK (status IN ('pending_acceptance','active','completed',
                                         'cancelled','disputed')),
  brand_accepted_at   TEXT,                  -- FR-26: both parties accept
  creator_accepted_at TEXT,
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  milestone_id   TEXT PRIMARY KEY,
  contract_id    TEXT NOT NULL REFERENCES contracts(contract_id),
  sequence_no    INTEGER NOT NULL,
  description    TEXT NOT NULL,
  amount_minor   INTEGER NOT NULL CHECK (amount_minor > 0),
  due_date       TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','funded','in_progress','submitted',
                                     'accepted','disputed','refunded','split',
                                     'cancelled')),
  revision_count INTEGER NOT NULL DEFAULT 0,
  funded_at      TEXT,
  submitted_at   TEXT,
  accepted_at    TEXT,
  UNIQUE (contract_id, sequence_no)
);

CREATE TABLE IF NOT EXISTS deliverables (
  deliverable_id TEXT PRIMARY KEY,
  milestone_id   TEXT NOT NULL REFERENCES milestones(milestone_id),
  title          TEXT NOT NULL,
  note           TEXT,
  external_link  TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- The ledger is append-only double entry. Nothing here is ever UPDATEd or
-- DELETEd; balances are derived by summing. The unique idempotency_key is what
-- makes a duplicate posting impossible under retry — the guarantee lives in the
-- database constraint, not in application discipline.
CREATE TABLE IF NOT EXISTS ledger_entries (
  entry_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id  TEXT NOT NULL,
  account_type    TEXT NOT NULL CHECK (account_type IN
                    ('brand_funding','escrow','creator_payable',
                     'platform_commission','provider_settlement')),
  account_owner_id TEXT,
  direction       TEXT NOT NULL CHECK (direction IN ('debit','credit')),
  amount_minor    INTEGER NOT NULL CHECK (amount_minor > 0),
  currency_code   TEXT NOT NULL DEFAULT 'NGN',
  milestone_id    TEXT REFERENCES milestones(milestone_id),
  memo            TEXT,
  idempotency_key TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_ledger_idem
  ON ledger_entries (idempotency_key, account_type, direction);
CREATE INDEX IF NOT EXISTS ix_ledger_account
  ON ledger_entries (account_type, account_owner_id);

CREATE TABLE IF NOT EXISTS payouts (
  payout_id    TEXT PRIMARY KEY,
  creator_id   TEXT NOT NULL REFERENCES creator_profiles(profile_id),
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  destination  TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'settled',
  reference    TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  event_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  actor      TEXT,
  subject    TEXT,
  action     TEXT NOT NULL,
  detail     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ix_briefs_status   ON briefs (status, closes_at);
CREATE INDEX IF NOT EXISTS ix_creator_search
  ON creator_profiles (country_code, primary_discipline, published_at);
