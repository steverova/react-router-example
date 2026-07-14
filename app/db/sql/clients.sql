CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL DEFAULT 'legal_entity',
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  tax_id TEXT,
  country TEXT,
  state_province TEXT,
  city TEXT,
  address TEXT,
  postal_code TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
