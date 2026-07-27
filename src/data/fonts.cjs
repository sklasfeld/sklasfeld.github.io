// Single source of truth for the site's three font roles.
// Change a font by editing the family name below — every page and component
// picks it up automatically via the `font-display` / `font-sans` / `font-mono`
// Tailwind classes (wired up in tailwind.config.cjs), no per-file edits needed.
//
// All three roles currently point at the same family (Lexend) — one font,
// used consistently everywhere. The three roles still exist as separate
// levers: give `display`, `body`, or `label` a different family below and
// only that role changes (e.g. a different face for headers, same body text).
//
// To swap a font:
//   1. `npm install @fontsource-variable/<new-font>`
//   2. Update the family name + import line below
//   3. Update the matching `@import` in src/styles/global.css
//   4. Update the matching preload import + <link> in src/components/BaseHead.astro
//   5. `npm uninstall` any @fontsource-variable package no longer referenced anywhere

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // Headers and titles only (h1-h6, card titles, nav-adjacent labels).
  display: ['Lexend Variable', ...defaultTheme.fontFamily.sans],

  // Body copy and everything else by default (Tailwind applies this to <html>).
  body: ['Lexend Variable', ...defaultTheme.fontFamily.sans],

  // Dates, tags, timeperiods, nav links — short "data-flavored" label text.
  label: ['Lexend Variable', ...defaultTheme.fontFamily.sans],
};
