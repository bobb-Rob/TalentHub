"""
diagram_kit.py — minimal SVG drawing toolkit for the TalentHub SDLC figures.

Hand-rolled rather than pulled from a diagramming library so that every figure
is reproducible from source, versionable in git, and consistent in style.
Run the gen_*.py scripts to regenerate all figures.
"""

FONT = "Helvetica, Arial, 'DejaVu Sans', sans-serif"

# Palette. Fills differ in lightness as well as hue so the figures remain
# legible when printed in greyscale.
INK = "#16213E"
NAVY = "#1F3864"
NAVY_FILL = "#E7EDF6"
NAVY_MID = "#C6D4E8"
GREY = "#5B6472"
GREY_FILL = "#F1F2F4"
AMBER = "#9A5B06"
AMBER_FILL = "#FDF0DC"
GREEN = "#1B6B3A"
GREEN_FILL = "#E3F1E8"
RED = "#9B2226"
RED_FILL = "#FBE9E9"
WHITE = "#FFFFFF"


def esc(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def wrap(text, width):
    """Greedy wrap into lines of at most `width` characters."""
    words, lines, cur = str(text).split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


class Svg:
    def __init__(self, w, h, title=""):
        self.w, self.h, self.title = w, h, title
        self.parts = []

    def add(self, s):
        self.parts.append(s)
        return self

    # ---------- text ----------
    def text(self, x, y, s, size=13, weight="normal", anchor="middle",
             fill=None, italic=False, family=None, spacing=0):
        style = f'font-family:{family or FONT};font-size:{size}px;font-weight:{weight}'
        if italic:
            style += ";font-style:italic"
        if spacing:
            style += f";letter-spacing:{spacing}px"
        return self.add(
            f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{fill or INK}" '
            f'style="{style}">{esc(s)}</text>'
        )

    def lines(self, x, y, items, size=13, weight="normal", anchor="middle",
              fill=None, lh=None, italic=False):
        lh = lh or size + 4
        for i, ln in enumerate(items):
            self.text(x, y + i * lh, ln, size, weight, anchor, fill, italic)
        return self

    # ---------- shapes ----------
    def rect(self, x, y, w, h, fill=WHITE, stroke=NAVY, sw=1.6, r=4, dash=None,
             opacity=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        o = f' opacity="{opacity}"' if opacity else ""
        return self.add(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}"{d}{o}/>'
        )

    def box(self, x, y, w, h, label, sub=None, fill=NAVY_FILL, stroke=NAVY,
            size=13, weight="600", r=4, dash=None, wrap_at=None, sub_size=11,
            sub_fill=None):
        """Rounded box with vertically centred, wrapped label and optional subtitle."""
        self.rect(x, y, w, h, fill, stroke, r=r, dash=dash)
        wrap_at = wrap_at or max(8, int(w / (size * 0.56)))
        ls = wrap(label, wrap_at)
        subs = wrap(sub, int(w / (sub_size * 0.56))) if sub else []
        lh, slh = size + 3, sub_size + 2
        total = len(ls) * lh + (len(subs) * slh + 4 if subs else 0)
        top = y + h / 2 - total / 2 + size * 0.82
        self.lines(x + w / 2, top, ls, size, weight, "middle", stroke, lh=lh)
        if subs:
            self.lines(x + w / 2, top + len(ls) * lh + 2, subs, sub_size,
                       "normal", "middle", sub_fill or GREY, lh=slh)
        return self

    def oval(self, cx, cy, rx, ry, label, fill=WHITE, stroke=NAVY, size=12,
             wrap_at=18, sw=1.5):
        self.add(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" '
                 f'stroke="{stroke}" stroke-width="{sw}"/>')
        ls = wrap(label, wrap_at)
        self.lines(cx, cy - (len(ls) - 1) * (size + 2) / 2 + size * 0.35, ls,
                   size, "normal", "middle", stroke, lh=size + 2)
        return self

    def actor(self, cx, cy, label, stroke=NAVY, size=12, scale=1.0):
        """Stick figure with the label beneath it. cy is the top of the head."""
        s = scale
        hr = 9 * s
        self.add(f'<circle cx="{cx}" cy="{cy + hr}" r="{hr}" fill="{WHITE}" '
                 f'stroke="{stroke}" stroke-width="1.7"/>')
        y0 = cy + 2 * hr
        self.add(f'<path d="M{cx} {y0} L{cx} {y0 + 24 * s} '
                 f'M{cx - 14 * s} {y0 + 8 * s} L{cx + 14 * s} {y0 + 8 * s} '
                 f'M{cx} {y0 + 24 * s} L{cx - 12 * s} {y0 + 42 * s} '
                 f'M{cx} {y0 + 24 * s} L{cx + 12 * s} {y0 + 42 * s}" '
                 f'fill="none" stroke="{stroke}" stroke-width="1.7" '
                 f'stroke-linecap="round"/>')
        ls = wrap(label, 16)
        self.lines(cx, y0 + 42 * s + 15, ls, size, "600", "middle", stroke,
                   lh=size + 2)
        return self

    def cylinder(self, x, y, w, h, label, sub=None, fill=NAVY_FILL, stroke=NAVY,
                 size=12):
        """Datastore drawn as a cylinder."""
        ry = 9
        self.add(f'<path d="M{x} {y + ry} A{w/2} {ry} 0 0 1 {x + w} {y + ry} '
                 f'L{x + w} {y + h - ry} A{w/2} {ry} 0 0 1 {x} {y + h - ry} Z" '
                 f'fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>')
        self.add(f'<path d="M{x} {y + ry} A{w/2} {ry} 0 0 0 {x + w} {y + ry}" '
                 f'fill="none" stroke="{stroke}" stroke-width="1.6"/>')
        ls = wrap(label, int(w / (size * 0.55)))
        cy = y + ry + (h - ry) / 2
        self.lines(x + w / 2, cy - (len(ls) - 1) * (size + 2) / 2 + 2, ls, size,
                   "600", "middle", stroke, lh=size + 2)
        if sub:
            self.text(x + w / 2, y + h - 6, sub, 10, "normal", "middle", GREY)
        return self

    # ---------- connectors ----------
    def line(self, x1, y1, x2, y2, stroke=NAVY, sw=1.5, dash=None, marker="arrow",
             back=False):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        me = f' marker-end="url(#{marker})"' if marker else ""
        ms = f' marker-start="url(#{marker}-s)"' if back else ""
        return self.add(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" '
            f'stroke-width="{sw}"{d}{me}{ms}/>'
        )

    def path(self, d, stroke=NAVY, sw=1.5, dash=None, marker="arrow", fill="none"):
        da = f' stroke-dasharray="{dash}"' if dash else ""
        me = f' marker-end="url(#{marker})"' if marker else ""
        return self.add(f'<path d="{d}" fill="{fill}" stroke="{stroke}" '
                        f'stroke-width="{sw}"{da}{me}/>')

    def elbow(self, x1, y1, x2, y2, stroke=NAVY, sw=1.5, dash=None,
              marker="arrow", first="h"):
        """Orthogonal two-segment connector."""
        d = (f"M{x1} {y1} L{x2} {y1} L{x2} {y2}" if first == "h"
             else f"M{x1} {y1} L{x1} {y2} L{x2} {y2}")
        return self.path(d, stroke, sw, dash, marker)

    def label(self, x, y, s, size=10.5, fill=None, anchor="middle", bg=WHITE,
              weight="normal", pad=3):
        """Text with an opaque plate behind it, for labels sitting on lines."""
        wpx = len(str(s)) * size * 0.54 + pad * 2
        if bg:
            self.add(f'<rect x="{x - wpx/2}" y="{y - size * 0.82}" width="{wpx}" '
                     f'height="{size + 4}" fill="{bg}" opacity="0.94" rx="2"/>')
        return self.text(x, y + size * 0.3, s, size, weight, anchor, fill or GREY)

    # ---------- output ----------
    def render(self):
        defs = "".join(
            f'<marker id="arrow{sfx}" viewBox="0 0 10 10" refX="{rx}" refY="5" '
            f'markerWidth="6.5" markerHeight="6.5" orient="{orient}">'
            f'<path d="M0 0 L10 5 L0 10 z" fill="{INK}"/></marker>'
            for sfx, rx, orient in (("", 9, "auto"), ("-s", 9, "auto-start-reverse"))
        )
        defs += (f'<marker id="open" viewBox="0 0 10 10" refX="9" refY="5" '
                 f'markerWidth="8" markerHeight="8" orient="auto">'
                 f'<path d="M0 0 L10 5 L0 10" fill="none" stroke="{INK}" '
                 f'stroke-width="1.6"/></marker>')
        defs += (f'<marker id="hollow" viewBox="0 0 12 12" refX="11" refY="6" '
                 f'markerWidth="9" markerHeight="9" orient="auto">'
                 f'<path d="M1 1 L11 6 L1 11 z" fill="{WHITE}" stroke="{INK}" '
                 f'stroke-width="1.3"/></marker>')
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" '
            f'height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
            f'<defs>{defs}</defs>'
            f'<rect width="{self.w}" height="{self.h}" fill="{WHITE}"/>'
            + "".join(self.parts) + "</svg>"
        )

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.render())
        print(f"  wrote {path}")
        return path
