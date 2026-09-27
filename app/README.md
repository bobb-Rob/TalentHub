# TalentHub MVP

The escrow path, working end to end: a brand publishes a brief, a creator
applies, the brand awards and funds a milestone into escrow, the creator
delivers, the brand accepts, and the money is released and withdrawn — with
every movement recorded as a double-entry ledger posting you can inspect in the
interface.

Built as Increments 1–4 of the CMP 722 Group 2 project. See `/CLAUDE.md` at the
repository root for architecture notes and the rules the code holds to.

## Run it

```bash
npm install
npm run reset     # seed demo data
npm run dev       # API on :4000, client on :5173
```

Open http://localhost:5173 and use one of the demo buttons on the sign-in
screen. Every seeded account uses the password `password123`.

| Account | Who |
|---|---|
| `brand@sterling.example` | Sterling Foods — the hiring side |
| `amara@talenthub.africa` | Amara Okonkwo — motion designer, Lagos |
| `kwesi@talenthub.africa` | Kwesi Boateng — photographer, Accra |
| `zola@talenthub.africa` | Zola Mthembu — video editor, Nairobi |
| `tunde@talenthub.africa` | Tunde Alabi — illustrator, Ibadan |
| `nadia@talenthub.africa` | Nadia Cherif — copywriter, Casablanca |

## The demo, in order

1. Sign in as **Sterling Foods**. Go to **Briefs** and open the festive campaign
   brief — two creators have applied.
2. **Award** Amara. A contract is created with two milestones that sum to the
   agreed fee.
3. On milestone 1, the commission and the creator's net are shown *before* you
   confirm. **Fund it into escrow.** Expand *Show ledger postings* — two entries,
   a debit against brand funding and a credit to escrow.
4. Sign out, sign in as **Amara**, open the same contract under **My work**, and
   **submit a deliverable**. Note that submitting was impossible before the money
   was in escrow.
5. Back as **Sterling Foods**: **request a revision** (bounded at two), then
   **accept and release payment**. Three more ledger entries appear — escrow
   debited, the creator credited the net, the platform credited its commission.
6. As **Amara**, go to **Money** and withdraw.
7. As either party, open **Ledger** to see the whole book and the reconciliation
   check.

## Verify it

```bash
npm run smoke
```

59 assertions against a running API, in three parts: the escrow path itself,
accounts and profiles (sign-up, profile, skills, portfolio, audience, ID check),
and the brief and contract lifecycle (drafts, shortlisting, contract acceptance,
cancellation). They include the cases that should fail: applying twice to one
brief, funding before the creator accepts, submitting against an unfunded
milestone, a creator accepting their own work, funding the same milestone twice,
one brand touching another brand's applications, cancelling once money is in
escrow, and withdrawing more than is available. It finishes by asserting that
every transaction in the ledger balances.

## Deploy

Two routes, both in the repository:

- **Render** — `render.yaml` at the repository root. Point Render at the repo
  and it builds the client and serves it from the same Node process as the API.
  On the free plan there is no persistent disk, so the database is recreated and
  reseeded on each deploy; fine for a demo.
- **Container** — `Dockerfile` here. Works on Railway, Fly.io or Cloud Run.
  Mount a volume at `/data` to keep the database.

In production the API serves the built client, so it is one service, not two.

## API

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` · `/api/auth/login` | bcrypt cost 12, JWT |
| GET | `/api/me` | current user and profile |
| PUT | `/api/creator/profile` · `/api/brand/profile` | create or update |
| POST | `/api/creator/portfolio` · `/api/creator/social` · `/api/creator/kyc` | |
| GET | `/api/creators` | search: `q`, `discipline`, `country`, `mode`, `verified`, `maxRate` |
| GET | `/api/creators/:id` | full profile |
| GET · POST | `/api/briefs` | list or publish |
| GET | `/api/briefs/:id` | brief with applications |
| POST | `/api/briefs/:id/apply` | one per creator per brief |
| POST | `/api/applications/:id/award` | creates the contract and milestones |
| GET | `/api/contracts` · `/api/contracts/:id` | scoped to the signed-in party |
| POST | `/api/milestones/:id/fund` | escrow posting |
| POST | `/api/milestones/:id/submit` | requires a funded milestone |
| POST | `/api/milestones/:id/revise` | capped at two |
| POST | `/api/milestones/:id/accept` | release, net of commission |
| GET | `/api/creator/balance` · POST `/api/payouts` | withdrawal |
| GET | `/api/ledger` · `/api/ledger/reconcile` | the audit view |

## Not built yet

Disputes, reviews, messaging and notifications are Increment 5. The `disputed`,
`refunded` and `split` states already exist in the schema and the state machine;
they have no routes or interface yet.
