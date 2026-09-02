const { Pool } = require('pg');

const sslEnabled = ['true', 'require'].includes(String(process.env.DATABASE_SSL || '').toLowerCase());
const pool = new Pool({
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  ssl: sslEnabled ? { rejectUnauthorized: false } : false
});

pool.on('error', (error) => console.error('Unexpected PostgreSQL error:', error));

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
