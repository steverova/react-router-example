-- Seed: Usuarios
INSERT INTO users (public_id, name, email, role, status, created_at, updated_at)
VALUES 
  ('admin123', 'Admin', 'admin@example.com', 'admin', 'active', strftime('%s', 'now'), strftime('%s', 'now')),
  ('user001', 'Juan Perez', 'juan@example.com', 'user', 'active', strftime('%s', 'now'), strftime('%s', 'now'));

-- Seed: Credentials (password: password123)
INSERT INTO credentials (user_id, provider, provider_user_id, password_hash, created_at)
VALUES 
  (1, 'password', 'admin@example.com', '9180de33dd6da03eb2d75e37e7d911cd:3f42f86e79f4a16455fdc54b920c65c5ef13f0cf46261f88fdb1482f4817eb31', strftime('%s', 'now')),
  (2, 'password', 'juan@example.com', '9180de33dd6da03eb2d75e37e7d911cd:3f42f86e79f4a16455fdc54b920c65c5ef13f0cf46261f88fdb1482f4817eb31', strftime('%s', 'now'));

-- Seed: Clientes
INSERT INTO clients (entity_type, legal_name, trade_name, email, country, status, created_at, updated_at)
VALUES 
  ('legal_entity', 'Acme Corp', 'Acme', 'contact@acme.com', 'MX', 'active', strftime('%s', 'now'), strftime('%s', 'now')),
  ('person', 'Maria Lopez', NULL, 'maria@example.com', NULL, 'active', strftime('%s', 'now'), strftime('%s', 'now'));

-- Seed: Proyectos
INSERT INTO projects (project_code, client_entity_id, name, status, hours_budget, created_at, updated_at)
VALUES 
  ('PRJ-001', 1, 'Website Redesign', 'active', 120, strftime('%s', 'now'), strftime('%s', 'now')),
  ('PRJ-002', 2, 'Mobile App', 'draft', 200, strftime('%s', 'now'), strftime('%s', 'now'));

-- Seed: Actividades
INSERT INTO activities (project_id, title, priority, status, estimated_hours, created_at, updated_at)
VALUES 
  (1, 'Design mockups', 'high', 'completed', 20, strftime('%s', 'now'), strftime('%s', 'now')),
  (1, 'Frontend development', 'medium', 'in_progress', 40, strftime('%s', 'now'), strftime('%s', 'now')),
  (2, 'Requirements gathering', 'medium', 'pending', 10, strftime('%s', 'now'), strftime('%s', 'now'));
