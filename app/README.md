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

80 assertions against a running API, in four parts: the escrow path itself,
accounts and profiles (sign-up, profile, skills, portfolio, audience, ID check),
the brief and contract lifecycle (drafts, shortlisting, contract acceptance,
cancellation), and disputes (every ruling, and the ledger behind each). They
include the cases that should fail: applying twice to one
brief, funding before the creator accepts, submitting against an unfunded
milestone, a creator accepting their own work, funding the same milestone twice,
one brand touching another brand's applications, cancelling once money is in
escrow, and withdrawing more than is available. It finishes by asserting that
every transaction in the ledger balances.

## Deploy

The test environment deploys automatically from the **`staging`** branch:

| Part | Host | Config | URL |
|---|---|---|---|
| Client | Vercel, project root `app` | `vercel.json` | https://talenthub-taupe.vercel.app |
| API + SQLite | Render, Frankfurt, free plan | `render.yaml` | https://talenthub-api-ih7b.onrender.com |

The client is built with `VITE_API_URL` pointing at the API, and the API only
accepts browser requests from the origins in `CORS_ORIGIN`. On the free plan
there is no persistent disk, so the database is recreated and reseeded on each
deploy or wake; the first request after 15 idle minutes takes about 50 seconds.

There is no production environment yet. `main` deploys nowhere; when the
platform goes live, a production environment will deploy from `main`.

For a single-service alternative, `Dockerfile` here builds the client and serves
it from the API process — it works on Railway, Fly.io or Cloud Run. Mount a
volume at `/data` to keep the database.

## API

Every route checks the caller's role and ownership on the server.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` · `/api/auth/login` | bcrypt cost 12, JWT; lockout after 5 failures |
| GET | `/api/me` | current user and profile |
| PUT | `/api/creator/profile` · `/api/brand/profile` | create or update |
| GET · PUT | `/api/skills` · `/api/creator/skills` | taxonomy; replace a creator's skills |
| POST · DELETE | `/api/creator/portfolio` · `/api/creator/portfolio/:id` | at most 20 items |
| POST | `/api/creator/social` · `/api/creator/kyc` | typed-in figures are self-declared; KYC simulated |
| GET | `/api/creators` · `/api/creators/:id` | search: `q`, `discipline`, `country`, `mode`, `verified`, `maxRate` |
| GET · POST | `/api/briefs` | list, or create as draft or published |
| GET | `/api/briefs/:id` | applications visible only to the owning brand |
| POST | `/api/briefs/:id/status` | draft → published → closed |
| POST | `/api/briefs/:id/apply` | one per creator per brief |
| POST | `/api/applications/:id/status` · `/award` | shortlist, reject, award |
| GET | `/api/contracts` · `/api/contracts/:id` | scoped to the signed-in party |
| POST | `/api/contracts/:id/accept` · `/cancel` | creator accepts; either cancels before funding |
| POST | `/api/milestones/:id/fund` | escrow posting; contract must be accepted |
| POST | `/api/milestones/:id/submit` · `/revise` · `/accept` | revisions capped at two |
| POST | `/api/milestones/:id/dispute` | submitted milestones only; freezes it |
| GET | `/api/admin/disputes` | admin: the queue, with deliverables |
| POST | `/api/admin/disputes/:id/resolve` | admin: release, refund or split, with a reason |
| GET | `/api/creator/balance` · POST `/api/payouts` | withdrawal |
| GET | `/api/ledger` · `/api/ledger/reconcile` | the audit view |

## Not built yet

Reviews, messaging and notifications (the rest of Increment 5), and the rest of
the admin console (Increment 6). Portfolio items have no file upload yet, KYC
and payments are simulated, and audience figures are not fetched from the
platforms.
