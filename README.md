# GEFELL MMC — Trilingual Corporate Website

A production website for a real Baku-based B2B supplier, built solo
from a static-HTML rebuild brief into a fully trilingual, SEO-complete,
no-framework site — live, in use, and taking real customer inquiries.

**Live:** [gefell.az](https://gefell.az)

I'm a computer engineering student, and this was my first project of
this scale outside coursework: a real client, a real deadline, and no
framework to lean on. I've documented what I actually learned building
it below, not just what the site looks like.

---

## Skills demonstrated

### Internationalization (i18n) architecture
Built a 3-language site (Azerbaijani/Russian/English) from scratch —
no i18n library. Each language lives at its own URL path (`/`, `/ru/`,
`/en/`) with correct `hreflang` tags linking every page to its
translated siblings. On top of that, I built a **persistent language
preference system**: a small script remembers the last language a
visitor explicitly picked (`localStorage`) and auto-redirects future
visits to that language — but only when that specific page's
translation actually exists, derived by reading the page's own
`hreflang` tags at runtime, so it can never redirect someone into a
404. That constraint (don't break navigation for pages that aren't
translated yet) was harder to get right than the happy path.

### Structured data / SEO (schema.org, JSON-LD)
Implemented four different schema types — `FAQPage`, `Product`,
`NewsArticle`, and `LocalBusiness` — across the relevant pages. Rather
than hand-writing the JSON, I wrote a small Python extraction script
that pulls the FAQ questions, product specs, and article data directly
out of the live HTML, so the structured data can never drift out of
sync with the visible page content. Deliberately **left pricing data
out of the Product schema** — since the business sells B2B by quote,
not fixed price, including fake `offers` data would violate Google's
structured data policies and risk a manual penalty. Knowing what
*not* to add mattered as much as knowing the spec.

### Vanilla JavaScript, no framework
Every interactive piece — mobile nav, language switcher, image
lightbox, FAQ accordions, AJAX form submission — is hand-written DOM
manipulation, no React/Vue/jQuery. One shared `script-v4.js` file
powers all 18 pages. Building the contact form taught me the gap
between "submits a form" and "submits a form well": the original raw
HTML `<form>` POST would have redirected users to a generic third-party
"thanks" page after every submission. I rewrote it as an async
`fetch()` submission with inline success/error states and
multi-language messaging, so it stays on-brand and gives immediate
feedback.

### CSS architecture at scale
A single design-token-based stylesheet (CSS custom properties for
color, type, spacing) drives every page in every language with zero
duplication. Had to design components that stay coherent whether
they're rendering 2 products or 6 (the catalogue's alternating
image/text rows, for instance) — layout that degrades gracefully
rather than breaking at edge counts.

### Debugging methodology — this is the part I'm most proud of
I didn't just write code and assume it worked. Every non-trivial
change in this project was verified with a **headless browser test
script** (Playwright) before being handed off — actually rendering
the page, clicking the elements a real user would click, and reading
back computed values, not just checking the source looked right.
That process caught real bugs before they shipped, for example:

- A mobile language-switcher fix that looked correct in the diff but,
  when actually tested in a rendered mobile viewport, turned out to
  produce a broken `href="None"` link — caught, reverted cleanly
  across all 18 files, root-caused (a regex was checking the wrong
  substring for an HTML attribute), fixed, and re-verified before
  delivery.
- A hero image that was technically loading fine but visually cropping
  out half its subject — diagnosed by rendering the actual page at
  four different viewport sizes and comparing box dimensions against
  the image's aspect ratio, not just eyeballing it.
- An SEO sitemap that looked complete at a glance but was silently
  missing 10 of 18 page URLs — found by writing a script to diff the
  sitemap against the site's actual page list instead of trusting it
  by inspection.

### Deployment & real-world debugging
Diagnosed and fixed a live Vercel 404 caused by a partial deployment —
the language-persistence script was correctly trying to redirect to a
translated page whose files simply hadn't been uploaded yet. Tracing
that from "confusing 404 screenshot" to root cause (stale
`localStorage` value pointing at an undeployed route) was a real
lesson in separating *symptom* from *cause* in a live system.

### Accessibility & semantic HTML
ARIA roles and states throughout (`aria-current`, `aria-expanded`,
`role="menu"`), keyboard-operable interactive components, and
`<details>`/`<summary>` used natively for expandable content instead
of reinventing accordion behavior in JavaScript.

---

## The project itself

- **6 pages × 3 languages = 18 fully localized routes**
- **14 real products** across 4 international brands (GEALAN, KNG,
  SIEGENIA, AXOR), each with real technical specs sourced from actual
  manufacturer documentation and certificates
- **13 real FAQ items**, **3 news articles**, a working contact
  pipeline (Formspree backend)

## Tech stack

No framework, no build step, no bundler — deliberately.

- **HTML / CSS / vanilla JS**
- **Hosting:** [Vercel](https://vercel.com), static deployment
- **Forms:** [Formspree](https://formspree.io), via `fetch()`
- **Fonts:** Archivo (display), Inter (body), JetBrains Mono (labels)

## Project structure

```
/                       AZ (default language)
├── index.html
├── about/about.html
├── categories/categories.html
├── news/news.html
├── contact/contact.html
├── downloads/downloads.html
├── ru/                 Russian — mirrors the structure above
├── en/                 English — mirrors the structure above
├── assets/             shared images, brand logos, certificates
├── styles-v4.css        shared stylesheet for every page/language
├── script-v4.js         shared JS: nav, language memory, lightbox, forms
├── sitemap.xml
└── robots.txt
```

## Design system

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14181F` | primary text |
| `--paper` | `#FBFAF7` | background |
| `--panel` | `#F2F0EA` | section backgrounds |
| `--accent` | `#1F5AAE` | "blueprint blue" — links, CTAs |
| `--brass` | `#9A7B4F` | secondary accent |

## Running locally

Static site, no dependencies — but absolute paths mean you need a real
server, not just opening the HTML file directly:

```bash
python3 -m http.server 3000
# or
npx serve
```

Then visit `http://localhost:3000/`.

## Author

Built and maintained by Mulkum Badalov, Computer Engineering student —
a solo, ground-up rebuild of a real company's website into a modern,
trilingual, SEO-complete corporate presence.