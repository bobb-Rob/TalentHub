# Image prompts for TalentHub

Prompts for Gemini (Imagen) and ChatGPT (GPT image) to make the demo's imagery:
the seed creators' portfolio pieces first, then their portraits.

The app has no image upload yet (portfolio items are text only, FR-10), so these
images are for the demo build. Save them under the names in the tables and they
can be wired into the portfolio grid and avatars later.

## How to use this

1. Start a **new chat** in Gemini or ChatGPT. Paste the **style brief** once.
2. Then paste one **item prompt** per message. One image per message keeps the
   quality up; a request for nine images at once drifts.
3. If a result has text, a logo, or warped hands, reply with the line under
   *Fixes* rather than starting again.
4. Export at the size in the table and save it as WebP (or PNG) under that name.

## Two rules to keep

- **No real brand marks.** Some seed items name real companies (Sterling Bank,
  Indomie, Paystack, Safaricom). The images must be unbranded. Do not generate
  their logos, packaging or ads. A fake campaign image for a real company reads
  as genuine work it never commissioned. The prompts below already describe each
  piece generically.
- **The people are fictional.** Portraits stand in for demo accounts and must not
  resemble a real person. Don't upload a real photo to "make it look like" someone.

---

## 1. Style brief (paste first, once per chat)

```
You are the art director for TalentHub, a marketplace where African brands commission
African creators: motion designers, photographers, video editors, illustrators and
copywriters. I will ask for one image at a time. Every image must follow this brief.

Look and feel
- Premium, editorial, contemporary. Think a portfolio site or an agency case-study
  page, not stock photography and not "AI art".
- Colour: deep ink navy (#0E1A3A) as the dominant shadow tone, one emerald accent
  (#00C27A) used sparingly, warm natural skin tones, clean whites. Avoid purple,
  neon, rainbow gradients and teal-orange grading.
- Light: soft, directional, motivated (a window, a practical lamp, a softbox).
  Real shadows and real texture. No glow halos, no lens-flare spam.
- Setting: contemporary urban West, East and North Africa (Lagos, Accra, Nairobi,
  Ibadan, Casablanca), shown as modern and specific, never as cliché (no safari,
  no tribal patterns as decoration, no poverty imagery).
- Composition: one clear subject, generous negative space, rule of thirds, a calm
  frame that still reads when it is cropped to a small 4:3 card.

Hard rules
- No text, letters, numbers, captions, watermarks or signatures anywhere in the image.
  Where a screen, page or sign appears, its content is abstract shapes or blurred.
- No logos and no real brands. Products are unbranded or carry an invented simple mark.
- No real, identifiable people. Hands and faces must be anatomically correct.
- Photographic items look shot on a full-frame camera with a 35–85mm lens, natural
  grain, shallow-to-moderate depth of field. Illustrated items look hand-made by a
  professional, with visible craft.

Output: a single image, landscape 4:3, high resolution, unless I say otherwise.
Reply "Ready" and wait for the first item.
```

---

## 2. Portfolio pieces (4:3, 1600 × 1200)

| # | Creator | Seed item | File name |
|---|---|---|---|
| 1 | Amara Okonkwo — motion design | Sterling Bank — launch film | `amara-bank-launch.webp` |
| 2 | Amara Okonkwo | Indomie festive spot | `amara-festive-spot.webp` |
| 3 | Amara Okonkwo | Paystack developer series | `amara-developer-series.webp` |
| 4 | Kwesi Boateng — photography | Kofi Cocoa — product range | `kwesi-cocoa-range.webp` |
| 5 | Kwesi Boateng | Accra Fashion Week | `kwesi-fashion-week.webp` |
| 6 | Zola Mthembu — video editing | Safaricom brand film | `zola-brand-film.webp` |
| 7 | Zola Mthembu | Two-part documentary | `zola-documentary.webp` |
| 8 | Tunde Alabi — illustration | Children's book series | `tunde-childrens-book.webp` |
| 9 | Nadia Cherif — copywriting | Bank rebrand — voice guide | `nadia-voice-guide.webp` |

**1 — Bank launch film (motion design still)**
```
Item 1. A single frame from a 2D motion-design launch film for a modern African bank.
Flat vector style with subtle grain: bold geometric shapes (circles, arcs, a stylised
card and a rising coin path) mid-transition across a deep navy field, one emerald
accent shape leading the eye, crisp white secondary forms. It should feel like
movement is frozen mid-frame: motion trails, overlapping layers, a slight 3D parallax.
No text, no logo, no bank name.
```

**2 — Festive food spot (motion design still)**
```
Item 2. A frame from a warm, festive 2D/2.5D animated advert for an instant-noodle
brand in Nigeria. A stylised family table seen from above at dusk: a steaming bowl
of noodles at the centre, hands reaching in, paper-cut style decorations and soft
bokeh string lights. Rich warm palette (saffron, chilli red, cream) set against the
deep navy shadows, with one emerald detail. Celebratory, cosy. Unbranded packaging,
no text, no logo.
```

**3 — Developer series (motion design still)**
```
Item 3. A frame from an explainer animation series for software developers at an
African payments company. Isometric 3D-flat illustration: modular blocks, cables and
nodes forming a clean payment pipeline, small stylised developer characters working
at floating panels whose contents are abstract shapes, not code. Navy background,
white and soft-grey forms, emerald highlights on the "flow". Precise, systematic,
elegant. No readable code, no text, no logo.
```

**4 — Cocoa product range (product photography)**
```
Item 4. Commercial product photograph: a range of six unbranded premium chocolate bars
and cocoa tins from a Ghanaian craft-chocolate maker, arranged in a staggered line on
a warm stone surface, with raw cocoa pods, nibs and a split pod as props. Soft
side-light from a large window, deep shadows, dark navy backdrop falling off to black,
one emerald leaf. Packaging uses an invented minimal geometric mark only, no words.
Shot on 85mm, f/5.6, crisp detail.
```

**5 — Fashion week (editorial photography)**
```
Item 5. Editorial runway photograph at a fashion week in Accra. A model mid-stride in
a sharply tailored contemporary outfit cut from bold West African wax-print fabric,
seen against a dark navy set with a single hard spotlight and a soft emerald rim
light. Blurred audience silhouettes in the foreground, shallow depth of field, motion
in the fabric. High-fashion, confident, modern. No text, no logos, no signage.
```

**6 — Brand film (video editing still)**
```
Item 6. A cinematic still from a brand film for a Kenyan mobile network: a young woman
on a Nairobi matatu at golden hour, looking out of the window and smiling at her phone,
city lights starting to glow outside. Anamorphic look, 2.39:1 letterbox bars inside
the 4:3 frame, natural film grain, gentle teal-free grade with deep navy shadows and
warm skin tones. The phone screen shows abstract colour, not an interface. No logos,
no text.
```

**7 — Documentary (video editing still)**
```
Item 7. A documentary film still: an older craftsman in a Nairobi workshop, lit by one
window, hands shaping wood on a workbench, sawdust in the light beam, his face half in
shadow and full of character. Observational, intimate, unposed. Shot on 35mm, natural
grain, muted palette with deep navy shadows. No text, no logos.
```

**8 — Children's book (illustration)**
```
Item 8. An illustrated spread from a Nigerian children's picture book. Hand-painted
gouache and coloured-pencil texture: a curious girl with her hair in threaded
braids and her small goat, exploring a vivid market at sunrise in Ibadan, with
stylised stalls, fabrics and fruit. Warm, joyful, full of small details to discover.
Visible paper texture and brush marks. Leave a calm area where text would go, but
include no text.
```

**9 — Voice guide (copywriting)**
```
Item 9. Overhead flat-lay photograph of a brand voice guide for a bank rebrand, open on a
designer's desk in Casablanca: a printed booklet in navy and white with an emerald
spot colour, its pages showing large typographic blocks rendered as abstract,
illegible marks; a fountain pen, a mint tea glass, sticky tabs and a laptop edge.
Soft morning window light, clean and premium. All writing is illegible abstract
marks. No real words, no logos.
```

---

## 3. Creator portraits (1:1, 800 × 800)

Use the same chat. Paste this line once before the portraits:

```
Next, portraits. Same brief, but output a square 1:1 image. Head-and-shoulders,
the person looking toward the camera, a calm, confident expression, natural
retouching (real skin texture), shallow depth of field, a softly blurred setting
that hints at their craft, and the background falling into deep navy. Fictional
person, not resembling anyone real.
```

| Creator | Prompt | File name |
|---|---|---|
| Amara Okonkwo | `Portrait: a Nigerian woman in her early thirties, a motion designer, natural short hair, simple black top, in a dim studio lit by the soft glow of two monitors behind her (screens blurred), Lagos.` | `avatar-amara.webp` |
| Kwesi Boateng | `Portrait: a Ghanaian man in his late twenties, a photographer, with a camera strap over his shoulder and a linen shirt, by a large studio window in Accra, with a softbox blurred behind him.` | `avatar-kwesi.webp` |
| Zola Mthembu | `Portrait: a Kenyan woman in her late twenties, a film editor, braids tied up, headphones around her neck, in an edit suite with blurred timelines glowing behind her, Nairobi.` | `avatar-zola.webp` |
| Tunde Alabi | `Portrait: a Nigerian man in his mid twenties, an illustrator, with round glasses and a pencil behind his ear, at a drawing desk with sketches pinned up and blurred behind him, Ibadan.` | `avatar-tunde.webp` |
| Nadia Cherif | `Portrait: a Moroccan woman in her thirties, a copywriter, dark wavy hair and a cream blazer, in a bright Casablanca café-office with zellige tiles softly blurred behind her.` | `avatar-nadia.webp` |

---

## 4. Optional: the brand and the empty states

**Sterling Foods brand mark (the demo brand account, 1:1, 512 × 512)**
```
A flat vector logomark for an invented food company called Sterling Foods: a simple
abstract wheat-and-sun symbol inside a rounded square, emerald on deep navy. Geometric,
minimal, works at 32px. Symbol only, no lettering.
```

**Empty-state illustration (3:2, 1200 × 800, transparent or white background)**
```
A minimal line illustration in deep navy with one emerald accent on a plain white
background: an open portfolio folder with a few empty frames and a small sparkle,
drawn with a single-weight line, plenty of white space. Friendly, quiet, no text.
```

---

## Fixes (reply with these when a result is off)

- Text crept in: `Remove every letter, number and logo. Replace any writing with abstract marks.`
- Too "AI" or glossy: `Make it more photographic and less polished: real texture, natural grain, motivated light, no glow or bloom.`
- Wrong colours: `Regrade toward deep navy shadows with a single emerald accent. Remove purple and teal-orange.`
- Hands or faces off: `Regenerate with anatomically correct hands and a natural face. Keep everything else.`
- Too busy for a small card: `Simplify: one clear subject and more negative space, still readable when shrunk to 300px wide.`
