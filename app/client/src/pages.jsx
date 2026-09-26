import React, { useEffect, useState } from 'react';
import { api, money, titleCase } from './api.js';
import {
  Avatar, Badge, Banner, Empty, Field, Flow, KycBadge, LedgerTable,
  MetricBadge, MilestoneBadge, Stat,
} from './components/ui.jsx';

const DEMO = [
  ['brand@sterling.example', 'Sterling Foods', 'brand — hires creators'],
  ['amara@talenthub.africa', 'Amara Okonkwo', 'creator — motion design, Lagos'],
  ['zola@talenthub.africa', 'Zola Mthembu', 'creator — video editing, Nairobi'],
];

// ---------------------------------------------------------------- sign in
export function SignIn({ onSignedIn }) {
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
        body: { email: asEmail || email, password: 'password123' },
      });
      onSignedIn(res);
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };

  return (
    <div className="signin">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ color: 'var(--navy)', marginBottom: 2 }}>TalentHub</h1>
        <p className="muted small">
          Creator–brand marketplace for the African digital creator economy
        </p>
      </div>
      <div className="card">
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
          <button disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="section-label">Or sign in as a demo account</div>
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
        <p className="tiny muted" style={{ marginTop: 12, marginBottom: 0 }}>
          Every seeded account uses the password <code>password123</code>.
        </p>
      </div>
    </div>
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
      <div className="page-head">
        <div>
          <h1>Find a creator</h1>
          <p>Verified profiles carrying both portfolio work and audience figures.</p>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div style={{ flex: 2, minWidth: 200 }}>
            <input placeholder="Search name or biography…" value={f.q}
                   onChange={(e) => setF({ ...f, q: e.target.value })} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <select value={f.discipline}
                    onChange={(e) => setF({ ...f, discipline: e.target.value })}>
              <option value="">Any discipline</option>
              {disciplines.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <select value={f.country}
                    onChange={(e) => setF({ ...f, country: e.target.value })}>
              <option value="">Any country</option>
              <option value="NG">Nigeria</option>
              <option value="GH">Ghana</option>
              <option value="KE">Kenya</option>
              <option value="MA">Morocco</option>
            </select>
          </div>
          <label className="row small" style={{ gap: 6, marginBottom: 0 }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={f.verified}
                   onChange={(e) => setF({ ...f, verified: e.target.checked })} />
            ID verified only
          </label>
        </div>
      </div>

      <div className="section-label">{rows.length} creators</div>
      <div className="grid two">
        {rows.map((c) => (
          <div key={c.profile_id} className="card clickable"
               onClick={() => go(`/creators/${c.profile_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Avatar name={c.display_name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{c.display_name}</strong>
                <div className="small muted">
                  {c.primary_discipline} · {c.city}, {c.country_code}
                </div>
                <div className="row" style={{ gap: 6, marginTop: 6 }}>
                  <KycBadge status={c.kyc_status} />
                  {c.social.slice(0, 2).map((s) => (
                    <span key={s.platform} className="row tiny" style={{ gap: 4 }}>
                      <strong>{(s.follower_count / 1000).toFixed(1)}k</strong>
                      <MetricBadge source={s.metrics_source} />
                    </span>
                  ))}
                </div>
                <div className="small" style={{ marginTop: 8 }}>
                  {money(c.day_rate_minor, c.currency_code)} / day
                  {c.completed_contracts > 0 &&
                    <span className="muted"> · {c.completed_contracts} completed</span>}
                </div>
              </div>
            </div>
          </div>
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
      <button className="quiet small" onClick={() => go('/discover')}>← Back to search</button>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <Avatar name={c.display_name} lg />
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 2 }}>{c.display_name}</h2>
            <div className="muted small">
              {c.primary_discipline} · {c.city}, {c.country_code}
            </div>
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              <KycBadge status={c.kyc_status} />
              {c.engagement_modes.split(',').map((m) => (
                <Badge key={m} tone="navy">{m === 'reach' ? 'reach campaigns' : 'commissioned work'}</Badge>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {money(c.day_rate_minor, c.currency_code)}
            </div>
            <div className="tiny muted">per day</div>
          </div>
        </div>
        <p className="small" style={{ marginTop: 14, marginBottom: 0 }}>{c.biography}</p>
      </div>

      <div className="section-label">Portfolio</div>
      <div className="grid three">
        {c.portfolio.map((p) => (
          <div key={p.item_id} className="card">
            <div className="thumb" style={{ marginBottom: 8 }}>{p.media_type}</div>
            <strong className="small">{p.title}</strong>
            <div className="tiny muted">{p.role_played}</div>
          </div>
        ))}
        {!c.portfolio.length && <Empty>No portfolio items yet.</Empty>}
      </div>

      <div className="section-label">Audience</div>
      <div className="card">
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
      </div>
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
    try {
      await api('/briefs', { method: 'POST', body: {
        title: form.title,
        description: form.description,
        engagement_mode: form.engagement_mode,
        budget_min_minor: Math.round(Number(form.budget_min) * 100),
        budget_max_minor: Math.round(Number(form.budget_max) * 100),
      } });
      setOpen(false);
      setForm({ ...form, title: '', description: '' });
      load();
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{isBrand ? 'Your briefs' : 'Open briefs'}</h1>
          <p>{isBrand ? 'Work you have put out to the market.'
                      : 'Work brands are looking to commission.'}</p>
        </div>
        <div className="spacer" />
        {isBrand && <button onClick={() => setOpen(!open)}>
          {open ? 'Cancel' : '+ New brief'}
        </button>}
      </div>

      <Banner tone="err">{err}</Banner>

      {open && (
        <div className="card" style={{ marginBottom: 14 }}>
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
            <button>Publish brief</button>
          </form>
        </div>
      )}

      <div className="stack">
        {rows.map((b) => (
          <div key={b.brief_id} className="card clickable" onClick={() => go(`/briefs/${b.brief_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="row" style={{ gap: 8 }}>
                  <strong>{b.title}</strong>
                  <Badge tone={b.engagement_mode === 'reach' ? 'navy' : 'grey'}>
                    {b.engagement_mode === 'reach' ? 'reach' : 'commission'}
                  </Badge>
                  <Badge tone={b.status === 'published' ? 'green' : 'grey'}>{b.status}</Badge>
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>{b.legal_name}</div>
                <p className="small" style={{ marginTop: 6, marginBottom: 0 }}>
                  {b.description.slice(0, 150)}{b.description.length > 150 ? '…' : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>
                  {money(b.budget_min_minor, b.currency_code)}–{money(b.budget_max_minor, b.currency_code)}
                </div>
                <div className="tiny muted">{b.application_count} application{b.application_count === 1 ? '' : 's'}</div>
              </div>
            </div>
          </div>
        ))}
        {!rows.length && <Empty>
          {isBrand ? 'You have not published a brief yet.' : 'No open briefs right now.'}
        </Empty>}
      </div>
    </div>
  );
}

export function BriefDetail({ briefId, user, go, refresh }) {
  const [b, setB] = useState(null);
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [fee, setFee] = useState('300000');
  const isBrand = user.role === 'brand';

  const load = () => api(`/briefs/${briefId}`).then(setB).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [briefId]);
  if (!b) return <div className="page"><Empty>Loading…</Empty></div>;

  const act = async (fn) => {
    setErr('');
    try { await fn(); load(); refresh?.(); } catch (e) { setErr(e.message); }
  };

  const apply = (e) => {
    e.preventDefault();
    act(() => api(`/briefs/${briefId}/apply`, { method: 'POST', body: {
      cover_note: note, proposed_fee_minor: Math.round(Number(fee) * 100) } }));
  };

  const award = (applicationId) =>
    act(async () => {
      const res = await api(`/applications/${applicationId}/award`, { method: 'POST' });
      go(`/contracts/${res.contract_id}`);
    });

  return (
    <div className="page">
      <button className="quiet small" onClick={() => go('/briefs')}>← Back to briefs</button>
      <Banner tone="err">{err}</Banner>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ gap: 8 }}>
          <h2 style={{ margin: 0 }}>{b.title}</h2>
          <Badge tone={b.status === 'published' ? 'green' : 'grey'}>{b.status}</Badge>
        </div>
        <div className="small muted" style={{ marginTop: 4 }}>
          {b.legal_name} · budget {money(b.budget_min_minor, b.currency_code)}–{money(b.budget_max_minor, b.currency_code)}
        </div>
        <p style={{ marginTop: 12, marginBottom: 0 }}>{b.description}</p>
      </div>

      {!isBrand && b.status === 'published' && (
        <>
          <div className="section-label">Apply</div>
          <div className="card">
            <form onSubmit={apply}>
              <Field label="Why you">
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                          placeholder="Relevant work, how you would approach it, turnaround…" />
              </Field>
              <Field label="Your fee (₦)"
                     hint="The brand funds this into escrow before you begin.">
                <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
              </Field>
              <button>Submit application</button>
            </form>
          </div>
        </>
      )}

      {isBrand && (
        <>
          <div className="section-label">Applications ({b.applications.length})</div>
          <div className="stack">
            {b.applications.map((a) => (
              <div key={a.application_id} className="card">
                <div className="row" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                  <Avatar name={a.display_name} />
                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong>{a.display_name}</strong>
                      <KycBadge status={a.kyc_status} />
                      <Badge tone={a.status === 'awarded' ? 'green'
                                 : a.status === 'rejected' ? 'grey' : 'navy'}>
                        {a.status}
                      </Badge>
                    </div>
                    <div className="small muted">
                      {a.primary_discipline} · {a.city}, {a.country_code}
                    </div>
                    <p className="small" style={{ marginTop: 6, marginBottom: 0 }}>
                      {a.cover_note}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>
                      {money(a.proposed_fee_minor, b.currency_code)}
                    </div>
                    {a.status === 'submitted' && (
                      <button className="go small" style={{ marginTop: 8 }}
                              onClick={() => award(a.application_id)}>
                        Award this creator
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
      <div className="section-label" style={{ color: tone }}>{label}</div>
      <div className="stack">
        {list.map((c) => (
          <div key={c.contract_id} className="card clickable"
               onClick={() => go(`/contracts/${c.contract_id}`)}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <strong>{c.brief_title}</strong>
                <div className="small muted">
                  {isBrand ? c.display_name : c.legal_name} · {c.milestones.length} milestones
                </div>
                <div className="row" style={{ gap: 6, marginTop: 8 }}>
                  {c.milestones.map((m) => (
                    <MilestoneBadge key={m.milestone_id} status={m.status} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>
                  {money(c.agreed_fee_minor, c.currency_code)}
                </div>
                {c.escrow_held_minor > 0 && (
                  <div className="tiny" style={{ color: 'var(--amber)', fontWeight: 700 }}>
                    {money(c.escrow_held_minor, c.currency_code)} in escrow
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Contracts</h1>
          <p>Grouped by what needs your attention.</p>
        </div>
      </div>
      {group(rows.filter((c) => c.status === 'active' && needsMe(c)),
             'Awaiting your action', 'var(--amber)')}
      {group(rows.filter((c) => c.status === 'active' && !needsMe(c)),
             'In progress', 'var(--grey)')}
      {group(rows.filter((c) => c.status === 'completed'), 'Completed', 'var(--green)')}
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
      <button className="quiet small" onClick={() => go('/contracts')}>← Back to contracts</button>
      <Banner tone="err">{err}</Banner>
      <Banner tone="ok">{ok}</Banner>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 2 }}>{c.brief_title}</h2>
            <div className="small muted">
              {c.legal_name} → {c.display_name} · {c.primary_discipline}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {money(c.agreed_fee_minor, c.currency_code)}
            </div>
            <div className="tiny muted">
              agreed fee · {(c.commission_rate * 100).toFixed(0)}% platform commission
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">Milestones</div>
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
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{money(m.amount_minor, c.currency_code)}</div>
                </div>
              </div>

              <Flow status={m.status} />

              {m.status === 'pending' && isBrand && (
                <div style={{ background: '#fff', border: '1px solid #eccfa3',
                              borderRadius: 6, padding: 12 }}>
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
                  <button className="money" style={{ width: '100%', marginTop: 10 }}
                          onClick={() => act(
                            () => api(`/milestones/${m.milestone_id}/fund`, { method: 'POST' }),
                            `${money(m.amount_minor, c.currency_code)} is now held in escrow.`)}>
                    Fund {money(m.amount_minor, c.currency_code)} into escrow
                  </button>
                </div>
              )}

              {m.status === 'pending' && !isBrand && (
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
                  <div className="section-label" style={{ marginTop: 14 }}>
                    Submitted deliverables
                  </div>
                  {m.deliverables.map((d) => (
                    <div key={d.deliverable_id} className="row small"
                         style={{ justifyContent: 'space-between',
                                  borderBottom: '1px solid #eef0f4', padding: '6px 0' }}>
                      <span><strong>{d.title}</strong> <span className="muted">{d.note}</span></span>
                      <span className="tiny muted">{d.created_at}</span>
                    </div>
                  ))}
                </>
              )}

              {m.status === 'submitted' && isBrand && (
                <div className="row" style={{ marginTop: 12 }}>
                  <button className="go" onClick={() => act(
                    () => api(`/milestones/${m.milestone_id}/accept`, { method: 'POST' }),
                    `Accepted. ${money(m.net_minor, c.currency_code)} released to ${c.display_name}.`)}>
                    Accept and release payment
                  </button>
                  <button className="ghost" disabled={m.revision_count >= 2}
                          onClick={() => act(
                            () => api(`/milestones/${m.milestone_id}/revise`, {
                              method: 'POST', body: { reason: 'Changes requested' } }),
                            'Revision requested.')}>
                    Request revision
                  </button>
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

              <div style={{ marginTop: 12 }}>
                <button className="quiet small"
                        onClick={() => setShowLedger({ ...showLedger,
                                                       [m.milestone_id]: !showLedger[m.milestone_id] })}>
                  {showLedger[m.milestone_id] ? 'Hide' : 'Show'} ledger postings ({m.ledger.length})
                </button>
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
    </div>
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
      <button>Submit for review</button>
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
      <div className="page-head">
        <div>
          <h1>Money</h1>
          <p>Released funds land here, ready to withdraw.</p>
        </div>
      </div>
      <Banner tone="err">{err}</Banner>
      <Banner tone="ok">{ok}</Banner>

      <div className="grid three">
        <Stat k="Available to withdraw" v={money(bal?.available_minor ?? 0)}
              sub="released from escrow on acceptance" />
        <Stat k="Withdrawn to date" v={money(bal?.paid_out_minor ?? 0)}
              sub={`${payouts.length} payout${payouts.length === 1 ? '' : 's'}`} />
        <div className="stat">
          <div className="k">Withdraw</div>
          <button className="money" style={{ width: '100%', marginTop: 8 }}
                  disabled={!bal?.available_minor} onClick={withdraw}>
            Withdraw everything
          </button>
          <div className="tiny muted" style={{ marginTop: 6 }}>
            Bank account ····4417
          </div>
        </div>
      </div>

      <div className="section-label">Payout history</div>
      <div className="card">
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
      </div>
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
      <div className="page-head">
        <div>
          <h1>Ledger</h1>
          <p>Every movement of money, append-only and double entry.</p>
        </div>
      </div>

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

      <div className="card">
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
      </div>
    </div>
  );
}
