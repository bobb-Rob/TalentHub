import React from 'react';
import { money, initials, titleCase } from '../api.js';

export const Avatar = ({ name, lg }) => (
  <div className={'avatar' + (lg ? ' lg' : '')}>{initials(name)}</div>
);

export const Badge = ({ tone = 'grey', children }) => (
  <span className={`badge ${tone}`}>{children}</span>
);

const MILESTONE_TONE = {
  pending: 'grey', funded: 'amber', in_progress: 'navy', submitted: 'amber',
  accepted: 'green', disputed: 'red', refunded: 'red', split: 'red', cancelled: 'grey',
};
const MILESTONE_LABEL = {
  pending: 'Not funded', funded: 'In escrow', in_progress: 'Creator working',
  submitted: 'Awaiting your review', accepted: 'Paid', disputed: 'Disputed',
  refunded: 'Refunded', split: 'Split', cancelled: 'Cancelled',
};

export const MilestoneBadge = ({ status }) => (
  <Badge tone={MILESTONE_TONE[status] || 'grey'}>
    {MILESTONE_LABEL[status] || titleCase(status)}
  </Badge>
);

/** Verified vs self-declared is the trust signal; never show one as the other. */
export const MetricBadge = ({ source }) =>
  source === 'api_verified'
    ? <Badge tone="green">verified</Badge>
    : <Badge tone="amber">self-declared</Badge>;

export const KycBadge = ({ status }) => {
  const tone = { verified: 'green', pending: 'amber', rejected: 'red' }[status] || 'grey';
  const label = { verified: 'ID verified', pending: 'ID check pending',
                  rejected: 'ID rejected' }[status] || 'ID not verified';
  return <Badge tone={tone}>{label}</Badge>;
};

export const AvailabilityBadge = ({ value }) => {
  const tone = { available: 'green', limited: 'amber', unavailable: 'grey' }[value] || 'grey';
  const label = { available: 'available', limited: 'limited availability',
                  unavailable: 'not taking work' }[value] || value;
  return <Badge tone={tone}>{label}</Badge>;
};

/** FR-38 — a mean rating and how many reviews it rests on; honest when there are none. */
export const Rating = ({ mean, count, compact }) =>
  count ? (
    <span className="rating" title={`${mean} out of 5 from ${count} review${count === 1 ? '' : 's'}`}>
      <span aria-hidden="true">★</span> {Number(mean).toFixed(1)}
      <span className="muted"> ({count}{compact ? '' : ` review${count === 1 ? '' : 's'}`})</span>
    </span>
  ) : <span className="tiny muted">No reviews yet</span>;

/** A 1–5 picker made of real radio buttons, so it works by keyboard. */
export function StarInput({ value, onChange, name }) {
  return (
    <div className="star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className={n <= value ? 'on' : ''} title={`${n} of 5`}>
          <input type="radio" name={name} value={n} checked={value === n}
                 onChange={() => onChange(n)} />
          <span aria-hidden="true">★</span>
          <span className="sr-only">{n} star{n === 1 ? '' : 's'}</span>
        </label>
      ))}
    </div>
  );
}

export const Banner = ({ tone = 'info', children }) =>
  children ? <div className={`banner ${tone}`}>{children}</div> : null;

export const Stat = ({ k, v, sub }) => (
  <div className="stat">
    <div className="k">{k}</div>
    <div className="v">{v}</div>
    {sub && <div className="tiny muted">{sub}</div>}
  </div>
);

export const Field = ({ label, children, hint }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {hint && <div className="tiny muted" style={{ marginTop: 3 }}>{hint}</div>}
  </div>
);

export const Empty = ({ children }) => <div className="empty">{children}</div>;

/** The escrow path as a progress strip — it doubles as an explanation. */
export function Flow({ status }) {
  const steps = [
    ['pending', 'Awarded'],
    ['funded', 'Funded into escrow'],
    ['in_progress', 'Work in progress'],
    ['submitted', 'Submitted'],
    ['accepted', 'Paid out'],
  ];
  const order = ['pending', 'funded', 'in_progress', 'submitted', 'accepted'];
  const here = order.indexOf(status === 'funded' ? 'in_progress' : status);
  return (
    <div className="flow">
      {steps.map(([key, label], i) => (
        <div key={key}
             className={'step ' + (i === here ? 'on' : i < here ? 'past' : '')}>
          {label}
        </div>
      ))}
    </div>
  );
}

/** The double-entry postings behind a milestone — the audit view. */
export function LedgerTable({ entries, currency = 'NGN' }) {
  if (!entries?.length)
    return <p className="small muted">No postings yet — nothing has moved.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Account</th><th>Dr/Cr</th><th className="num">Amount</th><th>Memo</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.entry_id}>
            <td className="mono">{e.account_type}</td>
            <td>
              <Badge tone={e.direction === 'debit' ? 'navy' : 'green'}>
                {e.direction === 'debit' ? 'Dr' : 'Cr'}
              </Badge>
            </td>
            <td className="num">{money(e.amount_minor, e.currency_code || currency)}</td>
            <td className="small muted">{e.memo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
