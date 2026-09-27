import crypto from 'node:crypto';
import { db } from './db.js';

/**
 * The ledger.
 *
 * Two rules are enforced here and nowhere else:
 *
 *  1. Every transaction balances. The sum of debits equals the sum of credits,
 *     in each currency, or nothing is written at all.
 *  2. A transaction is applied at most once. The unique index on
 *     (idempotency_key, account_type, direction) means a retry of the same
 *     logical operation collides with the row it already wrote, so a double
 *     charge is impossible even under concurrent retry. The guarantee is a
 *     database constraint, not a convention the calling code must remember.
 *
 * Nothing in this file updates or deletes a row. Balances are derived by
 * summing, which is what makes the history auditable (NFR-15).
 */

export class LedgerError extends Error {}

const insert = db.prepare(`
  INSERT INTO ledger_entries
    (transaction_id, account_type, account_owner_id, direction, amount_minor,
     currency_code, milestone_id, memo, idempotency_key)
  VALUES (@transaction_id, @account_type, @account_owner_id, @direction,
          @amount_minor, @currency_code, @milestone_id, @memo, @idempotency_key)
`);

/**
 * Post one balanced transaction.
 * @param {object[]} lines  {account_type, account_owner_id?, direction, amount_minor, memo?}
 * @param {object}   opts   {idempotencyKey, milestoneId?, currency?}
 * @returns {{transactionId: string, applied: boolean}}  applied=false means this
 *          transaction had already been posted and was therefore a no-op.
 */
export function post(lines, { idempotencyKey, milestoneId = null, currency = 'NGN' }) {
  if (!idempotencyKey) throw new LedgerError('an idempotency key is required');
  if (!lines?.length) throw new LedgerError('a transaction needs at least two lines');

  const debits = lines.filter((l) => l.direction === 'debit')
    .reduce((s, l) => s + l.amount_minor, 0);
  const credits = lines.filter((l) => l.direction === 'credit')
    .reduce((s, l) => s + l.amount_minor, 0);
  if (debits !== credits) {
    throw new LedgerError(
      `transaction does not balance: debits ${debits} vs credits ${credits}`);
  }
  if (lines.some((l) => !Number.isInteger(l.amount_minor) || l.amount_minor <= 0)) {
    throw new LedgerError('every amount must be a positive integer of minor units');
  }

  const transaction_id = crypto.randomUUID();
  const run = db.transaction(() => {
    for (const l of lines) {
      insert.run({
        transaction_id,
        account_type: l.account_type,
        account_owner_id: l.account_owner_id ?? null,
        direction: l.direction,
        amount_minor: l.amount_minor,
        currency_code: currency,
        milestone_id: milestoneId,
        memo: l.memo ?? null,
        idempotency_key: idempotencyKey,
      });
    }
  });

  try {
    run();
    return { transactionId: transaction_id, applied: true };
  } catch (err) {
    if (String(err.message).includes('UNIQUE constraint failed')) {
      // This exact transaction is already in the ledger. Nothing was written by
      // this call, and nothing should be: report the original outcome.
      const row = db.prepare(
        'SELECT transaction_id FROM ledger_entries WHERE idempotency_key = ? LIMIT 1'
      ).get(idempotencyKey);
      return { transactionId: row?.transaction_id ?? null, applied: false };
    }
    throw err;
  }
}

/** Balance of one account, as debits minus credits or the reverse by account nature. */
export function balance(accountType, ownerId = null) {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN direction = 'debit'  THEN amount_minor ELSE 0 END), 0) AS debits,
      COALESCE(SUM(CASE WHEN direction = 'credit' THEN amount_minor ELSE 0 END), 0) AS credits
    FROM ledger_entries
    WHERE account_type = ?
      AND (account_owner_id IS ? OR account_owner_id = ?)
  `).get(accountType, ownerId, ownerId);

  // escrow, creator_payable and platform_commission are liability-natured:
  // a credit increases what the platform owes. brand_funding is the source.
  const liability = ['escrow', 'creator_payable', 'platform_commission'];
  return liability.includes(accountType)
    ? row.credits - row.debits
    : row.debits - row.credits;
}

/** Every posting against one milestone, oldest first — the audit view. */
export function milestoneLedger(milestoneId) {
  return db.prepare(`
    SELECT entry_id, transaction_id, account_type, account_owner_id, direction,
           amount_minor, currency_code, memo, created_at
    FROM ledger_entries
    WHERE milestone_id = ?
    ORDER BY entry_id
  `).all(milestoneId);
}

/**
 * Assert the books balance. Every transaction_id must have equal debits and
 * credits; a violation is a defect, not a user error.
 */
export function reconcile() {
  const broken = db.prepare(`
    SELECT transaction_id,
           SUM(CASE WHEN direction = 'debit'  THEN amount_minor ELSE 0 END) AS d,
           SUM(CASE WHEN direction = 'credit' THEN amount_minor ELSE 0 END) AS c
    FROM ledger_entries
    GROUP BY transaction_id
    HAVING d <> c
  `).all();
  const totals = db.prepare(`
    SELECT account_type,
           SUM(CASE WHEN direction = 'credit' THEN amount_minor ELSE -amount_minor END) AS net
    FROM ledger_entries GROUP BY account_type
  `).all();
  return { balanced: broken.length === 0, unbalanced: broken, totals };
}
