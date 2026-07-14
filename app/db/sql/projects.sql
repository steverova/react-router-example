CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_entity_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  project_manager_id INTEGER,
  owner_id INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  start_date TEXT,
  target_end_date TEXT,
  hours_budget REAL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
