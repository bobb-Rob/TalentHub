# TalentHub — working notes

Read this before changing anything. It is the context a fresh session needs.

## What this is

A creator–brand marketplace for African digital creators, built as the Group 2
project for **CMP 722 (Software Engineering)**, Anchor University Lagos.

Two things live here:

- `docs/` — the SDLC documentation, which is the graded deliverable.
  `docs/TalentHub-SDLC-Documentation.docx` is the submission.
- `app/` — a working MVP demonstrating the escrow path, to show alongside it.

## The one idea the product turns on

Every African incumbent (Wowzi, Posse, Tikora, Cofluenxa) is an **influencer
marketing** platform: what a brand buys is access to the creator's own audience.
Tikora already has KYC, escrow and local payout, so none of those are a
differentiator and the documentation does not claim them as one.

The gap is the other axis: nobody serves the creator as a **commissioned craft
professional** — the motion designer, editor, photographer whose deliverable is
work handed to the client, not a post to their followers. TalentHub is therefore
**dual-mode**: one verified profile carries both a portfolio and authenticated
audience metrics, and a brand can engage that creator either way under one
contracting, escrow and payout mechanism.

Keep that framing. It is what the whole document argues.

## Delivery model

Incremental, six weekly increments. Increments 1–4 are the minimum viable
deliverable; 5–6 are explicitly de-scopable. See §1.9 of the document.

| Increment | Scope | State |
|---|---|---|
| 1 | Auth, schema, role routing | **done** |
| 2 | Creator profiles, portfolio, KYC status, audience linking | **done** |
| 3 | Discovery, briefs, applications | **done** |
| 4 | Contracts, milestones, escrow, deliverables, payout | **done** |
| 5 | Reviews, messaging, notifications, disputes | in progress — messaging left |
| 6 | Admin console, reporting, accessibility, regression | not started |

## Running it

```bash
cd app
npm install
npm run reset     # wipes and seeds demo data
npm run dev       # API on :4000, Vite on :5173
npm run smoke     # 104 assertions: escrow, accounts, briefs, disputes, reviews, notifications
```

Every seeded account uses the password `password123`. Sign-in has demo buttons.

- `admin@talenthub.example` — the administrator; rules on disputes
- `brand@sterling.example` — Sterling Foods, the hiring side
- `amara@talenthub.africa` — Amara Okonkwo, motion designer, Lagos
- plus Kwesi (Accra), Zola (Nairobi), Tunde (Ibadan), Nadia (Casablanca)

## Architecture

Layered, deliberately not microservices: the escrow invariant is far cheaper to
guarantee inside one ACID transaction boundary than across a distributed saga.

```
client/  React 18 + Vite, hash router, no UI framework
server/  Express, better-sqlite3
  db.js        connection, schema bootstrap, id helper
  auth.js      bcrypt (cost 12) + JWT, server-side role checks
  ledger.js    append-only double-entry posting  ← read this first
  index.js     routes and the milestone state machine
  seed.js      demo data
  smoke.mjs    end-to-end assertions
```

## Rules that are not negotiable

These come straight from the design chapter, and the tests enforce them.

1. **Money is integer minor units.** No floats anywhere in the financial path.
   `amount_minor` is kobo, with an explicit ISO 4217 code. TalentHub settles in
   **NGN only** for now (`CURRENCY` in `server/ledger.js`); the API refuses any
   other code, and the ledger keeps the code per row so more can be added later.
2. **The ledger is append-only.** Nothing UPDATEs or DELETEs `ledger_entries`.
   Balances are derived by summing.
3. **Every transaction balances.** `post()` refuses to write unless debits equal
   credits. A milestone cannot leave a funded state without a balancing entry.
4. **Idempotency keys are derived, not generated.** `fund:<milestone_id>`,
   `release:<milestone_id>`. The unique index makes a double posting impossible
   under retry — the guarantee is a database constraint, not a convention.
5. **The milestone state machine is the only path.** `TRANSITIONS` in
   `server/index.js`. Anything not in that table is rejected. `cancelled` is
   reachable only from `pending`, so funded money can never be discarded without
   an explicit financial outcome.
6. **Authorisation is server-side on every route.** Never trust a client role.
7. **Verified vs self-declared audience figures are never shown as the same
   thing.** `metrics_source` is the trust signal the whole product rests on.

## What is stubbed

- `paymentProvider()` in `server/index.js` simulates Paystack/Flutterwave. It
  always authorises. Replacing it should not require touching the ledger.
- KYC is a button that sets a status; no provider call.
- `emailProvider()` in `server/notify.js` logs `[email stub]` lines instead of
  sending; every notification is otherwise real.
- Audience metrics come from the seed or the creator; no OAuth to Instagram or
  TikTok yet. `oauth: true` on `POST /api/creator/social` marks a figure verified.

## Where to go next

Increment 5, in order of value to the demo:

1. ~~**Disputes**~~ — done. Either party disputes a *submitted* milestone
   (Figure 3.5 allows `disputed` only from `submitted`); an admin rules release,
   refund or split through `settleEscrow()` in `server/index.js`, the one place
   money leaves escrow.
2. ~~**Reviews**~~ — done. Publication (both reviewed, or 14 days after
   completion) is applied on read by the `PUBLISHED` SQL in `server/index.js`;
   an unpublished review's content never leaves the server.
3. ~~**Notifications**~~ — done. `notify()` in `server/notify.js` writes the
   in-app inbox; call it next to `logEvent()` for anything a user should hear about.
4. **Messaging** — scoped to a contract or an open application. The last of
   Increment 5.

## Documentation

If you change the product, change `docs/` too — the chapters are the graded
artefact and they must describe what was built. Rebuild the Word file with
`cd docs/build && ./build.sh`. Figures regenerate from `docs/diagrams/`.

## Branches and deployment

```
feature/* ──PR──▶ develop ──PR──▶ staging ──PR──▶ main
                                    │
                                    └─ auto-deploys the test environment
```

- **`develop`** — integration branch. Every feature or fix is its own branch
  off `develop` (`feat/…`, `fix/…`, `chore/…`) and comes back by PR.
- **`staging`** — the deploy branch. Anything merged here goes live on the
  *test* environment automatically: Render (`talenthub-api`, API + SQLite) and
  Vercel (`talenthub`, client). Only `develop` is merged into `staging`.
- **`main`** — the final, reviewed record, reached only by a PR from `staging`
  once the test environment checks out. Nothing deploys from it yet; a
  production environment will when TalentHub goes live.

Never commit straight to `develop`, `staging` or `main`, and never PR a
feature branch into `staging` or `main` directly. Test environment URLs are in
`app/README.md` under *Deploy*.

## Team

Robertson (PM1), David (PM2 / Tech Lead), Mercy (QA), Olufems (Developer).
Code review by the Tech Lead before merge; no increment closes without QA sign-off.
