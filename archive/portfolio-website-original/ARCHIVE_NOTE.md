# Archive Note — Original Project Direction

**Status:** Superseded. Retained for traceability only.
**Archived on:** 26 September 2026
**Superseded by:** TalentHub — Creator–Brand Collaboration Marketplace (see repository root `README.md`)

---

## 1. What the original project was

The first direction for the CMP 722 Software Engineering group project was a
**Personal Portfolio Website** — a single-page React application intended to
showcase one developer's work to prospective employers and clients.

**Scope as originally specified:**

| Section | Purpose |
|---|---|
| Navbar | Sticky navigation with smooth scroll to each section |
| Hero | Headline, short bio and two call-to-action buttons |
| Projects Gallery | Card grid loaded from `projects.json`, filterable by technology tag |
| About & Skills | Biography plus a skills grid loaded from `skills.json` |
| Contact Form | Validated form wired to EmailJS for direct email delivery |
| Footer | Social links and copyright |

**Technology stack:** React (Create React App), TailwindCSS, Zustand,
React Router, React Icons, EmailJS. Deployment target was Vercel or Netlify.

**Delivery model:** Six weekly increments totalling 43–55 hours of effort
(5–10 hours per person per week):

1. Week 1 — Environment setup, repository, React initialisation
2. Week 2 — Navbar and Hero
3. Week 3 — Projects gallery with filtering
4. Week 4 — About and Skills sections
5. Week 5 — Contact form with validation and email integration
6. Week 6 — Testing, Lighthouse optimisation, deployment

**Team structure:** four roles, defined in `TEAM_PROJECT_CHARTER.md` —
Robertson (Project Manager 1), David (Project Manager 2 / Technical Lead),
Mercy (QA Tester), Olufems (Developer).

## 2. Why it was replaced

The portfolio concept assumed a **single subject**. A personal portfolio is, by
definition, one person's site: it carries one name, one biography, one set of
projects. In a four-person group project this created an unresolvable ownership
problem — whichever member's name and work the site carried would own the
deliverable, and the other three would be building someone else's artefact. The
team could not divide authorship of a single-identity product fairly, and the
assessment would not evidence four members' contribution equally.

A second, weaker concern was engineering depth. The portfolio brief is
explicitly "beginner-friendly": a static front end with one third-party email
integration. It offered little scope for the requirements engineering,
multi-actor modelling, transactional design, and non-functional analysis that a
software engineering assessment is meant to demonstrate.

## 3. What was carried forward

The pivot preserved the project's delivery machinery and discarded only its
subject matter. Carried into TalentHub unchanged:

- The four team roles and their responsibilities
- The six-week incremental delivery model and weekly cadence
- The collaboration workflow — GitHub issues, branch strategy, code review, weekly standups and demos
- The CMP 722 assessment framing

Replaced: the product itself. TalentHub is a **multi-sided marketplace**
connecting African digital creators with brands — a neutral shared subject that
no single member owns, with genuine multi-actor requirements, a transactional
core, and enough architectural substance to carry a full SDLC document set.

## 4. Files in this archive

| File | Contents |
|---|---|
| `ORIGINAL_README.md` | Original package overview and reading order |
| `TEAM_PROJECT_CHARTER.md` | Roles, weekly schedule, success metrics, risks |
| `6WEEK_PLAN.md` | Day-by-day build plan with code snippets |
| `TEAM_COLLABORATION_GUIDE.md` | Communication channels, git workflow, code review |
| `TEAM_STARTUP_CHECKLIST.md` | Pre-launch setup and verification tasks |
| `ROBERTSONS_GUIDE.md` | Project Manager 1 role guide |
| `DAVIDS_GUIDE.md` | Project Manager 2 / Technical Lead role guide |
| `MERCYS_GUIDE.md` | QA Tester role guide |
| `OLUFEMS_GUIDE.md` | Developer role guide |
| `Portfolio_6Week_Gantt.pptx` | Original six-week Gantt chart |

These documents remain valid descriptions of the superseded direction. They are
**not** the current project specification. For the active project, see
`/README.md` and `/docs/`.
