# TalentHub

**A creator–brand collaboration marketplace for the African digital creator economy.**

TalentHub is the group software engineering project of **Group 2, CMP 722
(Software Engineering)**, Department of Computing, Anchor University Lagos —
Postgraduate Diploma in Computing, 2025/2026 session. The product concept, its
requirements, and its design were all produced as coursework for this module;
this repository is both the engineering artefact and the assessment submission.

---

## 1. The problem

Africa's creator economy is growing quickly — variously estimated at US$3–5
billion in 2026 and forecast between US$17.8 billion and US$29.8 billion by the
early 2030s — yet the creators inside it are not capturing that value. Around
**six in ten African creators earn less than US$100 a month**, and 57% have
fewer than 10,000 followers, which places them below the threshold most
international influencer-marketing platforms will onboard.

The friction is structural, not a shortage of talent or demand:

- **Discovery.** There is no trusted, searchable registry of African creators
  with verified audience data. Brands fall back on personal networks and
  agencies.
- **Trust in both directions.** An estimated 15–30% of influencer followings are
  artificial, costing brands roughly US$1.3 billion a year globally. Creators, in
  turn, report briefs abandoned mid-campaign and invoices left unpaid.
- **Payments.** Cross-border payout rails are fragmented. A Kenyan brand hiring
  a Nigerian creator has no straightforward, low-fee, escrow-backed way to pay.
- **Intermediary cost.** Agencies charge substantial fees while micro and
  mid-tier creators — the majority — remain effectively unreachable to the small
  and medium brands that would hire them.
- **Measurement.** Campaign performance is largely self-reported. Difficulty
  proving return has now overtaken budget as brands' leading concern.

## 2. The proposition

TalentHub is a two-sided marketplace with a transactional core. Creators hold a
verified profile carrying portfolio work and platform-authenticated audience
metrics. Brands post campaign briefs, search and filter the creator registry,
and contract directly. Money moves through **escrow**: funds are committed at
contract award, held while deliverables are submitted and reviewed, and released
on approval — which is what makes the trust problem tractable in both
directions at once. Payouts settle through African payment rails, so a creator is
paid in a currency and to an instrument they actually hold.

The platform deliberately serves the **micro and mid-tier** segment that larger
platforms exclude, and treats mobile-first, low-bandwidth access as a primary
constraint rather than an afterthought.

## 3. Delivery model

The project follows an **incremental / iterative** SDLC across six weekly
increments. Each increment closes with a working, demonstrable slice of the
platform, and requirements are revisited at each increment boundary rather than
frozen after analysis.

## 4. Team

| Member | Role | Responsibility |
|---|---|---|
| **Robertson** | Project Manager 1 | Coordination, timeline, stakeholder communication, requirements sign-off |
| **David** | Project Manager 2 / Technical Lead | Architecture decisions, code review, build and deployment pipeline |
| **Mercy** | QA Tester | Test planning, functional and non-functional verification, defect reporting |
| **Olufems** | Developer | Feature implementation, data layer, integrations |

## 5. Documentation

The SDLC document set lives under `docs/`:

| Phase | Location | Contents |
|---|---|---|
| Planning | `docs/01-planning/` | Project charter, feasibility study, competitor analysis, increment roadmap, risk register |
| Requirements Analysis | `docs/02-requirements/` | Stakeholder analysis, functional and non-functional requirements, use cases, user stories, traceability matrix |
| System Design | `docs/03-design/` | Architecture, data model and dictionary, sequence and activity diagrams, interface design, security design |
| Diagrams | `docs/diagrams/` | Source SVG and rendered PNG for every figure in the document set |

A combined Word document of the full set is produced for submission.

## 6. Project history

This repository originally held a **Personal Portfolio Website** project. That
direction was superseded because a single-identity product cannot be authored
fairly by a four-person team — the site would carry one member's name and work.
The team's roles, six-week cadence and collaboration workflow were carried
forward; the subject matter was replaced. The original material is preserved
under `archive/portfolio-website-original/`, with the full rationale in that
folder's `ARCHIVE_NOTE.md`.

---

## Sources for the figures quoted above

- [Africa Creator Economy Report 2026 — reported by Techpoint Africa](https://techpoint.africa/news/africa-creator-economy-report-2026/)
- [The State of the Creator Economy in Africa — Contemeleon](https://www.contemeleon.com/blog/state-of-creator-economy-in-africa)
- [Cofluenxa launch coverage — TechCabal](https://techcabal.com/2025/10/02/exclusive-nigerian-tech-startup-cofluenxa-launches-to-streamline-influencer-marketing-in-africa/)
