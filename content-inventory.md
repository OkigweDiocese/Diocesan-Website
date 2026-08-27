# Content Inventory — Catholic Diocese of Okigwe Website

Prepared as groundwork for the Decap CMS migration (Decap CMS + DecapBridge + GitHub + Netlify).

## How to read this

**Verdict** — one of three:

- **EDITABLE** — the Secretariat will change this. Becomes a CMS field.
- **FIXED** — structural. Stays hard-coded in the HTML/CSS/JS; not exposed in the CMS.
- **REPEATING** — belongs to a list (news, events, priests, parishes…). Becomes a CMS *list/collection* field, not one CMS field per item. For lists with dozens or hundreds of entries (the priest roll, the parish directory), this table gives the **item schema once** — not one row per priest — with a note on where the raw data currently lives and roughly how many items it holds.

**Field name** — draft name only, in `camelCase`, scoped to the JSON/YAML file it will live in (so `heroTitle` inside `home.json` doesn't need a `home` prefix). These are provisional — treat them as the first draft the task asked for, not final.

**A note on duplication:** several pieces of wording currently exist in more than one place on the site with *slightly different text* (the Mission statement, the Vision statement, the phone number's two formats). Where I found that, I've flagged it under **Notes** rather than silently picking one — that's a decision for you, not something I should resolve by guessing which wording is "correct."

---

## 1. Global / Shared Content

Anything appearing on more than one page. Edited once, in one shared file (proposed: `global.json`), referenced everywhere instead of hard-coded per page.

| Element | Appears on | Verdict | Field name | Notes |
|---|---|---|---|---|
| Site name "Catholic Diocese of Okigwe" | Every page (navbar + footer) | FIXED | — | Identity/branding, not day-to-day content. Could become `siteName` later if ever needed. |
| Diocesan logo image | Every page (navbar + footer) | EDITABLE | `logoImage` | Currently `images/logo-transperent.png`, same file in navbar and footer. |
| Diocesan seal / coat of arms image | Home hero, Bishop page | EDITABLE | `diocesanSealImage` | `images/diocesan-seal.png` |
| Site tagline "Serving God and Humanity Through Faith, Hope & Love" | Footer (every page), Home hero mission line, `<meta description>` | EDITABLE | `tagline` | Currently duplicated verbatim in footer and hero — should be one field read in both places. |
| Main navigation menu (Home / About ▾ / Our Bishop / Priests / Parishes / Institutions ▾ / Archives ▾ / Contact) | Every page | FIXED | — | Site structure. Not "Secretariat will change this" content — flag separately if you want menu editing later. |
| Footer "Quick Links" list | Every page | FIXED | — | Mirrors the nav; same reasoning. |
| Facebook page URL | Footer (every page), Contact page's "Follow the Diocese" card | EDITABLE | `facebookUrl` | Currently `https://web.facebook.com/profile.php?id=61557403089364`, hard-coded ~20 times. |
| WhatsApp number | Contact page's "Follow the Diocese" card | EDITABLE | `whatsappNumber` | Currently `2348133807134` (wa.me link). Same underlying number as `phone`, different format — decide whether to store once and derive, or store both. |
| Diocesan Secretariat address | Home (contact section + footer), Contact page (contact card + footer), every other page's footer | EDITABLE | `address` | "Diocesan Catholic Secretariat, Villa Lourdes. Box 99 Okigwe, Imo State, Nigeria." Multi-line — hard-coded in ~20 footers plus 2 contact-info cards. |
| Phone number | Home (contact section + footer), Contact page (contact card + footer), every footer | EDITABLE | `phone` | `+234 (0) 813 380 7134`. Note: on Contact page the `tel:` link is `+2348133807134` (no space after `+234`) while the *displayed* text elsewhere is `+234 (0) 813 380 7134` — inconsistent formatting to reconcile. |
| General enquiries email | Home (contact section + footer), Contact page (contact card + footer), every footer | EDITABLE | `email` | `okigwecathdiocese@yahoo.com` |
| Office hours | Home contact section, Contact page | EDITABLE | `officeHours` | "Tuesday & Thursday: 10:00 AM – 2:00 PM" |
| Google Maps embed URL | Home contact section, Contact page | EDITABLE | `mapEmbedUrl` | Same iframe `src` on both pages. |
| Current Bishop (name, title, role) | Home (Bishop's Message), About: Officials (Bishop highlight), Our Bishop page (sidebar card) | EDITABLE | `currentBishop: { title, name, role }` | "Most Rev. Dr. / Solomon A. Amatu / Catholic Bishop of Okigwe" — reworded slightly differently in 3 places today (e.g. Bishop page uses full name "Solomon Amanchukwu Amatu"). Recommend one shared record. |
| Mission statement | Home (About section), About: History page | EDITABLE | `missionText` | **Wording differs between the two pages today** (About: History's version adds "faithfully" and "— leaving no soul behind"). Needs a decision on which text wins, or whether they're intentionally distinct. |
| Vision statement | Home (About section), About: History page | EDITABLE | `visionText` | Same issue — wording differs slightly between the two occurrences. |
| Footer copyright line | Every page | FIXED | — | Year is auto-generated by `script.js` (`#footer-year`); surrounding text is static. |
| Theme toggle, hamburger menu, back-to-top button | Every page | FIXED | — | UI chrome, not content. |
| Official Diocesan Directory PDF | About: Statistics page | EDITABLE | `officialDirectoryPdf` | `files/The 2026 Directory_Main.pdf` — a yearly-updated download, good candidate for a CMS file-upload field. |

---

## 2. Page-by-Page Inventory

### Home — `index.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero headline "Welcome to the Catholic Diocese of Okigwe" | EDITABLE | `heroTitle` | |
| Hero mission line | EDITABLE | *(shared)* `tagline` | See Global table — currently a separate copy of the footer tagline. |
| Hero action buttons (Find a Parish / View Diocesan Calendar / Contact Us) | REPEATING | `heroActions[].{label, link}` | Exactly 3 today; a small list is more future-proof than 3 fixed fields if the Secretariat ever wants a 4th. |
| Scrolling announcement ticker | REPEATING | `tickerAnnouncements[]` (text) | 3 items today, each duplicated twice in the HTML for the seamless scroll loop — CMS should store 3 items once and let the template render the loop. |
| Bishop's Message: portrait image | EDITABLE | `bishopPortraitImage` | |
| Bishop's Message: quote text | EDITABLE | `bishopMessageQuote` | Two paragraphs. |
| Bishop's Message: "Read More" link | FIXED | — | Anchors to `#about` on the same page. |
| About section heading/subtitle | EDITABLE | `aboutHeading`, `aboutSubtitle` | |
| Mission card text | EDITABLE | *(shared)* `missionText` | See duplication note above. |
| Vision card text | EDITABLE | *(shared)* `visionText` | See duplication note above. |
| Statistics grid (Parishes, Chaplaincies, Priests, Major Seminarians, Schools, Faithful) | REPEATING | `diocesanStats[].{label, value}` | 6 of the 10 stats also shown on About: Statistics. Recommend **one** shared stats list with a `showOnHome: true/false` flag per item, rather than two separately-edited copies. |
| Featured Parishes (4 cards: image, badge, name, location, description) | REPEATING | `featuredParishes[].{image, badge, name, location, description}` | All 4 also exist as entries in the full Parish Directory (`parishes.html`). Recommend a `featured: true` flag on the shared parish record instead of duplicate content maintained in two places. |
| Upcoming Events grid | REPEATING | `events[].{date, time, title, event, location}` | **Currently lives in `script.js`, not in this page** — a hard-coded `EVENTS` array inside `initUpcomingEvents()`, shared code that only renders on this page. Top priority to extract into its own `events.json`/collection since it's the most frequently-changing content on the site. |
| News & Events section (3 cards: image, category, date, title, excerpt) | REPEATING | `newsItems[].{image, category, date, title, excerpt}` | "Read More" links were removed earlier (led nowhere); excerpts are the full story text today. |
| "All News & Events" button | FIXED | — | Links to `pages/news.html`. |
| Media Gallery section | — | — | Entered in markup but **fully commented out** — not rendered. Skip until it's built out. |
| Contact section heading/subtitle | EDITABLE | `contactHeading`, `contactSubtitle` | |
| Contact info (address/phone/email/hours) | EDITABLE | *(shared)* `address`, `phone`, `email`, `officeHours` | Don't duplicate — same global fields as the footer. |
| Contact form | FIXED | — | Structural (Netlify Forms). Field labels could become EDITABLE later but are low priority. |

### About: History — `pages/about_history.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `historyHeroTitle`, `historyHeroSubtitle` | |
| History narrative | REPEATING | `historyParagraphs[]` | 3 paragraphs today; a list lets the Secretariat add more without a template change. |
| Mission card text | EDITABLE | *(shared)* `missionText` | Wording differs from Home's copy today — see Global table. |
| Vision card text | EDITABLE | *(shared)* `visionText` | Same. |
| Core Values | REPEATING | `coreValues[]` | "Faith • Service • Compassion • Stewardship • True Leadership • Community • Excellence" |
| Diocesan Map image | EDITABLE | `diocesanMapImage` | Just added (`images/map_of_the_diocese.jfif`). |
| Diocesan Map caption | EDITABLE | `diocesanMapCaption` | "Map of the Diocese of Okigwe" |
| "Be Part of Our Story" CTA heading/text | EDITABLE | `historyCtaTitle`, `historyCtaText` | |
| CTA buttons (Find a Parish / Contact the Diocese) | FIXED | — | Structural links. |

### About: Statistics — `pages/about_statistics.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `statsHeroTitle`, `statsHeroSubtitle` | |
| Statistics grid (10 items: Deaneries, Parishes, Dedicated Parishes, Chaplaincies, Priests, Major Seminarians, Schools, Faithful, Health Centres, Seminaries) | REPEATING | *(shared)* `diocesanStats[]` | This is the fuller, canonical list — see Home's note about sharing one source. This page's `<section id="diocesan-directory">` is also the anchor target for the homepage's "View Diocesan Calendar" button. |
| "Diocesan Directory" CTA heading/text | EDITABLE | `directoryCtaTitle`, `directoryCtaText` | |
| Official Directory PDF button | EDITABLE | *(shared)* `officialDirectoryPdf` | See Global table. |
| "Be Part of Our Story" CTA | EDITABLE | `historyCtaTitle`/`historyCtaText` (shared with About: History) | Identical block to the one on About: History — candidate for a single shared "find a parish" CTA component. |

### About: Officials — `pages/about_officials.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `officialsHeroTitle`, `officialsHeroSubtitle` | |
| Bishop highlight (portrait, name, bio paragraphs, "Meet Our Bishop" link) | EDITABLE | *(shared)* `currentBishop`, `bishopBioShort[]` | Portrait/name shared with global `currentBishop`; the two intro paragraphs here are unique to this page. |
| Diocesan Officials roster (Vicars General, Chancellor, Episcopal Vicars, Judicial Vicar, Financial Administrator, Cathedral Administrator, Legal Advisers — 11 people) | REPEATING | `officials[].{photo, role, name, parish, phone, email}` | Each entry: photo, role/title, name, parish/base, one or more phone numbers, optional email. |
| Deans of the Deaneries (13 people) | REPEATING | `deans[].{photo, deanery, name}` | One per deanery. |
| "Be Part of Our Story" CTA | EDITABLE | Shared with above | Same block again — 3rd copy of this CTA on the site. |

### Our Bishop — `pages/bishop.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `bishopHeroTitle`, `bishopHeroSubtitle` | |
| Portrait image | EDITABLE | *(shared with)* `currentBishop.portrait` | |
| Vitals card (full name, born, ordained deacon, ordained priest, appointed auxiliary bishop, consecrated, coadjutor year, substantive year, episcopal motto, ordaining bishop) | EDITABLE | `bishopVitals: { fullName, born, ordainedDeacon, ordainedPriest, appointedAuxiliary, consecrated, coadjutorYear, substantiveYear, motto, ordainingBishop }` | One record — these all change together only when a new bishop is installed, so a single object, not a list. |
| Coat of Arms image + caption | EDITABLE | `coatOfArmsImage`, `coatOfArmsMotto` | |
| Biography | REPEATING | `bishopBioParagraphs[]` | 4 paragraphs today. |
| Photo with Pope Leo XIV (image + caption) | EDITABLE | `bishopFeaturedPhoto`, `bishopFeaturedPhotoCaption` | |
| Pastoral Letters / Homilies / Speeches tabs | — | — | Entire block is commented out (not rendered) — draft/future feature, all placeholder text. Skip for now. |
| Past Bishops grid | REPEATING | `pastBishops[].{photo, name, years, role}` | Only 1 of 3 card slots is populated (Bishop Ilonu); the other 2 are commented-out placeholders. |

### Priests — `pages/priests.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `priestsHeroTitle`, `priestsHeroSubtitle` | |
| Info banner (heading + Scripture quote) | EDITABLE | `priestsBannerTitle`, `priestsBannerQuote` | |
| Priest roll (searchable table) | REPEATING | `priests[].{name, ordination, location}` | **~500+ entries**, currently a hard-coded `PRIESTS` JS array inside a `<script>` tag on this page (search/pagination logic is also inline here). This is the single biggest content-migration job on the site. |

### Parish Directory — `pages/parishes.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `parishesHeroTitle`, `parishesHeroSubtitle` | |
| Deanery list (13 deaneries: Okigwe, Uturu, Isuikwuato, Obowo East, Obowo West, Uboma, Ihitte, Ehime East, Ehime West, Ugiri/Mbama, Osu, Onuimo, Umunneochi) | REPEATING | `deaneries[].{name, slug}` | Used to drive both the section headers and the filter tabs — should be a single source, not two. |
| Parish entries within each deanery | REPEATING | `parishes[].{name, deanery, location, feastDay?}` | **~150+ entries** across all 13 deaneries, hand-written as HTML cards (not a JS array like the priest roll). Same `featured: true` flag idea from Home applies here. |
| Mobile accordion / search / filter UI | FIXED | — | Just-built behavior; not content. |

### Institutions: Seminaries — `pages/ins_seminaries.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `seminariesHeroTitle`, `seminariesHeroSubtitle` | |
| Seminaries (3: St. Thomas Aquinas Ihitte, St. Peter's Okigwe, St. Charles Borromeo) | REPEATING | `seminaries[].{name, location, description, staff[].{role, name, contact}}` | Each has 2–3 formation-team staff. |

### Institutions: Secondary Schools — `pages/ins_sec_schools.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `secSchoolsHeroTitle`, `secSchoolsHeroSubtitle` | |
| School directory (searchable table) | REPEATING | `secSchools[].{name, managers[]}` | ~30 entries, hard-coded `SEC_SCHOOLS` JS array (same pattern as the priest roll, smaller scale). |

### Institutions: Returned Schools — `pages/ins_returned_schools.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `returnedSchoolsHeroTitle`, `returnedSchoolsHeroSubtitle` | |
| School directory (searchable table) | REPEATING | `returnedSchools[].{name, managers[]}` | ~8 entries, same `RETURNED_SCHOOLS` JS array pattern. |

### Institutions: Hospitals — `pages/ins_hospital.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `hospitalsHeroTitle`, `hospitalsHeroSubtitle` | |
| Hospital/health centre entries | REPEATING | `healthCentres[].{name, location, description}` | Currently 2 placeholder "Coming Soon" cards with no real data yet. |

### Institutions: Press — `pages/ins_press.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `pressHeroTitle`, `pressHeroSubtitle` | |
| Sage News Paper & Immaculata Printing Press (name, description, contact, staff) | EDITABLE | `pressOffice: { name, description, contact, staff[].{role, name, contact} }` | Only one institution — a single record, not a list. |

### Archives: Functionaries — `pages/ar_functionaries.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `functionariesHeroTitle`, `functionariesHeroSubtitle` | |
| "Jump to Office" nav (5 links) | FIXED | — | **3 of the 5 links are broken** — they point to `#vicars-general`, `#episcopal-vicars`, `#judicial-vicars`, none of which exist on the page (only "Chancellors" and "Financial Administrators" sections are actually built). Flagged in the earlier proofreading pass; still unresolved. |
| Chancellors (past holders of the office) | REPEATING | `chancellors[].{photo, name, years, deceased?}` | 4 entries. |
| Financial Administrators | REPEATING | `financialAdministrators[].{photo, name, years}` | |
| "Submit corrections" note + link | FIXED | — | |

### Archives: Priests — `pages/ar_priests.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `archivePriestsHeroTitle`, `archivePriestsHeroSubtitle` | |
| Memorial banner text | EDITABLE | `memorialBannerText` | |
| Departed priests roll (searchable table) | REPEATING | `departedPriests[].{name, ordination, death}` | ~63 entries, hard-coded `PRIESTS` JS array (this page's own copy — different schema from the active-priest roll, which has `location` instead of `death`). |

### Contact — `pages/contact.html`

| Section / Element | Verdict | Field name | Notes |
|---|---|---|---|
| Hero title/subtitle | EDITABLE | `contactHeroTitle`, `contactHeroSubtitle` | |
| Chancery contact card (address/phone/email/hours) | EDITABLE | *(shared)* `address`, `phone`, `email`, `officeHours` | Same global fields as the footer — don't duplicate. |
| Google Map embed | EDITABLE | *(shared)* `mapEmbedUrl` | |
| "Follow the Diocese" (Facebook + WhatsApp buttons) | EDITABLE | *(shared)* `facebookUrl`, `whatsappNumber` | |
| Contact form (name, email, phone, parish, subject dropdown, message) | FIXED | — | Structural (Netlify Forms). The subject dropdown's department list could become `contactSubjects[]` REPEATING later if departments change often — low priority. |

---

## 3. Pages not currently linked from the site (present as files, but no nav/footer link points to them)

These exist and are reachable by direct URL, but aren't part of the live click-through site today. Recommend deciding whether each becomes a real section (and gets a CMS collection) or stays parked before spending CMS effort on it.

### Ministries — `pages/ministries.html`
Fully written content (6 ministry overview cards + 6 detailed sections: Caritas, Youth, CWO, CMO, Schools, Liturgy), each with heading, 2 paragraphs, activity list, and contact line. Ready to inventory the same way as the linked pages **if** this page gets activated.

### News & Events — `pages/news.html`
Generic placeholder articles (not the same stories as Home's News section) plus category filters, newsletter signup, and pagination UI. Would need its content reconciled with — or replacing — Home's `newsItems`.

### Media Gallery — `pages/gallery.html`
16 placeholder photo tiles with captions, category filters, lightbox. No real photos yet.

### Archive: Bishops — `pages/ar_bishops.html`
Entirely bracketed template content (`[First Bishop]`, `[Year]`, etc.) — a scaffold for a "History of Our Bishops" page, not yet populated with real data. Nothing to inventory as EDITABLE until real content is written.

### Archive: History — `pages/ar_history.html`
Well-written narrative (6 sections) and an 11-event timeline, but every section carries a `TODO: Insert confirmed date/name from archives` comment — the prose is real, several facts inside it are placeholders (`[Year]`, `[Name]`). Worth inventorying properly once the archival research is done.

---

## 4. Field naming conventions used above

- `camelCase` throughout, no underscores or hyphens, to stay consistent across JSON keys, Decap `config.yml` field names, and any HTML `data-*` attributes.
- Global, cross-page fields (address, phone, email, tagline, etc.) get short, unprefixed names, since they live in one `global.json` and are referenced everywhere.
- Page-specific fields are prefixed with the page's short name (`heroTitle`, `historyParagraphs`, `bishopVitals`) so two pages can each have their own `HeroTitle`-style field without colliding once everything is flattened into one CMS config.
- Repeating items use a plural collection name and a singular per-item shape, e.g. `priests[].{name, ordination, location}` — matches how Decap CMS's `list` widget with nested `fields` works.
- Where the exact same piece of content already appears with **different wording** in two places (Mission, Vision, phone format), I did not invent a merged version — that's flagged under Notes as a decision for the Secretariat/you, not something to silently resolve.

---

## 5. Open questions this inventory surfaced (not yet answered)

1. **Mission & Vision wording** differs between Home and About: History — which version is authoritative?
2. **Home stats vs. About: Statistics stats** — same underlying numbers, two separately-maintained copies (6 vs. 10 items) today. Merge into one list with a `showOnHome` flag?
3. **Featured Parishes vs. full Parish Directory** — 4 parishes are duplicated content today. Add a `featured` flag to shared parish records instead?
4. **Events currently live in `script.js`**, not in any page — highest-priority extraction since it's the most frequently updated content.
5. **Phone number formatting** is inconsistent (`+234 (0) 813 380 7134` display text vs. `+2348133807134` in `tel:`/`wa.me` links) — store once and format per use, or store both forms?
6. **Broken jump-nav on Archives: Functionaries** (3 of 5 links point to sections that don't exist) — fix before or independently of the CMS work?
7. **Five orphaned pages** (Ministries, News, Gallery, Archive: Bishops, Archive: History) — bring into the CMS scope now, or leave parked until each is activated in the nav?
