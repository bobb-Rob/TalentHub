import React, { useEffect, useState } from 'react';
import { api, money, titleCase, COUNTRIES, toMinor } from './api.js';
import {
  Avatar, AvailabilityBadge, Badge, Banner, Button, Card, Empty, Field, Figure, Flow, Icon,
  KycBadge, LedgerTable, MetricBadge, MilestoneBadge, PageHeader, Rating, SectionLabel,
  StarInput, Stat, Wordmark, BackLink,
} from './components/ui.jsx';

const DEMO = [
  ['brand@sterling.example', 'Sterling Foods', 'brand — hires creators'],
  ['amara@talenthub.africa', 'Amara Okonkwo', 'creator — motion design, Lagos'],
  ['zola@talenthub.africa', 'Zola Mthembu', 'creator — video editing, Nairobi'],
  ['admin@talenthub.example', 'TalentHub Admin', 'administrator — rules on disputes'],
];

// ---------------------------------------------------------------- sign in
export function SignIn({ onSignedIn }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('brand@sterling.example');
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e, asEmail) => {
    e?.preventDefault();
    setBusy(true); setErr('');
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        // Demo buttons use the shared seed password; the form sends what was typed.
        body: { email: asEmail || email, password: asEmail ? 'password123' : password },
      });
      onSignedIn(res);
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };

  const switchTo = (next) => {
    setMode(next); setErr('');
    if (next === 'register') { setEmail(''); setPassword(''); }
  };

  return (
    <div className="auth">
      <div className="topbar-in"><Wordmark /></div>
      <div className="auth-grid">
        <div>
          <div className="eyebrow">Creator–brand marketplace · Africa</div>
          <h1 className="display">Hire the <span className="accent">makers.</span></h1>
          <hr className="auth-rule" />
          <h2>
            Commission Africa’s creators for their craft or their reach,
            with <span className="gradient-text">every fee held in escrow</span>.
          </h2>
          <p className="auth-lede">
            One verified profile carries a portfolio and authenticated audience figures.
            Brands engage a creator either way, under one contract, one escrow and one payout.
          </p>
          <ul className="points">
            <li><Icon name="shield" /> Verified audience figures are never shown as self-declared ones.</li>
            <li><Icon name="lock" /> Each milestone is funded into escrow before work begins.</li>
            <li><Icon name="star" /> Both sides review each other once the contract completes.</li>
          </ul>
        </div>

        <div className="auth-panel">
          <div className="tabs">
            <button type="button" className={mode === 'signin' ? 'on' : ''}
                    onClick={() => switchTo('signin')}>Sign in</button>
            <button type="button" className={mode === 'register' ? 'on' : ''}
                    onClick={() => switchTo('register')}>Create account</button>
          </div>
          {mode === 'register'
            ? <Register onSignedIn={onSignedIn} />
            : <Card>
            <Banner tone="err">{err}</Banner>
            <form onSubmit={submit}>
              <Field label="Email">
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                       autoComplete="username" />
              </Field>
              <Field label="Password">
                <input type="password" value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       autoComplete="current-password" />
              </Field>
              <Button variant="accent" size="lg" block disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <SectionLabel>Or try a demo account</SectionLabel>
            <div className="demo-list">
              {DEMO.map(([mail, name, note]) => (
                <button key={mail} type="button" disabled={busy}
                        onClick={(e) => submit(e, mail)}>
                  <Avatar name={name} />
                  <span>
                    <strong>{name}</strong>
                    <br /><span className="tiny muted">{note}</span>
                  </span>
                </button>
              ))}
            </div>
          </Card>}
          <p className="auth-foot">
            Every seeded account uses the password <code>password123</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

// FR-01 — register as a creator or a brand; the profile comes next.
function Register({ onSignedIn }) {
  const [f, setF] = useState({ role: 'creator', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      onSignedIn(await api('/auth/register', { method: 'POST', body: f }));
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };

  return (
    <Card>
      <Banner tone="err">{err}</Banner>
      <form onSubmit={submit}>
        <Field label="I am joining as">
          <div className="choice">
            {[['creator', 'A creator', 'I make work and get hired'],
              ['brand', 'A brand', 'I hire creators']].map(([role, label, note]) => (
              <label key={role} className={f.role === role ? 'on' : ''}>
                <input type="radio" name="role" value={role} checked={f.role === role}
                       onChange={() => setF({ ...f, role })} />
                <strong>{label}</strong>
                <span className="tiny muted">{note}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Email">
          <input type="email" required value={f.email} autoComplete="email"
                 onChange={(e) => setF({ ...f, email: e.target.value })} />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <input type="password" required minLength={8} value={f.password}
                 autoComplete="new-password"
                 onChange={(e) => setF({ ...f, password: e.target.value })} />
        </Field>
        <Button variant="accent" size="lg" block disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------- discovery
export function Discover({ go }) {
  const [rows, setRows] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [f, setF] = useState({ q: '', discipline: '', country: '', verified: false });

  const load = async () => {
    const qs = new URLSearchParams();
    if (f.q) qs.set('q', f.q);
    if (f.discipline) qs.set('discipline', f.discipline);
    if (f.country) qs.set('country', f.country);
    if (f.verified) qs.set('verified', 'true');
    setRows(await api('/creators?' + qs.toString()));
  };
  useEffect(() => { api('/disciplines').then(setDisciplines).catch(() => {}); }, []);
  useEffect(() => { load().catch(() => {}); }, [f]);

  return (
    <div className="page">
      <PageHeader eyebrow="Discover" title="Find a creator"
                  lede="Verified profiles carrying both portfolio work and audience figures." />

      <Card>
        <div className="filters">
          <input placeholder="Search name or biography…" value={f.q}
                 onChange={(e) => setF({ ...f, q: e.target.value })} />
          <select value={f.discipline}
                  onChange={(e) => setF({ ...f, discipline: e.target.value })}>
            <option value="">Any discipline</option>
            {disciplines.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={f.country}
                  onChange={(e) => setF({ ...f, country: e.target.value })}>
            <option value="">Any country</option>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
          <label className="check">
            <input type="checkbox" checked={f.verified}
                   onChange={(e) => setF({ ...f, verified: e.target.checked })} />
            ID verified only
          </label>
        </div>
      </Card>

      <SectionLabel count={rows.length}>Creators</SectionLabel>
      <div className="grid two">
        {rows.map((c) => (
          <Card key={c.profile_id} className="creator-card"
                onClick={() => go(`/creators/${c.profile_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Avatar name={c.display_name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3>{c.display_name}</h3>
                <div className="small muted">
                  {c.primary_discipline} · {c.city}, {c.country_code}
                </div>
              </div>
              <KycBadge status={c.kyc_status} />
            </div>
            <div className="row" style={{ gap: 14 }}>
              {c.social.slice(0, 2).map((s) => (
                <span key={s.platform} className="row small" style={{ gap: 6 }}>
                  <strong>{(s.follower_count / 1000).toFixed(1)}k</strong>
                  <span className="muted">{titleCase(s.platform)}</span>
                  <MetricBadge source={s.metrics_source} />
                </span>
              ))}
            </div>
            <div className="foot">
              <div>
                <Rating mean={c.mean_rating} count={c.review_count} compact />
                {c.completed_contracts > 0 &&
                  <span className="tiny muted"> · {c.completed_contracts} completed</span>}
              </div>
              <Figure size="sm" value={money(c.day_rate_minor, c.currency_code)} caption="per day" />
            </div>
          </Card>
        ))}
        {!rows.length && <Empty>No creators match those filters.</Empty>}
      </div>
    </div>
  );
}

export function CreatorDetail({ profileId, go }) {
  const [c, setC] = useState(null);
  useEffect(() => { api(`/creators/${profileId}`).then(setC).catch(() => {}); }, [profileId]);
  if (!c) return <div className="page"><Empty>Loading…</Empty></div>;
  return (
    <div className="page">
      <BackLink onClick={() => go('/discover')}>Back to search</BackLink>
      <Card className="lead">
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <Avatar name={c.display_name} lg />
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: 2 }}>{c.display_name}</h1>
            <div className="muted small">
              {c.primary_discipline} · {c.city}, {c.country_code}
            </div>
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              <KycBadge status={c.kyc_status} />
              {c.engagement_modes.split(',').map((m) => (
                <Badge key={m} tone="navy">{m === 'reach' ? 'reach campaigns' : 'commissioned work'}</Badge>
              ))}
              <AvailabilityBadge value={c.availability} />
            </div>
            {c.languages && <div className="tiny muted" style={{ marginTop: 6 }}>
              Speaks {c.languages}
            </div>}
          </div>
          <Figure size="lg" value={money(c.day_rate_minor, c.currency_code)} caption="per day">
            <div style={{ marginTop: 8 }}><Rating mean={c.mean_rating} count={c.review_count} /></div>
            <div className="tiny muted">{c.completed_contracts} completed contract{c.completed_contracts === 1 ? '' : 's'}</div>
          </Figure>
        </div>
        <p style={{ marginTop: 16, marginBottom: 0 }}>{c.biography}</p>
      </Card>

      {c.skills?.length > 0 && (
        <>
          <SectionLabel>Skills</SectionLabel>
          <div className="row" style={{ gap: 6 }}>
            {c.skills.map((s) => (
              <Badge key={s.skill_id} tone="grey">{s.name} · {s.proficiency}</Badge>
            ))}
          </div>
        </>
      )}

      <ReviewList title="Reviews from brands" reviews={c.reviews} />

      <SectionLabel count={c.portfolio.length}>Portfolio</SectionLabel>
      <div className="grid three">
        {c.portfolio.map((p) => (
          <Card key={p.item_id}>
            <div className="thumb" style={{ marginBottom: 10 }}>{p.media_type}</div>
            <strong>{p.title}</strong>
            <div className="small muted">{p.role_played}</div>
          </Card>
        ))}
        {!c.portfolio.length && <Empty>No portfolio items yet.</Empty>}
      </div>

      <SectionLabel>Audience</SectionLabel>
      <Card>
        <table>
          <thead>
            <tr><th>Platform</th><th>Handle</th><th className="num">Followers</th>
                <th className="num">Engagement</th><th>Source</th></tr>
          </thead>
          <tbody>
            {c.social.map((s) => (
              <tr key={s.social_account_id}>
                <td>{titleCase(s.platform)}</td>
                <td className="muted">{s.handle}</td>
                <td className="num">{s.follower_count?.toLocaleString()}</td>
                <td className="num">{s.engagement_rate}%</td>
                <td><MetricBadge source={s.metrics_source} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!c.social.length && <p className="small muted">No linked accounts.</p>}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- briefs
export function Briefs({ user, go }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', engagement_mode: 'commission',
    budget_min: '100000', budget_max: '400000',
  });
  const [err, setErr] = useState('');
  const isBrand = user.role === 'brand';

  const load = () => api('/briefs').then(setRows).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr('');
    // Which button submitted the form decides draft vs published (FR-22).
    const status = e.nativeEvent.submitter?.value === 'draft' ? 'draft' : 'published';
    try {
      await api('/briefs', { method: 'POST', body: {
        title: form.title,
        description: form.description,
        engagement_mode: form.engagement_mode,
        budget_min_minor: toMinor(form.budget_min),
        budget_max_minor: toMinor(form.budget_max),
        status,
      } });
      setOpen(false);
      setForm({ ...form, title: '', description: '' });
      load();
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <div className="page">
      <PageHeader eyebrow={isBrand ? 'Hiring' : 'Find work'}
                  title={isBrand ? 'Your briefs' : 'Open briefs'}
                  lede={isBrand ? 'Work you have put out to the market.'
                                : 'Work brands are looking to commission.'}
                  actions={isBrand && <Button variant={open ? 'outline' : 'accent'}
                                              onClick={() => setOpen(!open)}>
                    {open ? 'Cancel' : '+ New brief'}
                  </Button>} />

      <Banner tone="err">{err}</Banner>

      {open && (
        <Card style={{ marginBottom: 14 }}>
          <form onSubmit={create}>
            <Field label="Title">
              <input required value={form.title}
                     onChange={(e) => setForm({ ...form, title: e.target.value })}
                     placeholder="45 second festive campaign film" />
            </Field>
            <Field label="What you need">
              <textarea required value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Deliverables, format, timeline…" />
            </Field>
            <div className="field-row">
              <Field label="Engagement">
                <select value={form.engagement_mode}
                        onChange={(e) => setForm({ ...form, engagement_mode: e.target.value })}>
                  <option value="commission">Commissioned work</option>
                  <option value="reach">Reach campaign</option>
                </select>
              </Field>
              <Field label="Budget range (₦)">
                <div className="row" style={{ flexWrap: 'nowrap' }}>
                  <input type="number" value={form.budget_min}
                         onChange={(e) => setForm({ ...form, budget_min: e.target.value })} />
                  <input type="number" value={form.budget_max}
                         onChange={(e) => setForm({ ...form, budget_max: e.target.value })} />
                </div>
              </Field>
            </div>
            <div className="row">
              <Button variant="accent" value="published">Publish brief</Button>
              <Button variant="outline" value="draft">Save as draft</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="stack">
        {rows.map((b) => (
          <Card key={b.brief_id} onClick={() => go(`/briefs/${b.brief_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="row" style={{ gap: 8 }}>
                  <h3 style={{ margin: 0 }}>{b.title}</h3>
                  <Badge tone={b.engagement_mode === 'reach' ? 'navy' : 'grey'}>
                    {b.engagement_mode === 'reach' ? 'reach' : 'commission'}
                  </Badge>
                  <BriefStatus status={b.status} />
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>{b.legal_name}</div>
                <p className="small" style={{ marginTop: 6, marginBottom: 0 }}>
                  {b.description.slice(0, 150)}{b.description.length > 150 ? '…' : ''}
                </p>
              </div>
              <Figure size="sm"
                      value={`${money(b.budget_min_minor, b.currency_code)}–${money(b.budget_max_minor, b.currency_code)}`}
                      caption={`${b.application_count} application${b.application_count === 1 ? '' : 's'}`} />
            </div>
          </Card>
        ))}
        {!rows.length && <Empty>
          {isBrand ? 'You have not published a brief yet.' : 'No open briefs right now.'}
        </Empty>}
      </div>
    </div>
  );
}

const BRIEF_TONE = { published: 'green', draft: 'amber', closed: 'grey', withdrawn: 'red' };
const BriefStatus = ({ status }) => (
  <Badge tone={BRIEF_TONE[status] || 'grey'}>{status === 'published' ? 'open' : status}</Badge>
);

const APP_TONE = { awarded: 'green', shortlisted: 'amber', rejected: 'grey', submitted: 'navy' };

export function BriefDetail({ briefId, user, go, refresh }) {
  const [b, setB] = useState(null);
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [fee, setFee] = useState('300000');

  const load = () => api(`/briefs/${briefId}`).then(setB).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [briefId]);
  if (!b) return <div className="page"><Empty>{err || 'Loading…'}</Empty></div>;

  const isOwner = b.is_owner;
  const isCreator = user.role === 'creator';
  const myApplication = isCreator ? b.applications[0] : null;

  const act = async (fn) => {
    setErr('');
    try { await fn(); load(); refresh?.(); } catch (e) { setErr(e.message); }
  };

  const apply = (e) => {
    e.preventDefault();
    act(() => api(`/briefs/${briefId}/apply`, { method: 'POST', body: {
      cover_note: note, proposed_fee_minor: toMinor(fee) } }));
  };

  const setBriefStatus = (status) =>
    act(() => api(`/briefs/${briefId}/status`, { method: 'POST', body: { status } }));

  const setAppStatus = (applicationId, status) =>
    act(() => api(`/applications/${applicationId}/status`, { method: 'POST', body: { status } }));

  const award = (applicationId) =>
    act(async () => {
      const res = await api(`/applications/${applicationId}/award`, { method: 'POST' });
      go(`/contracts/${res.contract_id}`);
    });

  return (
    <div className="page">
      <BackLink onClick={() => go('/briefs')}>Back to briefs</BackLink>
      <Banner tone="err">{err}</Banner>

      <Card className="lead">
        <div className="row" style={{ gap: 10 }}>
          <h1 style={{ margin: 0 }}>{b.title}</h1>
          <BriefStatus status={b.status} />
          <div className="spacer" />
          {isOwner && b.status === 'draft' && (
            <Button variant="accent" size="sm" onClick={() => setBriefStatus('published')}>
              Publish brief
            </Button>
          )}
          {isOwner && b.status === 'published' && (
            <Button variant="outline" size="sm" onClick={() => setBriefStatus('closed')}>
              Close to applications
            </Button>
          )}
        </div>
        <div className="small muted" style={{ marginTop: 4 }}>
          {b.legal_name} · budget {money(b.budget_min_minor, b.currency_code)}–{money(b.budget_max_minor, b.currency_code)}
          {' · '}{b.application_count} application{b.application_count === 1 ? '' : 's'}
        </div>
        <div className="row small" style={{ gap: 8, marginTop: 6 }}>
          <Rating mean={b.mean_rating} count={b.review_count} />
          <span className="muted">· {b.brand_completed_contracts} completed contract{b.brand_completed_contracts === 1 ? '' : 's'} on TalentHub</span>
        </div>
        <p style={{ marginTop: 12, marginBottom: 0 }}>{b.description}</p>
        {isOwner && b.status === 'draft' && (
          <p className="tiny muted" style={{ marginTop: 10, marginBottom: 0 }}>
            Only you can see this draft. Creators cannot find or apply to it until you publish it.
          </p>
        )}
      </Card>

      {!isOwner && <ReviewList title={`What creators say about ${b.legal_name}`}
                               reviews={b.brand_reviews} />}

      {isCreator && myApplication && (
        <>
          <SectionLabel>Your application</SectionLabel>
          <Card>
            <div className="row" style={{ gap: 10 }}>
              <span className="figure-v">{money(myApplication.proposed_fee_minor, b.currency_code)}</span>
              <Badge tone={APP_TONE[myApplication.status]}>{myApplication.status}</Badge>
            </div>
            {myApplication.cover_note &&
              <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>{myApplication.cover_note}</p>}
            {myApplication.status === 'awarded' && (
              <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>
                You were awarded this brief. <a href="#/contracts">Review and accept the contract →</a>
              </p>
            )}
          </Card>
        </>
      )}

      {isCreator && !myApplication && b.status === 'published' && (
        <>
          <SectionLabel>Apply</SectionLabel>
          <Card>
            <form onSubmit={apply}>
              <Field label="Why you">
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                          placeholder="Relevant work, how you would approach it, turnaround…" />
              </Field>
              <Field label="Your fee (₦)"
                     hint="The brand funds this into escrow before you begin.">
                <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
              </Field>
              <Button variant="accent">Submit application</Button>
            </form>
          </Card>
        </>
      )}

      {isOwner && (
        <>
          <SectionLabel count={b.applications.length}>Applications</SectionLabel>
          <div className="stack">
            {b.applications.map((a) => {
              const open = ['submitted', 'shortlisted'].includes(a.status);
              return (
                <Card key={a.application_id}>
                  <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                    <Avatar name={a.display_name} />
                    <div style={{ flex: 1 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <a className="plain" href={`#/creators/${a.creator_id}`}>
                          <strong>{a.display_name}</strong>
                        </a>
                        <KycBadge status={a.kyc_status} />
                        <Badge tone={APP_TONE[a.status]}>{a.status}</Badge>
                      </div>
                      <div className="small muted">
                        {a.primary_discipline} · {a.city}, {a.country_code}
                      </div>
                      <p className="small" style={{ marginTop: 6, marginBottom: 0 }}>
                        {a.cover_note}
                      </p>
                    </div>
                    <Figure value={money(a.proposed_fee_minor, b.currency_code)} caption="proposed fee">
                      {open && (
                        <div className="stack" style={{ gap: 6, marginTop: 10, alignItems: 'flex-end' }}>
                          <Button variant="accent" size="sm" onClick={() => award(a.application_id)}>
                            Award this creator
                          </Button>
                          <div className="row" style={{ gap: 6 }}>
                            {a.status === 'submitted' && (
                              <Button variant="outline" size="sm"
                                      onClick={() => setAppStatus(a.application_id, 'shortlisted')}>
                                Shortlist
                              </Button>
                            )}
                            <Button variant="quiet" size="sm"
                                    onClick={() => setAppStatus(a.application_id, 'rejected')}>
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </Figure>
                  </div>
                </Card>
              );
            })}
            {!b.applications.length && <Empty>No applications yet.</Empty>}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- contracts
export function Contracts({ user, go }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { api('/contracts').then(setRows).catch(() => {}); }, []);
  const isBrand = user.role === 'brand';

  const needsMe = (c) => c.milestones.some((m) =>
    isBrand ? ['pending', 'submitted'].includes(m.status) : m.status === 'in_progress');

  const group = (list, label, tone) => list.length > 0 && (
    <>
      <SectionLabel count={list.length} style={{ color: tone }}>{label}</SectionLabel>
      <div className="stack">
        {list.map((c) => (
          <Card key={c.contract_id} onClick={() => go(`/contracts/${c.contract_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{c.brief_title}</h3>
                <div className="small muted">
                  {isBrand ? c.display_name : c.legal_name} · {c.milestones.length} milestones
                </div>
                <div className="row" style={{ gap: 6, marginTop: 8 }}>
                  {c.milestones.map((m) => (
                    <MilestoneBadge key={m.milestone_id} status={m.status} />
                  ))}
                </div>
              </div>
              <Figure size="sm" value={money(c.agreed_fee_minor, c.currency_code)}>
                {c.escrow_held_minor > 0 && (
                  <div className="tiny" style={{ color: 'var(--amber)', fontWeight: 700 }}>
                    {money(c.escrow_held_minor, c.currency_code)} in escrow
                  </div>
                )}
              </Figure>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <div className="page">
      <PageHeader eyebrow={isBrand ? 'Hiring' : 'My work'} title="Contracts"
                  lede="Grouped by what needs your attention." />
      {/* FR-26 — an unaccepted contract needs the creator; the brand just waits. */}
      {group(rows.filter((c) => (c.status === 'pending_acceptance' && !isBrand) ||
                                (c.status === 'active' && needsMe(c))),
             'Awaiting your action', 'var(--amber)')}
      {group(rows.filter((c) => c.status === 'pending_acceptance' && isBrand),
             'Waiting for the creator to accept', 'var(--grey)')}
      {group(rows.filter((c) => c.status === 'active' && !needsMe(c)),
             'In progress', 'var(--grey)')}
      {group(rows.filter((c) => c.status === 'completed'), 'Completed', 'var(--green)')}
      {group(rows.filter((c) => c.status === 'cancelled'), 'Cancelled', 'var(--grey)')}
      {!rows.length && <Empty>No contracts yet. Award a brief to create one.</Empty>}
    </div>
  );
}

export function ContractDetail({ contractId, user, go, refresh }) {
  const [c, setC] = useState(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [showLedger, setShowLedger] = useState({});
  const isBrand = user.role === 'brand';

  const load = () => api(`/contracts/${contractId}`).then(setC).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [contractId]);
  if (!c) return <div className="page"><Empty>{err || 'Loading…'}</Empty></div>;

  const live = c.status === 'active';
  // FR-34 — cancellable only while nothing has been funded.
  const cancellable = ['pending_acceptance', 'active'].includes(c.status) &&
    c.milestones.every((m) => m.status === 'pending');

  const act = async (fn, message) => {
    setErr(''); setOk('');
    try {
      const res = await fn();
      if (res?.contract) setC(res.contract); else await load();
      setOk(message);
      refresh?.();
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="page">
      <BackLink onClick={() => go('/contracts')}>Back to contracts</BackLink>
      <Banner tone="err">{err}</Banner>
      <Banner tone="ok">{ok}</Banner>

      <Card className="lead">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: 2 }}>{c.brief_title}</h1>
            <div className="small muted">
              {c.legal_name} → {c.display_name} · {c.primary_discipline}
            </div>
          </div>
          <Figure size="lg" value={money(c.agreed_fee_minor, c.currency_code)}
                  caption={`agreed fee · ${(c.commission_rate * 100).toFixed(0)}% platform commission`}>
            <div style={{ marginTop: 6 }}><ContractStatus status={c.status} /></div>
          </Figure>
        </div>
      </Card>

      {c.status === 'pending_acceptance' && !isBrand && (
        <Card className="notice">
          <strong>{c.legal_name} has awarded you this work.</strong>
          <p className="small" style={{ margin: '6px 0 12px' }}>
            Accepting makes the contract binding: the fee, the {(c.commission_rate * 100).toFixed(0)}%
            platform commission and the milestones below. The brand can fund milestone 1
            into escrow once you accept.
          </p>
          <div className="row">
            <Button variant="accent" onClick={() => act(
              () => api(`/contracts/${c.contract_id}/accept`, { method: 'POST' }),
              'Contract accepted. The brand can now fund the first milestone.')}>
              Accept contract
            </Button>
            <CancelButton label="Decline" c={c} act={act} />
          </div>
        </Card>
      )}

      {c.status === 'pending_acceptance' && isBrand && (
        <Banner tone="info">
          Waiting for {c.display_name} to accept the contract. You can fund milestones once they do.
        </Banner>
      )}

      {c.status === 'cancelled' && (
        <Banner tone="info">This contract was cancelled before any money moved.</Banner>
      )}

      {c.reviews && <ReviewPanel c={c} isBrand={isBrand} act={act} />}

      <SectionLabel count={c.milestones.length}>Milestones</SectionLabel>
      <div className="stack">
        {c.milestones.map((m) => {
          const done = m.status === 'accepted';
          const active = ['funded', 'in_progress', 'submitted'].includes(m.status);
          return (
            <div key={m.milestone_id}
                 className={'milestone' + (done ? ' done' : active ? ' active' : '')}>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <strong>Milestone {m.sequence_no} — {m.description}</strong>
                    <MilestoneBadge status={m.status} />
                  </div>
                  {m.revision_count > 0 && (
                    <div className="tiny muted" style={{ marginTop: 4 }}>
                      {2 - m.revision_count} of 2 revisions remaining
                    </div>
                  )}
                </div>
                <Figure size="sm" value={money(m.amount_minor, c.currency_code)} />
              </div>

              <Flow status={m.status} />

              {m.status === 'pending' && isBrand && live && (
                <div className="fund-box">
                  <div className="money-line">
                    <span>Milestone amount</span>
                    <span>{money(m.amount_minor, c.currency_code)}</span>
                  </div>
                  <div className="money-line">
                    <span>Platform commission ({(c.commission_rate * 100).toFixed(0)}%)</span>
                    <span>− {money(m.commission_minor, c.currency_code)}</span>
                  </div>
                  <div className="money-line total">
                    <span>Creator receives</span>
                    <span>{money(m.net_minor, c.currency_code)}</span>
                  </div>
                  <Button variant="escrow" block style={{ marginTop: 12 }}
                          onClick={() => act(
                            () => api(`/milestones/${m.milestone_id}/fund`, { method: 'POST' }),
                            `${money(m.amount_minor, c.currency_code)} is now held in escrow.`)}>
                    <Icon name="lock" size={15} /> Fund {money(m.amount_minor, c.currency_code)} into escrow
                  </Button>
                </div>
              )}

              {m.status === 'pending' && !isBrand && live && (
                <p className="small muted" style={{ marginBottom: 0 }}>
                  Waiting for the brand to fund this milestone. Do not start work until
                  the money is in escrow.
                </p>
              )}

              {['funded', 'in_progress'].includes(m.status) && !isBrand && (
                <SubmitForm milestone={m} act={act} />
              )}

              {['funded', 'in_progress'].includes(m.status) && isBrand && (
                <p className="small muted" style={{ marginBottom: 0 }}>
                  Money is held in escrow. {c.display_name} is working.
                </p>
              )}

              {m.deliverables.length > 0 && (
                <>
                  <SectionLabel style={{ marginTop: 16 }}>Submitted deliverables</SectionLabel>
                  {m.deliverables.map((d) => (
                    <div key={d.deliverable_id} className="row small list-row">
                      <span><strong>{d.title}</strong> <span className="muted">{d.note}</span></span>
                      <span className="tiny muted">{d.created_at}</span>
                    </div>
                  ))}
                </>
              )}

              {m.status === 'submitted' && isBrand && (
                <div className="row" style={{ marginTop: 12 }}>
                  <Button variant="accent" onClick={() => act(
                    () => api(`/milestones/${m.milestone_id}/accept`, { method: 'POST' }),
                    `Accepted. ${money(m.net_minor, c.currency_code)} released to ${c.display_name}.`)}>
                    Accept and release payment
                  </Button>
                  <Button variant="outline" disabled={m.revision_count >= 2}
                          onClick={() => act(
                            () => api(`/milestones/${m.milestone_id}/revise`, {
                              method: 'POST', body: { reason: 'Changes requested' } }),
                            'Revision requested.')}>
                    Request revision
                  </Button>
                  {m.revision_count >= 2 && (
                    <span className="tiny muted">Revision limit reached (FR-30)</span>
                  )}
                </div>
              )}

              {m.status === 'submitted' && !isBrand && (
                <p className="small muted" style={{ marginBottom: 0 }}>
                  Submitted. Waiting for {c.legal_name} to review.
                </p>
              )}

              {m.dispute && <DisputeNote d={m.dispute} m={m} c={c} isBrand={isBrand} />}
              {m.status === 'submitted' && <RaiseDispute m={m} act={act} />}

              <div style={{ marginTop: 12 }}>
                <Button variant="quiet" size="sm"
                        onClick={() => setShowLedger({ ...showLedger,
                                                       [m.milestone_id]: !showLedger[m.milestone_id] })}>
                  {showLedger[m.milestone_id] ? 'Hide' : 'Show'} ledger postings ({m.ledger.length})
                </Button>
                {showLedger[m.milestone_id] && (
                  <div style={{ marginTop: 8 }}>
                    <LedgerTable entries={m.ledger} currency={c.currency_code} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cancellable && !(c.status === 'pending_acceptance' && !isBrand) && (
        <div className="row" style={{ marginTop: 16 }}>
          <CancelButton label="Cancel contract" c={c} act={act} />
          <span className="tiny muted">
            Possible until a milestone is funded. After that, only a dispute can unwind it.
          </span>
        </div>
      )}
    </div>
  );
}

/** FR-35 — either party can freeze a submitted milestone and hand it to an administrator. */
function RaiseDispute({ m, act }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  if (!open) return (
    <div style={{ marginTop: 10 }}>
      <Button variant="quiet" size="sm" onClick={() => setOpen(true)}>Raise a dispute…</Button>
    </div>
  );
  return (
    <div className="dispute-box">
      <strong className="small">Raise a dispute</strong>
      <p className="tiny muted" style={{ margin: '4px 0 8px' }}>
        The milestone is frozen — nothing can be submitted, revised or accepted — and the
        money stays in escrow until a TalentHub administrator rules. They can release it,
        refund it, or split it. The ruling is final.
      </p>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="What went wrong, and what outcome you think is fair" />
      <div className="row" style={{ marginTop: 8 }}>
        <Button variant="danger" disabled={reason.trim().length < 10} onClick={() => act(
          () => api(`/milestones/${m.milestone_id}/dispute`, { method: 'POST', body: { reason } }),
          'Dispute raised. The milestone is frozen until an administrator rules.')}>
          Freeze milestone and raise dispute
        </Button>
        <Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

const OUTCOME_TEXT = {
  release: 'released in full to the creator',
  refund: 'refunded in full to the brand',
  split: 'split between creator and brand',
};

function DisputeNote({ d, m, c, isBrand }) {
  const raisedByMe = (d.raised_by_role === 'brand') === isBrand;
  const who = raisedByMe ? 'You' : d.raised_by_role === 'brand' ? c.legal_name : c.display_name;
  return (
    <div className={'dispute-box' + (d.status === 'open' ? '' : ' resolved')}>
      <div className="row" style={{ gap: 8 }}>
        <Badge tone={d.status === 'open' ? 'red' : 'grey'}>
          {d.status === 'open' ? 'dispute open' : 'dispute resolved'}
        </Badge>
        <span className="tiny muted">raised by {who} · {d.created_at}</span>
      </div>
      <p className="small" style={{ margin: '8px 0 0' }}>“{d.reason}”</p>
      {d.status === 'open' ? (
        <p className="tiny muted" style={{ margin: '8px 0 0' }}>
          {money(m.amount_minor, c.currency_code)} is frozen in escrow until a TalentHub
          administrator rules.
        </p>
      ) : (
        <p className="small" style={{ margin: '8px 0 0' }}>
          <strong>Ruling:</strong> {OUTCOME_TEXT[d.outcome]}
          {d.outcome === 'split' && ` — ${money(d.creator_share_minor, c.currency_code)} to the creator (before commission), the rest to the brand`}.
          <span className="muted"> “{d.resolution_note}”</span>
        </p>
      )}
    </div>
  );
}

/** FR-37 — published reviews, newest first. Renders nothing when there are none. */
function ReviewList({ title, reviews }) {
  if (!reviews?.length) return null;
  return (
    <>
      <SectionLabel count={reviews.length}>{title}</SectionLabel>
      <Card>
        {reviews.map((r, i) => (
          <div key={i} className="review">
            <div className="row" style={{ gap: 8 }}>
              <span className="rating"><span aria-hidden="true">{'★'.repeat(r.rating)}</span>
                <span className="sr-only">{r.rating} of 5</span></span>
              <strong className="small">{r.reviewer_name}</strong>
              <span className="tiny muted">· {r.brief_title} · {r.created_at.slice(0, 10)}</span>
            </div>
            <p className="small" style={{ margin: '4px 0 0' }}>{r.body}</p>
          </div>
        ))}
      </Card>
    </>
  );
}

/**
 * FR-37 — the two-way review on a completed contract. The other side's review
 * stays sealed until you submit yours or the 14-day window closes; the server
 * never sends its content before then.
 */
function ReviewPanel({ c, isBrand, act }) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const r = c.reviews;
  const other = isBrand ? c.display_name : c.legal_name;

  return (
    <Card style={{ marginTop: 12 }}>
      <h3 style={{ marginBottom: 4 }}>Reviews</h3>

      {r.can_review ? (
        <>
          <p className="small muted" style={{ marginTop: 0 }}>
            How was working with {other}? {r.theirs?.submitted
              ? `They have already reviewed you — yours unlocks theirs.`
              : `Neither review is shown until you both submit, or until ${r.window_closes_at.slice(0, 10)}.`}
          </p>
          <StarInput value={rating} onChange={setRating} name={`rate-${c.contract_id}`} />
          <textarea style={{ marginTop: 8 }} value={body} onChange={(e) => setBody(e.target.value)}
                    placeholder={isBrand ? 'Quality of the work, communication, timing…'
                                         : 'Clarity of the brief, feedback, payment…'} />
          <Button variant="accent" style={{ marginTop: 10 }} disabled={!rating || !body.trim()} onClick={() => act(
            () => api(`/contracts/${c.contract_id}/review`, { method: 'POST', body: { rating, body } }),
            'Thanks — your review is in.')}>
            Submit review
          </Button>
        </>
      ) : !r.mine && (
        <p className="small muted" style={{ marginTop: 0 }}>The 14-day review window has closed.</p>
      )}

      {r.mine && (
        <div className="review">
          <div className="tiny muted">Your review of {other}</div>
          <span className="rating">{'★'.repeat(r.mine.rating)}</span>
          <p className="small" style={{ margin: '4px 0 0' }}>{r.mine.body}</p>
        </div>
      )}
      {r.theirs && (
        <div className="review">
          <div className="tiny muted">{other}’s review of you</div>
          {r.theirs.submitted
            ? <p className="small muted" style={{ margin: '4px 0 0' }}>
                Submitted — sealed until you review, or until {r.window_closes_at.slice(0, 10)}.
              </p>
            : <>
                <span className="rating">{'★'.repeat(r.theirs.rating)}</span>
                <p className="small" style={{ margin: '4px 0 0' }}>{r.theirs.body}</p>
              </>}
        </div>
      )}
    </Card>
  );
}

const CONTRACT_STATUS = {
  pending_acceptance: ['amber', 'awaiting acceptance'], active: ['navy', 'active'],
  completed: ['green', 'completed'], cancelled: ['grey', 'cancelled'], disputed: ['red', 'disputed'],
};
const ContractStatus = ({ status }) => {
  const [tone, label] = CONTRACT_STATUS[status] || ['grey', status];
  return <Badge tone={tone}>{label}</Badge>;
};

/** FR-34 — a two-step button: the second click confirms, so a stray click cannot cancel. */
function CancelButton({ label, c, act }) {
  const [armed, setArmed] = useState(false);
  if (!armed) return <Button variant="outline" onClick={() => setArmed(true)}>{label}</Button>;
  return (
    <span className="row" style={{ gap: 6 }}>
      <Button variant="danger" onClick={() => act(
        () => api(`/contracts/${c.contract_id}/cancel`, { method: 'POST' }),
        'Contract cancelled. No money had moved.')}>
        Yes, {label.toLowerCase()}
      </Button>
      <Button variant="quiet" onClick={() => setArmed(false)}>Keep it</Button>
    </span>
  );
}

function SubmitForm({ milestone, act }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      act(() => api(`/milestones/${milestone.milestone_id}/submit`, {
        method: 'POST', body: { title: title || 'Deliverable', note } }),
        'Submitted for review.');
      setTitle(''); setNote('');
    }}>
      <div className="field-row">
        <Field label="What are you delivering">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
                 placeholder="First cut — master plus verticals" />
        </Field>
        <Field label="Note to the brand">
          <input value={note} onChange={(e) => setNote(e.target.value)}
                 placeholder="Anything they should know" />
        </Field>
      </div>
      <Button variant="accent">Submit for review</Button>
    </form>
  );
}

// ---------------------------------------------------------------- creator money
export function Money({ refresh }) {
  const [bal, setBal] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const load = async () => {
    setBal(await api('/creator/balance'));
    setPayouts(await api('/payouts'));
  };
  useEffect(() => { load().catch((e) => setErr(e.message)); }, []);

  const withdraw = async () => {
    setErr(''); setOk('');
    try {
      const res = await api('/payouts', { method: 'POST' });
      setOk(`${money(res.amount_minor)} sent. Reference ${res.reference}.`);
      await load(); refresh?.();
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="page">
      <PageHeader eyebrow="Earnings" title="Money"
                  lede="Released funds land here, ready to withdraw." />
      <Banner tone="err">{err}</Banner>
      <Banner tone="ok">{ok}</Banner>

      <div className="grid three">
        <Stat k="Available to withdraw" v={money(bal?.available_minor ?? 0)}
              sub="released from escrow on acceptance" />
        <Stat k="Withdrawn to date" v={money(bal?.paid_out_minor ?? 0)}
              sub={`${payouts.length} payout${payouts.length === 1 ? '' : 's'}`} />
        <div className="stat">
          <div className="k">Withdraw</div>
          <Button variant="accent" size="lg" block style={{ marginTop: 10 }}
                  disabled={!bal?.available_minor} onClick={withdraw}>
            Withdraw everything
          </Button>
          <div className="tiny muted" style={{ marginTop: 6 }}>
            Bank account ····4417
          </div>
        </div>
      </div>

      <SectionLabel count={payouts.length}>Payout history</SectionLabel>
      <Card>
        {payouts.length ? (
          <table>
            <thead>
              <tr><th>When</th><th>Destination</th><th>Reference</th>
                  <th className="num">Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.payout_id}>
                  <td className="small">{p.created_at}</td>
                  <td className="small">{p.destination}</td>
                  <td className="mono">{p.reference}</td>
                  <td className="num">{money(p.amount_minor)}</td>
                  <td><Badge tone="green">{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="small muted" style={{ margin: 0 }}>No withdrawals yet.</p>}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- audit
export function LedgerPage() {
  const [entries, setEntries] = useState([]);
  const [rec, setRec] = useState(null);
  useEffect(() => {
    api('/ledger').then(setEntries).catch(() => {});
    api('/ledger/reconcile').then(setRec).catch(() => {});
  }, []);

  return (
    <div className="page">
      <PageHeader eyebrow="Audit" title="Ledger"
                  lede="Every movement of money, append-only and double entry." />

      {rec && (
        <Banner tone={rec.balanced ? 'ok' : 'err'}>
          {rec.balanced
            ? 'Reconciliation passed — every transaction balances.'
            : `${rec.unbalanced.length} transaction(s) do not balance.`}
        </Banner>
      )}

      <div className="grid three" style={{ marginBottom: 14 }}>
        {rec?.totals?.map((t) => (
          <Stat key={t.account_type} k={t.account_type.replace(/_/g, ' ')}
                v={money(Math.abs(t.net))} />
        ))}
      </div>

      <Card>
        <table>
          <thead>
            <tr><th>#</th><th>Account</th><th>Dr/Cr</th><th className="num">Amount</th>
                <th>Memo</th><th>When</th></tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.entry_id}>
                <td className="mono">{e.entry_id}</td>
                <td className="mono">{e.account_type}</td>
                <td>
                  <Badge tone={e.direction === 'debit' ? 'navy' : 'green'}>
                    {e.direction === 'debit' ? 'Dr' : 'Cr'}
                  </Badge>
                </td>
                <td className="num">{money(e.amount_minor, e.currency_code)}</td>
                <td className="small muted">{e.memo}</td>
                <td className="tiny muted">{e.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!entries.length && <p className="small muted" style={{ margin: 0 }}>
          Nothing posted yet. Fund a milestone to see the first entries.
        </p>}
      </Card>
    </div>
  );
}
