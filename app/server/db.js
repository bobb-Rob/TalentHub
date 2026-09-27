import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const dir = path.dirname(fileURLToPath(import.meta.url));
export const DB_PATH = process.env.TALENTHUB_DB || path.join(dir, 'talenthub.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'));

// CREATE TABLE IF NOT EXISTS leaves an older database without columns added
// since; bring it forward additively so no one has to reset their data.
function ensureColumn(table, column, ddl) {
  const has = db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column);
  if (!has) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}
ensureColumn('creator_profiles', 'languages', 'TEXT');
ensureColumn('brand_profiles', 'trading_name', 'TEXT');
ensureColumn('contracts', 'brand_accepted_at', 'TEXT');
ensureColumn('contracts', 'creator_accepted_at', 'TEXT');

export const id = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export function logEvent(actor, subject, action, detail) {
  db.prepare(
    'INSERT INTO events (actor, subject, action, detail) VALUES (?, ?, ?, ?)'
  ).run(actor ?? null, subject ?? null, action, detail ?? null);
}
