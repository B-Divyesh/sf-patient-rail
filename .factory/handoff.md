# Patient Rail handoff

## Repair 3 result

All three findings from `.factory/verification-3.md` are repaired. The shipped implementation is `09ec2c2f36dfd0951508dcc0957568973044726b`. It is pushed to `main` and deployed at <https://patient-rail.sociobot.in>.

The product remains a deterministic 7 by 7, turn-based train-defense game. A run has one action per turn, one visible enemy intent, three five-turn stops, a daily seed, and a separate fixed sample.

## Finding disposition

### V3-1 — nested complementary landmark — closed

The current-turn and result panels are now sections of the game instead of complementary `aside` landmarks nested inside `main`. The axe regression now fails on any reported violation, including moderate findings. Fresh local and live checks report zero axe violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`.

### V3-2 — unverified 20-minute claim — closed

Variable human play time is no longer presented as a measured promise on the site, in the README, or in the catalog description. Public copy now states the deterministic shape: 15 turns across three stops. The sample-win and complete-configuration tests assert that exact count. The README also says there is no timer and duration depends on the player.

### V3-3 — incomplete keyboard and spoken-label coverage — closed

The single `@claim:keyboard-play` regression now checks:

- Tab reaches the board.
- ArrowRight, ArrowDown, ArrowLeft, and ArrowUp move focus to the expected cells.
- Enter and Space fire from the focused intent cell.
- B braces and W holds position.
- Focus stays on a board cell after keyboard turns.
- All 49 cells have unique accessible names with coordinates, piece state, and available-action information.

The expanded test exposed and fixed a focus-recovery edge case: B or W used from the initial intent cell previously resolved a turn but lost board focus unless an arrow key had first set the selected cell.

## Earlier finding disposition

- Verification 1 CSP finding remains closed by the same-origin `/404.css` test.
- Verification 1 phone-first-view finding remains closed by the 390 by 844 viewport outcome test.
- Verification 1 seed-proof finding remains closed by exhaustive checks of all 108 tactical configurations.
- Verification 2 touch-target finding remains closed by rendered-size checks across nine routes and the settings dialog.

## Clean verification

A fresh clone of implementation `09ec2c2f36dfd0951508dcc0957568973044726b` used Node.js 22.23.2 and npm 10.9.8.

```sh
npm ci
npm test
npm run build
```

- `npm ci`: passed with zero dependency vulnerabilities.
- `npm test`: 7 deterministic engine tests and 26 Chromium tests passed.
- Every command in `.factory/claims.json`: all 12 passed separately from the clean clone.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.45 KB raw and 10.76 KB gzip.
- Production CSS: 21.14 KB raw and 5.50 KB gzip.
- Each of the 12 claim IDs has exactly one matching test tag.

## Live verification

- Deployment completed successfully for the existing `sf-patient-rail` static app.
- The same 7 engine tests and 26 browser tests passed against live HTTPS.
- The factory URL verifier found the correct title and language, one h1, one main, no missing labels, and no console errors.
- Lighthouse mobile scored 98 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 seconds, TBT 130 ms, and CLS 0.049.
- Fresh 390 by 844 and 1440 by 950 contexts started at scroll position zero. The job, audience, sample action, first-action instruction, and active intent cell were all fully inside the first viewport.
- One click opened the populated fixed sample. The demo label remained after play. Reset restored turn 1 and `SAMPLE-EMBER-7` while a daily-storage sentinel stayed byte-for-byte unchanged.
- The sample reached **Route complete** in 15 Fire actions and **Train stopped** in 11 Hold position actions. Restart behavior passed in the browser suite.
- The live frame sample recorded 182 frames over 3.00 seconds: 60.3 fps average and a 16.8 ms maximum frame interval. Game rules do not depend on animation.
- All named product routes and public metadata returned 200. `/404` deliberately returned 404 with its designed recovery page.
- Live JavaScript SHA-256: `090263dc0a898138cbab8f4fd6fc5ed9db7a164d2f90b47a2ea7fcfe2e97ac3c`.
- Live CSS SHA-256: `09e267c81239c9974c7e0bc32589242434f7b3994840282ab9634f31fea64cf3`.
- Both live asset hashes exactly matched the clean local build.

Evidence is under `.factory/evidence/`, including the refreshed phone, desktop, win, and loss images. Repair-specific URL-verifier and Lighthouse output is under `.factory/evidence/repair-3/`.

## Privacy and operations

There is no backend, account, telemetry, third-party script, runtime model call, or shared database. Daily and sample state stay in separate browser local-storage namespaces. The demo and privacy claim tests confirm their isolation and same-origin request behavior.

This repair deployed only the existing `sf-patient-rail` static app. It did not access or change another product, shared database, staging slot, or secret.

## Known dependency

The US$8 one-time offline/archive offer remains unavailable because offer registration and entitlement validation have not occurred. The archive, activation, and terms pages disclose this state; purchase is disabled and makes no billing request. The free daily game and sample are complete.

The billing operator metadata is copied to `/work/.evidence/billing-offer.json`. A checkout redirect must not unlock the archive without verified entitlement.

## Next steps

1. Have the billing operator register the existing one-time offer.
2. Add and test entitlement validation before enabling archive purchase or activation.
3. Measure player completion and return goals only under an approved privacy-respecting plan.
