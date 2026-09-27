import React, { useEffect, useRef, useState } from 'react';
import { api } from './api.js';

const POLL_MS = 30000;

/** FR-40 — the in-app half of notifications: a bell, an unread count, an inbox. */
export function NotificationBell({ go, route }) {
  const [box, setBox] = useState({ unread: 0, items: [] });
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () => api('/notifications').then(setBox).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { load(); }, [route]);

  // Close on a click outside or on Escape.
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const follow = async (n) => {
    setOpen(false);
    if (!n.read_at) setBox(await api('/notifications/read', {
      method: 'POST', body: { notification_id: n.notification_id } }));
    if (n.link) go(n.link);
  };
  const readAll = async () => setBox(await api('/notifications/read', { method: 'POST' }));

  return (
    <div className="bell" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}
              aria-label={`Notifications, ${box.unread} unread`}>
        <span aria-hidden="true">🔔</span>
        {box.unread > 0 && <span className="count">{box.unread > 99 ? '99+' : box.unread}</span>}
      </button>
      {open && (
        <div className="inbox" role="dialog" aria-label="Notifications">
          <div className="inbox-head">
            <strong className="small">Notifications</strong>
            {box.unread > 0 && (
              <button className="quiet small" onClick={readAll}>Mark all as read</button>
            )}
          </div>
          {box.items.length ? box.items.map((n) => (
            <button key={n.notification_id} className={'inbox-item' + (n.read_at ? '' : ' unread')}
                    onClick={() => follow(n)}>
              {n.message}
              <div className="tiny muted" style={{ fontWeight: 400, marginTop: 2 }}>{n.created_at}</div>
            </button>
          )) : <p className="small muted" style={{ padding: 14, margin: 0 }}>Nothing yet.</p>}
          <p className="tiny muted" style={{ padding: '8px 14px', margin: 0 }}>
            Each of these is also sent by email (simulated in this demo).
          </p>
        </div>
      )}
    </div>
  );
}
