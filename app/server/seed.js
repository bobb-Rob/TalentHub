/**
 * Seeds a demo dataset so the app opens with something to look at.
 * `npm run reset` wipes and reseeds.
 */
import fs from 'node:fs';
import { db, DB_PATH, id, logEvent } from './db.js';
import { hash } from './auth.js';

const RESET = process.argv.includes('--reset');

if (RESET) {
  db.pragma('foreign_keys = OFF');
  for (const t of ['ledger_entries', 'payouts', 'deliverables', 'milestones',
                   'contracts', 'applications', 'briefs', 'profile_skills',
                   'portfolio_items', 'social_accounts', 'creator_profiles',
                   'brand_profiles', 'skills', 'users', 'events']) {
    db.prepare(`DELETE FROM ${t}`).run();
  }
  db.pragma('foreign_keys = ON');
  console.log('cleared existing data');
}

if (db.prepare('SELECT COUNT(*) n FROM users').get().n > 0) {
  console.log('database already seeded — use `npm run reset` to start over');
  process.exit(0);
}

const PW = 'password123';
const mkUser = (email, role) => {
  const user_id = id('usr');
  db.prepare('INSERT INTO users (user_id, email, password_hash, role) VALUES (?,?,?,?)')
    .run(user_id, email, hash(PW), role);
  return user_id;
};

const creators = [
  { email: 'amara@talenthub.africa', name: 'Amara Okonkwo', disc: 'Motion design',
    city: 'Lagos', cc: 'NG', rate: 8500000, bio:
    'Motion designer working with fintech and FMCG brands across West Africa. Ten years in broadcast graphics before going independent.',
    kyc: 'verified', modes: 'commission,reach',
    social: [['instagram', '@amara.motion', 18400, 4.2, 'api_verified'],
             ['tiktok', '@amaramotion', 31200, 6.8, 'api_verified']],
    work: [['Sterling Bank — launch film', 'Lead animator'],
           ['Indomie festive spot', 'Director of animation'],
           ['Paystack developer series', 'Motion design']] },
  { email: 'kwesi@talenthub.africa', name: 'Kwesi Boateng', disc: 'Photography',
    city: 'Accra', cc: 'GH', rate: 1200000, bio:
    'Commercial and editorial photographer. Product, lifestyle and campaign stills.',
    kyc: 'verified', modes: 'commission',
    social: [['instagram', '@kwesishoots', 9800, 3.1, 'self_declared']],
    work: [['Kofi Cocoa — product range', 'Photographer'],
           ['Accra Fashion Week', 'Editorial photographer']] },
  { email: 'zola@talenthub.africa', name: 'Zola Mthembu', disc: 'Video editing',
    city: 'Nairobi', cc: 'KE', rate: 950000, bio:
    'Long-form and short-form editor. Documentary, brand films and social cutdowns.',
    kyc: 'verified', modes: 'commission',
    social: [['youtube', '@zolacuts', 4050, 5.4, 'api_verified']],
    work: [['Safaricom brand film', 'Editor'], ['Two-part documentary', 'Lead editor']] },
  { email: 'tunde@talenthub.africa', name: 'Tunde Alabi', disc: 'Illustration',
    city: 'Ibadan', cc: 'NG', rate: 600000, bio:
    'Illustrator and character designer for publishing, advertising and games.',
    kyc: 'unverified', modes: 'commission',
    social: [['instagram', '@tundedraws', 2300, 7.9, 'self_declared']],
    work: [['Children’s book series', 'Illustrator']] },
  { email: 'nadia@talenthub.africa', name: 'Nadia Cherif', disc: 'Copywriting',
    city: 'Casablanca', cc: 'MA', rate: 700000, bio:
    'Bilingual copywriter, French and English. Brand voice, campaign lines, long-form.',
    kyc: 'verified', modes: 'commission,reach',
    social: [['instagram', '@nadiawrites', 12600, 3.8, 'api_verified']],
    work: [['Bank rebrand — voice guide', 'Lead writer']] },
];

const profileIds = {};
for (const c of creators) {
  const user_id = mkUser(c.email, 'creator');
  const profile_id = id('cre');
  profileIds[c.email] = profile_id;
  db.prepare(`INSERT INTO creator_profiles
    (profile_id, user_id, display_name, biography, country_code, city,
     primary_discipline, engagement_modes, day_rate_minor, currency_code,
     availability, kyc_status, published_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,'available',?,datetime('now'))`).run(
    profile_id, user_id, c.name, c.bio, c.cc, c.city, c.disc, c.modes,
    c.rate, c.cc === 'NG' ? 'NGN' : c.cc === 'GH' ? 'GHS' : c.cc === 'KE' ? 'KES' : 'MAD',
    c.kyc);
  c.social.forEach(([platform, handle, followers, er, src]) =>
    db.prepare(`INSERT INTO social_accounts
      (social_account_id, profile_id, platform, handle, follower_count,
       engagement_rate, metrics_source, last_refreshed_at)
      VALUES (?,?,?,?,?,?,?,datetime('now'))`).run(
      id('soc'), profile_id, platform, handle, followers, er, src));
  c.work.forEach(([title, role], i) =>
    db.prepare(`INSERT INTO portfolio_items
      (item_id, profile_id, title, media_type, role_played, display_order)
      VALUES (?,?,?,'image',?,?)`).run(id('itm'), profile_id, title, role, i));
}

const brandUser = mkUser('brand@sterling.example', 'brand');
const brand_id = id('brd');
db.prepare(`INSERT INTO brand_profiles (brand_id, user_id, legal_name, country_code, sector, website)
  VALUES (?,?,?,?,?,?)`).run(brand_id, brandUser, 'Sterling Foods Ltd', 'NG',
  'Food & beverage', 'https://example.com');

const briefs = [
  ['commission', 'Festive campaign film — 45 second cutdown',
   'We need a 45 second brand film for our festive push, cut from footage we already hold, plus three vertical social cutdowns. Delivery in four weeks.',
   'Motion design,Video editing', 30000000, 60000000],
  ['commission', 'Product range photography — 12 SKUs',
   'Studio stills for twelve products, white background plus three lifestyle setups. Shot list provided.',
   'Photography', 8000000, 15000000],
  ['reach', 'Ramadan recipe series — creator posts',
   'Looking for food and lifestyle creators to produce three recipe posts each using our products, published to their own audience.',
   'Copywriting,Photography', 5000000, 12000000],
];
for (const [mode, title, desc, skills, min, max] of briefs) {
  db.prepare(`INSERT INTO briefs
    (brief_id, brand_id, engagement_mode, title, description, required_skills,
     budget_min_minor, budget_max_minor, currency_code, status)
    VALUES (?,?,?,?,?,?,?,?, 'NGN', 'published')`).run(
    id('brf'), brand_id, mode, title, desc, skills, min, max);
}

// one brief already has applications waiting, so the demo opens mid-flow
const firstBrief = db.prepare("SELECT brief_id FROM briefs ORDER BY rowid LIMIT 1").get().brief_id;
db.prepare(`INSERT INTO applications
  (application_id, brief_id, creator_id, cover_note, proposed_fee_minor, status)
  VALUES (?,?,?,?,?, 'submitted')`).run(id('app'), firstBrief,
  profileIds['amara@talenthub.africa'],
  'I directed animation on a similar festive spot last year. I can deliver the master and all three verticals inside three weeks.',
  48000000);
db.prepare(`INSERT INTO applications
  (application_id, brief_id, creator_id, cover_note, proposed_fee_minor, status)
  VALUES (?,?,?,?,?, 'submitted')`).run(id('app'), firstBrief,
  profileIds['zola@talenthub.africa'],
  'Happy to take the edit and the cutdowns. I have turned around similar work in two weeks.',
  36000000);

logEvent(null, null, 'demo.seeded', `${creators.length} creators, ${briefs.length} briefs`);

console.log(`seeded ${DB_PATH}`);
console.log('');
console.log('  Sign in with any of these — password for all accounts is:  ' + PW);
console.log('');
console.log('    brand@sterling.example      Sterling Foods (brand)');
for (const c of creators) console.log(`    ${c.email.padEnd(28)}${c.name} (creator)`);
console.log('');
