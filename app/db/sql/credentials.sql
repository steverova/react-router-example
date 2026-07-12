CREATE TABLE credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id CHAR(36) NOT NULL,
  provider ENUM('password', 'google', 'github') NOT NULL,
  provider_user_id VARCHAR(255) NULL,
  password_hash VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_provider_user (provider, provider_user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
