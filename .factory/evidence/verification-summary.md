# Verification summary — 6 September 2026

- Live URL: `https://patient-rail.sociobot.in`
- Deployed implementation: `8231d0bff1695ee72d8d8a805c90f36d304d39d7`
- Clean checkout: `npm ci`, all 12 claim commands, `npm test`, and `npm run build` passed.
- Test counts: 7 engine tests and 26 browser tests passed locally and against live HTTPS.
- Touch targets: 181 visible targets across nine live routes; none below 44 by 44 CSS pixels.
- Live URL verifier: no console errors; title, language, main, h1, image labels, and button labels passed.
- Live routes: all named routes and public metadata returned 200; `/404` returned the expected designed 404.
- Live sample: Fire on each shown intent won in 15 turns. Hold position lost in 11 turns. Restart restored turn one.
- Mobile: the 390 by 844 first screen had no body overflow and showed the 44 px intent cell before scroll.
- Accessibility: axe found no serious or critical issue on every named route.
- Offline: a fresh isolated browser reloaded and completed another action with networking disabled.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100, LCP 1.20 s, CLS 0.069, TBT 0 ms, and touch targets passed.
- Production assets: JavaScript 10.78 KB gzip; CSS 5.50 KB gzip. Live hashes matched `dist/`.
- Frame sample: 60.0 fps at 390 by 844; no rule depends on motion.
- Security: same-origin CSP, no third-party play requests, and zero dependency vulnerabilities.
- Billing: offer registration and entitlement validation remain pending and are not claimed to work.
