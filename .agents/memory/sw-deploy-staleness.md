---
name: Service worker staleness after deploy
description: Why deployed pages can go blank after a deploy on this PWA, and the navigation caching rule that prevents it.
---

# Service worker must be network-first for navigations

This site ships a PWA service worker (`client/public/sw.js`, registered in `home.tsx`). Navigation/document requests MUST use network-first, NOT stale-while-revalidate.

**Why:** With stale-while-revalidate on HTML, after a deploy the SW serves the *previously cached* `index.html`, which references the OLD hashed JS/CSS bundle filenames. Those files no longer exist in the new build, so the app loads a blank/broken page — users report "pages don't open" right after a deploy. Hashed asset requests are fine cached; the HTML shell is the poison.

**How to apply:** In the SW fetch handler, branch `request.mode === 'navigate' || request.destination === 'document'` to a network-first handler (fetch fresh, fall back to cache, then `cache.match('/')`). Bump `CACHE_NAME` whenever the shell-caching strategy changes so the activate handler purges the stale shell. Keep image/static assets on their existing cache-first / stale-while-revalidate paths.

# sendBeacon bodies aren't JSON-parsed by express.json()

`navigator.sendBeacon(url, JSON.stringify(...))` sends `Content-Type: text/plain`, so `express.json()` skips it and `req.body` is undefined → destructuring crashes → HTTP 500 (seen on `/api/analytics/duration`).

**How to apply:** Send beacons as a Blob with `type: "application/json"` so `express.json()` parses them, AND keep server beacon routes defensive (tolerate string/undefined `req.body`) so older cached clients don't 500.
