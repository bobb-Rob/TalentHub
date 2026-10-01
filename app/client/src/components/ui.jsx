import React from 'react';
import { money, initials, titleCase } from '../api.js';

const cx = (...parts) => parts.filter(Boolean).join(' ');

// ---------------------------------------------------------------- design system

/** The product name as a mark: "TalentHub." with the stop in the accent colour. */
export const Wordmark = ({ tag = 'MVP' }) => (
  <span className="wordmark">
    <b>TalentHub<i>.</i></b>
    {tag && <small>{tag}</small>}
  </span>
);

const ICONS = {
  bell: <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  check: <path d="M20 6 9 17l-5-5" />,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
};

/** Line icons drawn inline — no icon font, no emoji. */
export const Icon = ({ name, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const VARIANT = {
  primary: '', accent: 'go', escrow: 'money', outline: 'ghost', quiet: 'quiet', danger: 'danger',
};

/**
 * Every button in the app. Variants name intent, not colour: `accent` moves
 * work forward, `escrow` moves money. Other props (type, value, onClick,
 * disabled) pass straight through, so a native form submit behaves as before.
 */
export const Button = ({ variant = 'primary', size, block, className, ...rest }) => (
  <button className={cx(VARIANT[variant], size === 'sm' && 'small', size === 'lg' && 'lg',
                        block && 'block', className) || undefined} {...rest} />
);

/** A white surface. `onClick` makes it a link-like card with a hover lift. */
export const Card = ({ className, onClick, children, ...rest }) => (
  <div className={cx('card', onClick && 'clickable', className)} onClick={onClick} {...rest}>
    {children}
  </div>
);

/** The ink band at the top of a list page: eyebrow, title, one line, actions. */
export const PageHeader = ({ eyebrow, title, lede, actions }) => (
  <div className="page-head">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {lede && <p>{lede}</p>}
    </div>
    {actions && <><div className="spacer" />{actions}</>}
  </div>
);

export const SectionLabel = ({ children, count, style }) => (
  <div className="section-label" style={style}>
    <span>{children}{count != null && <span className="count"> · {count}</span>}</span>
  </div>
);

/** A right-aligned headline number (a fee, a balance) with a caption under it. */
export const Figure = ({ value, caption, size, tone, children }) => (
  <div className={cx('figure', size, tone)}>
    <div className="figure-v">{value}</div>
    {caption && <div className="tiny muted">{caption}</div>}
    {children}
  </div>
);

/**
 * The ink band at the top of a detail page. A `Card className="lead"` placed
 * straight after it rides up over the band.
 */
export const BackLink = ({ onClick, children }) => (
  <div className="crumb">
    <Button variant="quiet" size="sm" className="back" onClick={onClick}>
      <Icon name="back" size={15} /> {children}
    </Button>
  </div>
);

// ---------------------------------------------------------------- domain

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
export function LedgerTable({ entries, currency }) {
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
