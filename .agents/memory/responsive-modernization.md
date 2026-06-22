---
name: Responsive desktop modernization
description: Convention for adding modern desktop layouts to this mobile-first EnuygunPet site without regressing mobile.
---

# Desktop modernization convention

This site is mobile-first (the business depends on mobile traffic). Pages historically capped everything at `max-w-lg mx-auto`. Desktop modernization is layered on top using `lg:`-gated classes ONLY.

**Rules (enforced by code review):**
- Every desktop change must be `lg:`-prefixed or a true no-op on mobile. Do NOT change non-`lg` base classes that affect mobile rendering (image proxy widths, base bg, base ordering, hover effects that add transitions on touch).
- Containers widen via `max-w-lg lg:max-w-6xl mx-auto` + `lg:px-8`.
- Sticky mobile bottom action bar gets `lg:hidden`; page wrapper `pb-20 lg:pb-0`.
- New hover/lift effects must be `lg:hover:` / `lg:transition` so they don't add behavior on mobile.

**Why:** A prior review failed work because plain `hover:`/`transition`/wider-image-width and reordered content silently changed mobile.

**Two-column article sections that keep mobile order (h2 → images → text):**
Use CSS grid placement, NOT `lg:order` on a 2-child flex (that buries images below text on mobile). Pattern: a 3-child grid (`<h2>`, image grid, text block) that is single-column on mobile (DOM order = visual order) and on desktop uses explicit `lg:row-start-*` / `lg:col-start-*` so the image column spans both rows (`lg:row-span-2 lg:self-center`) on the chosen side. See `ArticleSection` in `client/src/pages/proplan.tsx`.

**Shared header:** `client/src/components/site-header.tsx` is used by proplan, royal-canin, and keyword pages. Desktop nav + shop CTA are `hidden lg:flex` / `hidden lg:inline-flex`; mobile CTA pill is `lg:hidden`. Logo uses `<Link href className>` directly (no nested `<a>`) to avoid validateDOMNesting warnings — follow that pattern for nav Links.

**Pre-existing (out of scope):** home.tsx brand/popular/blog links still trigger a wouter `<Link><a>` nesting console warning; leave untouched unless asked.
