# GEFELL MMC — Trilingual Corporate Website

A production website for **GEFELL MMC**, a Baku-based supplier of window and door
profile and hardware systems, representing four international brands
(GEALAN, KNG, SIEGENIA, AXOR). Built from scratch as a static, no-framework
site with a custom design system, full trilingual content, and a real,
working contact pipeline.

**Live:** [gefell.az](https://gefell.az)

---

## What this project actually is

Not a template. Every page, every product description, every FAQ answer,
and every piece of copy was written specifically for this business — in
three languages — then wired into a hand-built design system called
**Architectural v4**: a light, high-contrast, technical-drawing-inspired
aesthetic (hairline rules, monospace labels, a blueprint-blue accent) that
fits a company selling precision hardware.

- **6 pages** × **3 languages** = **18 fully localized routes**
- **14 real products** across 4 brands, each with technical specs pulled
  from actual manufacturer documentation
- **13 real FAQ items**, **3 news articles**, a working contact form wired
  to a live backend

## Tech stack

Deliberately simple — no framework, no build step, no bundler.

- **HTML / CSS / vanilla JS** — one shared stylesheet (`styles-v4.css`)
  and one shared script (`script-v4.js`) power every page in every
  language
- **Hosting:** [Vercel](https://vercel.com), static deployment
- **Forms:** [Formspree](https://formspree.io), submitted via `fetch()`
  with inline success/error states instead of a page redirect
- **Fonts:** Archivo (display), Inter (body), JetBrains Mono (labels/specs)

## Notable engineering details

**Trilingual architecture with persistent language memory.** Each
language lives at its own path (`/`, `/ru/`, `/en/`) with matching
`hreflang` tags on every page. A small script remembers the last language
a visitor explicitly chose and auto-redirects future visits to that
language's version of _the same page_ — but only when that page's
translation actually exists, so it never sends anyone to a 404.

**Self-documenting placeholders.** Product photos, videos, and documents
that aren't uploaded yet render as a clean dashed placeholder showing the
_exact_ filename the system expects — so dropping in the real file at
that path is the only step needed, no code changes required.

**Structured data (SEO).** JSON-LD schema across the site, generated
programmatically from the live page content (not hand-typed, to guarantee
it never drifts out of sync with what's actually on the page):

| Page       | Schema type                                             |
| ---------- | ------------------------------------------------------- |
| Home       | `HomeAndConstructionBusiness`                           |
| About      | `FAQPage` (13 questions)                                |
| Categories | `Product` (14 products)                                 |
| News       | `NewsArticle` (3 articles)                              |
| Contact    | `HomeAndConstructionBusiness` with real geo-coordinates |

**Certificate viewer.** Brand certification documents are click-to-zoom
via a lightweight lightbox, reused across every brand section with zero
duplicated JavaScript.

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

| Token      | Value     | Use                              |
| ---------- | --------- | -------------------------------- |
| `--ink`    | `#14181F` | primary text                     |
| `--paper`  | `#FBFAF7` | background                       |
| `--panel`  | `#F2F0EA` | section backgrounds              |
| `--accent` | `#1F5AAE` | "blueprint blue" — links, CTAs   |
| `--brass`  | `#9A7B4F` | secondary accent, used sparingly |

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

Built and maintained by [Your Name] — a full rebuild of the company's
existing site into a modern, trilingual, SEO-complete corporate presence.
