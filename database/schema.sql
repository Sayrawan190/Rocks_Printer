CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(40) UNIQUE NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  password_hash TEXT NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS filaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  material VARCHAR(20) NOT NULL CHECK (material IN ('PLA','PLA+')),
  color VARCHAR(60) NOT NULL,
  color_hex VARCHAR(10) DEFAULT '#64748b',
  total_grams NUMERIC(10,2) NOT NULL DEFAULT 1000 CHECK (total_grams > 0),
  remaining_grams NUMERIC(10,2) NOT NULL CHECK (remaining_grams >= 0),
  owners JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_sar NUMERIC(10,2) CHECK (price_sar IS NULL OR price_sar >= 0),
  purchase_date DATE,
  notes TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (remaining_grams <= total_grams)
);

CREATE TABLE IF NOT EXISTS queue_items (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  product_name VARCHAR(160) NOT NULL,
  filament_id INTEGER REFERENCES filaments(id) ON DELETE SET NULL,
  model_link TEXT,
  image_url TEXT,
  estimated_grams NUMERIC(10,2) NOT NULL CHECK (estimated_grams > 0),
  estimated_duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (estimated_duration_minutes > 0),
  priority VARCHAR(10) NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Low','Normal','High')),
  notes TEXT,
  status VARCHAR(12) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Printing','Done','Failed','Canceled')),
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queue_logs (
  id BIGSERIAL PRIMARY KEY,
  queue_id INTEGER REFERENCES queue_items(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  actor_id INTEGER REFERENCES users(id),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS current_print (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  queue_id INTEGER UNIQUE NOT NULL REFERENCES queue_items(id),
  owner_id INTEGER NOT NULL REFERENCES users(id),
  product_name VARCHAR(160) NOT NULL,
  filament_id INTEGER REFERENCES filaments(id) ON DELETE SET NULL,
  filament_name VARCHAR(120),
  filament_color VARCHAR(60),
  estimated_grams NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  model_link TEXT,
  image_url TEXT,
  notes TEXT,
  status VARCHAR(10) NOT NULL DEFAULT 'Printing' CHECK (status IN ('Printing','Paused')),
  started_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  paused_at TIMESTAMPTZ,
  started_by INTEGER NOT NULL REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  product_name VARCHAR(160) NOT NULL,
  model_link TEXT,
  image_url TEXT,
  notes TEXT,
  estimated_grams NUMERIC(10,2) CHECK (estimated_grams IS NULL OR estimated_grams > 0),
  preferred_filament_id INTEGER REFERENCES filaments(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS print_history (
  id BIGSERIAL PRIMARY KEY,
  queue_id INTEGER REFERENCES queue_items(id) ON DELETE SET NULL,
  product_name VARCHAR(160) NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  filament_id INTEGER REFERENCES filaments(id) ON DELETE SET NULL,
  filament_name VARCHAR(120),
  filament_color VARCHAR(60),
  grams NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (grams >= 0),
  result VARCHAR(10) NOT NULL CHECK (result IN ('Completed','Failed','Canceled')),
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_link TEXT,
  image_url TEXT,
  note TEXT,
  started_by INTEGER REFERENCES users(id),
  finished_by INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS filament_logs (
  id BIGSERIAL PRIMARY KEY,
  filament_id INTEGER NOT NULL REFERENCES filaments(id) ON DELETE CASCADE,
  history_id BIGINT REFERENCES print_history(id) ON DELETE SET NULL,
  product_name VARCHAR(160) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  grams NUMERIC(10,2) NOT NULL CHECK (grams >= 0),
  result VARCHAR(10) NOT NULL CHECK (result IN ('Completed','Failed','Canceled')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(40) NOT NULL DEFAULT 'info',
  related_entity_id BIGINT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('Maintenance','Repair','Purchased Part','Upgrade','Cleaning','Calibration','Consumable Purchase','Other')),
  description TEXT,
  maintenance_date DATE NOT NULL,
  printer_name VARCHAR(120) NOT NULL DEFAULT 'Ender 3 V3 SE',
  total_cost NUMERIC(10,2) NOT NULL CHECK (total_cost >= 0),
  store_name VARCHAR(160),
  invoice_link TEXT,
  receipt_image_url TEXT,
  notes TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_payments (
  id BIGSERIAL PRIMARY KEY,
  maintenance_id INTEGER NOT NULL REFERENCES maintenance_records(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  UNIQUE (maintenance_id, user_id)
);

CREATE TABLE IF NOT EXISTS login_history (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  username_attempted VARCHAR(80),
  success BOOLEAN NOT NULL,
  ip_address VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queue_owner_status ON queue_items(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_history_owner_date ON print_history(owner_id, finished_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_date ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_date ON maintenance_records(maintenance_date DESC);
