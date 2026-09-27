/**
 * Walks the escrow path end to end against a running API and asserts the
 * ledger balances at the end. Run with the API up:  node server/smoke.mjs
 */
const API = process.env.API || 'http://localhost:4000/api';
let pass = 0, fail = 0;

const check = (label, condition, detail = '') => {
  if (condition) { pass++; console.log(`  ok    ${label}`); }
  else { fail++; console.log(`  FAIL  ${label}${detail ? ' — ' + detail : ''}`); }
};

async function call(method, path, { token, body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }
  return { status: res.status, body: json };
}

const login = async (email) =>
  (await call('POST', '/auth/login', { body: { email, password: 'password123' } })).body;

console.log('\nTalentHub escrow path\n');

const brand = await login('brand@sterling.example');
check('brand signs in', !!brand.token);
const creator = await login('amara@talenthub.africa');
check('creator signs in', !!creator.token);

const bad = await call('POST', '/auth/login',
  { body: { email: 'brand@sterling.example', password: 'wrong' } });
check('a wrong password is rejected', bad.status === 401);

// discovery
const found = await call('GET', '/creators?discipline=Motion%20design');
check('discovery filters by discipline', found.body.length >= 1);
check('audience metrics carry their source',
  found.body[0].social.every((s) => ['api_verified', 'self_declared'].includes(s.metrics_source)));

// brief and application — created fresh each run so the test is repeatable
const made = await call('POST', '/briefs', { token: brand.token, body: {
  engagement_mode: 'commission',
  title: `Smoke test brief ${Date.now()}`,
  description: 'Created by the smoke test to walk the escrow path.',
  budget_min_minor: 10000000, budget_max_minor: 40000000 } });
check('the brand publishes a brief', made.status === 200, JSON.stringify(made.body));
const brief = made.body;

const applied = await call('POST', `/briefs/${brief.brief_id}/apply`, {
  token: creator.token,
  body: { proposed_fee_minor: 30000000, cover_note: 'I can deliver in three weeks.' } });
check('the creator applies', applied.status === 200, JSON.stringify(applied.body));

const dupe = await call('POST', `/briefs/${brief.brief_id}/apply`,
  { token: creator.token, body: { proposed_fee_minor: 1000, cover_note: 'again' } });
check('a second application to the same brief is refused (FR-23)', dupe.status === 409);

const detail = await call('GET', `/briefs/${brief.brief_id}`, { token: brand.token });
const application = detail.body.applications.find((a) => a.status === 'submitted');
check('the application is visible to the brand', !!application);

const anon = await call('GET', `/briefs/${brief.brief_id}`);
check('applications are hidden from anyone but the brief owner',
  anon.body.applications.length === 0 && anon.body.application_count === 1);

const shortlist = await call('POST', `/applications/${application.application_id}/status`,
  { token: brand.token, body: { status: 'shortlisted' } });
check('the brand shortlists the application (FR-24)', shortlist.status === 200,
  JSON.stringify(shortlist.body));

// award
const award = await call('POST', `/applications/${application.application_id}/award`,
  { token: brand.token });
check('awarding creates a contract', !!award.body.contract_id, JSON.stringify(award.body));

const contract = (await call('GET', `/contracts/${award.body.contract_id}`,
  { token: brand.token })).body;
check('the contract has milestones', contract.milestones.length === 2);
check('milestones sum to the agreed fee',
  contract.milestones.reduce((s, m) => s + m.amount_minor, 0) === contract.agreed_fee_minor);
check('the contract awaits the creator\'s acceptance (FR-26)',
  contract.status === 'pending_acceptance');

const m1 = contract.milestones[0];

const unaccepted = await call('POST', `/milestones/${m1.milestone_id}/fund`, { token: brand.token });
check('funding before the creator accepts is refused', unaccepted.status === 409,
  JSON.stringify(unaccepted.body));

const accepted = await call('POST', `/contracts/${contract.contract_id}/accept`,
  { token: creator.token });
check('the creator accepts the contract', accepted.body?.contract?.status === 'active',
  JSON.stringify(accepted.body));

// a creator must not be able to submit before the money is in escrow
const early = await call('POST', `/milestones/${m1.milestone_id}/submit`,
  { token: creator.token, body: { title: 'too early' } });
check('submitting against an unfunded milestone is refused (FR-28)', early.status === 409,
  JSON.stringify(early.body));

// fund
const fund = await call('POST', `/milestones/${m1.milestone_id}/fund`, { token: brand.token });
check('funding moves the milestone into escrow', fund.body.applied === true,
  JSON.stringify(fund.body));

// the same funding again must not post a second time
const refund = await call('POST', `/milestones/${m1.milestone_id}/fund`, { token: brand.token });
check('re-funding the same milestone is rejected by the state machine',
  refund.status === 409, JSON.stringify(refund.body));

// the wrong party cannot act
const wrongParty = await call('POST', `/milestones/${m1.milestone_id}/accept`,
  { token: creator.token });
check('a creator cannot accept their own work', wrongParty.status === 403);

// submit, revise, submit, accept
let r = await call('POST', `/milestones/${m1.milestone_id}/submit`,
  { token: creator.token, body: { title: 'First cut', note: 'Master plus three verticals' } });
check('the creator submits a deliverable', r.status === 200, JSON.stringify(r.body));

r = await call('POST', `/milestones/${m1.milestone_id}/revise`,
  { token: brand.token, body: { reason: 'Colour grade is too warm' } });
check('the brand can request a revision', r.status === 200);

r = await call('POST', `/milestones/${m1.milestone_id}/submit`,
  { token: creator.token, body: { title: 'Second cut' } });
check('the creator resubmits', r.status === 200);

const accept = await call('POST', `/milestones/${m1.milestone_id}/accept`, { token: brand.token });
check('accepting releases payment', accept.status === 200, JSON.stringify(accept.body));
const expectedCommission = Math.round(m1.amount_minor * 0.10);
check('commission is withheld correctly',
  accept.body.commission_minor === expectedCommission,
  `${accept.body.commission_minor} vs ${expectedCommission}`);
check('the creator is credited the net',
  accept.body.net_minor === m1.amount_minor - expectedCommission);

// balance and payout
const bal = (await call('GET', '/creator/balance', { token: creator.token })).body;
check('the creator balance shows the released net',
  bal.available_minor === accept.body.net_minor,
  `${bal.available_minor} vs ${accept.body.net_minor}`);

const payout = await call('POST', '/payouts', { token: creator.token });
check('the creator withdraws', payout.status === 200, JSON.stringify(payout.body));

const over = await call('POST', '/payouts', { token: creator.token, body: { amount_minor: 1 } });
check('withdrawing more than is available is refused', over.status === 409);

const after = (await call('GET', '/creator/balance', { token: creator.token })).body;
check('the balance is zero after withdrawal', after.available_minor === 0);

const lateCancel = await call('POST', `/contracts/${contract.contract_id}/cancel`,
  { token: brand.token });
check('a contract with a funded milestone cannot be cancelled (FR-34)',
  lateCancel.status === 409, JSON.stringify(lateCancel.body));

// ---------------------------------------------------------------- accounts
console.log('\nAccounts and profiles\n');

const stamp = Date.now();
const newBrand = await call('POST', '/auth/register', { body: {
  email: `smoke-brand-${stamp}@example.com`, password: 'password123', role: 'brand' } });
check('a visitor registers as a brand (FR-01)', !!newBrand.body.token,
  JSON.stringify(newBrand.body));
const dupeEmail = await call('POST', '/auth/register', { body: {
  email: `smoke-brand-${stamp}@example.com`, password: 'password123', role: 'brand' } });
check('an email can only register once', dupeEmail.status === 409);
const shortPw = await call('POST', '/auth/register', { body: {
  email: `smoke-short-${stamp}@example.com`, password: 'short', role: 'creator' } });
check('a short password is refused', shortPw.status === 400);

const noProfileBrief = await call('POST', '/briefs', { token: newBrand.body.token, body: {
  title: 'x', description: 'y' } });
check('a brand without a profile cannot publish a brief', noProfileBrief.status === 400);
const bp = await call('PUT', '/brand/profile', { token: newBrand.body.token, body: {
  legal_name: 'Smoke Test Ltd', trading_name: 'Smoke', country_code: 'GH', sector: 'Testing' } });
check('the brand saves its organisation profile (FR-15)',
  bp.body?.trading_name === 'Smoke', JSON.stringify(bp.body));

const otherApp = (await call('GET', `/briefs/${brief.brief_id}`, { token: brand.token }))
  .body.applications[0];
const foreign = await call('POST', `/applications/${otherApp.application_id}/status`,
  { token: newBrand.body.token, body: { status: 'rejected' } });
check('a brand cannot change applications on another brand\'s brief', foreign.status === 403);

const newCreator = await call('POST', '/auth/register', { body: {
  email: `smoke-creator-${stamp}@example.com`, password: 'password123', role: 'creator' } });
check('a visitor registers as a creator', !!newCreator.body.token);
const ct = newCreator.body.token;

const badRate = await call('PUT', '/creator/profile', { token: ct, body: {
  display_name: 'Smoke Creator', day_rate_minor: 12.5 } });
check('a fractional day rate is refused (money is integer minor units)', badRate.status === 400);

const cp = await call('PUT', '/creator/profile', { token: ct, body: {
  display_name: 'Smoke Creator', biography: 'Made by the smoke test.', country_code: 'KE',
  city: 'Mombasa', primary_discipline: 'Photography', languages: 'English, Swahili',
  engagement_modes: ['commission', 'reach'], day_rate_minor: 500000,
  currency_code: 'KES', availability: 'limited' } });
check('the creator publishes a profile (FR-08, FR-13, FR-14)',
  cp.body?.availability === 'limited' && cp.body?.languages === 'English, Swahili',
  JSON.stringify(cp.body));

const skills = (await call('GET', '/skills')).body;
const photo = skills.filter((s) => s.discipline === 'Photography').slice(0, 2);
const sk = await call('PUT', '/creator/skills', { token: ct, body: {
  skills: photo.map((s) => ({ skill_id: s.skill_id, proficiency: 'advanced' })) } });
check('the creator declares skills from the taxonomy (FR-09)', sk.body?.length === 2,
  JSON.stringify(sk.body));
const badSkill = await call('PUT', '/creator/skills', { token: ct, body: {
  skills: [{ skill_id: 'skl_nope', proficiency: 'expert' }] } });
check('a skill outside the taxonomy is refused', badSkill.status === 400);

const item = await call('POST', '/creator/portfolio', { token: ct, body: {
  title: 'Market day series', media_type: 'image', role_played: 'Photographer' } });
check('the creator adds a portfolio item (FR-10)', !!item.body.item_id);
const removed = await call('DELETE', `/creator/portfolio/${item.body.item_id}`, { token: ct });
check('the creator removes a portfolio item', removed.status === 200);

const soc = await call('POST', '/creator/social', { token: ct, body: {
  platform: 'instagram', handle: '@smoke', follower_count: 1200, engagement_rate: 3.5 } });
check('a figure the creator types in is marked self-declared (FR-12)',
  soc.body.metrics_source === 'self_declared');

const kyc = await call('POST', '/creator/kyc', { token: ct });
check('the creator completes the ID check (FR-06)', kyc.body.kyc_status === 'verified');

const pub = (await call('GET', `/creators/${cp.body.profile_id}`)).body;
check('the public profile carries skills and self-declared audience',
  pub.skills.length === 2 && pub.social[0].metrics_source === 'self_declared');

// ---------------------------------------------------------------- brief lifecycle
console.log('\nBriefs and cancellation\n');

const draft = (await call('POST', '/briefs', { token: brand.token, body: {
  title: `Smoke draft ${stamp}`, description: 'Not public yet.', status: 'draft',
  budget_min_minor: 100000, budget_max_minor: 200000 } })).body;
check('the brand saves a brief as a draft (FR-22)', draft.status === 'draft');
const openList = (await call('GET', '/briefs', { token: ct })).body;
check('a draft is not listed to creators', !openList.some((b) => b.brief_id === draft.brief_id));
const draftApply = await call('POST', `/briefs/${draft.brief_id}/apply`,
  { token: ct, body: { proposed_fee_minor: 150000 } });
check('nobody can apply to a draft', draftApply.status === 404 || draftApply.status === 409);
const publish = await call('POST', `/briefs/${draft.brief_id}/status`,
  { token: brand.token, body: { status: 'published' } });
check('the brand publishes the draft', publish.body.status === 'published');

const applied2 = await call('POST', `/briefs/${draft.brief_id}/apply`,
  { token: ct, body: { proposed_fee_minor: 150000, cover_note: 'Available now.' } });
check('the new creator applies', applied2.status === 200, JSON.stringify(applied2.body));
const ownView = (await call('GET', `/briefs/${draft.brief_id}`, { token: ct })).body;
check('a creator sees their own application', ownView.applications.length === 1);

const award2 = (await call('POST', `/applications/${applied2.body.application_id}/award`,
  { token: brand.token })).body;
const decline = await call('POST', `/contracts/${award2.contract_id}/cancel`,
  { token: ct, body: { reason: 'Timeline no longer works' } });
check('either party cancels an unfunded contract (FR-34)',
  decline.body?.contract?.status === 'cancelled' &&
  decline.body.contract.milestones.every((m) => m.status === 'cancelled'),
  JSON.stringify(decline.body));
const deadFund = await call('POST',
  `/milestones/${decline.body.contract.milestones[0].milestone_id}/fund`, { token: brand.token });
check('a cancelled contract cannot be funded', deadFund.status === 409);

const reopened = await call('POST', `/briefs/${draft.brief_id}/status`,
  { token: brand.token, body: { status: 'published' } });
check('an awarded brief cannot be reopened', reopened.status === 409);

// ---------------------------------------------------------------- disputes
console.log('\nDisputes\n');

const admin = await login('admin@talenthub.example');
check('the administrator signs in', !!admin.token && admin.user?.role === 'admin');

// A three-milestone contract, so each ruling gets its own milestone.
const dBrief = (await call('POST', '/briefs', { token: brand.token, body: {
  title: `Smoke dispute brief ${stamp}`, description: 'Walks every dispute outcome.',
  budget_min_minor: 100000, budget_max_minor: 400000 } })).body;
const dApp = (await call('POST', `/briefs/${dBrief.brief_id}/apply`,
  { token: ct, body: { proposed_fee_minor: 300000, cover_note: 'Ready.' } })).body;
const dAward = (await call('POST', `/applications/${dApp.application_id}/award`, {
  token: brand.token, body: { milestones: [
    { description: 'Shoot', amount_minor: 100000 },
    { description: 'Edit', amount_minor: 100000 },
    { description: 'Deliver', amount_minor: 100000 }] } })).body;
await call('POST', `/contracts/${dAward.contract_id}/accept`, { token: ct });
let dc = (await call('GET', `/contracts/${dAward.contract_id}`, { token: ct })).body;
const [dm1, dm2, dm3] = dc.milestones;
for (const m of dc.milestones) {
  await call('POST', `/milestones/${m.milestone_id}/fund`, { token: brand.token });
  await call('POST', `/milestones/${m.milestone_id}/submit`,
    { token: ct, body: { title: `Work for ${m.description}` } });
}
const balBefore = (await call('GET', '/creator/balance', { token: ct })).body.available_minor;

const outsider = await call('POST', `/milestones/${dm1.milestone_id}/dispute`,
  { token: creator.token, body: { reason: 'I am not a party to this contract.' } });
check('only a party to the contract can raise a dispute', outsider.status === 403);
const noReason = await call('POST', `/milestones/${dm1.milestone_id}/dispute`,
  { token: brand.token, body: { reason: 'no' } });
check('a dispute needs a stated reason', noReason.status === 400);

const raised = await call('POST', `/milestones/${dm1.milestone_id}/dispute`,
  { token: brand.token, body: { reason: 'Only half the shot list was delivered.' } });
check('the brand disputes a submitted deliverable (FR-35)',
  raised.body?.contract?.milestones?.[0]?.status === 'disputed', JSON.stringify(raised.body));
const twice = await call('POST', `/milestones/${dm1.milestone_id}/dispute`,
  { token: ct, body: { reason: 'Disputing the same milestone again.' } });
check('a disputed milestone cannot be disputed again', twice.status === 409);

const selfSettle = await call('POST', `/milestones/${dm1.milestone_id}/accept`, { token: brand.token });
check('the brand cannot settle its own dispute by accepting', selfSettle.status === 409);
const frozenSubmit = await call('POST', `/milestones/${dm1.milestone_id}/submit`,
  { token: ct, body: { title: 'Sneaking a resubmission in' } });
check('the creator cannot resubmit while frozen', frozenSubmit.status === 409);
const frozenRevise = await call('POST', `/milestones/${dm1.milestone_id}/revise`,
  { token: brand.token, body: { reason: 'x' } });
check('the brand cannot request a revision while frozen', frozenRevise.status === 409);

const queue = (await call('GET', '/admin/disputes', { token: admin.token })).body;
const d1 = queue.find((d) => d.milestone_id === dm1.milestone_id);
check('the dispute reaches the administrator with its evidence',
  d1?.status === 'open' && d1.deliverables.length === 1, JSON.stringify(d1));
const notAdmin = await call('POST', `/admin/disputes/${d1.dispute_id}/resolve`,
  { token: brand.token, body: { outcome: 'refund', note: 'Brand rules for itself.' } });
check('only an administrator can rule', notAdmin.status === 403);
const noNote = await call('POST', `/admin/disputes/${d1.dispute_id}/resolve`,
  { token: admin.token, body: { outcome: 'refund' } });
check('a ruling needs a recorded reason (FR-36)', noNote.status === 400);
const badSplit = await call('POST', `/admin/disputes/${d1.dispute_id}/resolve`,
  { token: admin.token, body: { outcome: 'split', creator_share_minor: 100000, note: 'All of it.' } });
check('a split must leave something on both sides', badSplit.status === 400);

// split: 40% to the creator, commission on that share only, the rest back to the brand
const split = await call('POST', `/admin/disputes/${d1.dispute_id}/resolve`, { token: admin.token,
  body: { outcome: 'split', creator_share_minor: 40000, note: 'Half the shot list, fairly priced.' } });
check('the administrator splits the milestone',
  split.body.outcome === 'split' && split.body.net_minor === 36000 &&
  split.body.commission_minor === 4000 && split.body.refunded_minor === 60000,
  JSON.stringify(split.body));
const again = await call('POST', `/admin/disputes/${d1.dispute_id}/resolve`,
  { token: admin.token, body: { outcome: 'refund', note: 'Changing my mind.' } });
check('a ruling is final', again.status === 409);

// refund: raised by the creator this time
const d2 = (await call('POST', `/milestones/${dm2.milestone_id}/dispute`,
  { token: ct, body: { reason: 'Brand is demanding work outside the brief.' } })).body;
const refunded = await call('POST', `/admin/disputes/${d2.dispute_id}/resolve`,
  { token: admin.token, body: { outcome: 'refund', note: 'Deliverable did not match the brief.' } });
check('the administrator refunds the brand in full',
  refunded.body.refunded_minor === 100000 && refunded.body.net_minor === 0, JSON.stringify(refunded.body));

// release: the creator is paid as if the brand had accepted
const d3 = (await call('POST', `/milestones/${dm3.milestone_id}/dispute`,
  { token: ct, body: { reason: 'Brand has not reviewed the final files.' } })).body;
const release = await call('POST', `/admin/disputes/${d3.dispute_id}/resolve`,
  { token: admin.token, body: { outcome: 'release', note: 'Files meet the brief.' } });
check('the administrator releases to the creator', release.body.net_minor === 90000,
  JSON.stringify(release.body));

dc = (await call('GET', `/contracts/${dAward.contract_id}`, { token: ct })).body;
check('each milestone ends in its ruled state',
  dc.milestones.map((m) => m.status).join() === 'split,refunded,accepted',
  dc.milestones.map((m) => m.status).join());
check('the contract completes once every milestone is settled', dc.status === 'completed');
check('nothing is left in escrow', dc.escrow_held_minor === 0);
const balAfter = (await call('GET', '/creator/balance', { token: ct })).body.available_minor;
check('the creator is credited exactly the split and release nets',
  balAfter - balBefore === 36000 + 90000, `${balAfter - balBefore}`);

const splitLedger = (await call('GET', `/milestones/${dm1.milestone_id}/ledger`)).body;
const splitTx = splitLedger.filter((e) => e.memo !== 'funding escrow' && e.memo !== 'held for milestone');
check('the split posts one balanced four-line transaction',
  splitTx.length === 4 &&
  splitTx.filter((e) => e.direction === 'debit').reduce((s, e) => s + e.amount_minor, 0) ===
  splitTx.filter((e) => e.direction === 'credit').reduce((s, e) => s + e.amount_minor, 0));

// ---------------------------------------------------------------- the books
console.log('\nLedger\n');
const rec = (await call('GET', '/ledger/reconcile')).body;
check('every ledger transaction balances', rec.balanced === true,
  JSON.stringify(rec.unbalanced));

const ledger = (await call('GET', `/milestones/${m1.milestone_id}/ledger`)).body;
check('the milestone carries its full audit trail', ledger.length === 5,
  `${ledger.length} entries`);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
