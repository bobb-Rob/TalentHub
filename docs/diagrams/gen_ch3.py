"""Generates Figures 3.1-3.7 (system design)."""
import os
from diagram_kit import (Svg, wrap, INK, NAVY, NAVY_FILL, NAVY_MID, GREY,
                         GREY_FILL, AMBER, AMBER_FILL, GREEN, GREEN_FILL, RED,
                         RED_FILL, WHITE)

OUT = os.path.dirname(os.path.abspath(__file__))
p = lambda n: os.path.join(OUT, n)


# ---------------------------------------------------------------- Fig 3.1
def fig_3_1():
    s = Svg(1020, 700)
    LX, CX, CW = 34, 190, 500

    def band(y, h, name, note, items, col=NAVY, fill=NAVY_FILL, cols=None,
             item_h=40, ext=False):
        s.rect(LX, y, 144, h, col if not ext else GREY, col if not ext else GREY,
               r=4)
        ls = wrap(name, 13)
        s.lines(LX + 72, y + h / 2 - (len(ls) - 1) * 8 - 2, ls, 12, "700",
                "middle", WHITE, lh=15)
        s.text(LX + 72, y + h / 2 + (len(ls) - 1) * 8 + 15, note, 9.5, "normal",
               "middle", "#C9D6EA" if not ext else "#DDE0E4")
        s.rect(CX, y, CW, h, WHITE, col if not ext else GREY, sw=1.4, r=4,
               dash="6 4" if ext else None)
        cols = cols or len(items)
        rows = (len(items) + cols - 1) // cols
        bw = (CW - 14 * (cols + 1)) / cols
        for i, it in enumerate(items):
            r, c = divmod(i, cols)
            bx = CX + 14 + c * (bw + 14)
            by = y + (h - rows * item_h - (rows - 1) * 8) / 2 + r * (item_h + 8)
            s.box(bx, by, bw, item_h, it, fill=fill, stroke=col, size=10.5,
                  r=3, wrap_at=int(bw / 5.9))

    band(70, 72, "Presentation", "browser, mobile-first",
         ["React SPA", "Tailwind UI", "Client-side validation"], cols=3)
    band(158, 72, "API", "stateless, replicable",
         ["JWT auth", "Schema validation", "Rate limiting", "Route authorisation"],
         cols=4)
    band(246, 130, "Service", "domain rules and invariants",
         ["Identity", "Profile", "Discovery", "Brief", "Contract",
          "Ledger", "Payout", "Review", "Notification", "Moderation"],
         cols=5, item_h=40)
    band(406, 72, "Integration", "substitutable adapters",
         ["Payment Provider", "KYC Provider", "Social Metrics", "Email",
          "Storage"], cols=5, fill=AMBER_FILL, col=AMBER)
    band(524, 76, "External", "outside the boundary",
         ["Paystack / Flutterwave", "Smile Identity / Dojah",
          "Instagram · TikTok · YouTube", "Email service"], cols=4,
         fill=GREY_FILL, col=GREY, ext=True)

    for y in (142, 230, 376):
        s.line(440, y, 440, y + 16, NAVY, 1.6, back=True)
    s.line(440, 478, 440, 522, AMBER, 1.6, back=True)

    # data column
    DX = 726
    s.text(DX + 130, 56, "Data layer", 12, "700", fill=NAVY)
    stores = [("PostgreSQL", "system of record", NAVY, NAVY_FILL),
              ("Elasticsearch", "creator search index", NAVY, NAVY_FILL),
              ("Redis", "cache, rate limits, jobs", NAVY, NAVY_FILL),
              ("Object storage", "media, KYC documents", NAVY, NAVY_FILL)]
    for i, (nm, note, col, fill) in enumerate(stores):
        y = 78 + i * 82
        s.cylinder(DX, y, 260, 64, nm, note, fill, col, 12)
        s.line(692, 300, DX - 4, y + 32, GREY, 1.3, back=True)
    s.rect(DX - 14, 66, 288, 342, "none", NAVY, sw=1.2, r=6, dash="6 4")

    s.add(f'<text transform="translate(710,240) rotate(-90)" text-anchor="middle" '
          f'fill="{GREY}" style="font-family:Helvetica,Arial,sans-serif;'
          f'font-size:9.5px">reads / writes</text>')
    s.text(LX, 646, "Figure 3.1 — System architecture", 12, "600", "start", INK)
    s.text(LX, 666, "Layered rather than microservices: the escrow invariant "
           "(NFR-08) is far cheaper to guarantee inside one ACID transaction "
           "boundary than across a distributed saga.", 11, "normal", "start", GREY)
    return s.save(p("fig-3-1-architecture.svg"))


# ---------------------------------------------------------------- Fig 3.2
def entity(s, x, y, w, name, attrs, col=NAVY, fill=WHITE, hdr=None):
    """ERD entity: header bar plus attribute rows. Returns (x, y, w, h)."""
    rh, hh = 17, 26
    h = hh + len(attrs) * rh + 8
    s.rect(x, y, w, h, fill, col, sw=1.5, r=3)
    s.add(f'<path d="M{x} {y + hh} L{x} {y + 3} Q{x} {y} {x + 3} {y} '
          f'L{x + w - 3} {y} Q{x + w} {y} {x + w} {y + 3} L{x + w} {y + hh} Z" '
          f'fill="{hdr or col}" stroke="{hdr or col}"/>')
    s.text(x + w / 2, y + 18, name, 11.5, "700", fill=WHITE)
    for i, (mark, a) in enumerate(attrs):
        ty = y + hh + 13 + i * rh
        mc = {"PK": AMBER, "FK": GREY, "U": GREEN}.get(mark, GREY)
        if mark:
            s.text(x + 8, ty, mark, 8.5, "700", "start", mc)
        s.text(x + 34, ty, a, 10, "600" if mark == "PK" else "normal", "start", INK)
    return (x, y, w, h)


def fig_3_2():
    s = Svg(1260, 930)
    E = {}
    E['USER'] = entity(s, 470, 26, 210, "USER",
                       [("PK", "user_id"), ("U", "email"), ("", "password_hash"),
                        ("", "role"), ("", "status")])
    E['CP'] = entity(s, 150, 186, 224, "CREATOR_PROFILE",
                     [("PK", "profile_id"), ("FK", "user_id"),
                      ("", "primary_discipline"), ("", "engagement_modes"),
                      ("", "day_rate_minor"), ("", "kyc_status")])
    E['BP'] = entity(s, 740, 186, 214, "BRAND_PROFILE",
                     [("PK", "brand_id"), ("FK", "user_id"),
                      ("", "legal_name"), ("", "country_code")])
    E['PI'] = entity(s, 60, 382, 196, "PORTFOLIO_ITEM",
                     [("PK", "item_id"), ("FK", "profile_id"),
                      ("", "media_type"), ("", "storage_key")])
    E['SA'] = entity(s, 284, 382, 206, "SOCIAL_ACCOUNT",
                     [("PK", "social_account_id"), ("FK", "profile_id"),
                      ("", "follower_count"), ("", "metrics_source")])
    E['SK'] = entity(s, 60, 586, 196, "SKILL",
                     [("PK", "skill_id"), ("", "name"), ("", "discipline")])
    E['AP'] = entity(s, 520, 382, 206, "APPLICATION",
                     [("PK", "application_id"), ("FK", "brief_id"),
                      ("FK", "creator_id"), ("", "proposed_fee_minor"),
                      ("", "status")])
    E['BR'] = entity(s, 760, 366, 214, "BRIEF",
                     [("PK", "brief_id"), ("FK", "brand_id"),
                      ("", "engagement_mode"), ("", "budget_max_minor"),
                      ("", "status")])
    E['CT'] = entity(s, 760, 566, 214, "CONTRACT",
                     [("PK", "contract_id"), ("FK", "brief_id"),
                      ("", "agreed_fee_minor"), ("", "commission_rate"),
                      ("", "status")])
    E['MS'] = entity(s, 1010, 566, 210, "MILESTONE",
                     [("PK", "milestone_id"), ("FK", "contract_id"),
                      ("", "amount_minor"), ("", "status"),
                      ("", "revision_count")], col=AMBER)
    E['DL'] = entity(s, 1010, 382, 210, "DELIVERABLE",
                     [("PK", "deliverable_id"), ("FK", "milestone_id"),
                      ("", "storage_key")])
    E['LE'] = entity(s, 1010, 746, 210, "LEDGER_ENTRY",
                     [("PK", "entry_id"), ("FK", "milestone_id"),
                      ("", "account_type / direction"), ("U", "idempotency_key")],
                     col=AMBER, fill=AMBER_FILL)
    E['RV'] = entity(s, 760, 746, 214, "REVIEW",
                     [("PK", "review_id"), ("FK", "contract_id"),
                      ("", "rating"), ("", "body")])

    def rel(a, b, ca, cb, side="v", col=GREY):
        ax, ay, aw, ah = E[a]
        bx, by, bw, bh = E[b]
        if side == "v":
            x1, y1, x2, y2 = ax + aw / 2, ay + ah, bx + bw / 2, by
            if abs(x1 - x2) > 4:
                s.path(f"M{x1} {y1} L{x1} {(y1 + y2) / 2} L{x2} {(y1 + y2) / 2} "
                       f"L{x2} {y2}", col, 1.3, marker=None)
            else:
                s.line(x1, y1, x2, y2, col, 1.3, marker=None)
            s.label(x1 + 16, y1 + 11, ca, 9.5, col, bg=WHITE)
            s.label(x2 + 16, y2 - 10, cb, 9.5, col, bg=WHITE)
        else:
            x1, y1, x2, y2 = ax + aw, ay + ah / 2, bx, by + bh / 2
            if abs(y1 - y2) > 4:
                s.path(f"M{x1} {y1} L{(x1 + x2) / 2} {y1} L{(x1 + x2) / 2} {y2} "
                       f"L{x2} {y2}", col, 1.3, marker=None)
            else:
                s.line(x1, y1, x2, y2, col, 1.3, marker=None)
            s.label(x1 + 20, y1 - 10, ca, 9.5, col, bg=WHITE)
            s.label(x2 - 20, y2 - 10, cb, 9.5, col, bg=WHITE)

    rel('USER', 'CP', "1", "1")
    rel('USER', 'BP', "1", "1")
    rel('CP', 'PI', "1", "0..20")
    rel('CP', 'SA', "1", "0..*")
    rel('CP', 'AP', "1", "0..*", side="h")
    rel('BP', 'BR', "1", "0..*")
    rel('AP', 'BR', "0..*", "1", side="h")
    rel('BR', 'CT', "1", "0..1")
    rel('CT', 'MS', "1", "1..*", side="h", col=AMBER)
    rel('DL', 'MS', "0..*", "1")
    rel('MS', 'LE', "1", "0..*", col=AMBER)
    rel('CT', 'RV', "1", "0..2")

    # creator profile M:N skill, resolved by the PROFILE_SKILL junction
    s.path("M150 270 L36 270 L36 537 L58 537", GREY, 1.3, marker=None)
    s.box(60, 520, 196, 34, "PROFILE_SKILL  (junction)", fill=GREY_FILL,
          stroke=GREY, size=9.5, r=3)
    s.line(158, 554, 158, 584, GREY, 1.3, marker=None)
    s.label(100, 258, "0..*", 9.5, GREY)
    s.label(180, 570, "0..*", 9.5, GREY)

    s.rect(60, 858, 380, 48, WHITE, "#D6DBE3", sw=1.2, r=3)
    for i, (m, t, c) in enumerate([("PK", "primary key", AMBER),
                                   ("FK", "foreign key", GREY),
                                   ("U", "unique constraint", GREEN)]):
        s.text(76 + i * 120, 878, m, 9, "700", "start", c)
        s.text(96 + i * 120, 878, t, 9.5, "normal", "start", INK)
    s.text(76, 896, "Multiplicities follow UML notation.", 9.5, "normal",
           "start", GREY)

    s.text(470, 868, "Figure 3.2 — Entity–relationship diagram", 12, "600",
           "start", INK)
    s.text(470, 888, "LEDGER_ENTRY is append-only; its unique idempotency_key is "
           "what makes a duplicate posting impossible.", 10.5, "normal", "start",
           GREY)
    s.text(470, 906, "PAYOUT, MESSAGE, DISPUTE and NOTIFICATION are omitted for "
           "legibility; all are listed in the data dictionary.", 10.5, "normal",
           "start", GREY)
    return s.save(p("fig-3-2-erd.svg"))


# ---------------------------------------------------------------- sequences
def seq_frame(s, lanes, top, bottom, title=None):
    """Draw lifelines. lanes = [(x, name, sub, colour, fill)]. Returns dict."""
    xs = {}
    for x, name, sub, col, fill in lanes:
        w = 150
        s.rect(x - w / 2, top, w, 46, fill, col, sw=1.6, r=4)
        s.text(x, top + 20, name, 11.5, "700", fill=col)
        s.text(x, top + 35, sub, 9.5, "normal", fill=GREY)
        s.line(x, top + 46, x, bottom, "#AAB3C0", 1.2, dash="5 5", marker=None)
        xs[name] = x
    return xs


def msg(s, y, x1, x2, text, num=None, dash=None, col=NAVY, above=True,
        self_msg=False):
    if self_msg:
        s.path(f"M{x1} {y} L{x1 + 46} {y} L{x1 + 46} {y + 22} L{x1 + 4} {y + 22}",
               col, 1.4, dash=dash)
        s.text(x1 + 54, y + 4, text, 10, "normal", "start", INK)
        if num:
            s.text(x1 + 54, y + 18, "", 9)
        return
    s.line(x1, y, x2, y, col, 1.4, dash=dash)
    mx = (x1 + x2) / 2
    label = f"{num}. {text}" if num else text
    s.label(mx, y - 9 if above else y + 13, label, 10, INK, bg=WHITE,
            weight="normal")


def frag(s, x, y, w, h, kind, cond, col=GREY):
    s.rect(x, y, w, h, "none", col, sw=1.3, r=2, dash="4 3")
    s.add(f'<path d="M{x} {y} L{x + 54} {y} L{x + 54} {y + 14} L{x + 44} {y + 20} '
          f'L{x} {y + 20} Z" fill="{WHITE}" stroke="{col}" stroke-width="1.3"/>')
    s.text(x + 26, y + 14, kind, 9.5, "700", "middle", col)
    s.text(x + 62, y + 14, cond, 9.5, "normal", "start", col)


def fig_3_3():
    s = Svg(1240, 1040)
    top, bottom = 60, 944
    lanes = [(100, "Brand", "actor", NAVY, NAVY_FILL),
             (290, "Creator", "actor", NAVY, NAVY_FILL),
             (490, "API", "Express", NAVY, WHITE),
             (690, "Contract Service", "domain", NAVY, WHITE),
             (890, "Ledger", "append-only", AMBER, AMBER_FILL),
             (1090, "Payment Provider", "external", GREY, GREY_FILL)]
    X = seq_frame(s, lanes, top, bottom)
    B, Cr, A, C, L, P = (X["Brand"], X["Creator"], X["API"],
                         X["Contract Service"], X["Ledger"],
                         X["Payment Provider"])

    y = 140
    msg(s, y, B, A, "POST /milestones/{id}/fund", 1)
    msg(s, y + 34, A, C, "fundMilestone(id, idempotencyKey)", 2)
    msg(s, y + 68, C, P, "createPaymentIntent(key, amount)", 3)
    msg(s, y + 102, P, C, "authorised(providerReference)", 4, dash="6 4", col=GREY)

    frag(s, 620, y + 122, 380, 86, "atomic", "one database transaction", AMBER)
    msg(s, y + 162, C, L, "post: debit brand_funding / credit escrow", 5, col=AMBER)
    msg(s, y + 192, L, C, "transactionId", 6, dash="6 4", col=AMBER)

    msg(s, y + 238, C, A, "milestone = funded", 7, dash="6 4", col=GREY)
    msg(s, y + 272, A, Cr, "notify: you may begin work", 8, dash="6 4", col=GREY)

    s.line(60, y + 302, 1180, y + 302, "#D6DBE3", 1.2, dash="3 4", marker=None)
    s.label(620, y + 302, "creator completes the work", 10, GREY)

    msg(s, y + 336, Cr, A, "POST /milestones/{id}/submit", 9)
    msg(s, y + 370, A, C, "recordSubmission(deliverables)", 10)
    msg(s, y + 404, A, B, "notify: deliverable submitted", 11, dash="6 4", col=GREY)

    frag(s, 60, y + 424, 740, 66, "alt", "revision requested  ·  max 2 (FR-30)", RED)
    msg(s, y + 462, B, C, "requestRevision(reason) → milestone returns to "
        "in_progress", 12, col=RED)

    msg(s, y + 512, B, A, "POST /milestones/{id}/accept", 13)
    msg(s, y + 546, A, C, "acceptSubmission()", 14)

    frag(s, 620, y + 566, 380, 86, "atomic", "one database transaction", AMBER)
    msg(s, y + 606, C, L, "post: debit escrow / credit payable + commission", 15,
        col=AMBER)
    msg(s, y + 636, L, C, "transactionId", 16, dash="6 4", col=AMBER)

    msg(s, y + 682, A, Cr, "notify: funds available to withdraw", 17, dash="6 4",
        col=GREY)
    msg(s, y + 716, Cr, A, "POST /payouts", 18)
    msg(s, y + 750, A, P, "initiateTransfer(bank / mobile money)", 19)
    msg(s, y + 784, P, A, "settled", 20, dash="6 4", col=GREY)

    s.text(34, 986, "Figure 3.3 — Sequence diagram: escrow funding through to payout",
           12, "600", "start", INK)
    s.text(34, 1006, "Steps 5-6 and 15-16 are single database transactions, so a "
           "partially applied release cannot exist. The idempotency key carried "
           "from step 2 makes a duplicate posting impossible under retry.", 11,
           "normal", "start", GREY)
    return s.save(p("fig-3-3-sequence-escrow.svg"))


def fig_3_4():
    s = Svg(1180, 660)
    top, bottom = 60, 556
    lanes = [(110, "Creator", "actor", NAVY, NAVY_FILL),
             (330, "API", "Express", NAVY, WHITE),
             (560, "Profile Service", "domain", NAVY, WHITE),
             (790, "Job Queue", "BullMQ", NAVY, NAVY_FILL),
             (1010, "External APIs", "KYC / social", GREY, GREY_FILL)]
    X = seq_frame(s, lanes, top, bottom)
    C, A, S, Q, E = (X["Creator"], X["API"], X["Profile Service"],
                     X["Job Queue"], X["External APIs"])

    y = 132
    msg(s, y, C, A, "POST /kyc  (identity documents)", 1)
    msg(s, y + 32, A, S, "submitKyc(documents)", 2)
    msg(s, y + 64, S, Q, "enqueue: verifyIdentity", 3)
    msg(s, y + 96, S, A, "kyc_status = pending", 4, dash="6 4", col=GREY)
    msg(s, y + 128, Q, E, "verify(documents)", 5)
    msg(s, y + 160, E, Q, "outcome: verified | rejected", 6, dash="6 4", col=GREY)
    msg(s, y + 192, Q, S, "updateKycStatus(outcome)", 7)

    s.line(80, y + 218, 1110, y + 218, "#D6DBE3", 1.2, dash="3 4", marker=None)
    s.label(595, y + 218, "audience metrics, refreshed at least every 7 days (FR-12)",
            10, GREY)

    msg(s, y + 250, C, A, "POST /social-accounts  (OAuth grant)", 8)
    msg(s, y + 282, A, S, "linkAccount(platform, token)", 9)
    msg(s, y + 314, S, Q, "enqueue: refreshMetrics (recurring)", 10)
    msg(s, y + 346, Q, E, "GET follower count, engagement rate", 11)

    frag(s, 300, y + 366, 800, 58, "alt", "provider unavailable or rate-limited "
         "(risk R4)", RED)
    msg(s, y + 402, Q, S, "retain figures, mark metrics_source = self_declared",
        12, col=RED)

    s.text(34, 600, "Figure 3.4 — Sequence diagram: creator verification and "
           "metric retrieval", 12, "600", "start", INK)
    s.text(34, 620, "Both paths are asynchronous because both depend on third "
           "parties whose latency the platform does not control. A failed metric "
           "call degrades the figure to self-declared rather than failing the "
           "profile.", 11, "normal", "start", GREY)
    return s.save(p("fig-3-4-sequence-verification.svg"))


# ---------------------------------------------------------------- Fig 3.5
def fig_3_5():
    s = Svg(1080, 540)

    def st(x, y, label, note, col=NAVY, fill=NAVY_FILL, w=142, h=58):
        s.box(x, y, w, h, label, sub=note, fill=fill, stroke=col, size=12,
              sub_size=9, r=14)
        return (x, y, w, h)

    s.add(f'<circle cx="52" cy="152" r="10" fill="{INK}"/>')
    P = st(96, 123, "pending", "defined, unfunded")
    F = st(288, 123, "funded", "money in escrow", AMBER, AMBER_FILL)
    I = st(480, 123, "in progress", "creator working")
    S = st(672, 123, "submitted", "awaiting review")
    A = st(880, 123, "accepted", "released to creator", GREEN, GREEN_FILL, 150)
    D = st(672, 268, "disputed", "escrow frozen", RED, RED_FILL)
    R = st(880, 252, "refunded", "returned to brand", RED, RED_FILL, 150, 50)
    SP = st(880, 318, "split", "divided by ruling", RED, RED_FILL, 150, 50)
    CA = st(96, 268, "cancelled", "abandoned pre-funding", GREY, GREY_FILL)

    def arr(x1, y1, x2, y2, t, lx, ly, col=NAVY, dash=None):
        s.line(x1, y1, x2, y2, col, 1.5, dash=dash)
        s.label(lx, ly, t, 9.5, col)

    s.line(62, 152, 94, 152, INK, 1.5)
    arr(238, 152, 286, 152, "fund", 262, 138, AMBER)
    arr(430, 152, 478, 152, "begin", 454, 138)
    arr(622, 152, 670, 152, "submit", 646, 138)
    arr(814, 152, 878, 152, "accept", 846, 138, GREEN)

    # revision loop, submitted -> in progress
    s.path("M700 123 L700 86 L556 86 L556 121", NAVY, 1.5)
    s.label(628, 86, "request revision  ·  max 2", 9.5, NAVY)
    # auto-accept
    s.path("M760 123 L760 64 L930 64 L930 121", GREEN, 1.5, dash="5 3")
    s.label(845, 64, "auto-accept after 7 days", 9.5, GREEN)

    arr(744, 181, 744, 266, "raise dispute", 744, 224, RED, dash="5 3")
    arr(814, 288, 878, 277, "release", 858, 262, RED)
    arr(814, 300, 878, 336, "refund / split", 830, 322, RED)
    arr(168, 181, 168, 266, "cancel", 168, 224, GREY)

    s.text(96, 400, "Invariants", 12, "700", "start", INK)
    for i, t in enumerate([
            "A milestone can never leave a funded state without a balancing "
            "ledger transaction.",
            "cancelled is reachable only from pending, so funded money can "
            "never be discarded without an explicit financial outcome.",
            "Any transition not drawn here is rejected by the service layer."]):
        s.text(112, 422 + i * 18, "•", 11, "700", "start", AMBER)
        s.text(128, 422 + i * 18, t, 11, "normal", "start", INK)

    s.text(34, 500, "Figure 3.5 — Milestone state transition model", 12, "600",
           "start", INK)
    s.text(34, 520, "Terminal states are accepted, refunded, split and cancelled.",
           11, "normal", "start", GREY)
    return s.save(p("fig-3-5-milestone-states.svg"))


# ---------------------------------------------------------------- Fig 3.6
def fig_3_6():
    s = Svg(1120, 600)
    FW, FH, FY = 244, 430, 74

    def frame(x, title, note):
        s.rect(x, FY, FW, FH, WHITE, NAVY, sw=1.8, r=10)
        s.rect(x, FY, FW, 26, NAVY, NAVY, r=10)
        s.rect(x, FY + 16, FW, 10, NAVY, NAVY, r=0)
        s.text(x + FW / 2, FY + 18, title, 10.5, "700", fill=WHITE)
        s.text(x + FW / 2, FY + FH + 20, note, 9.5, "normal", "middle", GREY)
        return x

    def bar(x, y, w, h, fill="#EDF1F7", stroke="#D3DAE5", r=3):
        s.rect(x, y, w, h, fill, stroke, sw=1, r=r)

    def txt(x, y, t, size=8.5, w="normal", col=INK, anchor="start"):
        s.text(x, y, t, size, w, anchor, col)

    # 1 — discovery
    x = frame(40, "Creator discovery", "filters collapse on narrow viewports")
    bar(x + 12, FY + 38, FW - 24, 22)
    txt(x + 20, FY + 52, "Search creators…", 8.5, "normal", GREY)
    bar(x + 12, FY + 66, 110, 20, NAVY_FILL, NAVY)
    txt(x + 22, FY + 80, "Filters  (7)", 8.5, "700", NAVY)
    bar(x + 128, FY + 66, 104, 20)
    txt(x + 138, FY + 80, "Sort: rating", 8.5, "normal", GREY)
    for i in range(3):
        cy = FY + 96 + i * 104
        bar(x + 12, cy, FW - 24, 96, WHITE, "#C9D2E0")
        s.add(f'<circle cx="{x + 40}" cy="{cy + 34}" r="20" fill="{NAVY_FILL}" '
              f'stroke="{NAVY}" stroke-width="1.2"/>')
        txt(x + 70, cy + 22, ["Amara O.", "Kwesi B.", "Zola M."][i], 9.5, "700")
        txt(x + 70, cy + 36, ["Motion designer · Lagos",
                              "Photographer · Accra",
                              "Video editor · Nairobi"][i], 8, "normal", GREY)
        s.rect(x + 70, cy + 44, 66, 14, GREEN_FILL, GREEN, sw=1, r=7)
        txt(x + 78, cy + 54, "KYC verified", 7.5, "700", GREEN)
        s.rect(x + 142, cy + 44, 78, 14, AMBER_FILL, AMBER, sw=1, r=7)
        txt(x + 148, cy + 54, ["18.4k audience", "self-declared", "9.1k audience"][i],
            7, "700", AMBER)
        txt(x + 70, cy + 76, ["₦85,000 / day  ·  4.8 / 5",
                              "GHS 1,200 / day  ·  4.6 / 5",
                              "KSh 9,500 / day  ·  5.0 / 5"][i], 8, "normal", INK)

    # 2 — profile
    x = frame(312, "Creator profile", "portfolio sits above audience metrics")
    bar(x + 12, FY + 38, FW - 24, 58, NAVY_FILL, NAVY)
    s.add(f'<circle cx="{x + 44}" cy="{FY + 67}" r="22" fill="{WHITE}" '
          f'stroke="{NAVY}" stroke-width="1.3"/>')
    txt(x + 76, FY + 58, "Amara Okonkwo", 10, "700", NAVY)
    txt(x + 76, FY + 72, "Motion designer · Lagos, NG", 8, "normal", GREY)
    s.rect(x + 76, FY + 78, 62, 13, GREEN_FILL, GREEN, sw=1, r=6)
    txt(x + 82, FY + 88, "KYC verified", 7, "700", GREEN)
    txt(x + 12, FY + 112, "PORTFOLIO", 8, "700", GREY)
    for i in range(6):
        r, c = divmod(i, 3)
        bar(x + 12 + c * 74, FY + 120 + r * 56, 66, 48, "#E3E9F2", "#C9D2E0")
    txt(x + 12, FY + 250, "AUDIENCE", 8, "700", GREY)
    for i, (pl, n, v) in enumerate([("Instagram", "18,400", True),
                                    ("TikTok", "31,200", True),
                                    ("YouTube", "4,050", False)]):
        yy = FY + 258 + i * 26
        bar(x + 12, yy, FW - 24, 22)
        txt(x + 20, yy + 14, pl, 8.5, "600")
        txt(x + 120, yy + 14, n, 8.5, "700")
        s.rect(x + 166, yy + 5, 56, 12, GREEN_FILL if v else AMBER_FILL,
               GREEN if v else AMBER, sw=1, r=6)
        txt(x + 172, yy + 14, "verified" if v else "declared", 6.5, "700",
            GREEN if v else AMBER)
    bar(x + 12, FY + 344, FW - 24, 26, NAVY, NAVY)
    txt(x + FW / 2, FY + 361, "Invite to brief", 9.5, "700", WHITE, "middle")
    txt(x + 12, FY + 392, "₦85,000 / day   ·   ₦420,000 / project", 8.5, "600")

    # 3 — brand dashboard
    x = frame(584, "Brand campaign dashboard", "grouped by what needs my action")
    txt(x + 12, FY + 48, "AWAITING YOUR ACTION", 8, "700", AMBER)
    for i, (t, sub, col, fill) in enumerate([
            ("Ramadan campaign · M2", "deliverable submitted · 6 days left",
             AMBER, AMBER_FILL),
            ("Product launch reel · M1", "milestone unfunded", AMBER, AMBER_FILL)]):
        yy = FY + 54 + i * 50
        bar(x + 12, yy, FW - 24, 42, fill, col)
        txt(x + 20, yy + 18, t, 8.5, "700", col)
        txt(x + 20, yy + 31, sub, 7.5, "normal", GREY)
    txt(x + 12, FY + 172, "IN PROGRESS", 8, "700", GREY)
    for i, (t, sub) in enumerate([("Brand film · M3", "creator working · due 14 Oct"),
                                  ("Studio shoot · M1", "creator working · due 21 Oct"),
                                  ("Podcast edit · M2", "creator working · due 2 Nov")]):
        yy = FY + 178 + i * 44
        bar(x + 12, yy, FW - 24, 36)
        txt(x + 20, yy + 16, t, 8.5, "700")
        txt(x + 20, yy + 28, sub, 7.5, "normal", GREY)
    txt(x + 12, FY + 322, "COMPLETED", 8, "700", GREEN)
    for i in range(2):
        yy = FY + 328 + i * 34
        bar(x + 12, yy, FW - 24, 28, GREEN_FILL, GREEN)
        txt(x + 20, yy + 18, ["Festive teaser · paid", "Launch stills · paid"][i],
            8.5, "600", GREEN)
    bar(x + 12, FY + 398, FW - 24, 22, NAVY, NAVY)
    txt(x + FW / 2, FY + 413, "+  New brief", 9, "700", WHITE, "middle")

    # 4 — milestone funding & review
    x = frame(856, "Milestone funding and review", "amounts restated before confirm")
    txt(x + 12, FY + 48, "MILESTONE 2 OF 3", 8, "700", GREY)
    txt(x + 12, FY + 64, "Final cut, colour graded", 9.5, "700")
    bar(x + 12, FY + 76, FW - 24, 74, AMBER_FILL, AMBER)
    for i, (k, v) in enumerate([("Milestone amount", "₦180,000"),
                                ("Platform commission (10%)", "− ₦18,000"),
                                ("Creator receives", "₦162,000")]):
        yy = FY + 94 + i * 20
        txt(x + 22, yy, k, 8, "700" if i == 2 else "normal",
            AMBER if i == 2 else INK)
        txt(x + FW - 22, yy, v, 8, "700" if i == 2 else "normal",
            AMBER if i == 2 else INK, "end")
    bar(x + 12, FY + 162, FW - 24, 26, AMBER, AMBER)
    txt(x + FW / 2, FY + 179, "Fund ₦180,000 into escrow", 9, "700", WHITE, "middle")
    s.line(x + 12, FY + 204, x + FW - 12, FY + 204, "#D3DAE5", 1, marker=None)
    txt(x + 12, FY + 224, "SUBMITTED DELIVERABLES", 8, "700", GREY)
    for i, (n, sz) in enumerate([("final_cut_v3.mp4", "412 MB"),
                                 ("colour_notes.pdf", "1.2 MB")]):
        yy = FY + 232 + i * 30
        bar(x + 12, yy, FW - 24, 24)
        txt(x + 22, yy + 16, n, 8, "600")
        txt(x + FW - 22, yy + 16, sz, 7.5, "normal", GREY, "end")
    bar(x + 12, FY + 300, FW - 24, 26, GREEN, GREEN)
    txt(x + FW / 2, FY + 317, "Accept and release payment", 9, "700", WHITE, "middle")
    bar(x + 12, FY + 332, FW - 24, 24, WHITE, NAVY)
    txt(x + FW / 2, FY + 348, "Request revision", 8.5, "700", NAVY, "middle")
    s.rect(x + 12, FY + 362, FW - 24, 16, GREY_FILL, GREY, sw=1, r=8)
    txt(x + FW / 2, FY + 373, "1 of 2 revisions remaining", 7.5, "700", GREY,
        "middle")
    txt(x + 12, FY + 398, "Auto-accepts in 6 days (FR-31)", 8, "normal", GREY)

    s.text(34, 562, "Figure 3.6 — User interface wireframes", 12, "600", "start", INK)
    s.text(34, 582, "Designed mobile-first at a 360 px baseline (NFR-04). Whether "
           "an audience figure is verified is surfaced on every card, because "
           "that is the trust signal brands said they lacked.", 11, "normal",
           "start", GREY)
    return s.save(p("fig-3-6-wireframes.svg"))


# ---------------------------------------------------------------- Fig 3.7
def fig_3_7():
    s = Svg(1080, 660)

    def node(x, y, w, h, title, items, col=NAVY, fill=WHITE, tag="node"):
        d = 12
        s.add(f'<path d="M{x} {y} L{x + d} {y - d} L{x + w + d} {y - d} '
              f'L{x + w + d} {y + h - d} L{x + w} {y + h} Z" fill="{fill}" '
              f'stroke="{col}" stroke-width="1.4" opacity="0.5"/>')
        s.rect(x, y, w, h, fill, col, sw=1.6, r=2)
        s.text(x + w / 2, y + 19, title, 11.5, "700", fill=col)
        s.text(x + w / 2, y + 32, f"«{tag}»", 8.5, "normal", "middle", GREY)
        for i, it in enumerate(items):
            s.rect(x + 10, y + 42 + i * 24, w - 20, 20, fill if fill != WHITE
                   else "#F4F7FB", col, sw=1, r=2)
            s.text(x + w / 2, y + 56 + i * 24, it, 9, "normal", "middle", INK)

    node(40, 92, 170, 92, "CDN edge", ["Static client bundle"], NAVY, NAVY_FILL,
         "device")
    node(262, 92, 180, 116, "Application tier", ["API replica 1", "API replica 2"],
         NAVY, WHITE, "executionEnvironment")
    node(262, 268, 180, 116, "Worker tier", ["Queue consumers",
                                             "Reconciliation job"], NAVY, WHITE,
         "executionEnvironment")
    node(520, 92, 210, 164, "Data tier", ["PostgreSQL (primary)", "Redis",
                                          "Elasticsearch"], NAVY, NAVY_FILL,
         "device")
    node(520, 316, 210, 68, "Object storage", ["Public + private buckets"], NAVY,
         NAVY_FILL, "device")
    node(818, 92, 200, 164, "External services",
         ["Payment provider", "KYC provider", "Social platform APIs"], AMBER,
         AMBER_FILL, "external")
    node(818, 316, 200, 68, "Email service", ["Transactional delivery"], GREY,
         GREY_FILL, "external")

    s.rect(240, 62, 512, 350, "none", NAVY, sw=1.3, r=8, dash="7 5")
    s.text(496, 54, "Deployed environment — development · staging · production",
           10.5, "700", fill=NAVY)

    def link(x1, y1, x2, y2, t, lx, ly, col=GREY, dash=None):
        s.line(x1, y1, x2, y2, col, 1.4, dash=dash, back=True)
        s.label(lx, ly, t, 9, col)

    link(212, 138, 260, 138, "", 0, 0)
    s.label(236, 122, "HTTPS", 9, GREY)
    link(444, 150, 518, 150, "", 0, 0)
    s.label(481, 134, "SQL / TLS", 9, GREY)
    link(444, 326, 518, 326, "", 0, 0)
    s.label(481, 310, "pre-signed", 9, GREY)
    link(444, 300, 518, 218, "", 0, 0)
    link(732, 150, 816, 150, "", 0, 0)
    s.label(774, 134, "REST", 9, AMBER)
    link(732, 344, 816, 344, "", 0, 0)
    s.label(774, 328, "SMTP", 9, GREY)
    s.path("M352 208 L352 266", NAVY, 1.4, marker=None)
    s.label(352, 238, "shared queue", 9, NAVY)

    s.rect(40, 440, 980, 80, "#FAFBFD", "#D6DBE3", sw=1.2, r=4)
    s.text(56, 462, "Deployment rules", 11, "700", "start", INK)
    for i, t in enumerate([
            "The application tier is stateless, so capacity is added by "
            "replication (NFR-18); workers scale independently of request traffic.",
            "PostgreSQL is the only system of record. Elasticsearch is a derived, "
            "rebuildable index — losing it degrades search but never loses data.",
            "Schema changes ship only as versioned, reversible migrations; "
            "deployment is gated on lint, unit, integration and coverage checks."]):
        s.text(56, 480 + i * 15, "•", 10, "700", "start", NAVY)
        s.text(68, 480 + i * 15, t, 10, "normal", "start", INK)

    s.text(40, 576, "Figure 3.7 — Deployment diagram", 12, "600", "start", INK)
    s.text(40, 596, "Public portfolio media and private KYC documents are "
           "separated by bucket sensitivity, not merely by path.", 11, "normal",
           "start", GREY)
    return s.save(p("fig-3-7-deployment.svg"))


if __name__ == "__main__":
    print("Chapter Three figures:")
    for fn in (fig_3_1, fig_3_2, fig_3_3, fig_3_4, fig_3_5, fig_3_6, fig_3_7):
        fn()
