// Empty in development (Vite proxies /api) and when the API serves the client
// itself; set VITE_API_URL at build time when the client is hosted separately.
// trim() also drops a byte-order mark — vite.config.js refuses to build with
// one, and this keeps the client correct even if that check is bypassed.
const BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '') + '/api';
let token = localStorage.getItem('th_token') || null;

export const getToken = () => token;
export function setToken(t) {
  token = t;
  if (t) localStorage.setItem('th_token', t);
  else localStorage.removeItem('th_token');
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `request failed (${res.status})`);
  return data;
}

const SYMBOL = { NGN: '₦', GHS: 'GH₵', KES: 'KSh', ZAR: 'R', MAD: 'MAD ', USD: '$' };
export const CURRENCIES = Object.keys(SYMBOL);
export const symbolOf = (currency) => (SYMBOL[currency] ?? currency + ' ').trim();

export const COUNTRIES = [
  ['NG', 'Nigeria'], ['GH', 'Ghana'], ['KE', 'Kenya'], ['ZA', 'South Africa'],
  ['MA', 'Morocco'], ['EG', 'Egypt'], ['RW', 'Rwanda'], ['SN', 'Senegal'],
  ['CI', "Côte d'Ivoire"], ['UG', 'Uganda'], ['TZ', 'Tanzania'], ['ET', 'Ethiopia'],
];

/** Major units typed into a form → integer minor units; null when blank. */
export const toMinor = (major) =>
  major === '' || major == null ? null : Math.round(Number(major) * 100);

/** Money is held in minor units everywhere; it is only ever divided for display. */
export function money(minor, currency = 'NGN') {
  if (minor == null) return '—';
  const sym = SYMBOL[currency] ?? currency + ' ';
  return sym + (minor / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  });
}

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export const titleCase = (s = '') =>
  s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
