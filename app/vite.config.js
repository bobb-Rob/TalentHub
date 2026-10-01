import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_API_URL is baked into the bundle, so a bad value ships silently: an
// invisible byte-order mark in front of "https" once turned every API call into
// a relative path on the Vercel host, which answered 404. Refuse to build
// instead — a failed deploy leaves the last good one live.
const apiUrl = process.env.VITE_API_URL;
if (apiUrl !== undefined && apiUrl !== '') {
  if (apiUrl !== apiUrl.trim())
    throw new Error('VITE_API_URL has leading or trailing whitespace or an invisible ' +
      `character (e.g. a byte-order mark): ${JSON.stringify(apiUrl)}. Re-enter it without them.`);
  if (!/^https?:\/\/[^/\s]+/.test(apiUrl))
    throw new Error(`VITE_API_URL must be an absolute http(s) URL, got ${JSON.stringify(apiUrl)}`);
}

export default defineConfig({
  root: 'client',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000' },
  },
  build: { outDir: '../dist', emptyOutDir: true },
});
