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

export const id = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export function logEvent(actor, subject, action, detail) {
  db.prepare(
    'INSERT INTO events (actor, subject, action, detail) VALUES (?, ?, ?, ?)'
  ).run(actor ?? null, subject ?? null, action, detail ?? null);
}
