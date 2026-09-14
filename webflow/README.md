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

Name (= card title) · Season label · Subheadline · Pill text · Current season (switch: starts centred + shows the pill; turn on for ONE item) · CTA label · CTA link · Accent colour (hex) · CTA text colour (hex) · Photo · Season badge · Order (1 = leftmost).

Colours are plain-text hex because the API can't bind a Color field to text or to an attribute. The card carries two hidden text blocks (`.ssc-card__meta-accent`, `.ssc-card__meta-cta`) bound to those fields; the footer script reads them and sets `--accent` / `--cta-text` on the card. If you'd rather have colour pickers, add Color fields and bind them in the Designer's Style panel (subheadline text colour, CTA background, pill dot background, CTA text colour) — the script leaves the CSS-variable path in place as a fallback.

## Moving the section to a real page

Copy the `section.ssc` element in the Designer and paste it on the target page, then copy `head.html` into that page's head code and `footer.html` into its footer code (or move both to site-wide custom code). The section pins with ScrollTrigger, so its parent must have no CSS transform. The Designer canvas shows the four slots stacked at the centre — that's expected; positions and the scroll animation only run on the published page.
