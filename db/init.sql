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