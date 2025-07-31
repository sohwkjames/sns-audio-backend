CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default user of {username: admin, password: Password123}
INSERT INTO users (username, password_hash)
VALUES (
  'admin',
  '$2b$10$orgpExCAHDKFPrJ7EE4c9OZeLCRAmbyyC9MC7iMnfXxmJZKypTJE6'
)
ON CONFLICT (username) DO NOTHING;