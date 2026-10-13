PRAGMA foreign_keys=ON;
-- Turso / SQLite schema. Authentication and authorization are handled by Better Auth and server routes.
CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "emailVerified" integer NOT NULL DEFAULT 0,
      "image" text,
      "role" text NOT NULL DEFAULT 'user',
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL
    );

CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY NOT NULL,
      "expiresAt" integer NOT NULL,
      "token" text NOT NULL UNIQUE,
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL,
      "ipAddress" text,
      "userAgent" text,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY NOT NULL,
      "accountId" text NOT NULL,
      "providerId" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accessToken" text,
      "refreshToken" text,
      "idToken" text,
      "accessTokenExpiresAt" integer,
      "refreshTokenExpiresAt" integer,
      "scope" text,
      "password" text,
      "createdAt" integer NOT NULL,
      "updatedAt" integer NOT NULL
    );

CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY NOT NULL,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" integer NOT NULL,
      "createdAt" integer,
      "updatedAt" integer
    );

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferred_role TEXT DEFAULT 'parent' CHECK (preferred_role IN ('parent', 'teacher', 'admin')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spaces (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  space_type TEXT NOT NULL CHECK (space_type IN ('family', 'classroom')),
  description TEXT,
  invite_code TEXT UNIQUE,
  is_active INTEGER DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS space_members (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'parent', 'teacher', 'observer')),
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(space_id, user_id)
);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nickname TEXT,
  birth_date TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  avatar_url TEXT,
  pin_code TEXT,
  notes TEXT,
  total_stars INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  space_id TEXT REFERENCES spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT DEFAULT 'bookmark',
  color TEXT DEFAULT '#6366f1',
  is_default INTEGER DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  category_slug TEXT NOT NULL DEFAULT 'ibadah' CHECK (category_slug IN ('ibadah', 'adab', 'belajar', 'kemandirian', 'kesehatan', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  star_reward INTEGER DEFAULT 1,
  icon TEXT DEFAULT 'sparkles',
  is_prayer_5_times INTEGER DEFAULT FALSE,
  prayer_name TEXT CHECK (prayer_name IN ('subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', NULL)),
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  log_date TEXT NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  
  -- Multi-dimensi pelaksanaan sholat / ibadah
  timing TEXT DEFAULT 'on_time' CHECK (timing IN ('on_time', 'late', 'qadha', 'not_performed', NULL)),
  location_mode TEXT DEFAULT 'jamaah_masjid' CHECK (location_mode IN ('jamaah_masjid', 'jamaah_rumah', 'munfarid', NULL)),
  has_rawatib INTEGER DEFAULT FALSE,
  has_dzikir INTEGER DEFAULT FALSE,
  
  notes TEXT,
  stars_awarded INTEGER DEFAULT 0,
  verified_by TEXT REFERENCES user(id) ON DELETE SET NULL,
  verified_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, activity_id, log_date)
);

CREATE TABLE IF NOT EXISTS rewards_pledges (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('idr', 'gold_grams', 'item', 'experience')),
  target_value REAL DEFAULT 0,
  target_unit TEXT DEFAULT 'rupiah',
  stars_required INTEGER NOT NULL DEFAULT 10,
  icon TEXT DEFAULT 'gift',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rewards_ledger (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  pledge_id TEXT REFERENCES rewards_pledges(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'fulfilled', 'adjustment')),
  amount REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'rupiah',
  notes TEXT,
  created_by TEXT REFERENCES user(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_sessions (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  session_date TEXT NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  topic TEXT,
  observations TEXT NOT NULL,
  next_steps TEXT,
  attendee_child_ids TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  child_id TEXT REFERENCES children(id) ON DELETE SET NULL,
  log_id TEXT REFERENCES activity_logs(id) ON DELETE SET NULL,
  session_id TEXT REFERENCES class_sessions(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by TEXT REFERENCES user(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS installation_license(id TEXT PRIMARY KEY CHECK(id='license'),license_key TEXT NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TRIGGER IF NOT EXISTS activity_logs_child_id_insert BEFORE INSERT ON activity_logs WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS activity_logs_activity_id_insert BEFORE INSERT ON activity_logs WHEN NEW.activity_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM activities WHERE id=NEW.activity_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS activity_logs_child_id_update BEFORE UPDATE ON activity_logs WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS activity_logs_activity_id_update BEFORE UPDATE ON activity_logs WHEN NEW.activity_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM activities WHERE id=NEW.activity_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_pledges_child_id_insert BEFORE INSERT ON rewards_pledges WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_pledges_child_id_update BEFORE UPDATE ON rewards_pledges WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_ledger_child_id_insert BEFORE INSERT ON rewards_ledger WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_ledger_pledge_id_insert BEFORE INSERT ON rewards_ledger WHEN NEW.pledge_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM rewards_pledges WHERE id=NEW.pledge_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_ledger_child_id_update BEFORE UPDATE ON rewards_ledger WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS rewards_ledger_pledge_id_update BEFORE UPDATE ON rewards_ledger WHEN NEW.pledge_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM rewards_pledges WHERE id=NEW.pledge_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS media_assets_child_id_insert BEFORE INSERT ON media_assets WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;
CREATE TRIGGER IF NOT EXISTS media_assets_child_id_update BEFORE UPDATE ON media_assets WHEN NEW.child_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM children WHERE id=NEW.child_id AND space_id=NEW.space_id) BEGIN SELECT RAISE(ABORT,'Invalid space relation'); END;

CREATE TRIGGER IF NOT EXISTS log_stars_insert AFTER INSERT ON activity_logs BEGIN UPDATE children SET total_stars=(SELECT COALESCE(SUM(stars_awarded),0) FROM activity_logs WHERE child_id=NEW.child_id AND status='approved') WHERE id=NEW.child_id; END;
CREATE TRIGGER IF NOT EXISTS log_stars_update AFTER UPDATE ON activity_logs BEGIN UPDATE children SET total_stars=(SELECT COALESCE(SUM(stars_awarded),0) FROM activity_logs WHERE child_id=NEW.child_id AND status='approved') WHERE id=NEW.child_id; END;
CREATE TRIGGER IF NOT EXISTS log_stars_delete AFTER DELETE ON activity_logs BEGIN UPDATE children SET total_stars=(SELECT COALESCE(SUM(stars_awarded),0) FROM activity_logs WHERE child_id=OLD.child_id AND status='approved') WHERE id=OLD.child_id; END;
