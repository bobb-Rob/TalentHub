# CHAPTER TWO
# REQUIREMENTS ANALYSIS

## 2.1 Requirements Elicitation Approach

Four techniques were used, chosen for what was achievable within the course
timetable.

| Technique | Applied to | Output |
|---|---|---|
| Document analysis | *Africa Creator Economy Report 2026*, Contemeleon market study, trade press coverage of African platforms | Quantified problem statement; earnings, verification and payment failure data |
| Competitive system analysis | Nine platforms (§1.5) | Baseline feature set; identification of the commissioned-work gap |
| Informal interviews | Three practising creators (a photographer, a video editor and a micro-influencer) and two small-business owners who had commissioned creative work | Pain points in payment timing, brief clarity and scope disputes |
| Analogy analysis | Escrow and milestone mechanics of general freelance marketplaces | Contracting and deliverable-review workflow patterns |

The interviews changed the specification in two concrete ways. First, creators
raised *scope disputes* — work accepted then endlessly revised — more often than
outright non-payment, which produced the bounded revision limit in FR-30. Second,
both buyers described judging creators on **past work**, not follower counts,
which is what led to the portfolio being a first-class entity rather than an
optional profile field.

## 2.2 Stakeholder Analysis

| Stakeholder | Interest in the system | Influence | Key requirement |
|---|---|---|---|
| **Creator** (primary user) | Be found, be hired, be paid reliably | High | Verified profile; payment protected before work begins |
| **Brand / Business** (primary user) | Find suitable creators; get usable work for money spent | High | Trustworthy discovery; funds not released until work is accepted |
| **Platform Administrator** | Keep the marketplace safe and solvent | High | Moderation, verification override, dispute adjudication |
| **Payment Service Provider** | Regulatory compliance of flows it settles | High (external) | Correct, auditable, idempotent transaction instructions |
| **KYC Provider** | Accurate identity submissions | Medium (external) | Conformant document and biometric submission |
| **Social Platform APIs** | Terms-of-service compliance | Medium (external) | Authorised, rate-limited metric retrieval |
| **Module Supervisor** | Evidence of sound engineering process | High (assessment) | Complete, traceable SDLC documentation |
| **Agencies** (secondary) | Manage several brands' campaigns | Low | Out of scope for this release; noted for future work |

## 2.3 System Context

TalentHub sits between two classes of human user and four external services.
Figure 2.1 shows the system boundary and every crossing of it.

> **Figure 2.1 — System Context Diagram**

The boundary matters for a specific reason recorded in §1.6: money crosses it in
both directions, but TalentHub never holds it. The platform instructs the payment
service provider and records entitlement; custody stays with the licensed
provider.

## 2.4 Functional Requirements

Priority follows MoSCoW: **M** must have, **S** should have, **C** could have.
The *Inc.* column gives the increment that delivers the requirement.

### 2.4.1 Account and identity

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-01 | The system shall allow a visitor to register as either a Creator or a Brand, capturing email, password and role. | M | 1 |
| FR-02 | The system shall verify a registered email address by time-limited token before granting access to transactional features. | M | 1 |
| FR-03 | The system shall authenticate returning users by email and password, and shall lock an account after five consecutive failed attempts. | M | 1 |
| FR-04 | The system shall allow a user to reset a forgotten password via a single-use, time-limited link. | M | 1 |
| FR-05 | The system shall route an authenticated user to the dashboard corresponding to their role. | M | 1 |
| FR-06 | The system shall allow a Creator to submit identity documents for KYC verification and shall display verification status as *unverified*, *pending*, *verified* or *rejected*. | M | 2 |
| FR-07 | The system shall allow an Administrator to override a KYC outcome, recording the acting administrator and a reason. | S | 6 |

### 2.4.2 Creator profile and portfolio

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-08 | The system shall allow a Creator to maintain a profile comprising display name, biography, country, city, languages and primary discipline. | M | 2 |
| FR-09 | The system shall allow a Creator to declare skills from a controlled taxonomy, each with a self-assessed proficiency level. | M | 2 |
| FR-10 | The system shall allow a Creator to upload portfolio items (image, video or document, with title, description and role played) to a maximum of 20 items. | M | 2 |
| FR-11 | The system shall allow a Creator to link social accounts by OAuth and shall retrieve follower count and engagement rate from the platform's official API. | M | 2 |
| FR-12 | The system shall mark audience metrics as *verified* when retrieved by API and *self-declared* when entered manually, and shall refresh verified metrics at least every 7 days. | M | 2 |
| FR-13 | The system shall allow a Creator to publish a day rate and a project-based rate per discipline, in a selected currency. | M | 2 |
| FR-14 | The system shall allow a Creator to set availability as *available*, *limited* or *unavailable*. | S | 2 |

### 2.4.3 Brand profile

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-15 | The system shall allow a Brand to maintain an organisation profile comprising legal name, trading name, country, sector, website and logo. | M | 2 |
| FR-16 | The system shall allow a Brand to invite additional users into its organisation with either *administrator* or *member* permission. | C | 6 |

### 2.4.4 Discovery

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-17 | The system shall allow a Brand to search Creators by free text across name, biography and portfolio titles. | M | 3 |
| FR-18 | The system shall allow results to be filtered by discipline, skill, country, city, engagement mode, rate range, audience size band, verification status and average rating. | M | 3 |
| FR-19 | The system shall allow results to be sorted by relevance, rating, rate or audience size, and shall paginate at 20 per page. | M | 3 |
| FR-20 | The system shall allow a Brand to save a Creator to a named shortlist. | S | 3 |

### 2.4.5 Briefs and applications

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-21 | The system shall allow a Brand to create a brief specifying engagement mode (*reach campaign* or *commissioned work*), title, description, required skills, deliverables, budget, currency and closing date. | M | 3 |
| FR-22 | The system shall allow a Brand to save a brief as a draft, publish it, or close it to further applications. | M | 3 |
| FR-23 | The system shall allow a Creator to apply to a published brief with a covering note and a proposed fee, and shall prevent more than one application per Creator per brief. | M | 3 |
| FR-24 | The system shall allow a Brand to mark an application as *shortlisted*, *rejected* or *awarded*. | M | 3 |
| FR-25 | The system shall allow a Brand to invite a specific Creator directly to a brief without a prior application. | S | 3 |

### 2.4.6 Contracting, escrow and delivery

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-26 | On award, the system shall generate a contract recording the parties, scope, agreed fee, platform commission, deliverables, milestones and acceptance criteria, requiring acceptance by both parties. | M | 4 |
| FR-27 | The system shall allow a contract to be divided into one or more milestones, each with a description, amount and due date, the sum of which equals the agreed fee. | M | 4 |
| FR-28 | The system shall require the Brand to fund a milestone into escrow before the Creator may begin it, and shall not permit submission against an unfunded milestone. | M | 4 |
| FR-29 | The system shall allow a Creator to submit deliverables against a funded milestone as file uploads or external links, with a submission note. | M | 4 |
| FR-30 | The system shall allow a Brand to accept a submission, or request revision with stated reasons, to a maximum of two revision requests per milestone. | M | 4 |
| FR-31 | The system shall automatically accept a submission not acted upon within 7 days of submission, and shall notify both parties before doing so. | M | 4 |
| FR-32 | On acceptance, the system shall release the milestone amount less platform commission to the Creator's payout balance, and shall record the movement as a double-entry ledger transaction. | M | 4 |
| FR-33 | The system shall allow a Creator to withdraw an available payout balance to a registered bank account or mobile money wallet. | M | 4 |
| FR-34 | The system shall allow either party to cancel a contract before any milestone is funded, without penalty. | S | 4 |
| FR-35 | The system shall allow either party to raise a dispute on a funded milestone, which shall freeze the milestone pending administrative adjudication. | M | 5 |
| FR-36 | The system shall allow an Administrator to resolve a dispute by releasing to the Creator, refunding to the Brand, or splitting the milestone amount, recording a reason. | M | 5 |

### 2.4.7 Trust, communication and administration

| ID | Requirement | Pri | Inc. |
|---|---|---|---|
| FR-37 | The system shall allow each party to rate the other from 1 to 5 with a written review after contract completion, and shall publish reviews only once both are submitted or 14 days have elapsed. | M | 5 |
| FR-38 | The system shall compute and display each user's mean rating and completed-contract count. | M | 5 |
| FR-39 | The system shall allow messaging between parties to an active contract or an open application, retaining message history against the contract. | M | 5 |
| FR-40 | The system shall notify users of application, award, funding, submission, acceptance, payout and dispute events by in-app notification and email. | M | 5 |
| FR-41 | The system shall allow a user to report a profile, brief or message for policy violation. | S | 6 |
| FR-42 | The system shall allow an Administrator to suspend a user, withdraw a brief, and view an audit trail of administrative actions. | M | 6 |
| FR-43 | The system shall present an Administrator dashboard reporting registrations, published briefs, contract value, escrow held, disputes open and commission earned over a selected period. | S | 6 |

## 2.5 Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | Search results shall return within 2 seconds at the 95th percentile for a catalogue of 50,000 creator profiles. |
| NFR-02 | Performance | Any page shall achieve first contentful paint within 3 seconds on a 3G connection at 400 kbps. |
| NFR-03 | Performance | The system shall sustain 500 concurrent authenticated sessions without degradation beyond NFR-01. |
| NFR-04 | Usability | The interface shall be operable on a viewport of 360 px width without horizontal scrolling. |
| NFR-05 | Usability | A first-time Creator shall be able to publish a complete profile within 10 minutes without assistance. |
| NFR-06 | Accessibility | The interface shall conform to WCAG 2.1 Level AA, including keyboard operability and a minimum 4.5:1 text contrast ratio. |
| NFR-07 | Availability | The platform shall target 99.5% monthly availability, excluding announced maintenance. |
| NFR-08 | Reliability | No financial transaction shall be lost or double-applied; all monetary state transitions shall be idempotent under retry. |
| NFR-09 | Security | Passwords shall be stored using bcrypt at cost factor 12 or greater; plaintext passwords shall never be logged or persisted. |
| NFR-10 | Security | All traffic shall be served over TLS 1.2 or above; KYC documents and payout instruments shall be encrypted at rest. |
| NFR-11 | Security | Authorisation shall be enforced server-side on every request; no endpoint shall rely on client-side role checks. |
| NFR-12 | Security | Authentication endpoints shall be rate-limited to 10 attempts per IP address per minute. |
| NFR-13 | Privacy | Personal and KYC data shall be processed on a recorded lawful basis under the Nigeria Data Protection Act 2023; KYC documents shall be retained no longer than 5 years after account closure. |
| NFR-14 | Privacy | A user shall be able to export their personal data and request erasure, subject to statutory retention of financial records. |
| NFR-15 | Auditability | Every monetary movement and administrative action shall be recorded immutably with actor, timestamp and reason. |
| NFR-16 | Maintainability | Code shall pass linting and achieve at least 70% unit-test line coverage on service and ledger modules before merge. |
| NFR-17 | Portability | The client shall function on current versions of Chrome, Firefox, Safari and Edge, and on Android 9+ and iOS 14+ browsers. |
| NFR-18 | Scalability | The application tier shall be stateless so that capacity can be added by horizontal replication. |
| NFR-19 | Localisation | Monetary values shall be stored in minor units with an explicit ISO 4217 currency code; no cross-currency arithmetic shall occur without a recorded rate. |
| NFR-20 | Interoperability | Each external provider (payments, KYC, social metrics) shall be accessed through an internal interface permitting substitution without changes to business logic. |

## 2.6 Use Case Model

Four actors interact with the system: **Creator**, **Brand**, **Administrator**
and the external **Payment Service Provider**. Figure 2.2 shows the use case
model.

> **Figure 2.2 — Use Case Diagram**

## 2.7 Use Case Specifications

Three use cases are specified in full: the two that carry the highest risk
(escrow funding and payout release) and the one that defines the product's
core value (creator discovery).

### UC-07 — Fund Milestone into Escrow

| Field | Detail |
|---|---|
| **ID / Name** | UC-07 — Fund Milestone into Escrow |
| **Actor** | Brand (primary), Payment Service Provider (secondary) |
| **Requirements** | FR-28, FR-32, NFR-08, NFR-15, NFR-19 |
| **Pre-conditions** | A contract exists and has been accepted by both parties; the target milestone is in state *pending*; the Brand is authenticated and authorised on the contract |
| **Post-conditions** | The milestone is in state *funded*; a double-entry ledger transaction records the movement; the Creator is notified and may begin work |
| **Trigger** | The Brand selects *Fund milestone* on a contract |

**Main flow**

1. The Brand selects a milestone in state *pending*.
2. The system displays the milestone amount, the platform commission and the total payable.
3. The Brand confirms and selects a payment method.
4. The system creates a payment intent with an idempotency key derived from the milestone identifier and initiates the transaction with the Payment Service Provider.
5. The Provider authorises the payment and returns a confirmation reference.
6. The system posts a ledger transaction debiting the Brand's funding account and crediting the escrow account for the milestone amount.
7. The system sets the milestone to *funded*, records the provider reference, and notifies the Creator.

**Alternative flows**

- *A1 — Payment declined (step 5).* The Provider returns a decline. The system leaves the milestone *pending*, posts no ledger entry, records the failure against the attempt, and invites the Brand to retry or choose another method. Returns to step 3.
- *A2 — Provider timeout (step 5).* No response is received within the configured window. The system marks the attempt *indeterminate* and does not change milestone state. A reconciliation job re-queries the Provider using the original idempotency key and completes or abandons the attempt on the authoritative answer. No second charge can occur, satisfying NFR-08.
- *A3 — Duplicate submission (step 4).* The same idempotency key is presented again. The system returns the outcome of the original attempt without initiating a second transaction.

**Exception**

- *E1 — Milestone no longer fundable.* The milestone has been cancelled or funded since the page was rendered. The system rejects the request with an explanatory message and re-renders current contract state.

### UC-09 — Accept Deliverable and Release Payment

| Field | Detail |
|---|---|
| **ID / Name** | UC-09 — Accept Deliverable and Release Payment |
| **Actor** | Brand (primary), Creator and Payment Service Provider (secondary) |
| **Requirements** | FR-29, FR-30, FR-31, FR-32, FR-33, NFR-08, NFR-15 |
| **Pre-conditions** | The milestone is in state *submitted*; the Brand is authorised on the contract |
| **Post-conditions** | The milestone is *accepted*; the net amount is credited to the Creator's payout balance; commission is recognised; both parties are notified and invited to review |
| **Trigger** | The Brand selects *Accept* on a submission, or the 7-day auto-acceptance timer elapses |

**Main flow**

1. The Brand opens the submission and reviews the attached deliverables.
2. The Brand selects *Accept*.
3. The system computes the platform commission and the net amount due to the Creator.
4. The system posts a ledger transaction debiting escrow and crediting the Creator's payout balance and the platform commission account.
5. The system sets the milestone to *accepted*.
6. Where the accepted milestone is the contract's last, the system sets the contract to *completed* and opens the review window (FR-37).
7. The system notifies the Creator that funds are available for withdrawal.

**Alternative flows**

- *A1 — Revision requested (step 2).* The Brand selects *Request revision* and supplies reasons. If fewer than two revisions have been requested on this milestone, the system returns it to *in progress*, records the request, and notifies the Creator. On the third attempt the option is unavailable and the Brand must accept or raise a dispute (FR-35).
- *A2 — Auto-acceptance (trigger).* Seven days elapse without action. The system notifies both parties 24 hours in advance, then executes steps 3–7 with the acting party recorded as *system*.
- *A3 — Dispute raised (step 2).* The Brand raises a dispute instead of accepting. The milestone moves to *disputed*, escrow is frozen, and UC-12 (Adjudicate Dispute) takes over.

**Exception**

- *E1 — Ledger posting fails (step 4).* The transaction is rolled back atomically and the milestone remains *submitted*. No partial credit is possible. The failure is logged for administrative attention.

### UC-04 — Search and Filter Creators

| Field | Detail |
|---|---|
| **ID / Name** | UC-04 — Search and Filter Creators |
| **Actor** | Brand |
| **Requirements** | FR-17, FR-18, FR-19, FR-20, NFR-01, NFR-04 |
| **Pre-conditions** | The Brand is authenticated |
| **Post-conditions** | A paginated, ordered result set of published Creator profiles is displayed; applied filters are reflected in the URL so the search is shareable |
| **Trigger** | The Brand submits a search term or applies a filter |

**Main flow**

1. The Brand enters a search term and/or applies filters (discipline, skill, country, engagement mode, rate range, audience band, verification status, minimum rating).
2. The system validates filter values and rejects incoherent ranges.
3. The system queries published, non-suspended Creator profiles matching all applied criteria.
4. The system orders results by the selected criterion, defaulting to relevance, and returns the first 20.
5. The system displays each result as a card showing name, discipline, location, verification badge, audience figure with its verification state, rate and mean rating.
6. The Brand may page through results, refine filters, open a profile, or save a Creator to a shortlist.

**Alternative flows**

- *A1 — No matches (step 4).* The system reports that no creators match, states which filters are active, and offers to relax the most restrictive.
- *A2 — Filter combination too narrow.* The system suggests the nearest broader criterion — typically widening the rate range or audience band.

**Exception**

- *E1 — Search backend unavailable.* The system degrades to a direct database query on discipline, country and skill only, and states that ranked relevance is temporarily unavailable.

## 2.8 User Stories by Increment

**Increment 1 — Foundation**

- As a visitor, I want to register as a creator or a brand so that the platform presents the right tools for me.
- As a user, I want to verify my email address so that my account is trusted.
- As a returning user, I want to log in and land on my own dashboard so that I can resume work.
- As a user, I want to reset my password so that a forgotten password does not lock me out.

**Increment 2 — Identity and profiles**

- As a creator, I want to publish a profile with my biography, location and discipline so that brands understand what I do.
- As a creator, I want to upload past work so that brands can judge me on output rather than follower count.
- As a creator, I want to link my social accounts so that my audience figures are verified rather than merely claimed.
- As a creator, I want to complete identity verification so that brands can see I am a real, accountable person.
- As a brand, I want to publish an organisation profile so that creators can see who is hiring them.

**Increment 3 — Discovery and briefs**

- As a brand, I want to filter creators by skill, location and rate so that I can build a shortlist quickly.
- As a brand, I want to publish a brief so that suitable creators come to me.
- As a creator, I want to apply to a brief with a note and a fee so that I can win work I am suited to.
- As a brand, I want to shortlist and reject applications so that I can manage a large response.

**Increment 4 — Contracting and escrow**

- As a brand, I want a contract generated on award so that scope and fee are recorded before work starts.
- As a creator, I want the brand's money held in escrow before I begin so that I am not working on trust alone.
- As a creator, I want to submit my deliverables in the platform so that delivery is evidenced.
- As a brand, I want to request a bounded number of revisions so that I get usable work without the scope becoming open-ended.
- As a creator, I want payment released on acceptance and withdrawable to my bank or mobile money so that I am actually paid.

**Increment 5 — Trust and communication**

- As either party, I want to rate and review the other after completion so that reputation accumulates.
- As either party, I want to message in-platform so that the conversation stays attached to the contract.
- As either party, I want to raise a dispute so that a stalemate has a route out.
- As an administrator, I want to adjudicate disputes so that frozen funds can be resolved fairly.

**Increment 6 — Hardening and release**

- As an administrator, I want to suspend abusive accounts and withdraw offending briefs so that the marketplace stays safe.
- As an administrator, I want a reporting dashboard so that I can see the platform's health.
- As any user, I want the platform to work on my phone over a slow connection so that I can use it where I actually am.

## 2.9 Data Flow

Figure 2.3 decomposes the platform into its five major processes and the data
stores they read and write.

> **Figure 2.3 — Level 1 Data Flow Diagram**

## 2.10 Requirements Traceability Matrix

| Objective (§1.3) | Requirements | Use cases | Increment | Verification |
|---|---|---|---|---|
| 2 — Specify requirements for all stakeholder classes | FR-01 to FR-43, NFR-01 to NFR-20 | UC-01 to UC-13 | 1–6 | Supervisor review of this chapter |
| Secure, role-based access | FR-01 to FR-05, NFR-09 to NFR-12 | UC-01, UC-02 | 1 | Functional and penetration testing |
| Verified creator identity and capability | FR-06 to FR-14 | UC-03 | 2 | Functional testing; KYC sandbox verification |
| Trustworthy discovery | FR-17 to FR-20, NFR-01 | UC-04 | 3 | Functional testing; load test at 50,000 profiles |
| Brief-to-application workflow | FR-21 to FR-25 | UC-05, UC-06 | 3 | Functional testing |
| Escrow-protected contracting | FR-26 to FR-34, NFR-08, NFR-15, NFR-19 | UC-07, UC-08, UC-09 | 4 | Ledger reconciliation suite; idempotency tests |
| Dispute resolution | FR-35, FR-36 | UC-12 | 5 | Functional testing of all three resolution outcomes |
| Accumulated reputation | FR-37, FR-38 | UC-10 | 5 | Functional testing |
| Communication and notification | FR-39, FR-40 | UC-11 | 5 | Functional testing; email delivery verification |
| Platform governance | FR-07, FR-41 to FR-43, NFR-15 | UC-13 | 6 | Functional testing; audit trail inspection |
| 5 — Verify against specification | All NFRs | — | 6 | Mercy's test plan; QA sign-off |
| Mobile-first, low-bandwidth access | NFR-02, NFR-04, NFR-06, NFR-17 | All | 6 | Lighthouse audit; throttled-network testing; WCAG audit |

Every functional requirement traces to at least one use case and exactly one
increment; every objective in §1.3 traces to a verification activity.
