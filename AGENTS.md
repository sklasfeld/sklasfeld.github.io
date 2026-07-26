# AGENTS.md

Documentation for AI agents and contributors working in this repository.

> **Agents: keep this file current.** Whenever a file is added, updated, or deleted — including blog posts, components, styles, config files, or public assets — update the relevant section of this document before ending the task.

---

---

## Stack

- **Astro 5** — static site generator
- **Tailwind CSS 3** with `@tailwindcss/typography`
- **Astro Expressive Code** — code block rendering
- **MDX** — extended markdown support
- **TypeScript** — strict mode
- **Netlify** — deployment (Node 22, `npm run build`, publish dir `dist`)

---

## Directory Structure

```
src/
  components/       # Reusable Astro components
  content/
    blog/           # Blog posts (.md or .mdx)
      biobank-intro-series/   # Example multi-part series
    pages/          # Static pages (terms)
    projects/       # Project showcases
  data/
    site-config.ts  # Site metadata, nav links, hero content
  layouts/
    BaseLayout.astro
  pages/            # Astro file-based routing
  styles/
    global.css      # CSS variables, base layer overrides
  utils/
    data-utils.ts   # Series/tag filtering utilities
public/
  blog_images/      # All blog post images, subdirectory per series
```

---

## Blog Post Frontmatter

Every blog post requires at minimum `title` and `publishDate`. All other fields are optional.

```yaml
---
title: 'Post Title'
excerpt: 'Short description used in previews'
publishDate: 'Mar 13 2026'
updatedDate: 'Apr 1 2026'       # optional
isFeatured: false                # optional, default false
draft: false                     # optional, default false
tags:
  - biobank
  - all-of-us
series:                          # optional, for multi-part series
  name: 'Biobank Intro Series'
  order: 8
  image:                         # optional series cover image
    src: '/blog_images/...'
    alt: '...'
    caption: '...'
seo:                             # optional
  image:
    src: '/blog_images/...'
    alt: '...'
---
```

---

## Series

Multi-part series are subdirectories under `src/content/blog/`. Posts are connected by matching `series.name` in frontmatter and ordered by `series.order`.

- Series pages are auto-generated at `/blog/[series-slug]/`
- Previous/next navigation within a post respects `series.order`
- File naming convention: `01-slug.md`, `02-slug.md`, etc.

---

## Blog Post Formatting

### Figures

```html
<figure class="my-8 !max-w-none">
  <img src="/blog_images/..." alt="..." class="!max-w-none mx-auto w-full" />
  <figcaption class="text-center text-sm opacity-80 mt-2">
    <em>Caption text.</em>
  </figcaption>
</figure>
```

For light/dark mode image variants:

```html
<img src="/blog_images/light.png" class="block dark:hidden" alt="..." />
<img src="/blog_images/dark.png" class="hidden dark:block" alt="..." />
```

### Code Blocks

Fenced code blocks are rendered by Astro Expressive Code. Always specify the language.

```python
# python example
```

```bash
# bash example
```

Font size is set to `1.05rem` in `astro.config.mjs` via `styleOverrides.codeFontSize`.

### Collapsible Code Blocks

Wrap code blocks in `<details open>` to make them collapsible. The `open` attribute means visible by default.

```html
<details open>
<summary>Code</summary>

```bash
your code here
```

</details>
```

Rules:
- Always include a blank line between `<summary>` and the opening code fence
- Always include a blank line before `</details>`
- Use `<summary>Code</summary>` as the label (neutral, works open or closed)

### Tables

Standard markdown table syntax. Column order convention for data path tables: Format | Notes | Path.

```markdown
| Format | Notes | Path |
|--------|-------|------|
| Phased VCFs | By chromosome | `gs://...` |
```

### Task List Checkboxes

Use standard markdown task list syntax. Bullets are hidden via CSS.

```markdown
- [ ] Item one
- [ ] Item two
```

The CSS in `global.css` handles hiding the bullet and sizing the checkbox. Do not use raw HTML `<input type="checkbox">` for this — use `- [ ]`.

### No Em Dashes

Do not use em dashes (`—`). Rewrite as separate sentences or use a comma instead.

---

## Theming

"Instrument Panel" direction — violet + teal on cool graphite, sharp corners, left-rail cards. Colors are CSS custom properties defined in `src/styles/global.css` and consumed by Tailwind via `tailwind.config.cjs`.

| Variable | Light | Dark |
|----------|-------|------|
| `--color-text-main` | `#201F24` | `#F1F0F4` |
| `--color-bg-main` | `#F2F2F5` | `#16161A` |
| `--color-bg-muted` | `#DBDAE3` | `#2A2932` |
| `--color-accent` (violet) | `#5B3E96` | `#B48CFF` |
| `--color-accent-secondary` (teal) | `#1B9AAA` | `#2DD4E8` |

Dark mode is class-based (`html.dark`). Toggle is handled client-side in `BaseLayout.astro`.

Dark-mode accent values are brightened relative to light mode (not a naive same-hex reuse) — they need more voltage to read clearly against the near-black background. Violet is the primary/interactive accent (buttons, links, card left-rail). Teal is the secondary accent, used sparingly (e.g. `SeriesPreview.astro`'s rail, tags) — don't let it compete with violet for primary emphasis.

### Fonts

**One font site-wide (Lexend), but three independent levers to change it by.** `src/data/fonts.cjs` is the single source of truth — it exports three named stacks (`display`, `body`, `label`), each already appending the matching Tailwind default fallback:

| `fonts.cjs` export | Tailwind key / class | Currently | Role |
|---|---|---|---|
| `display` | `font-display` | Lexend | Headers and titles only (h1–h6, card titles) |
| `body` | `font-sans` | Lexend | Body text and the sitewide default — Tailwind preflight applies `fontFamily.sans` to `html`, so this key must stay named `sans` even though the export is called `body` |
| `label` | `font-mono` | Lexend | Dates, timeperiods, tags, nav links — short data-flavored text |

All three currently point at the same family on purpose — the site reads as one consistent typeface. They are still three separate settings, not one: give `display` a different family than `body`/`label` and only headers change, everything else stays Lexend. This is how the site looked before this file existed (Big Shoulders Display for headers, Public Sans for body, JetBrains Mono for labels) — that three-font setup is a valid configuration of this same system, not a different system.

`tailwind.config.cjs` just does `const fonts = require('./src/data/fonts.cjs')` and assigns `fonts.display`/`fonts.body`/`fonts.label` to the `fontFamily` keys — it has no font names of its own.

One self-hosted `@fontsource-variable` package currently backs all three roles, imported once in `global.css` (no CDN). `BaseHead.astro` additionally preloads its woff2 file directly. If a role's font is ever changed to a different family, update **all three** in lockstep for that family: `fonts.cjs`, the `global.css` `@import`, and the `BaseHead.astro` preload import + `<link>` — otherwise the dev server throws a "Cannot find module" error at the old path. If a family stops being used by any role, `npm uninstall` its `@fontsource-variable` package too — don't leave it installed-but-unreferenced.

Do not reintroduce a `font-serif` class — the display role is `font-display` (renamed from a prior `font-serif` holdover that didn't describe an actual serif font). `blockquote` inside markdown content deliberately uses `theme('fontFamily.sans')` (body role), not `display` — if `display` is ever set back to a bold condensed poster face, italicizing it at 1.3–1.67em for a multi-sentence quote reads as decorative rather than legible. Keep `font-display` scoped to genuine headers/titles, not longer-form text, regardless of which family it points to.

### Shape system

Cards (`ProjectPreview.astro`, `PostPreview.astro`, `SeriesPreview.astro`) and buttons (`Button.astro`) use sharp corners (no `rounded-*`) with a colored left border (`border-l-4 border-l-accent` or `border-l-accent-secondary`) instead of the old rounded-corner + drop-shadow card style. When adding new card-like components, follow this pattern rather than reintroducing `rounded-lg`/`shadow-sm`.

---

## Global CSS Rules of Note

Defined in `src/styles/global.css` inside `@layer base`:

- `summary` — sets text color to `--color-text-main` so it's visible in dark mode
- `li:has(> input[type="checkbox"])` — hides bullet, adds hanging indent for task list items
- `li:has(> input[type="checkbox"]) input[type="checkbox"]` — scales checkbox to 1.3x

---

## Images

- Store blog images in `public/blog_images/[series-name]/`
- Reference in markdown as `/blog_images/[series-name]/filename.png`
- Always include descriptive `alt` text

---

## Page Structure

| Route | Source | Notes |
|-------|--------|-------|
| `/` | `src/pages/index.astro` | Fully hand-coded (see quirk below) — hero, technical expertise, featured work experiences, education, and an "About Me" section with a featured-publication card |
| `/projects` | `src/pages/projects/[...page].astro` | Paginated list of all `projects` collection entries |
| `/projects/[id]` | `src/pages/projects/[id].astro` | One page per project entry, renders `headerImage`, `publications`, `presentations`, `references` |
| `/blog` | `src/pages/blog/[...page].astro` | Paginated blog index |
| `/blog/[id]` | `src/pages/blog/[...id].astro` | Individual post, handles series prev/next nav |
| `/blog/[series]` | `src/pages/blog/[series].astro` | Series landing page, auto-generated from `series.name` |
| `/contact` | `src/pages/contact.astro` | Netlify Forms (`data-netlify="true"`), no client validation |
| `/terms`, any `pages` collection entry | `src/pages/[...id].astro` | Generic renderer for the `pages` content collection |
| `/404` | `src/pages/404.astro` | |

Every page routes through `src/layouts/BaseLayout.astro`, which renders `Nav.astro` + `<slot />` + `Footer.astro` and injects `BaseHead.astro` (meta/SEO) and the theme-init script.

Key components: `Hero.astro` (profile image + markdown text + action buttons — see quirk below), `ProjectPreview.astro` / `PostPreview.astro` / `SeriesPreview.astro` (card-style list previews), `PublicationCard.astro` / `PresentationCard.astro` / `ReferenceButtons.astro` (used on project detail pages), `ThemeToggle.astro` (client-side dark mode switch).

---

## Known Quirks

- **`src/pages/index.astro` does not use `Hero.astro` or `siteConfig.hero`.** The homepage header, "Technical Expertise," "Work Experiences," "Education," and "About Me" sections are all hand-written directly in `index.astro` with hardcoded copy (e.g. current employer name). `site-config.ts`'s `hero` field and `Hero.astro` component are unused dead code on the homepage — editing `site-config.ts` will *not* change what visitors see on `/`. When updating "current role" info, `index.astro`'s "About Me" section is the actual source of truth on the home page.
- **`BaseLayout.astro`'s `showHeader` prop is unused.** `[...id].astro` passes `showHeader={false}` expecting the nav to hide, but `BaseLayout.astro` destructures `showHeader` and never applies it — `Nav` always renders regardless. Flagged by ESLint (`@typescript-eslint/no-unused-vars`), not yet fixed.
- **Image file extensions can lie about actual format.** `public/sklasfeld_cartoon.png` was previously named `.jpg` while actually being PNG data with an alpha channel; the static server sets `Content-Type` from the extension, so the mismatch caused the transparent background to not render correctly. Before trusting an image's transparency/format, check the real encoding (e.g. `file <path>` or `sharp(...).metadata()`), don't assume from the extension.
- **`about.md` was intentionally removed** (previously at `/about`, unlinked from nav) — the site owner considers the whole site "about me" and didn't want a separate about page. Don't re-add one without checking first.

---

## Linting

ESLint is configured via flat config at `eslint.config.js`: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-astro` recommended, with `eslint-config-prettier` last to avoid rule conflicts with the existing Prettier setup. `*.cjs` files (e.g. `tailwind.config.cjs`) get a `globals.node` override plus `@typescript-eslint/no-require-imports: off`, since they're legitimately CommonJS.

```bash
npm run lint       # check
npm run lint:fix   # autofix
```

As of this writing, `npm run lint` reports 8 pre-existing issues that were surfaced but intentionally left unfixed (out of scope at the time): unused vars in `Footer.astro` (`any` type), `BaseLayout.astro` (`showHeader`, see quirk above), `[...id].astro` (`seo`), `index.astro` (`featuredPosts`), `data-utils.ts` (`lastPost`); `prefer-const` in `blog/[...id].astro`; `no-var` in `common-utils.ts`. Fix opportunistically or on request.

One real bug ESLint caught and fixed: `astro.config.mjs` had `expressiveCode` imported twice (duplicate binding) — the second import was removed.

---

## Dependency Vulnerabilities

`npm audit fix` (non-breaking) was run, reducing reported vulnerabilities from 32 to 11. The remaining 11 all require breaking major-version bumps (`astro` 5→7, `eslint` 9→10 via `npm audit fix --force`) and were deliberately not applied without testing. Nearly all of the remaining advisories are in Astro's *build-time* transitive deps (Vite, Rollup, esbuild, PostCSS, sharp, dompurify, devalue) — this site builds to fully static HTML with no SSR runtime, so these don't expose visitors to anything at request time; the main residual risk is to the build/dev environment itself. Before running `--force`, rebuild and manually check every route (content collections, image handling, and Tailwind integration APIs have changed across Astro major versions).

---

## Deployment

Netlify auto-deploys from `main`. Changes must be committed and pushed to appear on the live site. The branch must exist on the remote before Netlify can deploy it.
