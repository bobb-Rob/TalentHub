import React, { useEffect, useState } from 'react';
import { api, titleCase, COUNTRIES, CURRENCIES, symbolOf, toMinor } from './api.js';
import { Badge, Banner, Empty, Field, KycBadge, MetricBadge } from './components/ui.jsx';

const PROFICIENCY = ['beginner', 'intermediate', 'advanced', 'expert'];
const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x', 'linkedin'];

/** Shared by both editors: one busy/error/ok triple per section. */
function useAction() {
  const [state, setState] = useState({ busy: false, err: '', ok: '' });
  const run = async (fn, okMessage) => {
    setState({ busy: true, err: '', ok: '' });
    try {
      await fn();
      setState({ busy: false, err: '', ok: okMessage });
    } catch (e) {
      setState({ busy: false, err: e.message, ok: '' });
    }
  };
  return [state, run];
}

const Feedback = ({ state }) => (
  <>
    <Banner tone="err">{state.err}</Banner>
    <Banner tone="ok">{state.ok}</Banner>
  </>
);

// ---------------------------------------------------------------- creator
export function CreatorProfile({ user, onSaved, go }) {
  const p = user.profile;
  const [full, setFull] = useState(null);
  const [taxonomy, setTaxonomy] = useState([]);

  const reload = () => p && api(`/creators/${p.profile_id}`).then(setFull).catch(() => {});
  useEffect(() => { reload(); }, [p?.profile_id]);
  useEffect(() => { api('/skills').then(setTaxonomy).catch(() => {}); }, []);

  const disciplines = [...new Set(taxonomy.map((s) => s.discipline))];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{p ? 'Your profile' : 'Set up your profile'}</h1>
          <p>{p
            ? 'What brands see when they find you. Portfolio and audience sit side by side.'
            : 'Brands can find you once this is saved. You can add work and audience figures next.'}</p>
        </div>
        <div className="spacer" />
        {p && <button className="ghost" onClick={() => go(`/creators/${p.profile_id}`)}>
          View public profile
        </button>}
      </div>

      <CreatorDetails profile={p} disciplines={disciplines} onSaved={onSaved} />

      {p && full && (
        <>
          <Verification profile={full} onSaved={async () => { await onSaved(); reload(); }} />
          <Skills taxonomy={taxonomy} current={full.skills} onSaved={reload} />
          <Portfolio items={full.portfolio} onChanged={reload} />
          <Audience accounts={full.social} onChanged={reload} />
        </>
      )}
    </div>
  );
}

function CreatorDetails({ profile: p, disciplines, onSaved }) {
  const [f, setF] = useState(() => ({
    display_name: p?.display_name || '',
    biography: p?.biography || '',
    country_code: p?.country_code || 'NG',
    city: p?.city || '',
    primary_discipline: p?.primary_discipline || 'Motion design',
    languages: p?.languages || '',
    modes: (p?.engagement_modes || 'commission').split(','),
    day_rate: p?.day_rate_minor != null ? String(p.day_rate_minor / 100) : '',
    currency_code: p?.currency_code || 'NGN',
    availability: p?.availability || 'available',
  }));
  const [state, run] = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggleMode = (m) => setF({ ...f,
    modes: f.modes.includes(m) ? f.modes.filter((x) => x !== m) : [...f.modes, m] });

  const save = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/creator/profile', { method: 'PUT', body: {
        display_name: f.display_name, biography: f.biography,
        country_code: f.country_code, city: f.city,
        primary_discipline: f.primary_discipline, languages: f.languages,
        engagement_modes: f.modes, day_rate_minor: toMinor(f.day_rate),
        currency_code: f.currency_code, availability: f.availability,
      } });
      await onSaved();
    }, p ? 'Profile saved.' : 'Profile published. Now add your work and audience below.');
  };

  const allDisciplines = [...new Set([...disciplines, f.primary_discipline])];

  return (
    <div className="card">
      <h3>About you</h3>
      <Feedback state={state} />
      <form onSubmit={save}>
        <div className="field-row">
          <Field label="Display name">
            <input required value={f.display_name} onChange={set('display_name')} />
          </Field>
          <Field label="Primary discipline">
            <select value={f.primary_discipline} onChange={set('primary_discipline')}>
              {allDisciplines.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Biography">
          <textarea value={f.biography} onChange={set('biography')}
                    placeholder="What you make, who for, and how you work" />
        </Field>
        <div className="field-row">
          <Field label="Country">
            <select value={f.country_code} onChange={set('country_code')}>
              {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </Field>
          <Field label="City">
            <input value={f.city} onChange={set('city')} placeholder="Lagos" />
          </Field>
        </div>
        <Field label="Languages" hint="Separate with commas.">
          <input value={f.languages} onChange={set('languages')} placeholder="English, Yoruba" />
        </Field>
        <Field label="How brands can engage you">
          <div className="row" style={{ gap: 16 }}>
            {[['commission', 'Commissioned work — I deliver work to the client'],
              ['reach', 'Reach campaigns — I post to my own audience']].map(([m, label]) => (
              <label key={m} className="check">
                <input type="checkbox" checked={f.modes.includes(m)} onChange={() => toggleMode(m)} />
                {label}
              </label>
            ))}
          </div>
        </Field>
        <div className="field-row">
          <Field label={`Day rate (${symbolOf(f.currency_code)})`}>
            <div className="row" style={{ flexWrap: 'nowrap', gap: 6 }}>
              <input type="number" min="0" step="1" value={f.day_rate} onChange={set('day_rate')} />
              <select value={f.currency_code} onChange={set('currency_code')} style={{ width: 96 }}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Availability">
            <select value={f.availability} onChange={set('availability')}>
              <option value="available">Available for new work</option>
              <option value="limited">Limited availability</option>
              <option value="unavailable">Not taking work</option>
            </select>
          </Field>
        </div>
        <button disabled={state.busy}>{p ? 'Save profile' : 'Publish profile'}</button>
      </form>
    </div>
  );
}

// FR-06 — the KYC provider is stubbed; the button stands in for the upload.
function Verification({ profile, onSaved }) {
  const [state, run] = useAction();
  return (
    <>
      <div className="section-label">Identity verification</div>
      <div className="card">
        <Feedback state={state} />
        <div className="row">
          <KycBadge status={profile.kyc_status} />
          <span className="small muted" style={{ flex: 1 }}>
            {profile.kyc_status === 'verified'
              ? 'Brands see that your identity has been checked.'
              : 'Verified creators rank higher in search and can be paid out.'}
          </span>
          {profile.kyc_status !== 'verified' && (
            <button className="ghost" disabled={state.busy} onClick={() => run(async () => {
              await api('/creator/kyc', { method: 'POST' });
              await onSaved();
            }, 'Identity verified.')}>
              Submit ID for verification
            </button>
          )}
        </div>
        {profile.kyc_status !== 'verified' && (
          <p className="tiny muted" style={{ marginTop: 8, marginBottom: 0 }}>
            Demo: no ID provider is called, so the check passes straight away.
          </p>
        )}
      </div>
    </>
  );
}

// FR-09 — skills from the controlled taxonomy, each with a proficiency.
function Skills({ taxonomy, current, onSaved }) {
  const [picked, setPicked] = useState(() =>
    Object.fromEntries(current.map((s) => [s.skill_id, s.proficiency])));
  const [state, run] = useAction();
  const byDiscipline = taxonomy.reduce((acc, s) => {
    (acc[s.discipline] ||= []).push(s);
    return acc;
  }, {});

  const toggle = (id) => {
    const next = { ...picked };
    if (next[id]) delete next[id]; else next[id] = 'intermediate';
    setPicked(next);
  };

  const save = () => run(async () => {
    await api('/creator/skills', { method: 'PUT', body: {
      skills: Object.entries(picked).map(([skill_id, proficiency]) => ({ skill_id, proficiency })),
    } });
    onSaved();
  }, 'Skills saved.');

  return (
    <>
      <div className="section-label">Skills</div>
      <div className="card">
        <Feedback state={state} />
        <div className="grid three">
          {Object.entries(byDiscipline).map(([discipline, skills]) => (
            <div key={discipline}>
              <div className="small" style={{ fontWeight: 700, marginBottom: 6 }}>{discipline}</div>
              {skills.map((s) => (
                <div key={s.skill_id} className="row" style={{ gap: 6, marginBottom: 4, flexWrap: 'nowrap' }}>
                  <label className="check" style={{ flex: 1 }}>
                    <input type="checkbox" checked={!!picked[s.skill_id]}
                           onChange={() => toggle(s.skill_id)} />
                    {s.name}
                  </label>
                  {picked[s.skill_id] && (
                    <select className="compact" value={picked[s.skill_id]}
                            onChange={(e) => setPicked({ ...picked, [s.skill_id]: e.target.value })}>
                      {PROFICIENCY.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button style={{ marginTop: 12 }} disabled={state.busy} onClick={save}>Save skills</button>
      </div>
    </>
  );
}

// FR-10 — up to 20 items. Media files need object storage, which the MVP does
// not have, so an item is its title, type, role and description.
function Portfolio({ items, onChanged }) {
  const blank = { title: '', media_type: 'image', role_played: '', description: '' };
  const [f, setF] = useState(blank);
  const [state, run] = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/creator/portfolio', { method: 'POST', body: f });
      setF(blank);
      onChanged();
    }, 'Added to your portfolio.');
  };
  const remove = (item) => run(async () => {
    await api(`/creator/portfolio/${item.item_id}`, { method: 'DELETE' });
    onChanged();
  }, `Removed “${item.title}”.`);

  return (
    <>
      <div className="section-label">Portfolio ({items.length} of 20)</div>
      <div className="card">
        <Feedback state={state} />
        {items.length ? (
          <table>
            <thead><tr><th>Title</th><th>Type</th><th>Your role</th><th /></tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.item_id}>
                  <td><strong className="small">{it.title}</strong>
                    {it.description && <div className="tiny muted">{it.description}</div>}</td>
                  <td className="small">{it.media_type}</td>
                  <td className="small muted">{it.role_played}</td>
                  <td className="num">
                    <button className="quiet small" onClick={() => remove(it)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No work yet. Add the projects you want brands to see.</Empty>}

        {items.length < 20 && (
          <form onSubmit={add} style={{ marginTop: 14 }}>
            <div className="field-row">
              <Field label="Title">
                <input required value={f.title} onChange={set('title')}
                       placeholder="Indomie festive spot" />
              </Field>
              <Field label="Your role">
                <input value={f.role_played} onChange={set('role_played')}
                       placeholder="Director of animation" />
              </Field>
            </div>
            <div className="field-row">
              <Field label="Type">
                <select value={f.media_type} onChange={set('media_type')}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </Field>
              <Field label="Description">
                <input value={f.description} onChange={set('description')} />
              </Field>
            </div>
            <button className="ghost" disabled={state.busy}>+ Add to portfolio</button>
          </form>
        )}
      </div>
    </>
  );
}

// FR-11/12 — a figure typed in here is self-declared and labelled as such.
// Verified figures need an OAuth link to the platform, not built in the MVP.
function Audience({ accounts, onChanged }) {
  const blank = { platform: 'instagram', handle: '', followers: '', engagement: '' };
  const [f, setF] = useState(blank);
  const [state, run] = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/creator/social', { method: 'POST', body: {
        platform: f.platform, handle: f.handle,
        follower_count: f.followers === '' ? null : Math.round(Number(f.followers)),
        engagement_rate: f.engagement === '' ? null : Number(f.engagement),
      } });
      setF(blank);
      onChanged();
    }, 'Account saved. It shows as self-declared until verified.');
  };

  return (
    <>
      <div className="section-label">Audience</div>
      <div className="card">
        <Feedback state={state} />
        {accounts.length ? (
          <table>
            <thead><tr><th>Platform</th><th>Handle</th><th className="num">Followers</th>
                       <th className="num">Engagement</th><th>Source</th></tr></thead>
            <tbody>
              {accounts.map((s) => (
                <tr key={s.social_account_id}>
                  <td>{titleCase(s.platform)}</td>
                  <td className="muted">{s.handle}</td>
                  <td className="num">{s.follower_count?.toLocaleString() ?? '—'}</td>
                  <td className="num">{s.engagement_rate != null ? `${s.engagement_rate}%` : '—'}</td>
                  <td><MetricBadge source={s.metrics_source} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="small muted">No linked accounts yet.</p>}

        <form onSubmit={add} style={{ marginTop: 14 }}>
          <div className="field-row">
            <Field label="Platform">
              <select value={f.platform} onChange={set('platform')}>
                {PLATFORMS.map((pl) => <option key={pl} value={pl}>{titleCase(pl)}</option>)}
              </select>
            </Field>
            <Field label="Handle">
              <input required value={f.handle} onChange={set('handle')} placeholder="@yourname" />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Followers">
              <input type="number" min="0" step="1" value={f.followers} onChange={set('followers')} />
            </Field>
            <Field label="Engagement rate (%)">
              <input type="number" min="0" step="0.1" value={f.engagement} onChange={set('engagement')} />
            </Field>
          </div>
          <p className="tiny muted" style={{ marginTop: 0 }}>
            Figures you type in are shown to brands as <Badge tone="amber">self-declared</Badge>.
            Only a figure fetched from the platform itself is shown as verified.
          </p>
          <button className="ghost" disabled={state.busy}>Save account</button>
        </form>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- brand
export function BrandProfile({ user, onSaved }) {
  const p = user.profile;
  const [f, setF] = useState(() => ({
    legal_name: p?.legal_name || '', trading_name: p?.trading_name || '',
    country_code: p?.country_code || 'NG', sector: p?.sector || '', website: p?.website || '',
  }));
  const [state, run] = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/brand/profile', { method: 'PUT', body: f });
      await onSaved();
    }, p ? 'Organisation profile saved.' : 'Saved. You can now publish briefs.');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{p ? 'Organisation profile' : 'Set up your organisation'}</h1>
          <p>Creators see this on every brief you publish.</p>
        </div>
      </div>
      <div className="card">
        <Feedback state={state} />
        <form onSubmit={save}>
          <div className="field-row">
            <Field label="Legal name">
              <input required value={f.legal_name} onChange={set('legal_name')}
                     placeholder="Sterling Foods Ltd" />
            </Field>
            <Field label="Trading name">
              <input value={f.trading_name} onChange={set('trading_name')}
                     placeholder="Sterling Foods" />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Country">
              <select value={f.country_code} onChange={set('country_code')}>
                {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </Field>
            <Field label="Sector">
              <input value={f.sector} onChange={set('sector')} placeholder="Food & beverage" />
            </Field>
          </div>
          <Field label="Website">
            <input type="url" value={f.website} onChange={set('website')}
                   placeholder="https://example.com" />
          </Field>
          <button disabled={state.busy}>{p ? 'Save' : 'Save and continue'}</button>
        </form>
      </div>
    </div>
  );
}

