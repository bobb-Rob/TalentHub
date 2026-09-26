# CHAPTER THREE
# SYSTEM DESIGN

## 3.1 Design Objectives

The design is governed by five objectives derived from Chapter Two.

1. **Financial correctness before all else.** Money must never be lost,
   duplicated or stranded (NFR-08). Every design decision in the transaction path
   is subordinate to this.
2. **Substitutable externals.** Payment, KYC and social-metric providers differ by
   market and change commercially. Each is reached through an internal interface
   so that business logic is unaffected by substitution (NFR-20).
3. **Mobile-first on constrained networks.** The median user is on a mid-range
   Android device over a slow connection (NFR-02, NFR-04, NFR-17).
4. **Server-authoritative access control.** Role and ownership checks are enforced
   on every request; the client is never trusted (NFR-11).
5. **Auditability by construction.** Financial and administrative history is
   append-only rather than reconstructed from mutable rows (NFR-15).

## 3.2 Architectural Design

A **layered (three-tier) architecture with a modular service layer** was selected.
Figure 3.1 shows the arrangement.

> **Figure 3.1 — System Architecture**

| Layer | Responsibility | Components |
|---|---|---|
| **Presentation** | Rendering, client-side validation, state, routing | React SPA; Tailwind CSS; responsive layout; served as static assets from a CDN |
| **API** | Request authentication, authorisation, input validation, rate limiting, response shaping | Node.js / Express REST API; JWT access and refresh tokens; per-route authorisation middleware |
| **Service (domain)** | Business rules, invariants, orchestration of external providers | Identity, Profile, Discovery, Brief, Contract, Ledger, Payout, Review, Notification, Moderation modules |
| **Integration** | Provider adapters behind internal interfaces | `PaymentProvider`, `KycProvider`, `SocialMetricsProvider`, `EmailProvider`, `StorageProvider` |
| **Data** | Persistence, search indexing, media, queued work | PostgreSQL (system of record); Elasticsearch (creator search index); S3-compatible object storage (portfolio media, KYC documents); Redis (cache, rate limits, job queue) |

**Why layered rather than microservices.** Microservices were considered and
rejected. A six-week schedule with four part-time developers cannot absorb the
operational cost of distributed deployment, and — more importantly — the escrow
invariant in NFR-08 is far easier to guarantee inside a single ACID transaction
boundary than across a distributed saga. The service layer is nevertheless kept
modular, with no cross-module database access, so that a module can be extracted
later if scale demands it.

**Key architectural decisions.**

- *Stateless API.* Sessions are carried in signed tokens, not server memory, so
  capacity is added by replication (NFR-18).
- *Search index separate from the system of record.* Multi-criteria filtering over
  50,000 profiles within 2 seconds (NFR-01) is served by Elasticsearch, populated
  asynchronously from PostgreSQL. The index is a derived, rebuildable artefact;
  its loss degrades search (UC-04/E1) but never loses data.
- *Asynchronous work off the request path.* Metric refresh, email dispatch,
  payment reconciliation and index updates run as queued jobs so that no user
  request waits on a third party.
- *Ledger as append-only double entry.* See §3.5.

## 3.3 Technology Stack

| Concern | Selection | Rationale |
|---|---|---|
| Client | React 18, Tailwind CSS, Zustand | Team experience carried over from the archived project; small bundle achievable for NFR-02 |
| API | Node.js 20, Express, Zod validation | One language across the stack; the team's strongest competence |
| Database | PostgreSQL 15 | Transactional integrity is mandatory for the ledger; `NUMERIC` for money; mature constraint support |
| Search | Elasticsearch 8 | Multi-facet filtering and relevance ranking at the required latency |
| Cache / queue | Redis 7 with BullMQ | Rate limiting, session cache and background jobs in one dependency |
| Object storage | S3-compatible with pre-signed URLs | Media uploads bypass the API tier; private bucket for KYC documents |
| Payments | Paystack (primary), Flutterwave (secondary) | Collections and payouts across the target markets; both behind `PaymentProvider` |
| KYC | Smile Identity or Dojah | African document and biometric coverage; behind `KycProvider` |
| Social metrics | Instagram Graph, TikTok and YouTube Data APIs | Official, terms-compliant retrieval |
| Testing | Jest, Supertest, Playwright, k6 | Unit, API, end-to-end and load coverage for NFR-01 and NFR-03 |
| CI/CD | GitHub Actions | Lint, test and coverage gate on every pull request (NFR-16) |

## 3.4 Database Design

Figure 3.2 gives the entity–relationship model. Sixteen entities form the
system of record.

> **Figure 3.2 — Entity–Relationship Diagram**

### 3.4.1 Data dictionary (principal entities)

**USER** — one row per authenticated principal.

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| user_id | UUID | PK | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Lowercased on write |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt, cost ≥ 12 (NFR-09) |
| role | ENUM | NOT NULL | `creator`, `brand`, `admin` |
| email_verified_at | TIMESTAMPTZ | NULL | NULL until FR-02 satisfied |
| status | ENUM | NOT NULL | `active`, `suspended`, `closed` |
| failed_login_count | SMALLINT | NOT NULL DEFAULT 0 | Supports FR-03 lockout |
| created_at, updated_at | TIMESTAMPTZ | NOT NULL | |

**CREATOR_PROFILE** — 1:1 with a user of role `creator`.

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| profile_id | UUID | PK | |
| user_id | UUID | FK → USER, UNIQUE | |
| display_name | VARCHAR(120) | NOT NULL | |
| biography | TEXT | | |
| country_code | CHAR(2) | NOT NULL | ISO 3166-1 alpha-2 |
| city | VARCHAR(120) | | |
| primary_discipline | VARCHAR(80) | NOT NULL | From controlled taxonomy |
| engagement_modes | ENUM[] | NOT NULL | `reach`, `commission`, or both |
| day_rate_minor | BIGINT | | Minor units (NFR-19) |
| project_rate_minor | BIGINT | | |
| currency_code | CHAR(3) | NOT NULL | ISO 4217 |
| availability | ENUM | NOT NULL | `available`, `limited`, `unavailable` |
| kyc_status | ENUM | NOT NULL | `unverified`, `pending`, `verified`, `rejected` |
| mean_rating | NUMERIC(3,2) | | Derived from REVIEW |
| completed_contracts | INTEGER | NOT NULL DEFAULT 0 | Derived |
| published_at | TIMESTAMPTZ | NULL | NULL = not discoverable |

**PORTFOLIO_ITEM** — many per creator profile, capped at 20 (FR-10).

| Attribute | Type | Constraints |
|---|---|---|
| item_id | UUID | PK |
| profile_id | UUID | FK → CREATOR_PROFILE |
| title | VARCHAR(160) | NOT NULL |
| description | TEXT | |
| media_type | ENUM | `image`, `video`, `document`, `link` |
| storage_key | VARCHAR(512) | Object-storage key |
| role_played | VARCHAR(160) | |
| display_order | SMALLINT | NOT NULL |

**SOCIAL_ACCOUNT** — linked audience source (FR-11, FR-12).

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| social_account_id | UUID | PK | |
| profile_id | UUID | FK → CREATOR_PROFILE | |
| platform | ENUM | NOT NULL | `instagram`, `tiktok`, `youtube`, `x` |
| handle | VARCHAR(120) | NOT NULL | |
| follower_count | BIGINT | | |
| engagement_rate | NUMERIC(5,2) | | Percentage |
| metrics_source | ENUM | NOT NULL | `api_verified`, `self_declared` |
| last_refreshed_at | TIMESTAMPTZ | | Drives the 7-day refresh (FR-12) |
| | | UNIQUE (profile_id, platform) | |

**BRIEF** — a published opportunity (FR-21, FR-22).

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| brief_id | UUID | PK | |
| brand_id | UUID | FK → BRAND_PROFILE | |
| engagement_mode | ENUM | NOT NULL | `reach`, `commission` |
| title | VARCHAR(200) | NOT NULL | |
| description | TEXT | NOT NULL | |
| budget_min_minor, budget_max_minor | BIGINT | | |
| currency_code | CHAR(3) | NOT NULL | |
| closes_at | TIMESTAMPTZ | NOT NULL | |
| status | ENUM | NOT NULL | `draft`, `published`, `closed`, `withdrawn` |

**CONTRACT** — the agreement formed on award (FR-26).

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| contract_id | UUID | PK | |
| brief_id | UUID | FK → BRIEF | |
| creator_id, brand_id | UUID | FK | |
| agreed_fee_minor | BIGINT | NOT NULL | |
| commission_rate | NUMERIC(5,4) | NOT NULL | Frozen at award |
| currency_code | CHAR(3) | NOT NULL | |
| status | ENUM | NOT NULL | `pending_acceptance`, `active`, `completed`, `cancelled`, `disputed` |
| creator_accepted_at, brand_accepted_at | TIMESTAMPTZ | | Both required for `active` |

**MILESTONE** — the unit of funding and delivery (FR-27 to FR-32).

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| milestone_id | UUID | PK | |
| contract_id | UUID | FK → CONTRACT | |
| sequence_no | SMALLINT | NOT NULL | UNIQUE with contract_id |
| description | TEXT | NOT NULL | |
| amount_minor | BIGINT | NOT NULL, > 0 | Sum per contract = agreed_fee_minor |
| due_date | DATE | | |
| status | ENUM | NOT NULL | See §3.6 |
| revision_count | SMALLINT | NOT NULL DEFAULT 0 | Capped at 2 (FR-30) |
| funded_at, submitted_at, accepted_at | TIMESTAMPTZ | | |

**LEDGER_ENTRY** — append-only double entry. No row is ever updated or deleted.

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| entry_id | BIGSERIAL | PK | |
| transaction_id | UUID | NOT NULL | Groups the entries of one transaction |
| account_type | ENUM | NOT NULL | `brand_funding`, `escrow`, `creator_payable`, `platform_commission`, `provider_settlement` |
| account_owner_id | UUID | NULL | NULL for platform accounts |
| direction | ENUM | NOT NULL | `debit`, `credit` |
| amount_minor | BIGINT | NOT NULL, > 0 | |
| currency_code | CHAR(3) | NOT NULL | |
| milestone_id | UUID | FK, NULL | |
| idempotency_key | VARCHAR(160) | UNIQUE | Enforces NFR-08 at the database level |
| created_at | TIMESTAMPTZ | NOT NULL | |

**Invariant.** For every `transaction_id`, the sum of debits equals the sum of
credits in each currency. A reconciliation job asserts this continuously; a
violation raises an administrative alert.

Remaining entities: `BRAND_PROFILE`, `SKILL`, `PROFILE_SKILL`, `APPLICATION`,
`DELIVERABLE`, `REVIEW`, `MESSAGE`, `DISPUTE`, `PAYOUT`, `NOTIFICATION`,
`AUDIT_LOG`.

### 3.4.2 Indexing

| Index | Purpose |
|---|---|
| `USER(email)` unique | Login lookup |
| `CREATOR_PROFILE(country_code, primary_discipline, published_at)` | Search fallback path (UC-04/E1) |
| `BRIEF(status, closes_at)` | Open-brief listing |
| `APPLICATION(brief_id, creator_id)` unique | Enforces one application per creator (FR-23) |
| `MILESTONE(contract_id, sequence_no)` unique | Ordering |
| `LEDGER_ENTRY(idempotency_key)` unique | Duplicate-transaction prevention |
| `LEDGER_ENTRY(account_type, account_owner_id, created_at)` | Balance derivation |

Monetary values are stored as `BIGINT` minor units with an explicit currency code.
Floating-point types are used nowhere in the financial path.

## 3.5 Process Design

### 3.5.1 Escrow funding, delivery and release

Figure 3.3 traces the full transaction path — funding, submission, acceptance and
payout — across the client, API, service layer, ledger and payment provider. This
is the sequence realising UC-07 and UC-09, and it is where NFR-08 is won or lost.

> **Figure 3.3 — Sequence Diagram: Escrow Funding to Payout**

Three mechanisms deliver the correctness objective:

- **Idempotency keys.** Each monetary operation derives a deterministic key from
  its subject (for example `fund:<milestone_id>`). The unique constraint on
  `LEDGER_ENTRY.idempotency_key` makes a duplicate posting impossible even under
  concurrent retry — correctness rests on a database constraint, not on
  application discipline.
- **Atomic state and ledger transitions.** A milestone's status change and its
  ledger entries are written in one database transaction. A partially applied
  release cannot exist (UC-09/E1).
- **Reconciliation over rollback.** Where a provider's outcome is unknown
  (UC-07/A2), state is left unchanged and a scheduled job re-queries the provider
  with the original key until an authoritative answer is obtained. The system
  never guesses at a payment's outcome.

### 3.5.2 Creator verification

Figure 3.4 shows identity verification and audience-metric retrieval, both
asynchronous because both depend on third parties whose latency the platform does
not control.

> **Figure 3.4 — Sequence Diagram: Creator Verification and Metric Retrieval**

Where a social API is unavailable or rate-limited, the profile publishes with
metrics marked `self_declared` rather than failing (FR-12, risk R4). The
distinction is surfaced in the interface, so a brand always knows which figures
have been independently confirmed.

## 3.6 Milestone State Model

The milestone is the system's most heavily guarded state machine. Figure 3.5
gives its permitted transitions; any transition not shown is rejected by the
service layer.

> **Figure 3.5 — Milestone State Transition Diagram**

| State | Meaning | Permitted next states |
|---|---|---|
| `pending` | Defined, not yet funded | `funded`, `cancelled` |
| `funded` | Money in escrow; creator may begin | `in_progress` |
| `in_progress` | Creator working | `submitted` |
| `submitted` | Deliverable awaiting brand review | `accepted`, `in_progress` (revision, < 2), `disputed` |
| `accepted` | Approved; funds moved to creator payable | *terminal* |
| `disputed` | Frozen pending adjudication | `accepted`, `refunded`, `split` |
| `refunded` | Returned to brand by adjudication | *terminal* |
| `split` | Divided by adjudication | *terminal* |
| `cancelled` | Abandoned before funding | *terminal* |

Two rules are invariant: a milestone can never leave a funded state without a
balancing ledger transaction, and `cancelled` is reachable only from `pending`, so
funded money can never be discarded without an explicit financial outcome.

## 3.7 Interface Design

The interface is designed mobile-first at a 360 px baseline and progressively
enhanced (NFR-04). Figure 3.6 shows wireframes for the four screens that carry
the core workflow.

> **Figure 3.6 — User Interface Wireframes**

| Screen | Design intent |
|---|---|
| **Creator discovery** | Filters collapse behind a single control on narrow viewports; each result card leads with discipline, location and *whether the audience figure is verified*, because that is the trust signal brands said they lacked |
| **Creator profile** | Portfolio work appears above audience metrics, reflecting the interview finding that buyers judge on output first |
| **Brand campaign dashboard** | Contracts grouped by milestone state, so *awaiting my action* is answerable at a glance |
| **Milestone funding and review** | Commission and net amount shown before confirmation, never after; revision allowance displayed as a remaining count |

Interface conventions: a single accent colour for primary actions, one action per
screen; destructive and financial actions always confirmed with the amount
restated; every form field labelled and error-associated for screen readers
(NFR-06); skeleton states rather than spinners, so perceived latency stays low on
slow connections.

## 3.8 Security Design

| Concern | Control |
|---|---|
| Authentication | bcrypt cost ≥ 12; short-lived JWT access tokens with rotating refresh tokens; account lockout after five failures (FR-03, NFR-09) |
| Authorisation | Per-route middleware asserting both role and resource ownership; every contract, brief and milestone query scoped to the requesting principal (NFR-11) |
| Transport | TLS 1.2+ enforced; HSTS; secure, `HttpOnly`, `SameSite` cookies for refresh tokens |
| Data at rest | Database encryption at rest; KYC documents in a private bucket reachable only by short-lived pre-signed URL; payout instruments encrypted at column level (NFR-10) |
| Input handling | Schema validation on every endpoint; parameterised queries only; uploads restricted by MIME type, magic-number check and size |
| Abuse | Rate limiting per IP and per principal on authentication, search and application endpoints (NFR-12) |
| Financial integrity | Unique idempotency keys; append-only ledger; continuous reconciliation; no client-supplied amounts trusted — all amounts recomputed server-side from stored contract terms |
| Privacy | Consent recorded at collection; purpose limitation; 5-year KYC retention cap; export and erasure endpoints subject to statutory financial retention (NFR-13, NFR-14) |
| Audit | Append-only `AUDIT_LOG` capturing actor, action, subject, timestamp and reason for every administrative and financial event (NFR-15) |
| Secrets | Provider credentials in environment configuration, never in source; rotated on member departure |

**Threat model summary.** The four threats judged material are: account takeover
of a creator profile to redirect payouts (mitigated by re-authentication and
notification on payout-instrument change); a brand disputing in bad faith after
receiving usable work (mitigated by evidenced in-platform delivery and
adjudication); fabricated audience metrics (mitigated by API-sourced verification
and explicit labelling of self-declared figures); and replayed payment
instructions (mitigated by idempotency keys and provider-side references).

## 3.9 Deployment View

Figure 3.7 shows the deployment topology.

> **Figure 3.7 — Deployment Diagram**

| Node | Contents | Notes |
|---|---|---|
| CDN edge | Static client bundle | Cached close to users, serving NFR-02 |
| Application tier | Two or more stateless API replicas behind a load balancer | Horizontally scalable (NFR-18) |
| Worker tier | Queue consumers — metric refresh, email, reconciliation, index updates | Scaled independently of request traffic |
| Data tier | Managed PostgreSQL with automated backup and point-in-time recovery; Redis; Elasticsearch | PostgreSQL is the only system of record |
| Object storage | Public bucket for portfolio media; private bucket for KYC documents | Separated by sensitivity |
| External | Payment provider, KYC provider, social APIs, email provider | All reached through adapters (NFR-20) |

Environments are `development`, `staging` and `production`, with schema changes
applied only by versioned, reversible migrations. Deployment is by GitHub Actions
on a merge to `main`, gated on lint, unit, integration and coverage checks
(NFR-16).

## 3.10 Design Traceability

| Requirement | Design element |
|---|---|
| NFR-01 (search latency) | Elasticsearch index, §3.2; composite fallback index, §3.4.2 |
| NFR-02, NFR-04 (mobile, bandwidth) | CDN-served bundle, §3.9; mobile-first wireframes, §3.7 |
| NFR-08 (financial reliability) | Idempotency keys and append-only double-entry ledger, §3.4.1 and §3.5.1 |
| NFR-11 (server-side authorisation) | Per-route ownership middleware, §3.8 |
| NFR-15 (auditability) | `LEDGER_ENTRY` and `AUDIT_LOG`, both append-only, §3.4.1 and §3.8 |
| NFR-18 (scalability) | Stateless API tier, §3.2 and §3.9 |
| NFR-19 (currency handling) | `BIGINT` minor units with ISO 4217 code, §3.4.2 |
| NFR-20 (provider substitution) | Integration adapter layer, §3.2 and §3.3 |
| FR-28 to FR-32 (escrow) | Milestone state machine, §3.6; funding sequence, §3.5.1 |
| FR-12 (metric verification) | `SOCIAL_ACCOUNT.metrics_source` and refresh job, §3.4.1 and §3.5.2 |
| FR-30 (bounded revisions) | `MILESTONE.revision_count`, §3.4.1; guarded transition, §3.6 |
