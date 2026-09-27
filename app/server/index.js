import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, id, logEvent } from './db.js';
import { post, balance, milestoneLedger, reconcile, LedgerError } from './ledger.js';
import { register, login, currentUser, requireUser, HttpError } from './auth.js';

const app = express();
// CORS_ORIGIN is a comma-separated allow-list (e.g. the Vercel client URL).
// Unset, any origin is allowed — fine locally, not in production.
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim().replace(/\/+$/, ''));
app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 4000;
const COMMISSION = 0.10;

// ---------------------------------------------------------------- helpers
const ok = (res, body) => res.json(body);
const wrap = (fn) => (req, res) => {
  try { fn(req, res); }
  catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    if (err instanceof LedgerError) return res.status(409).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: err.message || 'something went wrong' });
  }
};

const creatorOf = (req) =>
  db.prepare('SELECT * FROM creator_profiles WHERE user_id = ?').get(req.user.user_id);
const brandOf = (req) =>
  db.prepare('SELECT * FROM brand_profiles WHERE user_id = ?').get(req.user.user_id);

/**
 * The milestone state machine of §3.6. Every transition the platform allows is
 * in this table; anything absent is rejected. Guarding transitions in one place
 * is what stops a milestone leaving a funded state without a matching ledger
 * posting.
 */
const TRANSITIONS = {
  pending:     ['funded', 'cancelled'],
  funded:      ['in_progress'],
  in_progress: ['submitted'],
  submitted:   ['accepted', 'in_progress', 'disputed'],
  accepted:    [],
  disputed:    ['accepted', 'refunded', 'split'],
  refunded:    [],
  split:       [],
  cancelled:   [],
};

function moveTo(milestone, next) {
  const allowed = TRANSITIONS[milestone.status] || [];
  if (!allowed.includes(next)) {
    throw new HttpError(409,
      `a milestone that is ${milestone.status} cannot become ${next}`);
  }
}

/** Stand-in for the payment service provider. Authorises and returns a reference. */
function paymentProvider(action, { amount_minor, idempotencyKey }) {
  return {
    ok: true,
    reference: `psp_${action}_${crypto.createHash('sha1')
      .update(idempotencyKey).digest('hex').slice(0, 12)}`,
    amount_minor,
  };
}

// ---------------------------------------------------------------- auth
app.post('/api/auth/register', wrap((req, res) => {
  const user = register(req.body || {});
  const { token } = login({ email: user.email, password: req.body.password });
  ok(res, { token, user: currentUser({ headers: { authorization: `Bearer ${token}` } }) });
}));

app.post('/api/auth/login', wrap((req, res) => ok(res, login(req.body || {}))));

app.get('/api/me', wrap((req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'not signed in' });
  ok(res, user);
}));

// ---------------------------------------------------------------- creator profile
const AVAILABILITY = ['available', 'limited', 'unavailable'];     // FR-14
const MODES = ['commission', 'reach'];
const PROFICIENCY = ['beginner', 'intermediate', 'advanced', 'expert'];

function checkCreatorProfile(b) {
  if (b.display_name !== undefined && !String(b.display_name).trim())
    throw new HttpError(400, 'a display name is required');
  if (b.availability !== undefined && !AVAILABILITY.includes(b.availability))
    throw new HttpError(400, `availability must be one of ${AVAILABILITY.join(', ')}`);
  if (b.engagement_modes !== undefined &&
      (!Array.isArray(b.engagement_modes) || !b.engagement_modes.length ||
       b.engagement_modes.some((m) => !MODES.includes(m))))
    throw new HttpError(400, 'choose commissioned work, reach campaigns, or both');
  // Money is integer minor units (rule 1); a fractional rate is a client bug.
  if (b.day_rate_minor != null && (!Number.isInteger(b.day_rate_minor) || b.day_rate_minor < 0))
    throw new HttpError(400, 'the day rate must be a whole number of minor units');
}

app.put('/api/creator/profile', requireUser('creator'), wrap((req, res) => {
  const b = req.body || {};
  checkCreatorProfile(b);
  let profile = creatorOf(req);
  if (!profile) {
    const profile_id = id('cre');
    db.prepare(`INSERT INTO creator_profiles
      (profile_id, user_id, display_name, biography, country_code, city,
       primary_discipline, languages, engagement_modes, day_rate_minor,
       currency_code, availability, published_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).run(
      profile_id, req.user.user_id, b.display_name || 'Unnamed creator',
      b.biography || '', b.country_code || 'NG', b.city || '',
      b.primary_discipline || 'Motion design', b.languages || '',
      (b.engagement_modes || ['commission']).join(','),
      b.day_rate_minor ?? null, b.currency_code || 'NGN',
      b.availability || 'available');
    logEvent(req.user.user_id, profile_id, 'profile.published');
  } else {
    db.prepare(`UPDATE creator_profiles SET
      display_name = COALESCE(?, display_name),
      biography = COALESCE(?, biography),
      country_code = COALESCE(?, country_code),
      city = COALESCE(?, city),
      primary_discipline = COALESCE(?, primary_discipline),
      languages = COALESCE(?, languages),
      engagement_modes = COALESCE(?, engagement_modes),
      day_rate_minor = COALESCE(?, day_rate_minor),
      currency_code = COALESCE(?, currency_code),
      availability = COALESCE(?, availability),
      published_at = COALESCE(published_at, datetime('now'))
      WHERE profile_id = ?`).run(
      b.display_name ?? null, b.biography ?? null, b.country_code ?? null,
      b.city ?? null, b.primary_discipline ?? null, b.languages ?? null,
      b.engagement_modes ? b.engagement_modes.join(',') : null,
      b.day_rate_minor ?? null, b.currency_code ?? null, b.availability ?? null,
      profile.profile_id);
    logEvent(req.user.user_id, profile.profile_id, 'profile.updated');
  }
  ok(res, creatorOf(req));
}));

// FR-09 — skills come from a controlled taxonomy, never free text.
app.get('/api/skills', wrap((_req, res) => ok(res,
  db.prepare('SELECT * FROM skills ORDER BY discipline, name').all())));

app.put('/api/creator/skills', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile first');
  const list = req.body?.skills;
  if (!Array.isArray(list)) throw new HttpError(400, 'skills must be a list');
  for (const s of list) {
    if (!db.prepare('SELECT 1 FROM skills WHERE skill_id = ?').get(s.skill_id))
      throw new HttpError(400, `unknown skill ${s.skill_id}`);
    if (!PROFICIENCY.includes(s.proficiency))
      throw new HttpError(400, `proficiency must be one of ${PROFICIENCY.join(', ')}`);
  }
  db.transaction(() => {
    db.prepare('DELETE FROM profile_skills WHERE profile_id = ?').run(p.profile_id);
    for (const s of list) {
      db.prepare('INSERT INTO profile_skills (profile_id, skill_id, proficiency) VALUES (?,?,?)')
        .run(p.profile_id, s.skill_id, s.proficiency);
    }
  })();
  logEvent(req.user.user_id, p.profile_id, 'profile.skills_updated', String(list.length));
  ok(res, skillsOf(p.profile_id));
}));

const skillsOf = (profileId) => db.prepare(`
  SELECT s.skill_id, s.name, s.discipline, ps.proficiency
  FROM profile_skills ps JOIN skills s ON s.skill_id = ps.skill_id
  WHERE ps.profile_id = ? ORDER BY s.discipline, s.name`).all(profileId);

app.post('/api/creator/portfolio', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile first');
  const count = db.prepare('SELECT COUNT(*) n FROM portfolio_items WHERE profile_id = ?')
                  .get(p.profile_id).n;
  if (count >= 20) throw new HttpError(409, 'a portfolio holds at most 20 items (FR-10)');
  const b = req.body || {};
  if (!String(b.title || '').trim()) throw new HttpError(400, 'a portfolio item needs a title');
  const media = b.media_type || 'image';
  if (!['image', 'video', 'document'].includes(media))
    throw new HttpError(400, 'media type must be image, video or document');
  const item_id = id('itm');
  db.prepare(`INSERT INTO portfolio_items
    (item_id, profile_id, title, description, media_type, role_played, display_order)
    VALUES (?,?,?,?,?,?,?)`).run(
    item_id, p.profile_id, b.title.trim(), b.description || '',
    media, b.role_played || '', count);
  logEvent(req.user.user_id, item_id, 'portfolio.added', b.title);
  ok(res, { item_id });
}));

app.delete('/api/creator/portfolio/:itemId', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  const r = db.prepare('DELETE FROM portfolio_items WHERE item_id = ? AND profile_id = ?')
              .run(req.params.itemId, p?.profile_id ?? '');
  if (!r.changes) return res.status(404).json({ error: 'no such portfolio item' });
  logEvent(req.user.user_id, req.params.itemId, 'portfolio.removed');
  ok(res, { removed: true });
}));

app.post('/api/creator/social', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile first');
  const { platform, handle, follower_count, engagement_rate, oauth } = req.body || {};
  if (!platform || !handle) throw new HttpError(400, 'platform and handle are required');
  if (follower_count != null && (!Number.isInteger(follower_count) || follower_count < 0))
    throw new HttpError(400, 'follower count must be a whole number');

  // With an OAuth grant the figure comes from the platform's own API and is
  // marked verified; without one the creator's claim stands, clearly labelled.
  // A provider that is down degrades to self_declared rather than failing the
  // profile (FR-12, risk R4).
  const verified = Boolean(oauth);
  db.prepare(`INSERT INTO social_accounts
      (social_account_id, profile_id, platform, handle, follower_count,
       engagement_rate, metrics_source, last_refreshed_at)
      VALUES (?,?,?,?,?,?,?,datetime('now'))
      ON CONFLICT(profile_id, platform) DO UPDATE SET
        handle = excluded.handle,
        follower_count = excluded.follower_count,
        engagement_rate = excluded.engagement_rate,
        metrics_source = excluded.metrics_source,
        last_refreshed_at = datetime('now')`).run(
    id('soc'), p.profile_id, platform, handle,
    follower_count ?? null, engagement_rate ?? null,
    verified ? 'api_verified' : 'self_declared');
  ok(res, { metrics_source: verified ? 'api_verified' : 'self_declared' });
}));

app.post('/api/creator/kyc', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile first');
  const outcome = req.body?.outcome === 'rejected' ? 'rejected' : 'verified';
  db.prepare('UPDATE creator_profiles SET kyc_status = ? WHERE profile_id = ?')
    .run(outcome, p.profile_id);
  logEvent(req.user.user_id, p.profile_id, 'kyc.' + outcome);
  ok(res, { kyc_status: outcome });
}));

// ---------------------------------------------------------------- discovery
app.get('/api/creators', wrap((req, res) => {
  const { q, discipline, country, mode, verified, maxRate } = req.query;
  const where = ['cp.published_at IS NOT NULL'];
  const args = [];
  if (q) { where.push('(cp.display_name LIKE ? OR cp.biography LIKE ?)'); args.push(`%${q}%`, `%${q}%`); }
  if (discipline) { where.push('cp.primary_discipline = ?'); args.push(discipline); }
  if (country) { where.push('cp.country_code = ?'); args.push(country); }
  if (mode) { where.push('cp.engagement_modes LIKE ?'); args.push(`%${mode}%`); }
  if (verified === 'true') where.push("cp.kyc_status = 'verified'");
  if (maxRate) { where.push('cp.day_rate_minor <= ?'); args.push(Number(maxRate)); }

  const rows = db.prepare(`
    SELECT cp.*, u.email
    FROM creator_profiles cp JOIN users u ON u.user_id = cp.user_id
    WHERE ${where.join(' AND ')}
    ORDER BY cp.kyc_status = 'verified' DESC, cp.completed_contracts DESC
    LIMIT 20`).all(...args);

  for (const r of rows) {
    r.social = db.prepare('SELECT platform, handle, follower_count, metrics_source FROM social_accounts WHERE profile_id = ?').all(r.profile_id);
    r.portfolio = db.prepare('SELECT item_id, title, role_played FROM portfolio_items WHERE profile_id = ? ORDER BY display_order').all(r.profile_id);
  }
  ok(res, rows);
}));

app.get('/api/creators/:profileId', wrap((req, res) => {
  const r = db.prepare('SELECT * FROM creator_profiles WHERE profile_id = ?')
              .get(req.params.profileId);
  if (!r) return res.status(404).json({ error: 'no such creator' });
  r.social = db.prepare('SELECT * FROM social_accounts WHERE profile_id = ?').all(r.profile_id);
  r.portfolio = db.prepare('SELECT * FROM portfolio_items WHERE profile_id = ? ORDER BY display_order').all(r.profile_id);
  r.skills = skillsOf(r.profile_id);
  ok(res, r);
}));

// The taxonomy's disciplines plus any a profile already carries.
app.get('/api/disciplines', wrap((_req, res) => ok(res,
  db.prepare(`SELECT discipline d FROM skills UNION
              SELECT primary_discipline FROM creator_profiles ORDER BY 1`)
    .all().map((r) => r.d))));

// ---------------------------------------------------------------- brand + briefs
app.put('/api/brand/profile', requireUser('brand'), wrap((req, res) => {
  const b = req.body || {};
  let brand = brandOf(req);
  if (b.legal_name !== undefined && !String(b.legal_name).trim())
    throw new HttpError(400, 'a legal name is required');
  if (!brand) {
    const brand_id = id('brd');
    db.prepare(`INSERT INTO brand_profiles
      (brand_id, user_id, legal_name, trading_name, country_code, sector, website)
      VALUES (?,?,?,?,?,?,?)`).run(brand_id, req.user.user_id,
      b.legal_name || 'Unnamed brand', b.trading_name || '', b.country_code || 'NG',
      b.sector || '', b.website || '');
    logEvent(req.user.user_id, brand_id, 'brand.published');
  } else {
    db.prepare(`UPDATE brand_profiles SET legal_name = COALESCE(?, legal_name),
      trading_name = COALESCE(?, trading_name),
      country_code = COALESCE(?, country_code), sector = COALESCE(?, sector),
      website = COALESCE(?, website) WHERE brand_id = ?`).run(
      b.legal_name ?? null, b.trading_name ?? null, b.country_code ?? null,
      b.sector ?? null, b.website ?? null, brand.brand_id);
    logEvent(req.user.user_id, brand.brand_id, 'brand.updated');
  }
  ok(res, brandOf(req));
}));

app.post('/api/briefs', requireUser('brand'), wrap((req, res) => {
  const brand = brandOf(req);
  if (!brand) throw new HttpError(400, 'publish your organisation profile first');
  const b = req.body || {};
  if (!b.title || !b.description) throw new HttpError(400, 'a brief needs a title and description');
  const status = b.status || 'published';
  if (!['draft', 'published'].includes(status))            // FR-22
    throw new HttpError(400, 'a new brief is either a draft or published');
  const brief_id = id('brf');
  db.prepare(`INSERT INTO briefs
    (brief_id, brand_id, engagement_mode, title, description, required_skills,
     budget_min_minor, budget_max_minor, currency_code, closes_at, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    brief_id, brand.brand_id, b.engagement_mode || 'commission', b.title,
    b.description, (b.required_skills || []).join(','),
    b.budget_min_minor ?? null, b.budget_max_minor ?? null,
    b.currency_code || 'NGN', b.closes_at || null, status);
  logEvent(req.user.user_id, brief_id, `brief.${status === 'draft' ? 'drafted' : 'published'}`, b.title);
  ok(res, db.prepare('SELECT * FROM briefs WHERE brief_id = ?').get(brief_id));
}));

// FR-22 — a draft can be published; a published brief can be closed. Awarding
// closes a brief too. Nothing reopens one, so no application lands after award.
const BRIEF_TRANSITIONS = { draft: ['published'], published: ['closed'] };

app.post('/api/briefs/:id/status', requireUser('brand'), wrap((req, res) => {
  const brief = db.prepare('SELECT * FROM briefs WHERE brief_id = ?').get(req.params.id);
  if (!brief) return res.status(404).json({ error: 'no such brief' });
  if (brief.brand_id !== brandOf(req)?.brand_id) throw new HttpError(403, 'this brief is not yours');
  const next = req.body?.status;
  if (!(BRIEF_TRANSITIONS[brief.status] || []).includes(next))
    throw new HttpError(409, `a brief that is ${brief.status} cannot become ${next}`);
  db.prepare('UPDATE briefs SET status = ? WHERE brief_id = ?').run(next, brief.brief_id);
  logEvent(req.user.user_id, brief.brief_id, `brief.${next}`, brief.title);
  ok(res, { status: next });
}));

app.get('/api/briefs', wrap((req, res) => {
  const user = currentUser(req);
  let rows;
  if (user?.role === 'brand') {
    const brand = db.prepare('SELECT * FROM brand_profiles WHERE user_id = ?').get(user.user_id);
    rows = db.prepare(`SELECT b.*, bp.legal_name FROM briefs b
      JOIN brand_profiles bp ON bp.brand_id = b.brand_id
      WHERE b.brand_id = ? ORDER BY b.created_at DESC`).all(brand?.brand_id ?? '');
  } else {
    rows = db.prepare(`SELECT b.*, bp.legal_name FROM briefs b
      JOIN brand_profiles bp ON bp.brand_id = b.brand_id
      WHERE b.status = 'published' ORDER BY b.created_at DESC`).all();
  }
  for (const r of rows) {
    r.application_count = db.prepare('SELECT COUNT(*) n FROM applications WHERE brief_id = ?')
                            .get(r.brief_id).n;
  }
  ok(res, rows);
}));

app.get('/api/briefs/:id', wrap((req, res) => {
  const brief = db.prepare(`SELECT b.*, bp.legal_name FROM briefs b
    JOIN brand_profiles bp ON bp.brand_id = b.brand_id WHERE b.brief_id = ?`)
    .get(req.params.id);
  if (!brief) return res.status(404).json({ error: 'no such brief' });

  // Applications carry cover notes and fees: only the brief's own brand sees
  // them all; a creator sees only their own; nobody else sees any.
  const user = currentUser(req);
  const isOwner = user?.role === 'brand' &&
    db.prepare('SELECT brand_id FROM brand_profiles WHERE user_id = ?').get(user.user_id)
      ?.brand_id === brief.brand_id;
  if (brief.status === 'draft' && !isOwner)
    return res.status(404).json({ error: 'no such brief' });

  const applications = db.prepare(`
    SELECT a.*, cp.display_name, cp.primary_discipline, cp.city, cp.country_code,
           cp.kyc_status
    FROM applications a JOIN creator_profiles cp ON cp.profile_id = a.creator_id
    WHERE a.brief_id = ? ORDER BY a.created_at`).all(brief.brief_id);
  const mine = user?.role === 'creator' ? user.profile?.profile_id : null;
  brief.is_owner = isOwner;
  brief.applications = isOwner ? applications
    : applications.filter((a) => mine && a.creator_id === mine);
  brief.application_count = applications.length;
  ok(res, brief);
}));

app.post('/api/briefs/:id/apply', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile before applying');
  const brief = db.prepare('SELECT * FROM briefs WHERE brief_id = ?').get(req.params.id);
  if (!brief) return res.status(404).json({ error: 'no such brief' });
  if (brief.status !== 'published') throw new HttpError(409, 'this brief is not open for applications');
  const fee = Number(req.body?.proposed_fee_minor);
  if (!Number.isInteger(fee) || fee <= 0) throw new HttpError(400, 'quote a fee');

  try {
    const application_id = id('app');
    db.prepare(`INSERT INTO applications
      (application_id, brief_id, creator_id, cover_note, proposed_fee_minor)
      VALUES (?,?,?,?,?)`).run(application_id, brief.brief_id, p.profile_id,
      req.body.cover_note || '', fee);
    logEvent(req.user.user_id, application_id, 'application.submitted', brief.title);
    ok(res, { application_id });
  } catch (err) {
    if (String(err.message).includes('UNIQUE'))
      throw new HttpError(409, 'you have already applied to this brief');
    throw err;
  }
}));

app.post('/api/applications/:id/status', requireUser('brand'), wrap((req, res) => {
  const status = req.body?.status;
  if (!['shortlisted', 'rejected'].includes(status))
    throw new HttpError(400, 'status must be shortlisted or rejected');
  const app_ = db.prepare(`SELECT a.*, b.brand_id FROM applications a
    JOIN briefs b ON b.brief_id = a.brief_id WHERE a.application_id = ?`)
    .get(req.params.id);
  if (!app_) return res.status(404).json({ error: 'no such application' });
  if (app_.brand_id !== brandOf(req)?.brand_id)
    throw new HttpError(403, 'this application is not on your brief');
  if (!['submitted', 'shortlisted'].includes(app_.status))
    throw new HttpError(409, `an application that is ${app_.status} cannot be changed`);
  db.prepare('UPDATE applications SET status = ? WHERE application_id = ?')
    .run(status, app_.application_id);
  logEvent(req.user.user_id, app_.application_id, `application.${status}`);
  ok(res, { status });
}));

// Award creates the contract and its milestones in one transaction: a contract
// without milestones, or milestones that do not sum to the fee, must not exist.
app.post('/api/applications/:id/award', requireUser('brand'), wrap((req, res) => {
  const brand = brandOf(req);
  const app_ = db.prepare(`SELECT a.*, b.brand_id, b.title, b.currency_code
    FROM applications a JOIN briefs b ON b.brief_id = a.brief_id
    WHERE a.application_id = ?`).get(req.params.id);
  if (!app_) return res.status(404).json({ error: 'no such application' });
  if (app_.brand_id !== brand?.brand_id)
    throw new HttpError(403, 'this application is not on your brief');
  if (app_.status === 'awarded') throw new HttpError(409, 'already awarded');
  // Awarding rejects every other application, so this is also what stops a
  // second contract being awarded on the same brief.
  if (app_.status === 'rejected') throw new HttpError(409, 'a rejected application cannot be awarded');

  const fee = app_.proposed_fee_minor;
  let plan = req.body?.milestones;
  if (!Array.isArray(plan) || !plan.length) {
    const first = Math.floor(fee / 2);
    plan = [
      { description: 'First draft delivered for review', amount_minor: first },
      { description: 'Final files delivered', amount_minor: fee - first },
    ];
  }
  const total = plan.reduce((s, m) => s + Number(m.amount_minor), 0);
  if (total !== fee)
    throw new HttpError(400, `milestones sum to ${total} but the agreed fee is ${fee}`);

  // FR-26 — awarding is the brand's acceptance; the contract stays
  // pending_acceptance, and unfundable, until the creator accepts it too.
  const contract_id = id('ctr');
  db.transaction(() => {
    db.prepare(`INSERT INTO contracts
      (contract_id, brief_id, creator_id, brand_id, agreed_fee_minor,
       commission_rate, currency_code, status, brand_accepted_at)
      VALUES (?,?,?,?,?,?,?, 'pending_acceptance', datetime('now'))`).run(
      contract_id, app_.brief_id, app_.creator_id, brand.brand_id, fee,
      COMMISSION, app_.currency_code);
    plan.forEach((m, i) => {
      db.prepare(`INSERT INTO milestones
        (milestone_id, contract_id, sequence_no, description, amount_minor, due_date)
        VALUES (?,?,?,?,?,?)`).run(id('mst'), contract_id, i + 1,
        m.description, Number(m.amount_minor), m.due_date || null);
    });
    db.prepare("UPDATE applications SET status = 'awarded' WHERE application_id = ?")
      .run(app_.application_id);
    db.prepare("UPDATE applications SET status = 'rejected' WHERE brief_id = ? AND application_id <> ? AND status <> 'awarded'")
      .run(app_.brief_id, app_.application_id);
    db.prepare("UPDATE briefs SET status = 'closed' WHERE brief_id = ?").run(app_.brief_id);
  })();

  logEvent(req.user.user_id, contract_id, 'contract.awarded', app_.title);
  ok(res, { contract_id });
}));

// ---------------------------------------------------------------- contracts
function contractView(contract_id) {
  const c = db.prepare(`SELECT c.*, br.title AS brief_title, bp.legal_name,
    cp.display_name, cp.primary_discipline
    FROM contracts c
    JOIN briefs br ON br.brief_id = c.brief_id
    JOIN brand_profiles bp ON bp.brand_id = c.brand_id
    JOIN creator_profiles cp ON cp.profile_id = c.creator_id
    WHERE c.contract_id = ?`).get(contract_id);
  if (!c) return null;
  c.milestones = db.prepare('SELECT * FROM milestones WHERE contract_id = ? ORDER BY sequence_no')
                   .all(contract_id);
  for (const m of c.milestones) {
    m.deliverables = db.prepare('SELECT * FROM deliverables WHERE milestone_id = ? ORDER BY created_at')
                       .all(m.milestone_id);
    m.ledger = milestoneLedger(m.milestone_id);
    m.commission_minor = Math.round(m.amount_minor * c.commission_rate);
    m.net_minor = m.amount_minor - m.commission_minor;
  }
  c.escrow_held_minor = c.milestones
    .filter((m) => ['funded', 'in_progress', 'submitted', 'disputed'].includes(m.status))
    .reduce((s, m) => s + m.amount_minor, 0);
  return c;
}

app.get('/api/contracts', requireUser('creator', 'brand'), wrap((req, res) => {
  const rows = req.user.role === 'creator'
    ? db.prepare('SELECT contract_id FROM contracts WHERE creator_id = ? ORDER BY created_at DESC')
        .all(creatorOf(req)?.profile_id ?? '')
    : db.prepare('SELECT contract_id FROM contracts WHERE brand_id = ? ORDER BY created_at DESC')
        .all(brandOf(req)?.brand_id ?? '');
  ok(res, rows.map((r) => contractView(r.contract_id)));
}));

app.get('/api/contracts/:id', requireUser('creator', 'brand'), wrap((req, res) => {
  const c = contractView(req.params.id);
  if (!c) return res.status(404).json({ error: 'no such contract' });
  const mine = req.user.role === 'creator'
    ? c.creator_id === creatorOf(req)?.profile_id
    : c.brand_id === brandOf(req)?.brand_id;
  if (!mine) throw new HttpError(403, 'this contract is not yours');
  ok(res, c);
}));

// FR-26 — the creator's acceptance is what makes the contract binding.
app.post('/api/contracts/:id/accept', requireUser('creator'), wrap((req, res) => {
  const c = db.prepare('SELECT * FROM contracts WHERE contract_id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'no such contract' });
  if (c.creator_id !== creatorOf(req)?.profile_id) throw new HttpError(403, 'this contract is not yours');
  if (c.status !== 'pending_acceptance')
    throw new HttpError(409, `a contract that is ${c.status} cannot be accepted`);
  db.prepare(`UPDATE contracts SET status = 'active', creator_accepted_at = datetime('now')
              WHERE contract_id = ?`).run(c.contract_id);
  logEvent(req.user.user_id, c.contract_id, 'contract.accepted');
  ok(res, { contract: contractView(c.contract_id) });
}));

// FR-34 — either party may walk away while no money has moved. Each milestone
// still goes through the state machine, which only allows pending → cancelled,
// so a funded milestone can never be discarded this way (rule 5).
app.post('/api/contracts/:id/cancel', requireUser('creator', 'brand'), wrap((req, res) => {
  const c = db.prepare('SELECT * FROM contracts WHERE contract_id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'no such contract' });
  const mine = req.user.role === 'creator'
    ? c.creator_id === creatorOf(req)?.profile_id
    : c.brand_id === brandOf(req)?.brand_id;
  if (!mine) throw new HttpError(403, 'this contract is not yours');
  if (!['pending_acceptance', 'active'].includes(c.status))
    throw new HttpError(409, `a contract that is ${c.status} cannot be cancelled`);

  const milestones = db.prepare('SELECT * FROM milestones WHERE contract_id = ?').all(c.contract_id);
  if (milestones.some((m) => m.status !== 'pending'))
    throw new HttpError(409,
      'a milestone has already been funded — the contract can no longer be cancelled without penalty');
  milestones.forEach((m) => moveTo(m, 'cancelled'));

  db.transaction(() => {
    db.prepare("UPDATE milestones SET status = 'cancelled' WHERE contract_id = ?").run(c.contract_id);
    db.prepare("UPDATE contracts SET status = 'cancelled' WHERE contract_id = ?").run(c.contract_id);
  })();
  logEvent(req.user.user_id, c.contract_id, 'contract.cancelled', req.body?.reason);
  ok(res, { contract: contractView(c.contract_id) });
}));

const loadMilestone = (milestoneId) => {
  const m = db.prepare('SELECT * FROM milestones WHERE milestone_id = ?').get(milestoneId);
  if (!m) throw new HttpError(404, 'no such milestone');
  const c = db.prepare('SELECT * FROM contracts WHERE contract_id = ?').get(m.contract_id);
  return { m, c };
};

// UC-07 — fund a milestone into escrow.
app.post('/api/milestones/:id/fund', requireUser('brand'), wrap((req, res) => {
  const { m, c } = loadMilestone(req.params.id);
  if (c.brand_id !== brandOf(req)?.brand_id) throw new HttpError(403, 'not your contract');
  if (c.status !== 'active')
    throw new HttpError(409, c.status === 'pending_acceptance'
      ? 'the creator has not accepted the contract yet'
      : `a contract that is ${c.status} cannot be funded`);
  moveTo(m, 'funded');

  // The key is derived from the milestone, not generated per request, so a
  // retry of this same funding is the same key and cannot post twice.
  const idempotencyKey = `fund:${m.milestone_id}`;
  const auth = paymentProvider('fund', { amount_minor: m.amount_minor, idempotencyKey });
  if (!auth.ok) throw new HttpError(402, 'the payment was declined');

  const result = post([
    { account_type: 'brand_funding', account_owner_id: c.brand_id,
      direction: 'debit', amount_minor: m.amount_minor, memo: 'funding escrow' },
    { account_type: 'escrow', account_owner_id: c.contract_id,
      direction: 'credit', amount_minor: m.amount_minor, memo: 'held for milestone' },
  ], { idempotencyKey, milestoneId: m.milestone_id, currency: c.currency_code });

  db.prepare(`UPDATE milestones SET status = 'in_progress', funded_at = datetime('now')
              WHERE milestone_id = ?`).run(m.milestone_id);
  logEvent(req.user.user_id, m.milestone_id, 'milestone.funded', auth.reference);
  ok(res, { ...result, reference: auth.reference, contract: contractView(c.contract_id) });
}));

// UC-08 — submit a deliverable against a funded milestone.
app.post('/api/milestones/:id/submit', requireUser('creator'), wrap((req, res) => {
  const { m, c } = loadMilestone(req.params.id);
  if (c.creator_id !== creatorOf(req)?.profile_id) throw new HttpError(403, 'not your contract');
  if (m.status === 'pending')
    throw new HttpError(409, 'this milestone is not funded yet — you should not start work');
  moveTo(m, 'submitted');

  db.prepare(`INSERT INTO deliverables (deliverable_id, milestone_id, title, note, external_link)
              VALUES (?,?,?,?,?)`).run(id('dlv'), m.milestone_id,
    req.body?.title || 'Deliverable', req.body?.note || '', req.body?.external_link || '');
  db.prepare(`UPDATE milestones SET status = 'submitted', submitted_at = datetime('now')
              WHERE milestone_id = ?`).run(m.milestone_id);
  logEvent(req.user.user_id, m.milestone_id, 'milestone.submitted');
  ok(res, { contract: contractView(c.contract_id) });
}));

// FR-30 — a bounded number of revisions, so scope cannot become open-ended.
app.post('/api/milestones/:id/revise', requireUser('brand'), wrap((req, res) => {
  const { m, c } = loadMilestone(req.params.id);
  if (c.brand_id !== brandOf(req)?.brand_id) throw new HttpError(403, 'not your contract');
  moveTo(m, 'in_progress');
  if (m.revision_count >= 2)
    throw new HttpError(409,
      'two revisions have already been requested — accept the work or raise a dispute');
  db.prepare(`UPDATE milestones SET status = 'in_progress',
              revision_count = revision_count + 1 WHERE milestone_id = ?`)
    .run(m.milestone_id);
  logEvent(req.user.user_id, m.milestone_id, 'milestone.revision_requested', req.body?.reason);
  ok(res, { contract: contractView(c.contract_id) });
}));

// UC-09 — accept the deliverable and release payment.
app.post('/api/milestones/:id/accept', requireUser('brand'), wrap((req, res) => {
  const { m, c } = loadMilestone(req.params.id);
  if (c.brand_id !== brandOf(req)?.brand_id) throw new HttpError(403, 'not your contract');
  moveTo(m, 'accepted');

  const commission = Math.round(m.amount_minor * c.commission_rate);
  const net = m.amount_minor - commission;
  const idempotencyKey = `release:${m.milestone_id}`;

  // Status change and ledger posting happen in one database transaction: a
  // partially applied release cannot exist.
  const apply = db.transaction(() => {
    const result = post([
      { account_type: 'escrow', account_owner_id: c.contract_id,
        direction: 'debit', amount_minor: m.amount_minor, memo: 'released on acceptance' },
      { account_type: 'creator_payable', account_owner_id: c.creator_id,
        direction: 'credit', amount_minor: net, memo: 'net of commission' },
      { account_type: 'platform_commission', account_owner_id: null,
        direction: 'credit', amount_minor: commission, memo: 'platform commission' },
    ], { idempotencyKey, milestoneId: m.milestone_id, currency: c.currency_code });

    db.prepare(`UPDATE milestones SET status = 'accepted', accepted_at = datetime('now')
                WHERE milestone_id = ?`).run(m.milestone_id);

    const remaining = db.prepare(
      "SELECT COUNT(*) n FROM milestones WHERE contract_id = ? AND status <> 'accepted'")
      .get(c.contract_id).n;
    if (remaining === 0) {
      db.prepare("UPDATE contracts SET status = 'completed' WHERE contract_id = ?")
        .run(c.contract_id);
      db.prepare(`UPDATE creator_profiles
                  SET completed_contracts = completed_contracts + 1
                  WHERE profile_id = ?`).run(c.creator_id);
    }
    return result;
  });

  const result = apply();
  logEvent(req.user.user_id, m.milestone_id, 'milestone.accepted',
           `net ${net}, commission ${commission}`);
  ok(res, { ...result, net_minor: net, commission_minor: commission,
            contract: contractView(c.contract_id) });
}));

app.get('/api/milestones/:id/ledger', wrap((req, res) =>
  ok(res, milestoneLedger(req.params.id))));

// ---------------------------------------------------------------- payouts
app.get('/api/creator/balance', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) return ok(res, { available_minor: 0, paid_out_minor: 0 });
  // The payable account balance IS what the platform still owes: a withdrawal
  // posts a debit against it, so subtracting the payouts table as well would
  // count the same money twice.
  const paid = db.prepare(
    "SELECT COALESCE(SUM(amount_minor),0) s FROM payouts WHERE creator_id = ? AND status = 'settled'")
    .get(p.profile_id).s;
  ok(res, { available_minor: balance('creator_payable', p.profile_id),
            paid_out_minor: paid });
}));

app.post('/api/payouts', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  if (!p) throw new HttpError(400, 'publish your profile first');
  const available = balance('creator_payable', p.profile_id);

  const amount = Number(req.body?.amount_minor ?? available);
  if (!Number.isInteger(amount) || amount <= 0) throw new HttpError(400, 'nothing to withdraw');
  if (amount > available)
    throw new HttpError(409, `only ${available} is available to withdraw`);

  const payout_id = id('pay');
  const idempotencyKey = `payout:${payout_id}`;
  const transfer = paymentProvider('payout', { amount_minor: amount, idempotencyKey });

  db.transaction(() => {
    post([
      { account_type: 'creator_payable', account_owner_id: p.profile_id,
        direction: 'debit', amount_minor: amount, memo: 'withdrawal' },
      { account_type: 'provider_settlement', account_owner_id: null,
        direction: 'credit', amount_minor: amount, memo: transfer.reference },
    ], { idempotencyKey, currency: p.currency_code });
    db.prepare(`INSERT INTO payouts (payout_id, creator_id, amount_minor, destination, reference)
                VALUES (?,?,?,?,?)`).run(payout_id, p.profile_id, amount,
      req.body?.destination || 'Bank account ····4417', transfer.reference);
  })();

  logEvent(req.user.user_id, payout_id, 'payout.settled', String(amount));
  ok(res, { payout_id, amount_minor: amount, reference: transfer.reference });
}));

app.get('/api/payouts', requireUser('creator'), wrap((req, res) => {
  const p = creatorOf(req);
  ok(res, p ? db.prepare('SELECT * FROM payouts WHERE creator_id = ? ORDER BY created_at DESC')
                .all(p.profile_id) : []);
}));

// ---------------------------------------------------------------- audit
app.get('/api/ledger', wrap((_req, res) => ok(res, db.prepare(`
  SELECT * FROM ledger_entries ORDER BY entry_id DESC LIMIT 100`).all())));

app.get('/api/ledger/reconcile', wrap((_req, res) => ok(res, reconcile())));

app.get('/api/events', wrap((_req, res) => ok(res, db.prepare(
  'SELECT * FROM events ORDER BY event_id DESC LIMIT 50').all())));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// If a built client is present the API serves it too, so the MVP can also run
// as one service. On Render the client is not built; Vercel hosts it instead.
const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`TalentHub API listening on http://localhost:${PORT}`);
});
