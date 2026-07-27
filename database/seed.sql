-- Generated from "3D Printer (1)(1).xlsx" for schema(7).sql.
-- The users and passwords remain exactly as defined in the original seed file.
-- Assumptions and source corrections are documented at the end of this file.

BEGIN;

TRUNCATE TABLE
  login_history,
  maintenance_payments,
  maintenance_records,
  notifications,
  filament_logs,
  print_history,
  favorites,
  current_print,
  queue_logs,
  queue_items,
  filaments,
  app_settings,
  admin_permissions,
  users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, display_name, password_hash, language)
VALUES
  ('Abdullah', 'Abdullah', crypt('1234', gen_salt('bf')), 'en'),
  ('Basel', 'Basil', crypt('1234', gen_salt('bf')), 'en'),
  ('Saleh', 'Saleh', crypt('1234', gen_salt('bf')), 'en'),
  ('Rocks', 'Rocks', crypt('1234', gen_salt('bf')), 'en');

INSERT INTO admin_permissions (singleton, user_id)
SELECT TRUE, id FROM users WHERE username = 'Abdullah';

INSERT INTO app_settings (key, value)
VALUES ('printer_name', '"Ender 3 V3 SE"'::jsonb);

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 1, 'Filament #1 - Black', 'PLA', 'Black', '#111827', 1000, 808.42,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-06-30', 'Imported inventory spool #1. Excel total consumption: 191.58 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh', 'Basel');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 2, 'Filament #2 - Black', 'PLA', 'Black', '#111827', 1000, 43.32,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-06-30', 'Imported inventory spool #2. Excel total consumption: 956.68 g.'
FROM users
WHERE username IN ('Abdullah');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 3, 'Filament #3 - Black', 'PLA', 'Black', '#111827', 1000, 219.41,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-06-30', 'Imported inventory spool #3. Excel total consumption: 780.59 g.'
FROM users
WHERE username IN ('Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 4, 'Filament #4 - Black', 'PLA', 'Black', '#111827', 1000, 0.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-06-30', 'Imported inventory spool #4. Excel total consumption: 1002.99 g. Excel reported remaining -2.99 g; stored as 0.00 g to satisfy the schema constraint.'
FROM users
WHERE username IN ('Basel');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 5, 'Filament #5 - White', 'PLA', 'White', '#f8fafc', 60, 10.77,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-06-24', 'Imported inventory spool #5. Excel total consumption: 49.23 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh', 'Basel');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 6, 'Filament #6 - Skin', 'PLA', 'Skin', '#e8b894', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #6. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 7, 'Filament #7 - Black', 'PLA', 'Black', '#111827', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #7. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 8, 'Filament #8 - Brown', 'PLA', 'Brown', '#8b5e3c', 1000, 839.10,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #8. Excel total consumption: 160.90 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 9, 'Filament #9 - Silver', 'PLA', 'Silver', '#c0c0c0', 1000, 833.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #9. Excel total consumption: 167.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 10, 'Filament #10 - Blue', 'PLA', 'Blue', '#2563eb', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #10. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 11, 'Filament #11 - Orange', 'PLA', 'Orange', '#f97316', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #11. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 12, 'Filament #12 - White', 'PLA', 'White', '#f8fafc', 1000, 502.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #12. Excel total consumption: 498.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 13, 'Filament #13 - Gray', 'PLA', 'Gray', '#6b7280', 1000, 347.77,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #13. Excel total consumption: 652.23 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 14, 'Filament #14 - Red', 'PLA', 'Red', '#dc2626', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #14. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO filaments (id, name, material, color, color_hex, total_grams, remaining_grams, owners, price_sar, purchase_date, notes)
SELECT 15, 'Filament #15 - Green', 'PLA', 'Green', '#16a34a', 1000, 1000.00,
       COALESCE(jsonb_agg(id ORDER BY id), '[]'::jsonb), NULL, DATE '2026-07-02', 'Imported inventory spool #15. Excel total consumption: 0.00 g.'
FROM users
WHERE username IN ('Abdullah', 'Saleh');

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 1, id, 'Porsche 911', 4, 'https://drive.google.com/open?id=1ifBpnW44zzzC3Sb39UOA2QSHCgJ4GCJM', NULL, 77.14, 240, 'Normal', 'Imported queue status: تمت الطباعة.', 'Done', 0, TIMESTAMPTZ '2026-07-02 00:53:31+03', TIMESTAMPTZ '2026-07-02 00:53:31+03'
FROM users WHERE username = 'Basel';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 2, id, 'Minimal Remote Stand', 4, 'https://drive.google.com/open?id=1GehEYDO8lOfmDP1Sdwn7iApPC6V1gzsS', NULL, 119.51, 240, 'Normal', 'Imported queue status: تمت الطباعة.', 'Done', 0, TIMESTAMPTZ '2026-07-02 00:58:17+03', TIMESTAMPTZ '2026-07-02 00:58:17+03'
FROM users WHERE username = 'Basel';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 3, id, 'CR7 Card', 3, 'https://drive.google.com/open?id=1CAF3WWvVh4HSm4lzxxZMKhuHjuIz4fT8', NULL, 21.73, 156, 'Normal', 'Imported queue status: تمت الطباعة.', 'Done', 0, TIMESTAMPTZ '2026-07-04 00:14:45+03', TIMESTAMPTZ '2026-07-04 00:14:45+03'
FROM users WHERE username = 'Saleh';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 4, id, 'CR7 Model', 3, 'https://drive.google.com/open?id=1_bHj5fsLyi0hfPUo64Cxo3O5gMAEf--7', NULL, 50, 156, 'Normal', 'Imported queue status: الى وقثت اخر. Estimated grams were not provided in Excel and were assumed.', 'Canceled', 0, TIMESTAMPTZ '2026-07-04 00:16:04+03', TIMESTAMPTZ '2026-07-04 00:16:04+03'
FROM users WHERE username = 'Saleh';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 5, id, 'Tweezers  P2', 14, 'https://drive.google.com/open?id=1wizE_CH1gP3Svz2yM4NcfZwLtF-Jr63F', NULL, 10, 156, 'Normal', 'Imported queue status: في الانتظار. Estimated grams were not provided in Excel and were assumed.', 'Pending', 1, TIMESTAMPTZ '2026-07-08 09:49:53+03', TIMESTAMPTZ '2026-07-08 09:49:53+03'
FROM users WHERE username = 'Saleh';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 6, id, 'Phone Stand P2', 3, 'https://drive.google.com/open?id=1SscQfexSRkO7QyPEqgRrB6BgmS1rp9IL', NULL, 70.03, 156, 'Normal', 'Imported queue status: تمت الطباعة. Estimated grams were not provided in Excel and were assumed.', 'Done', 0, TIMESTAMPTZ '2026-07-08 09:51:05+03', TIMESTAMPTZ '2026-07-08 09:51:05+03'
FROM users WHERE username = 'Saleh';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 7, id, 'Dr', 12, 'https://drive.google.com/open?id=1hc0uExOitfl_WGEDjSYMMGqe5zwWHy5e', NULL, 25, 156, 'Normal', 'Imported queue status: في الانتظار.', 'Pending', 2, TIMESTAMPTZ '2026-07-08 18:15:47+03', TIMESTAMPTZ '2026-07-08 18:15:47+03'
FROM users WHERE username = 'Abdullah';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 8, id, 'ستاند جوال', 12, 'https://drive.google.com/open?id=1Wvnu-WqwUFfhGNJ9M9fYuViB6N9nhlmy', NULL, 60, 156, 'Normal', 'Imported queue status: في الانتظار. Preferred color was Any; filament #12 (White) was assigned. Estimated grams were not provided in Excel and were assumed.', 'Pending', 3, TIMESTAMPTZ '2026-07-08 18:21:11+03', TIMESTAMPTZ '2026-07-08 18:21:11+03'
FROM users WHERE username = 'Abdullah';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 9, id, 'Black Staff', 2, 'https://drive.google.com/open?id=1werexPwgfhKf6bpBWeQp7BYsE-MUnAyo', NULL, 42.63, 156, 'Normal', 'Imported queue status: في الانتظار. Estimated grams were not provided in Excel and were assumed.', 'Pending', 4, TIMESTAMPTZ '2026-07-10 18:21:59+03', TIMESTAMPTZ '2026-07-10 18:21:59+03'
FROM users WHERE username = 'Abdullah';

INSERT INTO queue_items (id, owner_id, product_name, filament_id, model_link, image_url, estimated_grams, estimated_duration_minutes, priority, notes, status, position, added_at, updated_at)
SELECT 10, id, 'White Staff', 12, 'https://drive.google.com/open?id=1jZSt2L9AskN6ed-1xdR364QbP3QpQpDY', NULL, 38, 156, 'Normal', 'Imported queue status: في الانتظار.', 'Pending', 5, TIMESTAMPTZ '2026-07-10 18:22:46+03', TIMESTAMPTZ '2026-07-10 18:22:46+03'
FROM users WHERE username = 'Abdullah';

INSERT INTO queue_logs (queue_id, action, actor_id, details, created_at)
SELECT q.id, 'Added', q.owner_id, jsonb_build_object('source', 'Excel Queue', 'status', q.status), q.added_at
FROM queue_items q
ORDER BY q.id;

INSERT INTO queue_logs (queue_id, action, actor_id, details, created_at)
SELECT q.id,
       CASE q.status WHEN 'Done' THEN 'Completed' ELSE 'Canceled' END,
       q.owner_id,
       jsonb_build_object('source', 'Excel Queue'),
       q.updated_at
FROM queue_items q
WHERE q.status IN ('Done', 'Canceled')
ORDER BY q.id;

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 1, NULL, 'مشحاف', u.id, 5, f.name, 'White', 3.05, 'Completed', 11,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '11 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 2, NULL, 'القارب', u.id, 5, f.name, 'White', 1, 'Failed', 3,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '3 minutes',
       NULL, NULL, 'الفشل على 20%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 3, NULL, 'القارب', u.id, 5, f.name, 'White', 3, 'Completed', 14,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '14 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 4, NULL, 'PLA-S', u.id, 5, f.name, 'White', 1, 'Failed', 5,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '5 minutes',
       NULL, NULL, 'الفشل على 25%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 5, NULL, 'PLA-S', u.id, 5, f.name, 'White', 4, 'Completed', 17,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '17 minutes',
       NULL, NULL, 'الفشل على 95%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 6, NULL, 'PLA-A&B', u.id, 5, f.name, 'White', 8, 'Completed', 35,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '35 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 7, NULL, 'PLA-A&B&S', u.id, 5, f.name, 'White', 12.3, 'Completed', 51,
       TIMESTAMPTZ '2026-06-25 00:00:00+03',
       TIMESTAMPTZ '2026-06-25 00:00:00+03' + INTERVAL '51 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 8, NULL, 'مشحاف', u.id, 5, f.name, 'White', 3.05, 'Completed', 11,
       TIMESTAMPTZ '2026-06-24 00:00:00+03',
       TIMESTAMPTZ '2026-06-24 00:00:00+03' + INTERVAL '11 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 9, NULL, 'Base 4x4', u.id, 1, f.name, 'Black', 20, 'Completed', 69,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '69 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 1
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 10, NULL, 'org tools', u.id, 1, f.name, 'Black', 171.58, 'Completed', 513,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '513 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 1
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 11, NULL, 'Flow Tester', u.id, 13, f.name, 'Gray', 14.01, 'Completed', 51,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '51 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 12, NULL, 'Bed Tester', u.id, 13, f.name, 'Gray', 10.8, 'Completed', 24,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '24 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 13, NULL, 'Bed Tester', u.id, 12, f.name, 'White', 10.8, 'Completed', 24,
       TIMESTAMPTZ '2026-07-19 00:00:00+03',
       TIMESTAMPTZ '2026-07-19 00:00:00+03' + INTERVAL '24 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Rocks';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 14, NULL, 'Sd_orgnaizer', u.id, 5, f.name, 'White', 13.83, 'Completed', 43,
       TIMESTAMPTZ '2026-06-28 00:00:00+03',
       TIMESTAMPTZ '2026-06-28 00:00:00+03' + INTERVAL '43 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 5
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 15, NULL, 'Base_4x4', u.id, 2, f.name, 'Black', 3.3, 'Canceled', 11,
       TIMESTAMPTZ '2026-06-29 00:00:00+03',
       TIMESTAMPTZ '2026-06-29 00:00:00+03' + INTERVAL '11 minutes',
       NULL, NULL, 'الغيت على 18%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 16, NULL, 'Base_5x5', u.id, 2, f.name, 'Black', 29.53, 'Completed', 107,
       TIMESTAMPTZ '2026-06-29 00:00:00+03',
       TIMESTAMPTZ '2026-06-29 00:00:00+03' + INTERVAL '107 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 17, NULL, 'Base_5x3', u.id, 2, f.name, 'Black', 17.94, 'Completed', 66,
       TIMESTAMPTZ '2026-06-29 00:00:00+03',
       TIMESTAMPTZ '2026-06-29 00:00:00+03' + INTERVAL '66 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 18, NULL, 'org 9 pieces', u.id, 2, f.name, 'Black', 292.33, 'Completed', 876,
       TIMESTAMPTZ '2026-06-29 00:00:00+03',
       TIMESTAMPTZ '2026-06-29 00:00:00+03' + INTERVAL '876 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 19, NULL, 'org 5x2', u.id, 2, f.name, 'Black', 95.93, 'Completed', 238,
       TIMESTAMPTZ '2026-06-30 00:00:00+03',
       TIMESTAMPTZ '2026-06-30 00:00:00+03' + INTERVAL '238 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 20, NULL, 'Moon planter', u.id, 2, f.name, 'Black', 2, 'Failed', 1,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '1 minutes',
       NULL, NULL, 'اول طبقة', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 21, NULL, 'Moon planter', u.id, 2, f.name, 'Black', 71.45, 'Failed', 540,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '540 minutes',
       NULL, NULL, 'فشل على 80%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 22, NULL, 'half moon', u.id, 2, f.name, 'Black', 2.49, 'Failed', 26,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '26 minutes',
       NULL, NULL, 'فشلت على 26%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 23, NULL, 'only moon', u.id, 2, f.name, 'Black', 11.16, 'Failed', 92,
       TIMESTAMPTZ '2026-07-02 00:00:00+03',
       TIMESTAMPTZ '2026-07-02 00:00:00+03' + INTERVAL '92 minutes',
       NULL, NULL, 'خلص الفلمنت على 18%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 24, NULL, 'org 5 pieces', u.id, 2, f.name, 'Black', 206.89, 'Completed', 807,
       TIMESTAMPTZ '2026-07-02 00:00:00+03',
       TIMESTAMPTZ '2026-07-02 00:00:00+03' + INTERVAL '807 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 25, NULL, 'only moon', u.id, 2, f.name, 'Black', 62.04, 'Completed', 551,
       TIMESTAMPTZ '2026-07-04 00:00:00+03',
       TIMESTAMPTZ '2026-07-04 00:00:00+03' + INTERVAL '551 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 26, NULL, 'Base 1(3x5)', u.id, 2, f.name, 'Black', 10.99, 'Completed', 45,
       TIMESTAMPTZ '2026-07-05 00:00:00+03',
       TIMESTAMPTZ '2026-07-05 00:00:00+03' + INTERVAL '45 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 27, NULL, 'HelloKitty', u.id, 13, f.name, 'Gray', 27.04, 'Completed', 270,
       TIMESTAMPTZ '2026-07-08 00:00:00+03',
       TIMESTAMPTZ '2026-07-08 00:00:00+03' + INTERVAL '270 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 28, NULL, 'iphon Stand', u.id, 13, f.name, 'Gray', 198.58, 'Completed', 893,
       TIMESTAMPTZ '2026-07-09 00:00:00+03',
       TIMESTAMPTZ '2026-07-09 00:00:00+03' + INTERVAL '893 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 29, 9, 'Black Staff', u.id, 2, f.name, 'Black', 42.63, 'Completed', 287,
       TIMESTAMPTZ '2026-07-11 00:00:00+03',
       TIMESTAMPTZ '2026-07-11 00:00:00+03' + INTERVAL '287 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 30, NULL, 'Porsche GT3', u.id, 2, f.name, 'Black', 108, 'Completed', 898,
       TIMESTAMPTZ '2026-07-13 00:00:00+03',
       TIMESTAMPTZ '2026-07-13 00:00:00+03' + INTERVAL '898 minutes',
       NULL, NULL, 'الى حد ما', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 2
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 31, NULL, 'Coffee Bens', u.id, 8, f.name, 'Brown', 37.07, 'Failed', 227,
       TIMESTAMPTZ '2026-07-13 00:00:00+03',
       TIMESTAMPTZ '2026-07-13 00:00:00+03' + INTERVAL '227 minutes',
       NULL, NULL, 'اخ بس', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 32, NULL, 'Coffee Bens', u.id, 8, f.name, 'Brown', 39, 'Completed', 337,
       TIMESTAMPTZ '2026-07-13 00:00:00+03',
       TIMESTAMPTZ '2026-07-13 00:00:00+03' + INTERVAL '337 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 33, NULL, 'Ampoule', u.id, 8, f.name, 'Brown', 15, 'Completed', 60,
       TIMESTAMPTZ '2026-07-15 00:00:00+03',
       TIMESTAMPTZ '2026-07-15 00:00:00+03' + INTERVAL '60 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 34, 10, 'White Staff', u.id, 12, f.name, 'White', 34, 'Failed', 175,
       TIMESTAMPTZ '2026-07-15 00:00:00+03',
       TIMESTAMPTZ '2026-07-15 00:00:00+03' + INTERVAL '175 minutes',
       NULL, NULL, 'التصاق', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 35, 10, 'White Staff', u.id, 12, f.name, 'White', 38, 'Completed', 175,
       TIMESTAMPTZ '2026-07-16 00:00:00+03',
       TIMESTAMPTZ '2026-07-16 00:00:00+03' + INTERVAL '175 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 36, NULL, 'moniter Raizer', u.id, 12, f.name, 'White', 1, 'Canceled', 5,
       TIMESTAMPTZ '2026-07-17 00:00:00+03',
       TIMESTAMPTZ '2026-07-17 00:00:00+03' + INTERVAL '5 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 37, NULL, 'moniter Raizer P1', u.id, 12, f.name, 'White', 132, 'Completed', 886,
       TIMESTAMPTZ '2026-07-17 00:00:00+03',
       TIMESTAMPTZ '2026-07-17 00:00:00+03' + INTERVAL '886 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 38, NULL, 'gravity-hanger', u.id, 12, f.name, 'White', 19, 'Failed', 61,
       TIMESTAMPTZ '2026-07-18 00:00:00+03',
       TIMESTAMPTZ '2026-07-18 00:00:00+03' + INTERVAL '61 minutes',
       NULL, NULL, '1', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 39, NULL, 'moniter Raizer P2', u.id, 12, f.name, 'White', 60, 'Failed', 400,
       TIMESTAMPTZ '2026-07-19 00:00:00+03',
       TIMESTAMPTZ '2026-07-19 00:00:00+03' + INTERVAL '400 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 40, NULL, 'moniter Raizer P2', u.id, 12, f.name, 'White', 69, 'Failed', 420,
       TIMESTAMPTZ '2026-07-20 00:00:00+03',
       TIMESTAMPTZ '2026-07-20 00:00:00+03' + INTERVAL '420 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 41, NULL, 'Ampoule', u.id, 13, f.name, 'Gray', 14, 'Completed', 69,
       TIMESTAMPTZ '2026-07-20 00:00:00+03',
       TIMESTAMPTZ '2026-07-20 00:00:00+03' + INTERVAL '69 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 42, NULL, 'Trojan 8', u.id, 9, f.name, 'Silver', 55, 'Failed', 360,
       TIMESTAMPTZ '2026-07-21 00:00:00+03',
       TIMESTAMPTZ '2026-07-21 00:00:00+03' + INTERVAL '360 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 9
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 43, NULL, 'Trojan 8', u.id, 9, f.name, 'Silver', 50, 'Completed', 545,
       TIMESTAMPTZ '2026-07-21 00:00:00+03',
       TIMESTAMPTZ '2026-07-21 00:00:00+03' + INTERVAL '545 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 9
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 44, NULL, 'Trojan 8', u.id, 9, f.name, 'Silver', 62, 'Completed', 375,
       TIMESTAMPTZ '2026-07-22 00:00:00+03',
       TIMESTAMPTZ '2026-07-22 00:00:00+03' + INTERVAL '375 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 9
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 45, NULL, 'moniter Raizer P2', u.id, 12, f.name, 'White', 132, 'Completed', 886,
       TIMESTAMPTZ '2026-07-23 00:00:00+03',
       TIMESTAMPTZ '2026-07-23 00:00:00+03' + INTERVAL '886 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 46, NULL, 'Liunx', u.id, 12, f.name, 'White', 11, 'Failed', 312,
       TIMESTAMPTZ '2026-07-26 00:00:00+03',
       TIMESTAMPTZ '2026-07-26 00:00:00+03' + INTERVAL '312 minutes',
       NULL, NULL, 'الطبقه الاولى', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 47, NULL, 'Liunx', u.id, 12, f.name, 'White', 2, 'Failed', 312,
       TIMESTAMPTZ '2026-07-26 00:00:00+03',
       TIMESTAMPTZ '2026-07-26 00:00:00+03' + INTERVAL '312 minutes',
       NULL, NULL, 'مشكله التصاق', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 12
WHERE u.username = 'Abdullah';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 48, NULL, 'Monitor_Riser', u.id, 3, f.name, 'Black', 103.96, 'Completed', 402,
       TIMESTAMPTZ '2026-06-30 00:00:00+03',
       TIMESTAMPTZ '2026-06-30 00:00:00+03' + INTERVAL '402 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 49, NULL, 'Desktop Vise', u.id, 3, f.name, 'Black', 88.02, 'Completed', 292,
       TIMESTAMPTZ '2026-07-01 00:00:00+03',
       TIMESTAMPTZ '2026-07-01 00:00:00+03' + INTERVAL '292 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 50, 3, 'CR7 Card', u.id, 3, f.name, 'Black', 21.73, 'Completed', 165,
       TIMESTAMPTZ '2026-07-04 00:00:00+03',
       TIMESTAMPTZ '2026-07-04 00:00:00+03' + INTERVAL '165 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 51, NULL, 'Batman Holder', u.id, 3, f.name, 'Black', 1, 'Canceled', 1,
       TIMESTAMPTZ '2026-07-05 00:00:00+03',
       TIMESTAMPTZ '2026-07-05 00:00:00+03' + INTERVAL '1 minutes',
       NULL, NULL, 'من البدايه', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 52, NULL, 'Phone Stand P1', u.id, 3, f.name, 'Black', 61.99, 'Completed', 189,
       TIMESTAMPTZ '2026-07-06 00:00:00+03',
       TIMESTAMPTZ '2026-07-06 00:00:00+03' + INTERVAL '189 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 53, 6, 'Phone Stand P2', u.id, 3, f.name, 'Black', 35, 'Failed', 124,
       TIMESTAMPTZ '2026-07-06 00:00:00+03',
       TIMESTAMPTZ '2026-07-06 00:00:00+03' + INTERVAL '124 minutes',
       NULL, NULL, 'خلص الفلمنت', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 54, NULL, 'Aouto washer', u.id, 13, f.name, 'Gray', 19, 'Failed', 37,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '37 minutes',
       NULL, NULL, '0.06', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 55, NULL, 'Aouto washer', u.id, 13, f.name, 'Gray', 4, 'Failed', 10,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '10 minutes',
       NULL, NULL, '0.02', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 56, NULL, 'Aouto washer', u.id, 13, f.name, 'Gray', 131.9, 'Completed', 402,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '402 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 57, NULL, 'pinzetteBox + Tweezers P1', u.id, 13, f.name, 'Gray', 75.99, 'Completed', 485,
       TIMESTAMPTZ '2026-07-07 00:00:00+03',
       TIMESTAMPTZ '2026-07-07 00:00:00+03' + INTERVAL '485 minutes',
       NULL, NULL, 'الى حد ما', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 58, NULL, 'pinzetteBox  P2', u.id, 13, f.name, 'Gray', 10, 'Failed', 16,
       TIMESTAMPTZ '2026-07-08 00:00:00+03',
       TIMESTAMPTZ '2026-07-08 00:00:00+03' + INTERVAL '16 minutes',
       NULL, NULL, '0.05', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 59, NULL, 'pinzetteBox  P2', u.id, 13, f.name, 'Gray', 38.68, 'Completed', 228,
       TIMESTAMPTZ '2026-07-08 00:00:00+03',
       TIMESTAMPTZ '2026-07-08 00:00:00+03' + INTERVAL '228 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 60, NULL, 'pinzette Body', u.id, 13, f.name, 'Gray', 9.23, 'Completed', 53,
       TIMESTAMPTZ '2026-07-08 00:00:00+03',
       TIMESTAMPTZ '2026-07-08 00:00:00+03' + INTERVAL '53 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 61, NULL, 'Gaun Grap', u.id, 13, f.name, 'Gray', 66, 'Completed', 606,
       TIMESTAMPTZ '2026-07-09 00:00:00+03',
       TIMESTAMPTZ '2026-07-09 00:00:00+03' + INTERVAL '606 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 62, NULL, 'Gun Components', u.id, 13, f.name, 'Gray', 33, 'Completed', 378,
       TIMESTAMPTZ '2026-07-09 00:00:00+03',
       TIMESTAMPTZ '2026-07-09 00:00:00+03' + INTERVAL '378 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 13
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 63, 6, 'Phone Stand P2', u.id, 3, f.name, 'Black', 70.03, 'Completed', 247,
       TIMESTAMPTZ '2026-07-10 00:00:00+03',
       TIMESTAMPTZ '2026-07-10 00:00:00+03' + INTERVAL '247 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 64, NULL, 'Nozel Gun', u.id, 3, f.name, 'Black', 216, 'Completed', 1287,
       TIMESTAMPTZ '2026-07-11 00:00:00+03',
       TIMESTAMPTZ '2026-07-11 00:00:00+03' + INTERVAL '1287 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 65, NULL, 'Gun Black staff', u.id, 3, f.name, 'Black', 182.86, 'Completed', 1352,
       TIMESTAMPTZ '2026-07-12 00:00:00+03',
       TIMESTAMPTZ '2026-07-12 00:00:00+03' + INTERVAL '1352 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 3
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 66, NULL, 'Brown Staff', u.id, 8, f.name, 'Brown', 3, 'Failed', 10,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '10 minutes',
       NULL, NULL, 'اول طبقة', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 67, NULL, 'Brown Staff', u.id, 8, f.name, 'Brown', 8.68, 'Failed', 102,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '102 minutes',
       NULL, NULL, ' نص نجاح', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 68, NULL, 'Brown Staff', u.id, 8, f.name, 'Brown', 8.7, 'Failed', 98,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '98 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 69, NULL, 'Brown Staff', u.id, 8, f.name, 'Brown', 4.14, 'Failed', 35,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '35 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 70, NULL, 'Pinzette Hocks', u.id, 8, f.name, 'Brown', 8, 'Failed', 117,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '117 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 71, NULL, 'Pinzette Hocks', u.id, 8, f.name, 'Brown', 15, 'Failed', 103,
       TIMESTAMPTZ '2026-07-14 00:00:00+03',
       TIMESTAMPTZ '2026-07-14 00:00:00+03' + INTERVAL '103 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 72, NULL, 'Pinzette Hocks', u.id, 8, f.name, 'Brown', 22.31, 'Completed', 144,
       TIMESTAMPTZ '2026-07-24 00:00:00+03',
       TIMESTAMPTZ '2026-07-24 00:00:00+03' + INTERVAL '144 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 8
WHERE u.username = 'Saleh';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 73, 1, 'Porsche 911', u.id, 4, f.name, 'Black', 4.36, 'Canceled', 50,
       TIMESTAMPTZ '2026-07-03 00:00:00+03',
       TIMESTAMPTZ '2026-07-03 00:00:00+03' + INTERVAL '50 minutes',
       NULL, NULL, 'على 4%', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 74, 1, 'Porsche 911', u.id, 4, f.name, 'Black', 77.14, 'Completed', 646,
       TIMESTAMPTZ '2026-07-03 00:00:00+03',
       TIMESTAMPTZ '2026-07-03 00:00:00+03' + INTERVAL '646 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 75, 2, 'remote stand', u.id, 4, f.name, 'Black', 119.51, 'Completed', 287,
       TIMESTAMPTZ '2026-07-03 00:00:00+03',
       TIMESTAMPTZ '2026-07-03 00:00:00+03' + INTERVAL '287 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 76, NULL, 'Porsche GT3', u.id, 4, f.name, 'Black', 108, 'Completed', 898,
       TIMESTAMPTZ '2026-07-05 00:00:00+03',
       TIMESTAMPTZ '2026-07-05 00:00:00+03' + INTERVAL '898 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 77, NULL, 'Enterway part1', u.id, 4, f.name, 'Black', 130.81, 'Completed', 342,
       TIMESTAMPTZ '2026-07-05 00:00:00+03',
       TIMESTAMPTZ '2026-07-05 00:00:00+03' + INTERVAL '342 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 78, NULL, 'Enterway part2', u.id, 4, f.name, 'Black', 89.82, 'Completed', 241,
       TIMESTAMPTZ '2026-07-06 00:00:00+03',
       TIMESTAMPTZ '2026-07-06 00:00:00+03' + INTERVAL '241 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 79, NULL, 'Souls of cinder', u.id, 4, f.name, 'Black', 125, 'Completed', 828,
       TIMESTAMPTZ '2026-07-20 00:00:00+03',
       TIMESTAMPTZ '2026-07-20 00:00:00+03' + INTERVAL '828 minutes',
       NULL, NULL, NULL, u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO print_history (id, queue_id, product_name, owner_id, filament_id, filament_name, filament_color, grams, result, duration_minutes, started_at, finished_at, model_link, image_url, note, started_by, finished_by)
SELECT 80, NULL, 'Controller Throne', u.id, 4, f.name, 'Black', 348.35, 'Completed', 2013,
       TIMESTAMPTZ '1999-01-01 00:00:00+03',
       TIMESTAMPTZ '1999-01-01 00:00:00+03' + INTERVAL '2013 minutes',
       NULL, NULL, 'Result was missing and assumed Completed.', u.id, u.id
FROM users u
JOIN filaments f ON f.id = 4
WHERE u.username = 'Basel';

INSERT INTO filament_logs (filament_id, history_id, product_name, owner_id, grams, result, note, created_at)
SELECT filament_id, id, product_name, owner_id, grams, result, note, finished_at
FROM print_history
ORDER BY id;

UPDATE filaments f
SET usage_count = (
  SELECT COUNT(*)::INTEGER
  FROM print_history h
  WHERE h.filament_id = f.id
);

INSERT INTO maintenance_records (id, title, type, description, maintenance_date, printer_name, total_cost, store_name, invoice_link, receipt_image_url, notes, created_by)
SELECT 1, 'شراء كحول 99.9%', 'Consumable Purchase', 'منظف: كحول 99.9%', DATE '2026-07-09', 'Ender 3 V3 SE', 34.00, NULL, NULL, NULL, 'تبقى باسل', id
FROM users WHERE username = 'Abdullah';

INSERT INTO maintenance_payments (maintenance_id, user_id, amount)
SELECT 1, id, 17.00 FROM users WHERE username IN ('Abdullah', 'Saleh');

SELECT setval(pg_get_serial_sequence('filaments', 'id'), (SELECT MAX(id) FROM filaments), TRUE);
SELECT setval(pg_get_serial_sequence('queue_items', 'id'), (SELECT MAX(id) FROM queue_items), TRUE);
SELECT setval(pg_get_serial_sequence('print_history', 'id'), (SELECT MAX(id) FROM print_history), TRUE);
SELECT setval(pg_get_serial_sequence('maintenance_records', 'id'), (SELECT MAX(id) FROM maintenance_records), TRUE);

COMMIT;

-- Assumptions / corrections made because Excel did not provide these fields:
-- 1) Missing history date for "Controller Throne" was set to 1999-01-01 as requested.
-- 2) Missing result for "Controller Throne" was assumed to be Completed.
-- 3) Print start time was assumed to be 00:00 Asia/Riyadh on the listed date; finish time is start time plus print duration.
-- 4) Filament names were generated as "Filament #N - Color"; color hex values were inferred from common color values.
-- 5) Filament prices were left NULL because Excel contains no prices.
-- 6) Filament #4 showed -2.99 g remaining. It was stored as 0.00 g because the schema forbids negative remaining stock; the original value remains documented in its notes.
-- 7) Queue estimated grams were inferred from matching successful history records when possible. Missing values were assumed as follows:
--    CR7 Model 50 g, Tweezers P2 10 g, Dr 25 g, phone stand 60 g.
-- 8) Queue values of 156 were interpreted as 156 minutes. Values written as 4h were converted to 240 minutes.
-- 9) Queue priority was assumed Normal. "الى وقثت اخر" was mapped to Canceled, and "في الانتظار" to Pending.
-- 10) The "Any" color request was assigned filament #12 (White).
-- 11) No current print, favorites, notifications, or login-history rows were created because Excel has no corresponding data.
-- 12) The maintenance row says "تبقى باسل"; Abdullah and Saleh were therefore assumed to have paid SAR 17 each, while Basel was left unpaid.
-- 13) Existing users, passwords, display names, languages, and Abdullah's admin permission were kept exactly as in the original seed.
