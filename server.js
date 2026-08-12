require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Copy .env.example to .env and update it.');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(session({
  store: new pgSession({ pool: db.pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 14
  }
}));
app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});
app.use(express.static(PUBLIC_DIR));

function auth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Authentication required' });
  next();
}

async function currentUser(userId) {
  const { rows } = await db.query(`
    SELECT u.id, u.username, u.display_name, u.language, u.last_login_at,
           (ap.user_id = u.id) AS is_admin
    FROM users u CROSS JOIN admin_permissions ap
    WHERE u.id = $1 AND ap.singleton = TRUE`, [userId]);
  return rows[0];
}

async function adminOnly(req, res, next) {
  const user = await currentUser(req.session.userId);
  if (!user?.is_admin) return res.status(403).json({ error: 'Admin permission required' });
  req.user = user;
  next();
}

function validNumber(value, min = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min ? number : null;
}

function listOwners(value) {
  const list = Array.isArray(value) ? value.map(Number).filter(Number.isInteger) : [];
  return [...new Set(list)];
}

const notificationText = {
  queue_added: {
    en: (p) => ({ title: 'Queue request added', message: `A new print request '${p.productName}' was added to the queue.` }),
    ar: (p) => ({ title: 'طلب جديد في الطابور', message: `تمت إضافة طلب طباعة جديد '${p.productName}' إلى الطابور.` })
  },
  print_started: {
    en: (p) => ({ title: 'Print started', message: `Your print '${p.productName}' has been started by ${p.actor}. Filament: ${p.filament}. Estimated duration: ${p.duration} minutes.` }),
    ar: (p) => ({ title: 'بدأت الطباعة', message: `تم بدء طباعة '${p.productName}' بواسطة ${p.actor}. الفيلمنت: ${p.filament}. المدة المتوقعة: ${p.duration} دقيقة.` })
  },
  print_completed: {
    en: (p) => ({ title: 'Print Completed', message: `Your print '${p.productName}' was marked Completed.` }),
    ar: (p) => ({ title: 'اكتملت الطباعة', message: `تم تحديد طباعة '${p.productName}' كمكتملة.` })
  },
  print_failed: {
    en: (p) => ({ title: 'Print Failed', message: `Your print '${p.productName}' was marked Failed.` }),
    ar: (p) => ({ title: 'فشلت الطباعة', message: `تم تحديد طباعة '${p.productName}' كفاشلة.` })
  },
  print_canceled: {
    en: (p) => ({ title: 'Print Canceled', message: `Your print '${p.productName}' was marked Canceled.` }),
    ar: (p) => ({ title: 'أُلغيت الطباعة', message: `تم تحديد طباعة '${p.productName}' كملغاة.` })
  },
  filament_empty: {
    en: (p) => ({ title: 'Filament empty', message: `${p.name} is empty.` }),
    ar: (p) => ({ title: 'الفيلمنت فارغ', message: `${p.name} أصبح فارغًا.` })
  },
  filament_low: {
    en: (p) => ({ title: 'Low filament', message: `${p.name} has ${p.remaining}g remaining.` }),
    ar: (p) => ({ title: 'الفيلمنت منخفض', message: `${p.name} تبقى منه ${p.remaining} جم.` })
  },
  maintenance: {
    en: (p) => ({ title: 'Maintenance added', message: `${p.title} was added to maintenance records.` }),
    ar: (p) => ({ title: 'إضافة صيانة', message: `تمت إضافة '${p.title}' إلى سجل الصيانة.` })
  },
  admin_changed: {
    en: (p) => ({ title: 'Admin changed', message: `${p.name} is now the Admin.` }),
    ar: (p) => ({ title: 'تغيير المدير', message: `${p.name} أصبح المدير الآن.` })
  },
  became_admin: {
    en: () => ({ title: 'You are Admin', message: 'Admin access has been transferred to you.' }),
    ar: () => ({ title: 'أنت المدير الآن', message: 'تم نقل صلاحية المدير إليك.' })
  }
};

async function addNotification(client, { userId = null, type, params = {}, entityId = null, createdBy = null }) {
  let lang = 'ar';
  if (userId) {
    const { rows } = await client.query('SELECT language FROM users WHERE id=$1', [userId]);
    lang = rows[0]?.language === 'en' ? 'en' : 'ar';
  }
  const build = notificationText[type]?.[lang] || notificationText[type]?.ar;
  const { title, message } = build ? build(params) : { title: type, message: '' };
  await client.query(`INSERT INTO notifications
    (user_id, title, message, type, related_entity_id, created_by)
    VALUES ($1,$2,$3,$4,$5,$6)`, [userId, title, message, type, entityId, createdBy]);
}

async function notifyAll(client, payload) {
  const { rows } = await client.query('SELECT id FROM users ORDER BY id');
  for (const row of rows) await addNotification(client, { ...payload, userId: row.id });
}

const queueSelect = `
  SELECT q.*, u.display_name AS owner_name, f.name AS filament_name,
         f.color AS filament_color, f.material, f.remaining_grams,
         f.owners AS filament_owners
  FROM queue_items q
  JOIN users u ON u.id = q.owner_id
  LEFT JOIN filaments f ON f.id = q.filament_id`;

const favoriteSelect = `
  SELECT fav.*, u.display_name AS owner_name, f.name AS filament_name,
         f.color AS filament_color
  FROM favorites fav JOIN users u ON u.id = fav.owner_id
  LEFT JOIN filaments f ON f.id = fav.preferred_filament_id`;

const historySelect = `
  SELECT h.*, u.display_name AS owner_name,
         sb.display_name AS started_by_name, fb.display_name AS finished_by_name
  FROM print_history h JOIN users u ON u.id = h.owner_id
  LEFT JOIN users sb ON sb.id = h.started_by
  LEFT JOIN users fb ON fb.id = h.finished_by`;

app.post('/api/login', asyncRoute(async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  const { rows } = await db.query('SELECT * FROM users WHERE LOWER(username)=LOWER($1)', [username]);
  const user = rows[0];
  const success = Boolean(user && await bcrypt.compare(password, user.password_hash));
  await db.query(`INSERT INTO login_history (user_id, username_attempted, success, ip_address)
                  VALUES ($1,$2,$3,$4)`, [user?.id || null, username, success, req.ip]);
  if (!success) return res.status(401).json({ error: 'Incorrect username or password' });
  req.session.userId = user.id;
  if (req.body.rememberMe) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
  await db.query('UPDATE users SET last_login_at=NOW() WHERE id=$1', [user.id]);
  res.json({ user: await currentUser(user.id) });
}));

app.post('/api/logout', auth, (req, res, next) => {
  req.session.destroy((error) => error ? next(error) : res.json({ ok: true }));
});

app.get('/api/me', auth, asyncRoute(async (req, res) => {
  const user = await currentUser(req.session.userId);
  if (!user) return res.status(401).json({ error: 'Session user no longer exists' });
  res.json({ user });
}));

app.get('/api/users', auth, asyncRoute(async (_req, res) => {
  const { rows } = await db.query(`SELECT u.id,u.username,u.display_name,u.language,u.last_login_at,
    (u.id=ap.user_id) AS is_admin FROM users u CROSS JOIN admin_permissions ap ORDER BY u.id`);
  res.json(rows);
}));

app.put('/api/me/language', auth, asyncRoute(async (req, res) => {
  const language = req.body.language;
  if (!['ar', 'en'].includes(language)) return res.status(400).json({ error: 'Unsupported language' });
  await db.query('UPDATE users SET language=$1 WHERE id=$2', [language, req.session.userId]);
  res.json({ ok: true });
}));

app.put('/api/me/password', auth, asyncRoute(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'All password fields are required' });
  if (newPassword !== confirmPassword) return res.status(400).json({ error: 'New passwords do not match' });
  if (newPassword.length < 4) return res.status(400).json({ error: 'New password must be at least 4 characters' });
  const { rows } = await db.query('SELECT password_hash FROM users WHERE id=$1', [req.session.userId]);
  if (!await bcrypt.compare(currentPassword, rows[0].password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  const hash = await bcrypt.hash(newPassword, 12);
  await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.session.userId]);
  res.json({ ok: true });
}));

app.get('/api/dashboard', auth, asyncRoute(async (req, res) => {
  const [current, queue, filaments, history, favorites, maintenance] = await Promise.all([
    db.query(`SELECT cp.*, u.display_name AS owner_name, sb.display_name AS started_by_name
      FROM current_print cp JOIN users u ON u.id=cp.owner_id JOIN users sb ON sb.id=cp.started_by`),
    db.query(`SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status='Pending')::int AS pending FROM queue_items`),
    db.query(`SELECT COUNT(*)::int AS count, COALESCE(SUM(remaining_grams),0)::float AS grams FROM filaments`),
    db.query(`SELECT COUNT(*) FILTER (WHERE finished_at >= date_trunc('month',NOW()))::int AS month,
      COUNT(*) FILTER (WHERE result='Failed')::int AS failed,
      COUNT(*) FILTER (WHERE result='Canceled')::int AS canceled FROM print_history`),
    db.query('SELECT COUNT(*)::int AS count FROM favorites WHERE owner_id=$1', [req.session.userId]),
    db.query('SELECT COALESCE(SUM(total_cost),0)::float AS total FROM maintenance_records')
  ]);
  const recent = await db.query(`${historySelect} ORDER BY h.finished_at DESC LIMIT 5`);
  const profile = await db.query(`SELECT
      (SELECT COUNT(*) FROM queue_items WHERE owner_id=$1)::int AS total_requests,
      (SELECT COUNT(*) FROM queue_items WHERE owner_id=$1 AND status IN ('Pending','Printing'))::int AS active_queue,
      (SELECT COUNT(*) FROM favorites WHERE owner_id=$1)::int AS favorites,
      COUNT(h.*)::int AS total_prints,
      COUNT(h.*) FILTER (WHERE h.result='Completed')::int AS successful,
      COUNT(h.*) FILTER (WHERE h.result='Failed')::int AS failed,
      COUNT(h.*) FILTER (WHERE h.result='Canceled')::int AS canceled,
      COALESCE(SUM(h.grams),0)::float AS grams
    FROM print_history h WHERE h.owner_id=$1`, [req.session.userId]);
  res.json({
    current: current.rows[0] || null,
    cards: { queue: queue.rows[0], filaments: filaments.rows[0], history: history.rows[0], favorites: favorites.rows[0].count, maintenance: maintenance.rows[0].total },
    recent: recent.rows,
    profile: profile.rows[0]
  });
}));

app.get('/api/queue', auth, asyncRoute(async (_req, res) => {
  const { rows } = await db.query(`${queueSelect} ORDER BY CASE q.status WHEN 'Printing' THEN 0 WHEN 'Pending' THEN 1 ELSE 2 END, q.position, q.added_at`);
  res.json(rows);
}));

app.post('/api/queue', auth, asyncRoute(async (req, res) => {
  const requester = await currentUser(req.session.userId);
  let ownerId = req.session.userId;
  if (requester.is_admin && req.body.ownerId) {
    const targetId = Number(req.body.ownerId);
    const target = await db.query('SELECT id FROM users WHERE id=$1', [targetId]);
    if (!target.rows[0]) return res.status(400).json({ error: 'Invalid owner' });
    ownerId = targetId;
  }
  const grams = validNumber(req.body.estimatedGrams, 0.01);
  const duration = validNumber(req.body.estimatedDurationMinutes, 1);
  if (!req.body.productName?.trim() || !grams || !duration || !req.body.filamentId) return res.status(400).json({ error: 'Complete all required fields' });
  const filament = await db.query('SELECT * FROM filaments WHERE id=$1', [req.body.filamentId]);
  const spool = filament.rows[0];
  if (!spool) return res.status(404).json({ error: 'Filament not found' });
  if (!spool.owners.map(Number).includes(ownerId)) return res.status(403).json({ error: 'This filament is not shared with the selected owner' });
  if (Number(spool.remaining_grams) < grams) return res.status(400).json({ error: 'Estimated grams exceed remaining filament' });
  const result = await db.query(`INSERT INTO queue_items
    (owner_id,product_name,filament_id,model_link,image_url,estimated_grams,estimated_duration_minutes,priority,notes,position)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,(SELECT COALESCE(MAX(position),0)+1 FROM queue_items)) RETURNING *`,
    [ownerId, req.body.productName.trim(), req.body.filamentId, req.body.modelLink || null, req.body.imageUrl || null,
     grams, Math.round(duration), ['Low','Normal','High'].includes(req.body.priority) ? req.body.priority : 'Normal', req.body.notes || null]);
  await db.query('INSERT INTO queue_logs(queue_id,action,actor_id) VALUES($1,$2,$3)', [result.rows[0].id, 'Added', req.session.userId]);
  const admin = await db.query('SELECT user_id FROM admin_permissions WHERE singleton=TRUE');
  await addNotification(db, { userId:admin.rows[0].user_id, type:'queue_added',
    params:{ productName:req.body.productName.trim() }, entityId:result.rows[0].id, createdBy:req.session.userId });
  res.status(201).json(result.rows[0]);
}));

app.put('/api/queue/:id', auth, asyncRoute(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM queue_items WHERE id=$1', [req.params.id]);
  const item = rows[0];
  if (!item) return res.status(404).json({ error: 'Queue item not found' });
  const user = await currentUser(req.session.userId);
  if (!user.is_admin && (item.owner_id !== user.id || item.status !== 'Pending')) return res.status(403).json({ error: 'You cannot edit this request' });
  const grams = validNumber(req.body.estimatedGrams ?? item.estimated_grams, 0.01);
  const duration = validNumber(req.body.estimatedDurationMinutes ?? item.estimated_duration_minutes, 1);
  const filamentId = Number(req.body.filamentId ?? item.filament_id);
  const filament = await db.query('SELECT * FROM filaments WHERE id=$1', [filamentId]);
  if (!filament.rows[0] || Number(filament.rows[0].remaining_grams) < grams) return res.status(400).json({ error: 'Invalid filament or insufficient grams' });
  await db.query(`UPDATE queue_items SET product_name=$1,filament_id=$2,model_link=$3,image_url=$4,
    estimated_grams=$5,estimated_duration_minutes=$6,priority=$7,notes=$8,updated_at=NOW() WHERE id=$9`,
    [req.body.productName?.trim() || item.product_name, filamentId, req.body.modelLink ?? item.model_link,
     req.body.imageUrl ?? item.image_url, grams, Math.round(duration), req.body.priority || item.priority,
     req.body.notes ?? item.notes, item.id]);
  res.json({ ok: true });
}));

app.delete('/api/queue/:id', auth, asyncRoute(async (req, res) => {
  const item = (await db.query('SELECT * FROM queue_items WHERE id=$1', [req.params.id])).rows[0];
  if (!item) return res.status(404).json({ error: 'Queue item not found' });
  const user = await currentUser(req.session.userId);
  if (!user.is_admin && (item.owner_id !== user.id || item.status !== 'Pending')) return res.status(403).json({ error: 'You cannot delete this request' });
  if (item.status === 'Printing') return res.status(400).json({ error: 'Finish or cancel the active print first' });
  await db.query('DELETE FROM queue_items WHERE id=$1', [item.id]);
  res.json({ ok: true });
}));

app.post('/api/queue/:id/reorder', auth, adminOnly, asyncRoute(async (req, res) => {
  const direction = req.body.direction === 'up' ? -1 : 1;
  const item = (await db.query('SELECT * FROM queue_items WHERE id=$1 AND status=$2', [req.params.id, 'Pending'])).rows[0];
  if (!item) return res.status(404).json({ error: 'Pending queue item not found' });
  const neighbor = (await db.query(`SELECT * FROM queue_items WHERE status='Pending' AND
    position ${direction < 0 ? '<' : '>'} $1 ORDER BY position ${direction < 0 ? 'DESC' : 'ASC'} LIMIT 1`, [item.position])).rows[0];
  if (neighbor) {
    const client = await db.getClient();
    try { await client.query('BEGIN');
      await client.query('UPDATE queue_items SET position=$1 WHERE id=$2', [neighbor.position, item.id]);
      await client.query('UPDATE queue_items SET position=$1 WHERE id=$2', [item.position, neighbor.id]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }
  res.json({ ok: true });
}));

app.post('/api/queue/:id/start', auth, adminOnly, asyncRoute(async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const active = await client.query('SELECT 1 FROM current_print FOR UPDATE');
    if (active.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Another print is already active' }); }
    const queue = await client.query(`${queueSelect} WHERE q.id=$1 FOR UPDATE OF q`, [req.params.id]);
    const item = queue.rows[0];
    if (!item || item.status !== 'Pending') { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Only pending items can be started' }); }
    const grams = validNumber(req.body.estimatedGrams ?? item.estimated_grams, 0.01);
    const duration = validNumber(req.body.estimatedDurationMinutes ?? item.estimated_duration_minutes, 1);
    const filamentId = Number(req.body.filamentId ?? item.filament_id);
    const filament = (await client.query('SELECT * FROM filaments WHERE id=$1 FOR UPDATE', [filamentId])).rows[0];
    if (!filament || Number(filament.remaining_grams) < grams) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Insufficient filament for this print' }); }
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + duration * 60000);
    const productName = req.body.productName?.trim() || item.product_name;
    await client.query(`INSERT INTO current_print(singleton,queue_id,owner_id,product_name,filament_id,filament_name,
      filament_color,estimated_grams,duration_minutes,model_link,image_url,notes,started_at,ends_at,started_by)
      VALUES(TRUE,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [item.id,item.owner_id,productName,filament.id,filament.name,filament.color,grams,Math.round(duration),
       req.body.modelLink ?? item.model_link,req.body.imageUrl ?? item.image_url,req.body.notes ?? item.notes,startedAt,endsAt,req.user.id]);
    await client.query(`UPDATE queue_items SET status='Printing',product_name=$1,filament_id=$2,estimated_grams=$3,
      estimated_duration_minutes=$4,model_link=$5,image_url=$6,notes=$7,updated_at=NOW() WHERE id=$8`,
      [productName,filament.id,grams,Math.round(duration),req.body.modelLink ?? item.model_link,
       req.body.imageUrl ?? item.image_url,req.body.notes ?? item.notes,item.id]);
    await client.query('INSERT INTO queue_logs(queue_id,action,actor_id,details) VALUES($1,$2,$3,$4)',
      [item.id,'Started',req.user.id,JSON.stringify({ startedAt, endsAt, duration })]);
    await addNotification(client, { userId:item.owner_id, type:'print_started',
      params:{ productName, actor:req.user.display_name, filament:filament.name, duration:Math.round(duration) },
      entityId:item.id, createdBy:req.user.id });
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}));

app.post('/api/current/pause', auth, adminOnly, asyncRoute(async (_req, res) => {
  const result = await db.query(`UPDATE current_print SET status='Paused',paused_at=NOW(),updated_at=NOW()
    WHERE singleton=TRUE AND status='Printing' RETURNING *`);
  if (!result.rowCount) return res.status(400).json({ error: 'No running print to pause' });
  res.json({ ok: true });
}));

app.post('/api/current/resume', auth, adminOnly, asyncRoute(async (_req, res) => {
  const result = await db.query(`UPDATE current_print SET status='Printing',
    ends_at=ends_at+(NOW()-paused_at),paused_at=NULL,updated_at=NOW()
    WHERE singleton=TRUE AND status='Paused' RETURNING *`);
  if (!result.rowCount) return res.status(400).json({ error: 'No paused print to resume' });
  res.json({ ok: true });
}));

app.post('/api/current/finish', auth, adminOnly, asyncRoute(async (req, res) => {
  const resultType = req.body.result;
  if (!['Completed','Failed','Canceled'].includes(resultType)) return res.status(400).json({ error: 'Invalid final result' });
  const grams = validNumber(req.body.grams ?? 0, 0);
  if (grams === null) return res.status(400).json({ error: 'Invalid grams value' });
  if (resultType !== 'Completed' && !String(req.body.note || '').trim()) return res.status(400).json({ error: 'A reason note is required' });
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const active = (await client.query('SELECT * FROM current_print WHERE singleton=TRUE FOR UPDATE')).rows[0];
    if (!active) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'No active print' }); }
    const spool = active.filament_id ? (await client.query('SELECT * FROM filaments WHERE id=$1 FOR UPDATE', [active.filament_id])).rows[0] : null;
    if (spool && Number(spool.remaining_grams) < grams) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Consumed grams exceed remaining filament' }); }
    const elapsedReal = Math.max(0, Math.round((Date.now() - new Date(active.started_at).getTime()) / 60000));
    const elapsed = Math.min(elapsedReal, active.duration_minutes);
    const history = await client.query(`INSERT INTO print_history(queue_id,product_name,owner_id,filament_id,filament_name,
      filament_color,grams,result,duration_minutes,started_at,model_link,image_url,note,started_by,finished_by)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [active.queue_id,active.product_name,active.owner_id,active.filament_id,active.filament_name,active.filament_color,
       grams,resultType,elapsed,active.started_at,active.model_link,active.image_url,req.body.note || null,active.started_by,req.user.id]);
    if (spool && grams > 0) {
      await client.query('UPDATE filaments SET remaining_grams=remaining_grams-$1,usage_count=usage_count+1 WHERE id=$2', [grams,spool.id]);
      await client.query(`INSERT INTO filament_logs(filament_id,history_id,product_name,owner_id,grams,result,note)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [spool.id,history.rows[0].id,active.product_name,active.owner_id,grams,resultType,req.body.note || null]);
    }
    const queueStatus = resultType === 'Completed' ? 'Done' : resultType;
    await client.query('UPDATE queue_items SET status=$1,updated_at=NOW() WHERE id=$2', [queueStatus,active.queue_id]);
    await client.query('INSERT INTO queue_logs(queue_id,action,actor_id,details) VALUES($1,$2,$3,$4)',
      [active.queue_id,resultType,req.user.id,JSON.stringify({ grams, note:req.body.note || null })]);
    await addNotification(client, { userId:active.owner_id, type:`print_${resultType.toLowerCase()}`,
      params:{ productName:active.product_name },
      entityId:history.rows[0].id, createdBy:req.user.id });
    if (spool) {
      const remaining = Number(spool.remaining_grams) - grams;
      if (remaining <= 0) await notifyAll(client, { type:'filament_empty', params:{ name:spool.name }, entityId:spool.id, createdBy:req.user.id });
      else if (remaining < 100) await notifyAll(client, { type:'filament_low', params:{ name:spool.name, remaining:remaining.toFixed(1) }, entityId:spool.id, createdBy:req.user.id });
    }
    await client.query('DELETE FROM current_print WHERE singleton=TRUE');
    await client.query('COMMIT');
    res.json({ ok: true, historyId: history.rows[0].id });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}));

app.get('/api/favorites', auth, asyncRoute(async (_req, res) => {
  const { rows } = await db.query(`${favoriteSelect} ORDER BY fav.added_at DESC`);
  res.json(rows);
}));

app.post('/api/favorites', auth, asyncRoute(async (req, res) => {
  if (!req.body.productName?.trim()) return res.status(400).json({ error: 'Product name is required' });
  const tags = String(req.body.tags || '').split(',').map(v => v.trim()).filter(Boolean);
  const grams = req.body.estimatedGrams ? validNumber(req.body.estimatedGrams, 0.01) : null;
  const { rows } = await db.query(`INSERT INTO favorites(owner_id,product_name,model_link,image_url,notes,estimated_grams,preferred_filament_id,tags)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [req.session.userId,req.body.productName.trim(),req.body.modelLink || null,
    req.body.imageUrl || null,req.body.notes || null,grams,req.body.filamentId || null,tags]);
  res.status(201).json(rows[0]);
}));

app.delete('/api/favorites/:id', auth, asyncRoute(async (req, res) => {
  const favorite = (await db.query('SELECT * FROM favorites WHERE id=$1', [req.params.id])).rows[0];
  const user = await currentUser(req.session.userId);
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
  if (!user.is_admin && favorite.owner_id !== user.id) return res.status(403).json({ error: 'Cannot delete this favorite' });
  await db.query('DELETE FROM favorites WHERE id=$1', [favorite.id]);
  res.json({ ok: true });
}));

app.post('/api/favorites/:id/to-queue', auth, asyncRoute(async (req, res) => {
  const favorite = (await db.query('SELECT * FROM favorites WHERE id=$1 AND owner_id=$2', [req.params.id,req.session.userId])).rows[0];
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
  const filamentId = req.body.filamentId || favorite.preferred_filament_id;
  const grams = validNumber(req.body.estimatedGrams || favorite.estimated_grams, 0.01);
  const duration = validNumber(req.body.estimatedDurationMinutes, 1);
  const spool = (await db.query('SELECT * FROM filaments WHERE id=$1', [filamentId])).rows[0];
  if (!spool || !grams || !duration || !spool.owners.map(Number).includes(req.session.userId) || Number(spool.remaining_grams) < grams) {
    return res.status(400).json({ error: 'Choose an available filament, grams, and duration' });
  }
  await db.query(`INSERT INTO queue_items(owner_id,product_name,filament_id,model_link,image_url,estimated_grams,estimated_duration_minutes,notes,position)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,(SELECT COALESCE(MAX(position),0)+1 FROM queue_items))`,
    [req.session.userId,favorite.product_name,filamentId,favorite.model_link,favorite.image_url,grams,Math.round(duration),favorite.notes]);
  res.status(201).json({ ok: true });
}));

app.get('/api/filaments', auth, asyncRoute(async (req, res) => {
  const { rows } = await db.query(`SELECT f.*, COALESCE(jsonb_agg(jsonb_build_object('id',u.id,'name',u.display_name))
    FILTER (WHERE u.id IS NOT NULL),'[]') AS owner_details
    FROM filaments f LEFT JOIN users u ON f.owners @> to_jsonb(u.id)
    GROUP BY f.id ORDER BY f.created_at DESC`);
  res.json(rows);
}));

app.post('/api/filaments', auth, adminOnly, asyncRoute(async (req, res) => {
  const total = validNumber(req.body.totalGrams, 0.01);
  const remaining = validNumber(req.body.remainingGrams, 0);
  const owners = listOwners(req.body.owners);
  if (!req.body.name?.trim() || !req.body.color?.trim() || !total || remaining === null || remaining > total || !owners.length) return res.status(400).json({ error: 'Invalid filament fields' });
  const material = ['PLA','PLA+'].includes(req.body.material) ? req.body.material : 'PLA';
  const { rows } = await db.query(`INSERT INTO filaments(name,material,color,color_hex,total_grams,remaining_grams,owners,price_sar,purchase_date,notes)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [req.body.name.trim(),material,req.body.color.trim(),req.body.colorHex || '#64748b',
    total,remaining,JSON.stringify(owners),req.body.priceSar || null,req.body.purchaseDate || null,req.body.notes || null]);
  res.status(201).json(rows[0]);
}));

app.put('/api/filaments/:id', auth, adminOnly, asyncRoute(async (req, res) => {
  const total = validNumber(req.body.totalGrams, 0.01), remaining = validNumber(req.body.remainingGrams, 0);
  const owners = listOwners(req.body.owners);
  if (!req.body.name?.trim() || !total || remaining === null || remaining > total || !owners.length) return res.status(400).json({ error: 'Invalid filament fields' });
  const material = ['PLA','PLA+'].includes(req.body.material) ? req.body.material : 'PLA';
  await db.query(`UPDATE filaments SET name=$1,material=$2,color=$3,color_hex=$4,total_grams=$5,remaining_grams=$6,
    owners=$7,price_sar=$8,purchase_date=$9,notes=$10 WHERE id=$11`, [req.body.name.trim(),material,req.body.color,
    req.body.colorHex || '#64748b',total,remaining,JSON.stringify(owners),req.body.priceSar || null,req.body.purchaseDate || null,req.body.notes || null,req.params.id]);
  res.json({ ok: true });
}));

app.delete('/api/filaments/:id', auth, adminOnly, asyncRoute(async (req, res) => {
  const inUse = await db.query('SELECT 1 FROM current_print WHERE filament_id=$1', [req.params.id]);
  if (inUse.rowCount) return res.status(400).json({ error: 'Cannot delete filament used by current print' });
  await db.query('DELETE FROM filaments WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
}));

app.get('/api/filaments/:id/logs', auth, asyncRoute(async (req, res) => {
  const { rows } = await db.query(`SELECT fl.*,u.display_name AS owner_name FROM filament_logs fl
    LEFT JOIN users u ON u.id=fl.owner_id WHERE fl.filament_id=$1 ORDER BY fl.created_at DESC`, [req.params.id]);
  res.json(rows);
}));

app.get('/api/history', auth, asyncRoute(async (_req, res) => {
  const { rows } = await db.query(`${historySelect} ORDER BY h.finished_at DESC`);
  res.json(rows);
}));

async function verifyPassword(userId, password) {
  const { rows } = await db.query('SELECT password_hash FROM users WHERE id=$1', [userId]);
  return Boolean(rows[0] && await bcrypt.compare(String(password || ''), rows[0].password_hash));
}

app.put('/api/history/:id', auth, asyncRoute(async (req, res) => {
  const record = (await db.query('SELECT * FROM print_history WHERE id=$1', [req.params.id])).rows[0];
  if (!record) return res.status(404).json({ error: 'History record not found' });
  const user = await currentUser(req.session.userId);
  if (!user.is_admin && record.owner_id !== user.id) return res.status(403).json({ error: 'You cannot edit this record' });
  if (!await verifyPassword(user.id, req.body.password)) return res.status(401).json({ error: 'Incorrect password' });
  const grams = validNumber(req.body.grams ?? record.grams, 0);
  const duration = validNumber(req.body.durationMinutes ?? record.duration_minutes, 0);
  const result = ['Completed', 'Failed', 'Canceled'].includes(req.body.result) ? req.body.result : record.result;
  if (grams === null || duration === null) return res.status(400).json({ error: 'Invalid grams or duration' });
  const note = req.body.note ?? record.note;
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    if (record.filament_id) {
      const delta = Number(record.grams) - grams;
      if (delta !== 0) {
        const spool = (await client.query('SELECT * FROM filaments WHERE id=$1 FOR UPDATE', [record.filament_id])).rows[0];
        if (spool) {
          const newRemaining = Number(spool.remaining_grams) + delta;
          if (newRemaining < 0 || newRemaining > Number(spool.total_grams)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Grams change exceeds filament stock' });
          }
          await client.query('UPDATE filaments SET remaining_grams=$1 WHERE id=$2', [newRemaining, spool.id]);
        }
      }
    }
    await client.query(`UPDATE print_history SET product_name=$1,grams=$2,result=$3,duration_minutes=$4,note=$5 WHERE id=$6`,
      [req.body.productName?.trim() || record.product_name, grams, result, Math.round(duration), note, record.id]);
    await client.query('UPDATE filament_logs SET grams=$1,result=$2,note=$3 WHERE history_id=$4', [grams, result, note, record.id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}));

app.delete('/api/history/:id', auth, asyncRoute(async (req, res) => {
  const record = (await db.query('SELECT * FROM print_history WHERE id=$1', [req.params.id])).rows[0];
  if (!record) return res.status(404).json({ error: 'History record not found' });
  const user = await currentUser(req.session.userId);
  if (!user.is_admin && record.owner_id !== user.id) return res.status(403).json({ error: 'You cannot delete this record' });
  if (!await verifyPassword(user.id, req.body.password)) return res.status(401).json({ error: 'Incorrect password' });
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    if (record.filament_id && Number(record.grams) > 0) {
      const spool = (await client.query('SELECT * FROM filaments WHERE id=$1 FOR UPDATE', [record.filament_id])).rows[0];
      if (spool) {
        const restored = Math.min(Number(spool.total_grams), Number(spool.remaining_grams) + Number(record.grams));
        await client.query('UPDATE filaments SET remaining_grams=$1 WHERE id=$2', [restored, spool.id]);
      }
    }
    await client.query('DELETE FROM print_history WHERE id=$1', [record.id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}));

app.get('/api/notifications', auth, asyncRoute(async (req, res) => {
  const user = await currentUser(req.session.userId);
  const query = user.is_admin
    ? `SELECT n.*,u.display_name AS recipient_name FROM notifications n LEFT JOIN users u ON u.id=n.user_id ORDER BY n.created_at DESC LIMIT 200`
    : `SELECT n.*,u.display_name AS recipient_name FROM notifications n LEFT JOIN users u ON u.id=n.user_id WHERE n.user_id=$1 ORDER BY n.created_at DESC LIMIT 200`;
  const { rows } = await db.query(query, user.is_admin ? [] : [user.id]);
  res.json(rows);
}));

app.put('/api/notifications/:id/read', auth, asyncRoute(async (req, res) => {
  const user = await currentUser(req.session.userId);
  await db.query(`UPDATE notifications SET is_read=TRUE WHERE id=$1 ${user.is_admin ? '' : 'AND user_id=$2'}`,
    user.is_admin ? [req.params.id] : [req.params.id,user.id]);
  res.json({ ok: true });
}));

app.put('/api/notifications/read-all', auth, asyncRoute(async (req, res) => {
  await db.query('UPDATE notifications SET is_read=TRUE WHERE user_id=$1', [req.session.userId]);
  res.json({ ok: true });
}));

app.get('/api/maintenance', auth, asyncRoute(async (_req, res) => {
  const { rows } = await db.query(`SELECT m.*,cb.display_name AS created_by_name,
    COALESCE(jsonb_agg(jsonb_build_object('user_id',mp.user_id,'user_name',u.display_name,'amount',mp.amount))
      FILTER (WHERE mp.id IS NOT NULL),'[]') AS payments
    FROM maintenance_records m JOIN users cb ON cb.id=m.created_by
    LEFT JOIN maintenance_payments mp ON mp.maintenance_id=m.id LEFT JOIN users u ON u.id=mp.user_id
    GROUP BY m.id,cb.display_name ORDER BY m.maintenance_date DESC,m.id DESC`);
  res.json(rows);
}));

async function saveMaintenance(req, res, id = null) {
  const cost = validNumber(req.body.totalCost, 0);
  const payments = Array.isArray(req.body.payments) ? req.body.payments.map(p => ({ userId:Number(p.userId), amount:validNumber(p.amount,0) })) : [];
  if (!req.body.title?.trim() || !req.body.type || !req.body.date || cost === null || payments.some(p => !p.userId || p.amount === null)) return res.status(400).json({ error: 'Invalid maintenance fields' });
  const paid = payments.reduce((sum,p) => sum + p.amount, 0);
  if (Math.abs(paid - cost) > 0.009) return res.status(400).json({ error: 'Payments must equal total cost' });
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    let recordId = id;
    if (id) {
      const result = await client.query(`UPDATE maintenance_records SET title=$1,type=$2,description=$3,maintenance_date=$4,
        printer_name=$5,total_cost=$6,store_name=$7,invoice_link=$8,receipt_image_url=$9,notes=$10,updated_at=NOW()
        WHERE id=$11 RETURNING id`, [req.body.title.trim(),req.body.type,req.body.description || null,req.body.date,
        req.body.printerName || 'Ender 3 V3 SE',cost,req.body.storeName || null,req.body.invoiceLink || null,
        req.body.receiptImageUrl || null,req.body.notes || null,id]);
      if (!result.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Maintenance record not found' }); }
      await client.query('DELETE FROM maintenance_payments WHERE maintenance_id=$1', [id]);
    } else {
      const result = await client.query(`INSERT INTO maintenance_records(title,type,description,maintenance_date,printer_name,total_cost,
        store_name,invoice_link,receipt_image_url,notes,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [req.body.title.trim(),req.body.type,req.body.description || null,req.body.date,req.body.printerName || 'Ender 3 V3 SE',
        cost,req.body.storeName || null,req.body.invoiceLink || null,req.body.receiptImageUrl || null,req.body.notes || null,req.user.id]);
      recordId = result.rows[0].id;
    }
    for (const p of payments) await client.query('INSERT INTO maintenance_payments(maintenance_id,user_id,amount) VALUES($1,$2,$3)', [recordId,p.userId,p.amount]);
    if (!id) await notifyAll(client, { type:'maintenance', params:{ title:req.body.title }, entityId:recordId, createdBy:req.user.id });
    await client.query('COMMIT');
    res.status(id ? 200 : 201).json({ ok: true, id:recordId });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

app.post('/api/maintenance', auth, adminOnly, asyncRoute((req,res) => saveMaintenance(req,res)));
app.put('/api/maintenance/:id', auth, adminOnly, asyncRoute((req,res) => saveMaintenance(req,res,Number(req.params.id))));
app.delete('/api/maintenance/:id', auth, adminOnly, asyncRoute(async (req,res) => {
  await db.query('DELETE FROM maintenance_records WHERE id=$1', [req.params.id]); res.json({ ok:true });
}));

app.get('/api/statistics', auth, asyncRoute(async (_req, res) => {
  const users = await db.query(`SELECT u.id,u.display_name,
    COUNT(h.*)::int AS total_prints,COUNT(h.*) FILTER(WHERE h.result='Completed')::int AS successful,
    COUNT(h.*) FILTER(WHERE h.result='Failed')::int AS failed,COUNT(h.*) FILTER(WHERE h.result='Canceled')::int AS canceled,
    COALESCE(SUM(h.grams),0)::float AS grams,
    ROUND(COALESCE(100.0*COUNT(h.*) FILTER(WHERE h.result='Completed')/NULLIF(COUNT(h.*),0),0),1)::float AS success_rate,
    (SELECT COUNT(*) FROM favorites WHERE owner_id=u.id)::int AS favorite_count,
    (SELECT COUNT(*) FROM queue_items WHERE owner_id=u.id AND status IN ('Pending','Printing'))::int AS queue_count
    FROM users u LEFT JOIN print_history h ON h.owner_id=u.id GROUP BY u.id ORDER BY u.id`);
  const global = await db.query(`SELECT COUNT(*)::int AS total,
    COUNT(*) FILTER(WHERE result='Completed')::int AS successful,COUNT(*) FILTER(WHERE result='Failed')::int AS failed,
    COUNT(*) FILTER(WHERE result='Canceled')::int AS canceled,COALESCE(SUM(grams),0)::float AS grams FROM print_history`);
  const maintenance = await db.query(`SELECT COALESCE(SUM(total_cost),0)::float AS total_cost,
    COUNT(*) FILTER(WHERE type='Repair')::int AS repairs,COUNT(*) FILTER(WHERE type='Upgrade')::int AS upgrades,
    COUNT(*) FILTER(WHERE type='Purchased Part')::int AS parts,
    (SELECT type FROM maintenance_records GROUP BY type ORDER BY COUNT(*) DESC LIMIT 1) AS common_type
    FROM maintenance_records`);
  const payments = await db.query(`SELECT u.display_name,COALESCE(SUM(mp.amount),0)::float AS paid FROM users u
    LEFT JOIN maintenance_payments mp ON mp.user_id=u.id GROUP BY u.id ORDER BY u.id`);
  const top = await db.query(`SELECT
    (SELECT filament_name FROM print_history WHERE filament_name IS NOT NULL GROUP BY filament_name ORDER BY COUNT(*) DESC LIMIT 1) AS filament,
    (SELECT filament_color FROM print_history WHERE filament_color IS NOT NULL GROUP BY filament_color ORDER BY COUNT(*) DESC LIMIT 1) AS color,
    (SELECT u.display_name FROM users u JOIN print_history h ON h.owner_id=u.id GROUP BY u.id ORDER BY COUNT(*) DESC LIMIT 1) AS active_user`);
  res.json({ users:users.rows, global:global.rows[0], maintenance:maintenance.rows[0], payments:payments.rows, top:top.rows[0] });
}));

app.post('/api/admin/transfer', auth, adminOnly, asyncRoute(async (req,res) => {
  const targetId = Number(req.body.userId);
  const target = (await db.query('SELECT * FROM users WHERE id=$1', [targetId])).rows[0];
  if (!target) return res.status(404).json({ error:'User not found' });
  const client = await db.getClient();
  try { await client.query('BEGIN');
    await client.query('UPDATE admin_permissions SET user_id=$1,updated_at=NOW() WHERE singleton=TRUE', [targetId]);
    await notifyAll(client, { type:'admin_changed', params:{ name:target.display_name }, createdBy:req.user.id });
    await addNotification(client, { userId:targetId, type:'became_admin', createdBy:req.user.id });
    await client.query('COMMIT');
  } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  res.json({ ok:true });
}));

app.get('/api/admin/export', auth, adminOnly, asyncRoute(async (_req,res) => {
  const tables = ['users','admin_permissions','app_settings','filaments','queue_items','queue_logs','current_print','favorites','print_history','filament_logs','notifications','maintenance_records','maintenance_payments'];
  const data = {};
  for (const table of tables) data[table] = (await db.query(`SELECT * FROM ${table}`)).rows;
  res.setHeader('Content-Disposition', `attachment; filename="print-hub-${new Date().toISOString().slice(0,10)}.json"`);
  res.json({ exportedAt:new Date().toISOString(), data });
}));

app.post('/api/admin/import', auth, adminOnly, asyncRoute(async (req,res) => {
  const payload = req.body?.data;
  if (!payload || typeof payload !== 'object') return res.status(400).json({ error:'Invalid export file' });
  const order = ['users','admin_permissions','app_settings','filaments','queue_items','queue_logs','current_print','favorites','print_history','filament_logs','notifications','maintenance_records','maintenance_payments'];
  if (!Array.isArray(payload.users) || !payload.users.length) return res.status(400).json({ error:'Import must contain users' });
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE maintenance_payments,maintenance_records,notifications,filament_logs,print_history,
      favorites,current_print,queue_logs,queue_items,filaments,app_settings,admin_permissions,users RESTART IDENTITY CASCADE`);
    for (const table of order) {
      const rows = Array.isArray(payload[table]) ? payload[table] : [];
      for (const row of rows) {
        const columns = Object.keys(row).filter(key => /^[a-z_]+$/.test(key));
        if (!columns.length) continue;
        const placeholders = columns.map((_,index) => `$${index + 1}`).join(',');
        const quoted = columns.map(column => `"${column}"`).join(',');
        await client.query(`INSERT INTO ${table} (${quoted}) VALUES (${placeholders})`, columns.map(column => row[column]));
      }
    }
    for (const table of ['users','filaments','queue_items','favorites','print_history','filament_logs','notifications','maintenance_records','maintenance_payments','queue_logs']) {
      const serialColumn = table === 'print_history' || table === 'filament_logs' || table === 'notifications' || table === 'maintenance_payments' || table === 'queue_logs' ? 'id' : 'id';
      await client.query(`SELECT setval(pg_get_serial_sequence('${table}','${serialColumn}'), COALESCE((SELECT MAX(id) FROM ${table}),1), TRUE)`);
    }
    await client.query('COMMIT');
    res.json({ ok:true });
  } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}));

app.post('/api/admin/reset', auth, adminOnly, asyncRoute(async (req,res) => {
  if (req.body.confirm !== 'RESET') return res.status(400).json({ error:'Type RESET to confirm' });
  const client = await db.getClient();
  try { await client.query('BEGIN');
    await client.query('TRUNCATE current_print,queue_logs,filament_logs,print_history,queue_items,favorites,notifications,maintenance_payments,maintenance_records RESTART IDENTITY CASCADE');
    await client.query('UPDATE admin_permissions SET user_id=(SELECT id FROM users WHERE username=$1),updated_at=NOW() WHERE singleton=TRUE', ['Abdullah']);
    await client.query('COMMIT');
  } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  res.json({ ok:true });
}));

app.use('/api', (_req,res) => res.status(404).json({ error:'API route not found' }));
app.get('/{*splat}', (_req,res) => res.sendFile(path.join(PUBLIC_DIR,'index.html')));

app.use((error, _req, res, _next) => {
  console.error(error);
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : error.message;
  res.status(error.status || 500).json({ error:message });
});

app.listen(PORT, () => console.log(`Print Hub running at http://localhost:${PORT}`));
