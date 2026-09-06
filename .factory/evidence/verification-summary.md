# Verification summary — 6 September 2026

- Live URL: `https://patient-rail.sociobot.in`
- Deployed implementation: `78effd5584066428b9a838540e06546e8eb89c56`
- Local clean checkout: `npm ci`, all 12 claim commands, `npm test`, and `npm run build` passed.
- Live browser suite: 24 of 24 passed against HTTPS.
- Live URL verifier: no console errors; title, language, main, h1, image labels, and button labels passed.
- Live routes: seven named routes returned 200; `/404` and `/missing.js` returned the expected designed 404.
- Live sample: Fire on the shown intent won in 15 turns. Hold position lost in 11 turns. Restart reset all opening state.
- Mobile: 390 by 844 layout had no body overflow and 44 px minimum board targets.
- Accessibility: axe reported no serious or critical findings on every named route.
- Offline: a fresh isolated browser reloaded and completed another action with networking disabled.
- Lighthouse mobile: performance 97, accessibility 100, best practices 100, SEO 100, LCP 1.2 s, CLS 0.097, TBT 0 ms.
- Initial transfer: 84,389 bytes total, including 11,133 bytes JavaScript and 61,060 bytes in two requested local fonts.
- Frame sample: 60.0 frames per second under 4× CPU throttling; no gameplay rule depends on motion.
- Security: same-origin CSP, no third-party requests during play, zero dependency vulnerabilities.
- Billing: public offer metadata exists; offer registration and entitlement validation remain pending and are not claimed to work.
