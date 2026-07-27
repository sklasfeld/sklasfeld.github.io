# FONTS.md

## Current state: one font, Lexend

All three font roles (`display`, `body`, `label` — see `src/data/fonts.cjs`) currently point at **Lexend**. The site reads as a single consistent typeface everywhere: headers, body copy, dates, tags, nav links.

**To change the font:** edit `src/data/fonts.cjs`. Full instructions and the reasoning behind the three-role split are in `AGENTS.md` → Theming → Fonts — read that before touching fonts, not this file.

---

## Why the three roles still exist even though they match

The CSS classes `font-display` / `font-sans` / `font-mono` are still applied throughout the codebase exactly where they were when the site used three different faces (Big Shoulders Display for headers, Public Sans for body, JetBrains Mono for labels). Nothing about *where* those classes are used changed when the fonts were unified to Lexend — only the family name each role resolves to changed, in one file.

This means the three-font look is one edit away, not a rebuild: give `display` a different family in `fonts.cjs` and every header/title on the site changes while body and label text stay Lexend. The rule of thumb for what's tagged which role:

- **`font-display`**: h1–h6, card titles (project/post/series cards), collapsible section headers.
- **`font-sans`** (default, usually no explicit class): paragraphs, form labels, button text, footer links.
- **`font-mono`**: dates, timeperiods, tags, nav links, publication years — data/label-shaped text.

One exception either way this goes: markdown `blockquote`s are hardcoded to the `body` role, not `display`, regardless of what `display` is set to — see `AGENTS.md` for why.

If you want the granular "which exact file/line uses which class" breakdown, it's a `grep -rn "font-display\|font-sans\|font-mono" src` away — it wasn't worth duplicating that listing here now that it's not visually distinguishable in the browser.
