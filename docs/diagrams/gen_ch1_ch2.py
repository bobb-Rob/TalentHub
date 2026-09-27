"""Generates Figures 1.1-1.3 (planning) and 2.1-2.3 (requirements)."""
import os
from diagram_kit import (Svg, wrap, INK, NAVY, NAVY_FILL, NAVY_MID, GREY,
                         GREY_FILL, AMBER, AMBER_FILL, GREEN, GREEN_FILL, RED,
                         RED_FILL, WHITE)

OUT = os.path.dirname(os.path.abspath(__file__))
p = lambda n: os.path.join(OUT, n)


# ---------------------------------------------------------------- Fig 1.1
def fig_1_1():
    """Competitive positioning matrix."""
    s = Svg(920, 610)
    x0, y0, x1, y1 = 130, 70, 860, 500
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

    s.rect(x0, y0, x1 - x0, y1 - y0, WHITE, "#D6DBE3", sw=1.2, r=2)
    s.rect(cx, y0, x1 - cx, cy - y0, GREEN_FILL, "none", sw=0, r=0, opacity="0.5")
    s.line(cx, y0, cx, y1, "#C3CAD4", 1.2, dash="5 4", marker=None)
    s.line(x0, cy, x1, cy, "#C3CAD4", 1.2, dash="5 4", marker=None)

    s.line(x0 - 18, y1, x1 + 14, y1, INK, 1.8)
    s.line(x0 - 18, y1, x0 - 18, y0 - 14, INK, 1.8)
    s.text(cx, y1 + 42, "What a brand can buy", 13, "700", fill=INK)
    s.text(x0 + 4, y1 + 24, "Audience reach only", 11.5, "normal", "start", GREY)
    s.text(x1, y1 + 24, "Commissioned creative work", 11.5, "normal", "end", GREY)
    s.add(f'<text transform="translate(52,{cy}) rotate(-90)" text-anchor="middle" '
          f'fill="{INK}" style="font-family:Helvetica,Arial,sans-serif;'
          f'font-size:13px;font-weight:700">African market infrastructure</text>')
    s.add(f'<text transform="translate(72,{y0 + 78}) rotate(-90)" text-anchor="middle" '
          f'fill="{GREY}" style="font-family:Helvetica,Arial,sans-serif;'
          f'font-size:11.5px">KYC + escrow + local payout</text>')
    s.add(f'<text transform="translate(72,{y1 - 74}) rotate(-90)" text-anchor="middle" '
          f'fill="{GREY}" style="font-family:Helvetica,Arial,sans-serif;'
          f'font-size:11.5px">Weak or absent for Africa</text>')

    s.text(x0 + 14, y0 + 20, "REACH, WELL SERVED", 10, "700", "start", "#9AA3B0",
           spacing=0.8)
    s.text(x1 - 14, y0 + 20, "THE GAP", 10, "700", "end", GREEN, spacing=0.8)
    s.text(x0 + 14, y1 - 12, "REACH, POORLY SERVED", 10, "700", "start", "#9AA3B0",
           spacing=0.8)
    s.text(x1 - 14, y1 - 12, "CRAFT, POORLY SERVED", 10, "700", "end", "#9AA3B0",
           spacing=0.8)

    pts = [
        (250, 150, "Tikora", "KYC, escrow, local payout", NAVY, NAVY_MID, 9),
        (215, 250, "Wowzi", "23 countries, ~100k creators", NAVY, NAVY_FILL, 8),
        (325, 300, "Posse", "discovery + analytics", NAVY, NAVY_FILL, 8),
        (250, 370, "Cofluenxa", "Nigeria, self-serve", NAVY, NAVY_FILL, 8),
        (180, 430, "Plaqad / Trendupp / Rytar", "Nigeria", GREY, GREY_FILL, 7),
        (690, 430, "Upwork / Fiverr", "global pricing, poor rails", GREY, GREY_FILL, 8),
        (300, 465, "Upfluence / Aspire", "excludes sub-10k creators", GREY, GREY_FILL, 7),
        (742, 152, "TalentHub", "one verified profile, both modes", GREEN, GREEN_FILL, 13),
    ]
    for px, py, lab, note, col, fill, r in pts:
        hero = lab == "TalentHub"
        if hero:
            s.add(f'<circle cx="{px}" cy="{py}" r="{r + 9}" fill="{GREEN}" '
                  f'opacity="0.13"/>')
        s.add(f'<circle cx="{px}" cy="{py}" r="{r}" fill="{fill}" stroke="{col}" '
              f'stroke-width="{2.2 if hero else 1.6}"/>')
        anchor = "end" if px > 620 else "start"
        tx = px - r - 11 if anchor == "end" else px + r + 9
        s.text(tx, py - 1, lab, 12.5 if hero else 11.5, "700", anchor, col)
        s.text(tx, py + 13, note, 10, "normal", anchor, GREY)

    s.text(x0 - 18, 560, "Figure 1.1 — Competitive positioning of platforms serving "
           "African digital creators", 12, "600", "start", INK)
    s.text(x0 - 18, 578, "Every African incumbent sells audience reach. No reviewed "
           "platform spans both engagement modes over a single verified profile.",
           11, "normal", "start", GREY)
    return s.save(p("fig-1-1-positioning-matrix.svg"))


# ---------------------------------------------------------------- Fig 1.2
def fig_1_2():
    """Incremental / iterative SDLC model."""
    s = Svg(940, 486)
    names = ["Foundation", "Identity", "Discovery", "Escrow", "Trust", "Release"]
    adds = ["+ accounts", "+ profiles", "+ discovery", "+ escrow", "+ reviews",
            "+ admin"]
    phases = [("R", "Requirements"), ("D", "Design"), ("B", "Build"), ("T", "Test")]
    cw, gap, x0, top = 128, 18, 62, 96
    ph_h, ph_gap = 33, 6

    s.text(470, 34, "Each increment runs its own requirements, design, build and "
           "test cycle", 13, "700", fill=INK)
    s.text(470, 54, "and ends in a working, demonstrable slice of the platform",
           11.5, "normal", fill=GREY)

    for i, nm in enumerate(names):
        x = x0 + i * (cw + gap)
        s.rect(x, top, cw, 44, NAVY, NAVY, r=4)
        s.text(x + cw / 2, top + 20, f"Increment {i+1}", 13, "700", fill=WHITE)
        s.text(x + cw / 2, top + 35, f"Week {i+1} · {nm}", 9.5, "normal",
               fill="#C9D6EA")

        y = top + 54
        for j, (code, full) in enumerate(phases):
            yy = y + j * (ph_h + ph_gap)
            s.rect(x, yy, cw, ph_h, NAVY_FILL, NAVY, sw=1.3, r=3)
            s.text(x + 17, yy + ph_h / 2 + 4.5, code, 12.5, "700", "middle", NAVY)
            s.line(x + 32, yy + 4, x + 32, yy + ph_h - 4, NAVY_MID, 1, marker=None)
            s.text(x + 39, yy + ph_h / 2 + 4, full, 10.5, "normal", "start", NAVY)
            if j < len(phases) - 1:
                s.line(x + cw / 2, yy + ph_h, x + cw / 2, yy + ph_h + ph_gap,
                       NAVY, 1.2)

        s.path(f"M{x + cw - 6} {y + 3 * (ph_h + ph_gap) + ph_h / 2} "
               f"C{x + cw + 13} {y + 3 * (ph_h + ph_gap) + ph_h / 2}, "
               f"{x + cw + 13} {y + ph_h / 2}, {x + cw - 6} {y + ph_h / 2}",
               AMBER, 1.3, dash="4 3")

    # cumulative product band: one segment per increment, deepening in tone
    by, bh = top + 54 + 4 * (ph_h + ph_gap) + 22, 30
    for i, add in enumerate(adds):
        x = x0 + i * (cw + gap)
        w = cw + (gap if i < 5 else 0)
        s.add(f'<rect x="{x}" y="{by}" width="{w}" height="{bh}" fill="{GREEN}" '
              f'opacity="{0.08 + i * 0.055:.3f}"/>')
        s.text(x + cw / 2, by + 19, add, 10.5, "700", fill=GREEN)
    s.rect(x0, by, 6 * (cw + gap) - gap, bh, "none", GREEN, sw=1.8, r=3)
    s.text(x0, by - 9, "Cumulative working product — every increment leaves the "
           "platform demonstrable", 11, "700", "start", GREEN)

    ty = by + bh + 30
    s.line(x0 - 18, ty, x0 + 6 * (cw + gap) - gap, ty, INK, 1.6)
    s.text(x0 - 18, ty + 19, "Week 1", 10.5, "normal", "start", GREY)
    s.text(x0 + 6 * (cw + gap) - gap, ty + 19, "Week 6", 10.5, "normal", "end", GREY)
    s.text(470, ty + 19, "Requirements are re-examined at every increment boundary",
           10.5, "normal", "middle", AMBER, italic=True)

    s.text(x0 - 18, ty + 46, "Figure 1.2 — The incremental / iterative model as "
           "applied to TalentHub", 12, "600", "start", INK)
    return s.save(p("fig-1-2-incremental-model.svg"))


# ---------------------------------------------------------------- Fig 1.3
def fig_1_3():
    """Six-week increment roadmap (Gantt)."""
    s = Svg(940, 452)
    lx, gx0, gx1, top, rh = 40, 300, 900, 96, 42
    ww = (gx1 - gx0) / 6

    s.text(40, 36, "Figure 1.3 — Six-increment delivery roadmap", 13, "700",
           "start", INK)
    s.text(40, 56, "Increments 1-4 are the minimum viable deliverable. "
           "Increments 5-6 carry the de-scopable scope.", 11, "normal", "start", GREY)

    for w in range(6):
        x = gx0 + w * ww
        s.rect(x, top - 26, ww, 22, NAVY_FILL if w % 2 == 0 else WHITE,
               "#D6DBE3", sw=1, r=2)
        s.text(x + ww / 2, top - 11, f"Week {w+1}", 11, "700", fill=NAVY)
        s.line(x, top - 4, x, top + 6 * rh + 58, "#E3E7ED", 1, marker=None)
    s.line(gx1, top - 4, gx1, top + 6 * rh + 58, "#E3E7ED", 1, marker=None)

    rows = [
        ("Inc. 1  Foundation", 0, "Auth, CI, schema baseline", NAVY, NAVY_MID),
        ("Inc. 2  Identity & profiles", 1, "Profiles, portfolio, KYC", NAVY, NAVY_MID),
        ("Inc. 3  Discovery & briefs", 2, "Search, briefs, applications", NAVY, NAVY_MID),
        ("Inc. 4  Contracting & escrow", 3, "Contracts, escrow, payout", AMBER, AMBER_FILL),
        ("Inc. 5  Trust & communication", 4, "Reviews, messaging, disputes", GREY, GREY_FILL),
        ("Inc. 6  Hardening & release", 5, "Admin, a11y, regression, deploy", GREEN, GREEN_FILL),
    ]
    for i, (name, start, note, col, fill) in enumerate(rows):
        y = top + i * rh
        s.text(lx, y + 20, name, 12, "700", "start", INK)
        s.text(lx, y + 34, note, 10, "normal", "start", GREY)
        bx, bw = gx0 + start * ww + 4, ww - 8
        s.rect(bx, y + 8, bw, 24, fill, col, sw=1.6, r=3)
        if col == AMBER:
            s.text(bx + bw / 2, y + 24, "highest risk", 9.5, "700", fill=AMBER)
        if i > 0:
            s.path(f"M{gx0 + start * ww - 4} {y - rh + 20} "
                   f"L{gx0 + start * ww - 4} {y + 20} L{bx - 2} {y + 20}",
                   "#A9B3C1", 1.2, marker="open")

    for k, (label, col, fill) in enumerate(
            [("QA verification", GREEN, GREEN_FILL),
             ("Requirements review", AMBER, AMBER_FILL)]):
        y = top + 6 * rh + 8 + k * 30
        s.text(lx, y + 17, label, 11, "700", "start", col)
        s.rect(gx0 + 4, y + 4, gx1 - gx0 - 8, 20, fill, col, sw=1.3, r=3,
               dash="6 4")
        if k == 1:
            for w in range(1, 6):
                s.add(f'<circle cx="{gx0 + w * ww}" cy="{y + 14}" r="4" '
                      f'fill="{WHITE}" stroke="{col}" stroke-width="1.6"/>')

    s.text(gx1, top + 6 * rh + 80, "Deployment and QA sign-off", 10.5, "700",
           "end", GREEN)
    return s.save(p("fig-1-3-increment-roadmap.svg"))


# ---------------------------------------------------------------- Fig 2.1
def fig_2_1():
    """System context diagram."""
    s = Svg(1080, 660)
    C, R = (420, 300), 96

    s.actor(100, 118, "Creator", NAVY, 12.5, 1.15)
    s.actor(100, 368, "Brand", NAVY, 12.5, 1.15)
    s.actor(420, 492, "Administrator", NAVY, 12.5, 1.15)

    ext = [
        (60, "Payment Service Provider", "collections and payouts", AMBER, AMBER_FILL,
         ["→  payment & payout instructions", "←  settlement confirmations"]),
        (172, "KYC Provider", "identity verification", GREY, GREY_FILL,
         ["→  identity documents", "←  verification outcome"]),
        (284, "Social Platform APIs", "audience metrics", GREY, GREY_FILL,
         ["→  OAuth token, metric request", "←  follower count, engagement"]),
        (396, "Email Provider", "notification delivery", GREY, GREY_FILL,
         ["→  notification content"]),
    ]
    for ey, lab, note, col, fill, flows in ext:
        yc = ey + 36
        dx, dy = 820 - C[0], yc - C[1]
        ln = (dx * dx + dy * dy) ** 0.5
        sx, sy = C[0] + R * dx / ln, C[1] + R * dy / ln
        s.line(sx, sy, 818, yc, col, 1.5, back=True)
        s.box(820, ey, 220, 72, lab, sub=note, fill=fill, stroke=col, size=12.5,
              sub_size=10, wrap_at=19)
        for k, fl in enumerate(flows):
            s.label(812 - len(fl) * 5.4 / 2, yc - 8 + k * 17, fl, 10, col,
                    anchor="middle")

    # human actors
    for hub, ang_pt, flows, ly in (
            ((152, 172), (0, 0), ["→  profile, portfolio, applications, deliverables",
                                  "←  briefs, awards, payments, notifications"], 164),
            ((152, 424), (0, 0), ["→  briefs, awards, funding, decisions",
                                  "←  creator results, submissions, invoices"], 416)):
        dx, dy = hub[0] - C[0], hub[1] - C[1]
        ln = (dx * dx + dy * dy) ** 0.5
        sx, sy = C[0] + R * dx / ln, C[1] + R * dy / ln
        s.line(hub[0], hub[1], sx, sy, NAVY, 1.5, back=True)
        for k, fl in enumerate(flows):
            s.label(158 + len(fl) * 5.4 / 2, ly + k * 17, fl, 10, NAVY,
                    anchor="middle")

    s.line(420, 486, 420, C[1] + R + 2, NAVY, 1.5, back=True)
    for k, fl in enumerate(["→  moderation, dispute rulings",
                            "←  reports, flagged content"]):
        s.label(436 + len(fl) * 5.4 / 2, 432 + k * 17, fl, 10, NAVY, anchor="middle")

    s.add(f'<circle cx="{C[0]}" cy="{C[1]}" r="{R}" fill="{NAVY_FILL}" '
          f'stroke="{NAVY}" stroke-width="2.4"/>')
    s.text(C[0], C[1] - 6, "TalentHub", 21, "700", fill=NAVY)
    s.text(C[0], C[1] + 15, "Creator–Brand", 11.5, "normal", fill=NAVY)
    s.text(C[0], C[1] + 30, "Marketplace", 11.5, "normal", fill=NAVY)

    s.text(40, 604, "Figure 2.1 — System context diagram", 12, "600", "start", INK)
    s.text(40, 624, "Money crosses the boundary in both directions, but TalentHub "
           "never holds it: the platform instructs the provider and records "
           "entitlement.", 11, "normal", "start", GREY)
    return s.save(p("fig-2-1-context-diagram.svg"))


# ---------------------------------------------------------------- Fig 2.2
def fig_2_2():
    """Use case diagram, grouped by owning actor to minimise crossings."""
    s = Svg(1080, 916)
    BX, BR, BY, BB = 250, 830, 60, 850
    CXO, RX, RY = 540, 248, 26
    LV, RV = CXO - RX, CXO + RX

    s.rect(BX, BY, BR - BX, BB - BY, "#FBFCFE", NAVY, sw=2, r=6)
    s.text(CXO, BY + 26, "TalentHub", 14, "700", fill=NAVY)

    rows = [
        ("UC-01", "Register and verify account", "both"),
        ("UC-02", "Authenticate", "both"),
        ("UC-03", "Manage verified profile", "creator"),
        ("UC-06", "Apply to brief", "creator"),
        ("UC-08", "Submit deliverable", "creator"),
        ("UC-04", "Search and filter creators", "brand"),
        ("UC-05", "Publish brief", "brand"),
        ("UC-07", "Fund milestone into escrow", "brand"),
        ("UC-09", "Accept deliverable and release payment", "brand"),
        ("UC-10", "Rate and review counterparty", "both"),
        ("UC-11", "Exchange messages", "both"),
        ("UC-12", "Adjudicate dispute", "admin"),
        ("UC-13", "Moderate platform", "admin"),
    ]
    y_of, owner_of = {}, {}
    for i, (code, lab, who) in enumerate(rows):
        y_of[code], owner_of[code] = 130 + i * 56, who

    hubC, hubB, chC, chB = (126, 298), (126, 466), 186, 214

    def connect(hub, ch, code, col, dy=0):
        y = y_of[code] + dy
        if owner_of[code] in ("creator", "brand"):
            s.line(hub[0], hub[1], LV - 2, y, col, 1.2, marker=None)
        else:
            s.path(f"M{hub[0]} {hub[1]} L{ch} {hub[1]} L{ch} {y} L{LV - 2} {y}",
                   col, 1.2, marker=None)

    for code in ("UC-01", "UC-02", "UC-03", "UC-06", "UC-08", "UC-10", "UC-11"):
        connect(hubC, chC, code, NAVY, -5)
    for code in ("UC-01", "UC-02", "UC-04", "UC-05", "UC-07", "UC-09", "UC-10",
                 "UC-11"):
        connect(hubB, chB, code, GREY, 5)

    # administrator, right side
    hubA, chA = (934, 768), 845
    for code in ("UC-12", "UC-13"):
        s.line(hubA[0], hubA[1], RV + 2, y_of[code], NAVY, 1.2, marker=None)
    s.path(f"M{hubA[0]} {hubA[1]} L{chA} {hubA[1]} L{chA} {y_of['UC-02'] + 6} "
           f"L{RV + 2} {y_of['UC-02'] + 6}", NAVY, 1.2, marker=None)

    # «extend» relationships: both optional paths that extend acceptance
    s.path(f"M{LV} {y_of['UC-10'] - 14} L266 {y_of['UC-10'] - 14} "
           f"L266 {y_of['UC-09'] + 14} L{LV} {y_of['UC-09'] + 14}", GREY, 1.2,
           dash="5 3", marker="open")
    s.label(266, (y_of['UC-09'] + y_of['UC-10']) / 2, "«extend»", 9.5, GREY)
    s.path(f"M{RV} {y_of['UC-12'] - 14} L812 {y_of['UC-12'] - 14} "
           f"L812 {y_of['UC-09'] + 14} L{RV} {y_of['UC-09'] + 14}", RED, 1.2,
           dash="5 3", marker="open")
    s.label(812, (y_of['UC-09'] + y_of['UC-12']) / 2, "«extend»", 9.5, RED)

    # payment provider
    s.box(860, 470, 180, 70, "Payment Service Provider", fill=AMBER_FILL,
          stroke=AMBER, size=11.5, wrap_at=17)
    for code in ("UC-07", "UC-09"):
        s.line(858, 505, RV + 2, y_of[code], AMBER, 1.4, marker=None, dash="5 3")

    for code, lab, who in rows:
        hot = code in ("UC-07", "UC-09")
        s.oval(CXO, y_of[code], RX, RY, f"{code}  {lab}",
               AMBER_FILL if hot else WHITE, AMBER if hot else NAVY, 11.5, 46)

    s.actor(100, 250, "Creator", NAVY, 12.5, 1.2)
    s.actor(100, 418, "Brand", NAVY, 12.5, 1.2)
    s.actor(960, 720, "Administrator", NAVY, 12.5, 1.2)

    s.text(40, 880, "Figure 2.2 — Use case diagram", 12, "600", "start", INK)
    s.text(40, 900, "Use cases are grouped by owning actor. UC-07 and UC-09 carry "
           "the transaction and are specified in full in §2.7; UC-10 and UC-12 extend it.", 11, "normal",
           "start", GREY)
    return s.save(p("fig-2-2-use-case-diagram.svg"))


# ---------------------------------------------------------------- Fig 2.3
def fig_2_3():
    """Level 1 data flow diagram."""
    s = Svg(1040, 820)

    def proc(cx, cy, num, name, col=NAVY, fill=NAVY_FILL, r=56):
        s.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{col}" '
              f'stroke-width="1.8"/>')
        s.line(cx - r * 0.86, cy - r * 0.42, cx + r * 0.86, cy - r * 0.42, col,
               1.4, marker=None)
        s.text(cx, cy - r * 0.58, num, 12, "700", fill=col)
        ls = wrap(name, 13)
        s.lines(cx, cy - (len(ls) - 1) * 7 + 8, ls, 11.5, "600", "middle", col,
                lh=14)

    def store(x, y, sid, name, w):
        s.rect(x, y, w, 34, GREY_FILL, GREY, sw=1.4, r=2)
        s.rect(x, y, 30, 34, GREY, GREY, sw=1.4, r=2)
        s.text(x + 15, y + 22, sid, 11, "700", fill=WHITE)
        s.text(x + 40, y + 22, name, 11, "600", "start", INK)

    def ext(x, y, name, col=INK, fill=WHITE):
        s.rect(x, y, 130, 54, fill, col, sw=1.8, r=2)
        ls = wrap(name, 12)
        s.lines(x + 65, y + 27 - (len(ls) - 1) * 7 + 5, ls, 12, "700", "middle",
                col, lh=15)

    def f(x1, y1, x2, y2, t, lx, ly, col=NAVY, dash=None):
        s.line(x1, y1, x2, y2, col, 1.4, dash=dash)
        if t:
            s.label(lx, ly, t, 9.5, col)

    ext(30, 80, "Creator")
    ext(30, 320, "Brand")
    ext(30, 560, "Administrator")
    ext(880, 432, "Payment Provider", AMBER, AMBER_FILL)

    store(185, 200, "D1", "Profile & portfolio store", 215)
    store(430, 300, "D2", "Brief & application store", 200)
    store(730, 118, "D3", "Contract & milestone store", 215)
    store(760, 600, "D4", "Financial ledger", 190)
    store(140, 700, "D5", "Audit & moderation log", 215)

    # creator / process 1.0
    f(162, 96, 246, 98, "profile, portfolio", 204, 76)
    f(246, 120, 162, 122, "verification status", 204, 142, GREY)
    f(300, 161, 300, 198, "profile record", 366, 178)
    f(272, 236, 272, 292, "creator index", 206, 264, GREY)

    # brand / process 2.0
    f(162, 338, 246, 342, "search criteria", 202, 320)
    f(246, 362, 162, 366, "matched creators", 202, 386, GREY)
    f(350, 326, 428, 314, "brief, applications", 414, 352)
    f(352, 318, 548, 232, "award decision", 448, 262)

    # contracts 3.0
    f(640, 158, 728, 140, "contract, milestones", 722, 176)
    f(728, 152, 646, 172, "contract state", 694, 200, GREY)
    f(600, 246, 600, 408, "funding and release request", 600, 288, AMBER)

    # escrow 4.0
    f(660, 452, 878, 450, "payment instruction", 772, 426, AMBER, dash="5 3")
    f(878, 478, 662, 486, "settlement confirmation", 772, 508, AMBER, dash="5 3")
    f(628, 524, 758, 598, "ledger entries", 706, 552, AMBER)

    # governance 5.0
    f(162, 578, 246, 584, "rulings, suspensions", 202, 560)
    f(300, 656, 260, 698, "audit records", 236, 684, GREY)
    f(546, 494, 356, 578, "disputes raised", 450, 522, RED, dash="5 3")
    f(356, 596, 546, 512, "dispute resolution", 452, 574, RED)

    proc(300, 105, "1.0", "Manage identity and profiles")
    proc(300, 350, "2.0", "Match creators to briefs")
    proc(600, 190, "3.0", "Administer contracts")
    proc(600, 470, "4.0", "Process escrow and payouts", AMBER, AMBER_FILL, 60)
    proc(300, 600, "5.0", "Govern and moderate")

    s.text(30, 770, "Figure 2.3 — Level 1 data flow diagram", 12, "600", "start", INK)
    s.text(30, 790, "Process 4.0 and store D4 form the financial path; every flow "
           "into D4 is an append-only double-entry posting.", 11, "normal",
           "start", GREY)
    return s.save(p("fig-2-3-dfd-level1.svg"))


if __name__ == "__main__":
    print("Chapter One and Two figures:")
    for fn in (fig_1_1, fig_1_2, fig_1_3, fig_2_1, fig_2_2, fig_2_3):
        fn()
