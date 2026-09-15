# Webflow build — Seasons hero → carousel

Built 14 Sep 2026 on the Brodie marketing site (Webflow site `6921d2c2bd3b56136200df40`), staging Designer only — nothing published.

## Where things live

| Thing | Where |
| --- | --- |
| Page | **Seasons Scroll (prototype)** — `/seasons-scroll`, page id `6aa7f7d2c9fc6433f7bb7cb3`, marked *draft* (excluded from publishing until you flip it) |
| CMS | **Seasons** collection (slug `season-cards`, id `6aa7f859dc1504c79a240a47`) with 4 items: Brodie Summer, Slasher Season, Coldest Winter, Bracket Season |
| Section | `section.ssc` › `.ssc-stage` › hero copy (`.ssc-hero-copy`, three editable text elements) + `.ssc-track` › Collection List (`.ssc-list` › `.ssc-items` › item `.ssc-slot` › `.ssc-card`) + two paddles (`.ssc-arrow--prev/--next`, link blocks) |
| Custom code | Page **head**: `head.html` (custom properties, calc() transforms, keyframes). Page **footer**: `footer.html` (GSAP ScrollTrigger). Both in this folder, mirrored on the page settings. |

## CMS fields (per season)

Name (= card title) · Season label · Subheadline · Pill text (fill ONLY on the current season — it shows the pill and makes that season start centred) · CTA label · CTA link · Accent colour (hex) · CTA text colour (hex) · Photo · Season badge · Order (1 = leftmost).

Colours are plain-text hex because the API can't bind a Color field to text or to an attribute. The card carries two hidden text blocks (`.ssc-card__meta-accent`, `.ssc-card__meta-cta`) bound to those fields; the footer script reads them and sets `--accent` / `--cta-text` on the card. If you'd rather have colour pickers, add Color fields and bind them in the Designer's Style panel (subheadline text colour, CTA background, pill dot background, CTA text colour) — the script leaves the CSS-variable path in place as a fallback.

## Moving the section to a real page

Copy the `section.ssc` element in the Designer and paste it on the target page, then copy `head.html` into that page's head code and `footer.html` into its footer code (or move both to site-wide custom code). The section pins with ScrollTrigger, so its parent must have no CSS transform. The Designer canvas shows the four slots stacked at the centre — that's expected; positions and the scroll animation only run on the published page.

## Divisions carousel (added 15 Sep 2026)

Second section on the same page (`section.dv`, right after `section.ssc`). Driven by the existing **Divisions** collection (`6953fd7bfdbf03c11196c59f`) — two fields were added: **Carousel order** (1 = leftmost; the list is sorted by it and hides items without one) and **Carousel image** (portrait; the landscape *Image* stays for the Divisions page). Card = name → title, Subheading → resting caption, Description → the frosted overlay copy. A new **D6 Beginner** item was created (its tags, availability, button text and subheading are placeholders to review).

Behaviour: the row is a native horizontal scroller with snap (trackpad, Magic Mouse, swipe). Paddles scroll one card, or two when two or more fit, and disable at the ends. Hover reveals the frosted overlay; on touch (or keyboard focus) a + button appears and a tap on the card or the button toggles it; tapping elsewhere or Escape closes.

Sources: `divisions-static.css` (Webflow classes, via WHTML), `divisions-head.html`, `divisions-footer.html`, `divisions-prototype.html`. `build.mjs` rebuilds `index.html` from these; `build-page-code.mjs` produces the combined, comment-stripped page head/footer (`dist/`) that goes into the page settings — page-level custom code is capped at 10,000 characters per block.

## Ways to Play (added 15 Sep 2026)

Third section on the page (`section.wyp`, after `section.dv`), from Figma node 5448-12751. Left column: eyebrow, title, subtitle, "Find Your Game" CTA. Right column: a three-item accordion (Start A Team open by default; Join A Team and Drop-In Run collapsed). Static native elements — every text and button is editable in the Designer/Editor; duplicate a `.wyp-item` to add another way to play (give the default-open one the `wyp-open` class).

**Video backdrop:** `.wyp-media` fills the section; inside it `.wyp-video-wrap` is `position:sticky; top:0; height:100vh`, so the video always fills the viewport while the section grows with the open accordion. The `<video>` currently points at the site's existing "Join the movement" background-video transcodes (webm + mp4) as a stand-in — swap the two `<source>` URLs (or replace the element with a Webflow Background Video) when the final clip is ready. Poster = the Figma still (`assets/wyp-poster.jpg`, also uploaded to the Webflow asset library as `ways-to-play-video-poster`).

**Placeholders to review:** the Join A Team and Drop-In Run body copy (marked "Placeholder copy"), their CTA labels/links (`/join-a-team`, `/locations`), and the Start A Team "Learn More" link (`/start-a-team`).

Sources: `waystoplay-static.css`, `waystoplay-head.html`, `waystoplay-footer.html`, `waystoplay-prototype.html`. Page code is now minified with terser by `build-page-code.mjs` (run `npm install` once).
