CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default user of {username: admin, password: Password123}
INSERT INTO users (username, password_hash, is_admin)
VALUES (
  'admin',
  '$2b$10$orgpExCAHDKFPrJ7EE4c9OZeLCRAmbyyC9MC7iMnfXxmJZKypTJE6',
  TRUE
)
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS audios (
  audio_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_path TEXT NOT NULL,
  duration_seconds INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
