// Empty in development (Vite proxies /api) and when the API serves the client
// itself; set VITE_API_URL at build time when the client is hosted separately.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';
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

const SYMBOL = { NGN: '₦', GHS: 'GH₵', KES: 'KSh', MAD: 'MAD ', USD: '$' };

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
