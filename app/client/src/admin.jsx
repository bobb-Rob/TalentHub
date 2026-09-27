import React, { useEffect, useState } from 'react';
import { api, money, toMinor } from './api.js';
import { Badge, Banner, Empty, Field } from './components/ui.jsx';

/** FR-36 — the administrator's queue: open disputes first, then the record. */
export function AdminDisputes() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api('/admin/disputes').then(setRows).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  if (!rows) return <div className="page"><Empty>{err || 'Loading…'}</Empty></div>;
  const open = rows.filter((d) => d.status === 'open');
  const closed = rows.filter((d) => d.status !== 'open');

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Disputes</h1>
          <p>Each one is a frozen milestone. Your ruling moves the money and is final.</p>
        </div>
      </div>
      <Banner tone="err">{err}</Banner>

      <div className="section-label">Open ({open.length})</div>
      <div className="stack">
        {open.map((d) => <OpenDispute key={d.dispute_id} d={d} onResolved={load} />)}
        {!open.length && <Empty>No open disputes.</Empty>}
      </div>

      {closed.length > 0 && (
        <>
          <div className="section-label">Resolved ({closed.length})</div>
          <div className="card">
            <table>
              <thead><tr><th>Brief</th><th>Parties</th><th>Outcome</th>
                         <th className="num">Milestone</th><th>Reason recorded</th><th>When</th></tr></thead>
              <tbody>
                {closed.map((d) => (
                  <tr key={d.dispute_id}>
                    <td className="small">{d.brief_title}<div className="tiny muted">milestone {d.sequence_no}</div></td>
                    <td className="small">{d.legal_name} → {d.display_name}</td>
                    <td><Badge tone={d.outcome === 'refund' ? 'amber' : d.outcome === 'release' ? 'green' : 'navy'}>
                      {d.outcome}</Badge>
                      {d.outcome === 'split' && <div className="tiny muted">
                        {money(d.creator_share_minor, d.currency_code)} to creator</div>}</td>
                    <td className="num">{money(d.amount_minor, d.currency_code)}</td>
                    <td className="small muted">{d.resolution_note}</td>
                    <td className="tiny muted">{d.resolved_at}<div>{d.resolved_by_email}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function OpenDispute({ d, onResolved }) {
  const [outcome, setOutcome] = useState('');
  const [share, setShare] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // Preview the ledger effect before committing, using the same arithmetic as
  // the server: commission is taken only on what the creator receives.
  const amount = d.amount_minor;
  const gross = outcome === 'release' ? amount : outcome === 'split' ? (toMinor(share) ?? 0) : 0;
  const commission = Math.round(gross * d.commission_rate);
  const splitValid = outcome !== 'split' || (gross > 0 && gross < amount);
  const cur = d.currency_code;

  const resolve = async () => {
    setErr(''); setBusy(true);
    try {
      await api(`/admin/disputes/${d.dispute_id}/resolve`, { method: 'POST', body: {
        outcome, note, ...(outcome === 'split' ? { creator_share_minor: gross } : {}) } });
      onResolved();
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div className="card">
      <Banner tone="err">{err}</Banner>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <strong>{d.brief_title}</strong>
          <div className="small muted">
            Milestone {d.sequence_no} — {d.milestone_description} · {d.legal_name} → {d.display_name}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{money(amount, cur)}</div>
          <div className="tiny muted">frozen in escrow</div>
        </div>
      </div>

      <div className="dispute-box">
        <div className="tiny muted">
          Raised by the {d.raised_by_role} ({d.raised_by_email}) · {d.created_at}
        </div>
        <p className="small" style={{ margin: '6px 0 0' }}>“{d.reason}”</p>
      </div>

      <div className="section-label">What was delivered</div>
      {d.deliverables.length ? d.deliverables.map((x, i) => (
        <div key={i} className="small" style={{ padding: '4px 0', borderBottom: '1px solid #eef0f4' }}>
          <strong>{x.title}</strong> <span className="muted">{x.note}</span>
          {x.external_link && <> · <a href={x.external_link} target="_blank" rel="noreferrer">link</a></>}
          <span className="tiny muted" style={{ float: 'right' }}>{x.created_at}</span>
        </div>
      )) : <p className="small muted">Nothing was submitted.</p>}

      <div className="section-label">Ruling</div>
      <div className="choice three">
        {[['release', 'Release', 'Pay the creator in full'],
          ['split', 'Split', 'Part to each side'],
          ['refund', 'Refund', 'Return it all to the brand']].map(([k, label, hint]) => (
          <label key={k} className={outcome === k ? 'on' : ''}>
            <input type="radio" name={`o-${d.dispute_id}`} checked={outcome === k}
                   onChange={() => setOutcome(k)} />
            <strong>{label}</strong><span className="tiny muted">{hint}</span>
          </label>
        ))}
      </div>

      {outcome === 'split' && (
        <Field label="Creator's share, before commission"
               hint={`More than zero and less than ${money(amount, cur)}.`}>
          <input type="number" min="0" step="1" value={share} onChange={(e) => setShare(e.target.value)} />
        </Field>
      )}

      {outcome && splitValid && (
        <div className="preview">
          <div className="money-line"><span>Creator receives</span>
            <span>{money(gross - commission, cur)}</span></div>
          <div className="money-line"><span>Platform commission</span>
            <span>{money(commission, cur)}</span></div>
          <div className="money-line"><span>Returned to brand</span>
            <span>{money(amount - gross, cur)}</span></div>
        </div>
      )}

      {outcome && (
        <>
          <Field label="Reason for the ruling" hint="Both parties see this.">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <button className={outcome === 'refund' ? 'money' : 'go'}
                  disabled={busy || !note.trim() || !splitValid} onClick={resolve}>
            {busy ? 'Recording ruling…' : `Rule: ${outcome}`}
          </button>
        </>
      )}
    </div>
  );
}
