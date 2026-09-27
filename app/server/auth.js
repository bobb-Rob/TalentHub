import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, id, logEvent } from './db.js';

const SECRET = process.env.TALENTHUB_SECRET || 'talenthub-dev-secret-cmp722';
const ROUNDS = 12;                       // NFR-09
const MAX_FAILED = 5;                    // FR-03

export const hash = (pw) => bcrypt.hashSync(pw, ROUNDS);

export function register({ email, password, role }) {
  email = String(email || '').trim().toLowerCase();
  if (!email.includes('@')) throw new HttpError(400, 'a valid email is required');
  if (!password || password.length < 8)
    throw new HttpError(400, 'password must be at least 8 characters');
  if (!['creator', 'brand'].includes(role))
    throw new HttpError(400, 'role must be creator or brand');
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email))
    throw new HttpError(409, 'that email is already registered');

  const user_id = id('usr');
  db.prepare(`INSERT INTO users (user_id, email, password_hash, role)
              VALUES (?, ?, ?, ?)`).run(user_id, email, hash(password), role);
  logEvent(user_id, user_id, 'user.registered', role);
  return db.prepare('SELECT user_id, email, role FROM users WHERE user_id = ?')
           .get(user_id);
}

export function login({ email, password }) {
  email = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) throw new HttpError(401, 'email or password is incorrect');
  if (user.status === 'suspended') throw new HttpError(403, 'this account is suspended');
  if (user.failed_login_count >= MAX_FAILED)
    throw new HttpError(423, 'account locked after five failed attempts');

  if (!bcrypt.compareSync(password || '', user.password_hash)) {
    db.prepare('UPDATE users SET failed_login_count = failed_login_count + 1 WHERE user_id = ?')
      .run(user.user_id);
    throw new HttpError(401, 'email or password is incorrect');
  }
  db.prepare('UPDATE users SET failed_login_count = 0 WHERE user_id = ?').run(user.user_id);
  return { token: issue(user), user: shape(user) };
}

const issue = (user) =>
  jwt.sign({ sub: user.user_id, role: user.role }, SECRET, { expiresIn: '12h' });

function shape(user) {
  const out = { user_id: user.user_id, email: user.email, role: user.role };
  if (user.role === 'creator') {
    out.profile = db.prepare('SELECT * FROM creator_profiles WHERE user_id = ?')
                    .get(user.user_id) || null;
  } else if (user.role === 'brand') {
    out.profile = db.prepare('SELECT * FROM brand_profiles WHERE user_id = ?')
                    .get(user.user_id) || null;
  }
  return out;
}

export function currentUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, SECRET);
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(sub);
    return user ? shape(user) : null;
  } catch {
    return null;
  }
}

/** Authorisation is enforced here, server-side, on every protected route (NFR-11). */
export function requireUser(...roles) {
  return (req, res, next) => {
    const user = currentUser(req);
    if (!user) return res.status(401).json({ error: 'sign in to continue' });
    if (roles.length && !roles.includes(user.role))
      return res.status(403).json({ error: `this action is for a ${roles.join(' or ')}` });
    req.user = user;
    next();
  };
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export { shape as shapeUser };
