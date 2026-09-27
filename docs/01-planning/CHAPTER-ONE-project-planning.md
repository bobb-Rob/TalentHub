# CHAPTER ONE
# PROJECT PLANNING

## 1.1 Introduction

TalentHub is a web-based marketplace that connects African digital creators with
the brands and businesses that wish to hire them. The project was undertaken by
Group 2 as the group assignment for CMP 722 (Software Engineering), Department of
Computing, Anchor University Lagos.

The group's first proposal was a personal portfolio website. That concept was
abandoned during Week 1 planning for a reason worth recording, because it shaped
everything that followed: a personal portfolio has exactly one subject. It
carries one name, one biography and one body of work. Four people cannot author
it fairly — whoever the site is about owns the deliverable and the remaining
three build someone else's artefact. The group therefore looked for a product
with a neutral subject, multiple distinct classes of user, and a transaction at
its centre, so that the work of requirements engineering and design would be
genuine rather than decorative. TalentHub is that product.

## 1.2 Background and Problem Statement

Africa's creator economy is expanding rapidly. Independent estimates place it
between US$3 billion and US$5.1 billion in 2026, with forecasts ranging from
US$17.8 billion by 2030 to US$29.8 billion by 2032 (Communiqué & TM Global,
2026; Contemeleon, 2026). Nigeria alone has over 6.3 million TikTok creators
with more than 1,000 followers, and YouTube paid Nigerian creators over
US$10 million in 2024.

The creators inside that economy are nevertheless not capturing its value.
The *Africa Creator Economy Report 2026* found that **60% of African creators
earn less than US$100 per month**, that 57% have fewer than 10,000 followers,
and that 40% regard creation as a hobby rather than a business. The constraint
is not talent or demand; it is the absence of functioning market infrastructure.
Five specific failures recur:

**(a) Discovery.** No trusted, searchable registry of African creative
professionals exists. Brands hire through personal networks or agencies, which
means the pool a brand can reach is a function of who it already knows.

**(b) Two-sided distrust.** Between 15% and 30% of influencer followings are
estimated to be artificial, costing brands around US$1.3 billion annually. In
the other direction, creators report briefs abandoned mid-campaign and invoices
never settled. As the co-founder of a Nigerian entrant put it, *"sometimes
creators would collect payment and then disappear. Briefs got ignored, and
agencies charged too much without real results."*

**(c) Payment fragmentation.** Cross-border settlement within Africa is
expensive and slow. A Kenyan brand engaging a Nigerian creator has no
straightforward, low-fee, protected route to pay.

**(d) Intermediary cost and exclusion.** Agencies charge substantial fees, while
international platforms set follower thresholds that exclude the micro and
mid-tier creators who form the majority of the market.

**(e) Unverifiable outcomes.** Campaign performance is largely self-reported.
Difficulty in proving return has now overtaken budget as brands' leading
concern, and 73% of influencer campaigns are reported to fail against objective.

**Problem statement.** African digital creators and the organisations that would
hire them have no shared, trustworthy marketplace in which identity and
capability are verified, agreements are recorded, payment is protected until work
is accepted, and settlement reaches the creator through instruments they actually
hold. The consequence is a market in which most participants earn very little
and most buyers cannot find or safely transact with them.

## 1.3 Aim and Objectives

**Aim.** To design and implement a web-based, mobile-first marketplace that
enables verified African digital creators to be discovered, contracted and paid
by brands through an escrow-protected workflow.

**Objectives.**

1. To analyse existing creator and freelance platforms serving African markets
   and identify the functional gap TalentHub addresses.
2. To elicit and specify the functional and non-functional requirements of the
   platform for all identified stakeholder classes.
3. To design the system architecture, data model and user interfaces.
4. To implement the platform incrementally across six weekly increments, each
   producing a demonstrable working slice.
5. To verify the delivered increments against the specified requirements through
   functional, usability and performance testing.

## 1.4 Scope

**Within scope.**

- Creator registration, profile management, portfolio upload and skills declaration
- Identity verification (KYC) and social-account linking for audience metrics
- Brand registration and organisation profiles
- Campaign and commission brief creation, publication and closure
- Creator search and filtering by skill, location, rate, audience size and rating
- Application, shortlisting, award and contracting workflow
- Milestone-based escrow: funds committed on award, released on acceptance
- Deliverable submission, review, revision request and acceptance
- Payouts to bank account and mobile money across supported African markets
- Two-way ratings and reviews after contract closure
- In-platform messaging between contracted parties
- Administrative moderation, dispute handling and platform reporting

**Outside scope.**

- Native mobile applications for iOS and Android (the web client is
  mobile-first and responsive; native apps are deferred)
- Automated content production or AI content generation
- Direct posting to creators' social accounts on their behalf
- Physical merchandise fulfilment or logistics
- Tax filing and statutory reporting on behalf of users
- Direct integration with advertising platforms for paid media buying

## 1.5 Review of Existing Systems

Nine platforms were reviewed across three groups: African influencer-marketing
platforms, creator monetisation tools, and global freelance marketplaces.
Figure 1.1 plots them against the two axes that matter: what a brand can
actually buy, and how well the platform serves African market infrastructure.

> **Figure 1.1 — Competitive positioning of platforms serving African digital creators**

| Platform | Category | Reach | Verification | Escrow | Local payout | Commissioned creative work |
|---|---|---|---|---|---|---|
| **Wowzi** | African influencer marketing | 23 countries, ~100,000 creators | Creator vetting | Not published | Mobile-app fulfilment | No — reach campaigns only |
| **Posse** | African influencer marketing | Pan-African, not published | Social data profiles | Not published | Not published | No |
| **Tikora** | African influencer marketing | 11+ countries, ~12,000 creators | KYC verified | **Yes** | Bank, mobile money, crypto | No — campaign types are reach-based |
| **Cofluenxa** | Nigerian influencer marketing | Nigeria, launched Oct 2025 | Algorithmic matching on engagement | Not published | Not published | No |
| **Plaqad / Trendupp / Rytar** | Nigerian influencer marketing | Nigeria | Varies | Not published | Local | No |
| **Selar / Mainstack** | Creator monetisation | Pan-African | Seller onboarding | N/A — direct sale | Local | No — sells creators' own products |
| **Upwork / Fiverr** | Global freelance | Global | Limited identity checks | Yes | Poor African coverage, high fees | Yes |
| **Upfluence / Aspire** | Global influencer marketing | Global | Audience analytics | Partial | No African rails | No |

**Findings.** The African platforms are, without exception, **influencer
marketing** platforms: what a brand buys is *access to the creator's own
audience*. Tikora is the most mature — it already provides KYC verification,
escrow and local payout, which are therefore not by themselves a differentiator
and the group does not claim them as one.

The gap is on the other axis. None of the African platforms serve the digital
creator as a **commissioned craft professional** — the motion designer, video
editor, photographer, illustrator, podcast producer or copywriter whose
deliverable is a piece of creative work handed to the client, not a post to their
own followers. A Lagos brand needing a motion designer has only the global
freelance marketplaces, which impose global price competition, weak identity
verification, and payout rails that serve African creators badly. Conversely, the
global freelance marketplaces have no concept of verified audience, so a creator
whose value is genuinely their reach cannot represent it there.

**Positioning.** TalentHub is therefore specified as a **dual-mode** marketplace.
A single verified creator profile carries both a portfolio of craft work and
authenticated audience metrics, and a brand may engage that creator either for a
*reach campaign* or for a *commissioned deliverable*, under one contracting,
escrow and payout mechanism. No reviewed platform spans both modes, and the
unified profile is what makes spanning them coherent rather than merely adjacent.

## 1.6 Feasibility Study

**Technical feasibility.** The platform is a conventional three-tier web
application with well-understood components: a responsive client, a REST API, a
relational datastore, object storage for portfolio media, and third-party
integrations for payments, KYC and social metrics. Every integration required is
available as a documented commercial API in the target markets — Paystack and
Flutterwave for collections and payouts, Smile Identity or Dojah for KYC, and the
official Instagram Graph, TikTok and YouTube Data APIs for audience metrics. The
team holds prior React and Node.js experience. The one substantive technical risk
is correctness of the escrow ledger, which is addressed in design by
double-entry bookkeeping and idempotent transitions rather than by ad-hoc balance
updates. **Assessed: feasible.**

**Economic feasibility.** Development cost within the course is the team's own
time — four members at 7–10 hours per week over six weeks, approximately 200–240
person-hours. Recurring infrastructure cost for a demonstration deployment is
low: managed hosting, a managed PostgreSQL instance and object storage fall
within free or entry tiers, and the payment and KYC providers charge per
transaction rather than by subscription. The commercial model is a commission on
completed contracts, benchmarked against the 15% charged by the closest
comparator. **Assessed: feasible within course constraints.**

**Operational feasibility.** The workflow TalentHub encodes — brief, apply,
award, deliver, approve, pay — is the workflow both sides already follow
informally over WhatsApp, email and bank transfer. The platform formalises an
existing practice rather than asking users to adopt an unfamiliar one, which
materially lowers the adoption barrier. The principal operational demand is
dispute resolution, which requires human adjudication and is specified as an
administrative function. **Assessed: feasible.**

**Legal and regulatory feasibility.** Holding client funds in escrow is a
regulated activity. The design avoids taking custody of funds directly:
settlement is orchestrated through licensed payment service providers, with
TalentHub recording entitlement rather than holding balances. Nigeria's Data
Protection Act 2023 governs the personal and KYC data processed, requiring lawful
basis, purpose limitation, and data-subject rights; the design therefore
specifies consent capture, retention limits and export/erasure endpoints.
Contracts formed between brand and creator are between those parties, with
TalentHub as platform rather than employer. **Assessed: feasible, with the
compliance obligations above carried into the requirements as NFRs.**

**Schedule feasibility.** Six weeks is short for the full scope of §1.4. The
incremental model in §1.8 exists precisely to manage this: Increments 1–4
deliver the core transactional path and constitute the minimum viable
deliverable, while ratings, messaging and analytics in Increments 5–6 are
explicitly de-scopable if velocity falls short. **Assessed: feasible for the
core path; peripheral scope at risk and consciously ordered last.**

## 1.7 Team Roles and Responsibilities

| Member | Role | Responsibilities | Principal deliverables |
|---|---|---|---|
| **Robertson** | Project Manager 1 | Overall coordination, timeline, stakeholder communication, requirements sign-off, repository administration, final presentation | Project charter, requirements specification, weekly status reports, retrospective |
| **David** | Project Manager 2 / Technical Lead | Architecture decisions, code review and standards, environment and build pipeline, deployment, performance | Architecture and design documents, code style guide, deployment playbook |
| **Mercy** | QA Tester | Test planning, functional and non-functional verification, cross-browser and responsive testing, accessibility, defect reporting and sign-off | Test plan, test cases, defect reports, QA sign-off |
| **Olufems** | Developer | Feature implementation, data layer, third-party integrations, technical documentation of code | Application source, database migrations, integration modules |

Code review is mandatory: no branch merges without review by the Technical Lead,
and no increment closes without QA sign-off.

## 1.8 Choice of SDLC Model

The **incremental / iterative** model was selected. Each increment passes through
its own requirements, design, build and test activities and terminates in a
working, demonstrable slice of the platform; requirements are re-examined at each
increment boundary rather than frozen after analysis. Figure 1.2 shows the model
as applied here.

> **Figure 1.2 — The incremental / iterative model as applied to TalentHub**

**Justification.**

- *Requirements will change.* The group is not the customer. Understanding of how
  brands and creators actually transact improved materially between Week 1 and
  Week 3, and a model that forbids revision would have forced the team to build
  against a specification it knew to be wrong.
- *Risk is front-loadable.* The riskiest element is the escrow and payout path.
  Incremental delivery allows it to be built and tested in Increment 3, with three
  increments of slack remaining, instead of arriving during integration.
- *Assessment requires demonstrable progress.* A working slice every week gives
  the module supervisor something to assess continuously and gives the team an
  early signal when velocity is wrong.
- *De-scoping is graceful.* Because increments are ordered by importance, running
  short of time removes peripheral features rather than leaving the core
  half-built.

**Models rejected.** *Waterfall* was rejected because it assumes stable,
fully-known requirements — untrue here — and defers all integration risk to the
end of a six-week schedule. *Full Scrum* was rejected as disproportionate: with
four part-time members and a six-week horizon, the ceremony overhead would
consume a significant share of available effort, and the module requires formal
phase documentation that Scrum does not naturally produce. The chosen model
retains iteration while still yielding the planning, requirements and design
artefacts the assessment expects.

## 1.9 Increment Roadmap

Figure 1.3 gives the six-week schedule, the dependency between increments, and
the two activities that run continuously across all of them.

> **Figure 1.3 — Six-increment delivery roadmap**

| # | Week | Increment theme | Scope delivered | Exit criterion |
|---|---|---|---|---|
| 1 | 1 | Foundation | Repository, environment, CI, schema baseline, authentication, role selection | A user can register, verify email, log in and be routed by role |
| 2 | 2 | Identity & profiles | Creator profile, portfolio upload, skills taxonomy, KYC submission, brand organisation profile | A creator can publish a complete profile; a brand can publish an organisation |
| 3 | 3 | Discovery & briefs | Creator search and filtering, campaign/commission brief creation and publication, applications | A brand can publish a brief and receive applications; a creator can be found by filter |
| 4 | 4 | Contracting & escrow | Award, contract generation, milestone definition, escrow funding, deliverable submission, review and acceptance, payout release | A brand can fund, receive, accept and pay for a deliverable end to end |
| 5 | 5 | Trust & communication | Two-way ratings and reviews, in-platform messaging, notifications, dispute raising | A completed contract yields reviews on both sides; parties can message in-platform |
| 6 | 6 | Hardening & release | Admin moderation console, reporting, accessibility and performance remediation, regression testing, deployment | Regression suite passes; platform deployed; QA sign-off issued |

Increments 1–4 constitute the minimum viable deliverable. Increments 5 and 6
carry the de-scopable scope identified in §1.6.

## 1.10 Risk Register

Exposure is scored as Probability × Impact on a 1–5 scale.

| ID | Risk | P | I | Exp | Response |
|---|---|---|---|---|---|
| R1 | Payment provider sandbox approval delayed, blocking escrow development | 4 | 5 | 20 | Abstract payments behind a provider interface; build and test against a mock provider so Increment 4 is not gated on external approval |
| R2 | Six-week schedule insufficient for full scope | 4 | 4 | 16 | Increments ordered by importance; Increments 5–6 pre-identified as de-scopable; weekly velocity review at increment boundary |
| R3 | Escrow ledger defects causing incorrect balances | 3 | 5 | 15 | Double-entry ledger, idempotent state transitions, reconciliation test suite written before the feature |
| R4 | Social platform API rate limits or access restrictions block audience verification | 3 | 4 | 12 | Cache metrics with scheduled refresh; degrade to creator-declared figures marked *unverified* rather than failing the profile |
| R5 | Member unavailability through illness or examination clash | 3 | 4 | 12 | Documented handover per role; no single-owner critical path; pair on the escrow module |
| R6 | KYC provider cost or coverage gaps in target markets | 3 | 3 | 9 | Provider abstracted behind an interface; manual administrative verification as fallback path |
| R7 | Scope creep from stakeholder feedback during increments | 3 | 3 | 9 | Change requests logged as backlog items against a future increment, never admitted mid-increment |
| R8 | Data protection non-compliance in handling KYC data | 2 | 5 | 10 | Consent capture, encryption at rest, retention limits and erasure endpoint specified as NFRs in Chapter Two |
| R9 | Integration failures surfacing late | 2 | 4 | 8 | Continuous integration from Increment 1; integration tests per increment rather than a terminal integration phase |

R1, R2 and R3 are the three highest exposures and are reviewed at every weekly
standup.

---

### References

Communiqué & TM Global (2026) *Africa Creator Economy Report 2026*. Reported by
Techpoint Africa. Available at:
https://techpoint.africa/news/africa-creator-economy-report-2026/

Contemeleon (2026) *The State of the Creator Economy in Africa: Data, Trends, and
the Road to $30 Billion*. Available at:
https://www.contemeleon.com/blog/state-of-creator-economy-in-africa

TechCabal (2025) *Nigerian Tech Startup, Cofluenxa, Launches to Streamline
Influencer Marketing in Africa*. Available at:
https://techcabal.com/2025/10/02/exclusive-nigerian-tech-startup-cofluenxa-launches-to-streamline-influencer-marketing-in-africa/

Tikora (2026) *Africa's Influencer Marketing Platform*. Available at:
https://www.tikora.app/

Wowzi (2026) *Connecting Brands with Africa's Top Creators*. Available at:
https://www.wowzi.co/

Posse (2026) *Influencer Marketing Platform for Brands & Creators*. Available at:
https://www.posse.africa/
