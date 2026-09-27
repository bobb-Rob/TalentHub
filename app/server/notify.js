import { db } from './db.js';

/**
 * FR-40 — notifications. Each goes to the in-app inbox and "by email".
 *
 * emailProvider() stands in for a transactional email service the way
 * paymentProvider() stands in for Paystack: it logs instead of sending.
 * Replacing it should not require touching any caller.
 */
function emailProvider({ to, subject }) {
  console.log(`[email stub] to ${to}: ${subject}`);
  return { ok: true };
}

const insert = db.prepare(`INSERT INTO notifications (user_id, kind, message, link, emailed_at)
                           VALUES (?, ?, ?, ?, ?)`);

/** Notify one or more users. Falsy ids are skipped, so callers need no guards. */
export function notify(userIds, kind, message, link = null) {
  for (const userId of [].concat(userIds).filter(Boolean)) {
    const user = db.prepare('SELECT email FROM users WHERE user_id = ?').get(userId);
    if (!user) continue;
    const sent = emailProvider({ to: user.email, subject: message }).ok;
    insert.run(userId, kind, message, link, sent ? new Date().toISOString() : null);
  }
}

// Recipient lookups: marketplace rows point at profiles, notifications at users.
export const userOfCreator = (profileId) =>
  db.prepare('SELECT user_id FROM creator_profiles WHERE profile_id = ?').get(profileId)?.user_id;
export const userOfBrand = (brandId) =>
  db.prepare('SELECT user_id FROM brand_profiles WHERE brand_id = ?').get(brandId)?.user_id;
export const admins = () =>
  db.prepare("SELECT user_id FROM users WHERE role = 'admin'").all().map((r) => r.user_id);

export function inbox(userId) {
  return {
    unread: db.prepare('SELECT COUNT(*) n FROM notifications WHERE user_id = ? AND read_at IS NULL')
              .get(userId).n,
    items: db.prepare(`SELECT notification_id, kind, message, link, read_at, created_at
                       FROM notifications WHERE user_id = ?
                       ORDER BY notification_id DESC LIMIT 30`).all(userId),
  };
}

/** Mark one notification, or all of them, read — only ever the caller's own. */
export function markRead(userId, notificationId = null) {
  if (notificationId == null) {
    db.prepare(`UPDATE notifications SET read_at = datetime('now')
                WHERE user_id = ? AND read_at IS NULL`).run(userId);
  } else {
    db.prepare(`UPDATE notifications SET read_at = datetime('now')
                WHERE user_id = ? AND notification_id = ? AND read_at IS NULL`)
      .run(userId, notificationId);
  }
}
