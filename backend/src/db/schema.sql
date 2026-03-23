-- backend/src/db/schema.sql
-- Canonical schema for local DB init (npm run db:init)
-- Keep in sync with schema_dump_utf8.sql (production dump)

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  spotify_id TEXT UNIQUE,
  genres TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  refresh_token TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  google_token_expiry BIGINT,
  google_sync_enabled BOOLEAN DEFAULT true,
  email_alerts BOOLEAN DEFAULT true,
  push_alerts BOOLEAN DEFAULT false,
  profile_image_url TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  event_date TIMESTAMP NOT NULL,
  description TEXT,
  category VARCHAR(50),
  external_url TEXT,
  google_calendar_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIME,
  end_time TIME
);

CREATE TABLE IF NOT EXISTS event_artists (
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, artist_id)
);

CREATE TABLE IF NOT EXISTS releases (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT,
  release_date DATE,
  spotify_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_artists (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artist_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_artists_spotify_id ON artists (spotify_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_tracked_user_id ON user_artists (user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_artist_id ON user_artists (artist_id);
