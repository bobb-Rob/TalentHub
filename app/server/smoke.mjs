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

const detail = await call('GET', `/briefs/${brief.brief_id}`);
const application = detail.body.applications.find((a) => a.status === 'submitted');
check('the application is visible to the brand', !!application);

// award
const award = await call('POST', `/applications/${application.application_id}/award`,
  { token: brand.token });
check('awarding creates a contract', !!award.body.contract_id, JSON.stringify(award.body));

const contract = (await call('GET', `/contracts/${award.body.contract_id}`,
  { token: brand.token })).body;
check('the contract has milestones', contract.milestones.length === 2);
check('milestones sum to the agreed fee',
  contract.milestones.reduce((s, m) => s + m.amount_minor, 0) === contract.agreed_fee_minor);

const m1 = contract.milestones[0];

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

// the books
const rec = (await call('GET', '/ledger/reconcile')).body;
check('every ledger transaction balances', rec.balanced === true,
  JSON.stringify(rec.unbalanced));

const ledger = (await call('GET', `/milestones/${m1.milestone_id}/ledger`)).body;
check('the milestone carries its full audit trail', ledger.length === 5,
  `${ledger.length} entries`);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
