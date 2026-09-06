# Patient Rail handoff

## Strict review 4 — PASS

Strict review on 6 September 2026 reviewed implementation candidate `d8ddaf502e55581ed69ed05767632270a1cf1499` and documentation baseline `51c96b92886b5ff23778e1df915968cf0cf342a2`. The last shipped product-source change remains `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8`. Production JavaScript and CSS hashes exactly matched the clean build.

A fresh clone passed `npm ci`, `npm test` (7 engine and 27 Chromium tests), each of the 12 claim commands run separately, `npm run build`, and the complete suite against live HTTPS. Fresh desktop and phone contexts showed the job, audience, first action, sample entry, and active board before scrolling.

The isolated sample preserved a daily sentinel through play, reset, and exit. It won after 15 Fire actions, lost after 11 Hold position actions, and restarted both results at turn 1 with full cars. Invalid actions, damaged-state recovery, reload recovery, offline play, settings persistence, browser history, legal and not-found routes, reduced motion, keyboard labels, focus management, touch sizes, privacy requests, and the pending purchase boundary passed.

All earlier findings remain closed, including the repaired two-setting claim coverage. Fresh live axe checks found zero violations on every application route. Lighthouse mobile scored 99 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP was 1.277 seconds, TBT 105 ms, CLS 0.049, and transfer size 80.2 KB. A phone frame sample averaged 60.0 fps; no frame-rate claim is public.

The complete report is `.factory/review-4.md`; fresh evidence is under `.factory/evidence/review-4/`. There are zero findings and zero untested claims. Verdict: **PASS**.

The disclosed dependency is unchanged: the US$8 archive purchase remains disabled until billing registration and entitlement validation are available. The free daily game and sample are complete.

## Independent verification 6 — PASS

Independent QA on 6 September 2026 reviewed candidate `d8ddaf502e55581ed69ed05767632270a1cf1499` and documentation baseline `e91e5de8806c220f9b356a6b5e4237ec94df9ebd`. The candidate changes claim coverage for both board settings; the last shipped product-source change remains `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8`. Live JavaScript and CSS hashes exactly matched the clean build.

A fresh clone passed `npm ci`, `npm test` (7 engine and 27 Chromium tests), every one of the 12 claim commands run separately, and `npm run build`. The full 7-engine/27-browser suite also passed against production HTTPS. The repaired `settings-persist` claim visibly checks both settings before and after reload and confirms both reopened controls.

Fresh desktop and phone contexts showed the job, audience, sample action, first action, and active board before scrolling. One click opened the isolated populated sample. Reset and exit preserved a daily sentinel. The sample won after 15 Fire actions, lost after 11 Hold position actions, and restarted at turn 1 with full cars.

All earlier 404 CSP, phone viewport, exhaustive seed, touch-target, landmark, duration-copy, keyboard-label, focus-contrast, and settings-coverage findings remain closed. Live axe checks found zero violations across all application routes. Keyboard, dialog focus, 200% text, reduced motion, offline reload, privacy requests, internal links, titles, legal pages, purchase-return boundary, and the deliberate 404 passed.

Fresh live mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.201 seconds, total blocking time 0 ms, CLS 0.049, and transfer size 84.5 KB. A phone frame sample averaged 59.9 fps; no frame-rate claim is public.

The complete report is `.factory/verification-6.md`; evidence is under `.factory/evidence/verification-6/`. There are zero findings and zero untested claims. Verdict: **PASS**.

The disclosed dependency is unchanged: the US$8 archive purchase remains disabled until billing registration and entitlement validation are available. The free daily game and sample are complete.

## Repair 5 — PASS

Strict review 3 finding R3-1 is closed. The public settings claim and its single tagged browser test now cover both choices in the Board settings dialog: coordinate labels and the heavier enemy-intent outline. The test turns both options off, checks both rendered changes immediately, reloads, checks both rendered changes again, then reopens the dialog and confirms both controls remain off. It verifies browser-visible outcomes rather than source strings or only stored data.

The repair/claim commit is `d8ddaf502e55581ed69ed05767632270a1cf1499`. The production application source is still implementation `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8`; this repair changes test and claim coverage, so the shipped JavaScript and CSS are intentionally byte-for-byte unchanged. The repaired claim commit is pushed to `main`, and its clean `dist/` was deployed to the existing `sf-patient-rail` production static app without changing DNS or other infrastructure.

### Verification

- A fresh clone of `d8ddaf5` completed `npm ci` with zero vulnerabilities, passed `npm test` with 7 engine tests and 27 Chromium tests, and produced `dist/` with `npm run build`.
- Every one of the 12 commands in `.factory/claims.json` was then run as a separate process from that fresh clone and passed. Each claim ID still has exactly one matching tag.
- The broadened `settings-persist` claim passed locally, from the fresh clone, and against production HTTPS. It covers both settings and their rendered outcomes after reload.
- `PATIENT_RAIL_URL=https://patient-rail.sociobot.in npm test` passed all 7 engine and 27 browser tests. The route-wide Playwright axe integration reported zero violations.
- The factory URL verifier returned 200, found the correct title and language, one `h1`, one `main`, no missing alternatives, no unlabeled buttons, and no console errors.
- Fresh 1440 × 950 and 390 × 844 browser contexts started at scroll position zero and showed the job, audience, sample action, first action, and active board. The phone intent cell was fully visible at 44 × 44 px with no horizontal overflow.
- One-click sample entry showed the persistent sample label. Reset restored turn 1 and `SAMPLE-EMBER-7` while a seeded daily-storage value remained unchanged.
- The live sample reached **Route complete** after 15 shown-intent Fire actions and **Train stopped** after 11 Hold position actions. Restart behavior remains covered by the live suite.
- Fresh live mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 seconds, total blocking time 20 ms, CLS 0.049, and transferred content was 83 KiB.
- Live JavaScript SHA-256 is `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a`; live CSS SHA-256 is `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a`. Both match the clean local build.
- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml` returned 200. `/404` returned its deliberate 404. Required security headers remain present.

Fresh evidence is under `.factory/evidence/repair-5/`. All earlier CSP, phone viewport, exhaustive seed, touch-target, landmark, copy, keyboard-label, and focus-contrast findings remain closed through the complete regression suite.

### Known dependency

The free daily game and sample are complete. The US$8 one-time offline/archive offer remains unavailable until the separate billing operator registers it and entitlement validation is implemented. Purchase stays disabled and makes no billing request. Public metadata remains in `.factory/billing-offer.json`.

### How to verify

```sh
npm ci
npm test
npm run build
```

Run each command in `.factory/claims.json` separately. To repeat the production browser suite:

```sh
PATIENT_RAIL_URL=https://patient-rail.sociobot.in npm test
```

## Strict review 3 — FAIL

Strict QA on 6 September 2026 reviewed implementation `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` and documentation `2851d520f0260acb5c38c9bdfae4f1338821b345`. The live CSS and JavaScript hashes exactly matched a clean production build. A clean clone passed `npm ci`, `npm test` (7 engine and 27 browser tests), every one of the 12 declared claim commands run separately, and `npm run build`; the same complete suite passed against live HTTPS.

The live phone and desktop game appeared in the first viewport. The fixed sample won after 15 shown-intent Fire actions, lost after 11 Hold position actions, and restarted correctly. Reset isolation, offline reload, daily recovery, privacy requests, routes, legal pages, deliberate 404, keyboard, focus, touch targets, reduced motion, and axe checks passed. All earlier findings remain closed.

One medium claims-coverage finding prevents PASS: the settings dialog says both its coordinate and heavier intent-outline settings are saved in the browser, but the only `settings-persist` claim test verifies coordinates alone. A fresh live manual check showed the untested outline preference does persist, but the published broader claim is still incomplete under the claims contract. Add it to the tagged test or narrow the UI statement, then rerun the claim suite and strict review. Full evidence and the unambiguous verdict are in `.factory/review-3.md`.

## Strict review 2 — PASS

Strict QA on 6 September 2026 reviewed implementation `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` from documentation starting point `a4860db80f9b16048d290fbce016c17138090e09`. Later commits before this review changed only `.factory` reports and evidence. Live JavaScript and CSS hashes exactly matched the clean implementation build.

The assigned clean checkout passed `npm ci`, `npm test` (7 engine and 27 browser tests), all 12 declared claim commands run separately, and `npm run build`. The same complete suite passed against live HTTPS. Fresh Lighthouse mobile scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP was 1.352 s, total blocking time 18 ms, CLS 0.049, and transfer size 84.5 KB.

Fresh 1440 × 950 and 390 × 844 contexts showed the job, audience, sample action, first action, and active board before scrolling. One click opened the isolated populated sample. Reset and leaving demo mode preserved seeded daily data. The sample won after 15 Fire actions, lost after 11 Hold position actions, and restarted at turn 1 with all cars full.

All earlier findings remain closed. Axe found zero violations on all seven application routes. Keyboard play, 49 spoken cell labels, focus contrast, modal focus management, touch targets, reduced motion, 200% text, offline reload, route titles, links, legal pages, privacy requests, invalid actions, damaged-state recovery, the deliberate 404, and the untrusted purchase-return boundary passed.

The complete report is `.factory/review-2.md`; fresh evidence is under `.factory/evidence/review-2/`. There are zero findings and zero untested claims. Verdict: **PASS**.

The disclosed dependency is unchanged: the US$8 archive purchase remains disabled until billing registration and entitlement validation are available. The free daily game and sample are complete.

## Independent verification 5 — PASS

Independent QA on 6 September 2026 reviewed implementation `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` and documentation baseline `619cb5f723cb47d7f4e0fefc717bf4322ef414c9`. The later commit changes only handoff and Lighthouse evidence. Live JavaScript and CSS hashes exactly matched a clean build of the implementation.

A separate clean clone passed `npm ci`, `npm test` (7 engine and 27 browser tests), every one of the 12 declared claim commands run separately, and `npm run build`. The same complete suite passed against live HTTPS.

Fresh 1440 × 950 and 390 × 844 contexts showed the job, audience, first action, sample link, and active board at scroll position zero. One click opened the isolated populated sample. Reset preserved a daily sentinel. The sample won after 15 Fire actions, lost after 11 Hold position actions, and restarted at turn 1 with all cars full.

The focus repair is closed independently. Live controls on cream and navy plus the static 404 recovery link rendered two 3 px bands. Their relevant contrasts were 7.02:1, 13.68:1, and 3.65:1. Axe reported zero violations on all seven application routes; keyboard, dialog focus, touch targets, reduced motion, 200% text, offline reload, route titles, links, legal pages, privacy requests, and recovery paths passed.

Fresh live mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 s, total blocking time 50 ms, CLS 0.049, and transfer size 83 KiB. A fresh phone frame sample measured 60.0 fps; no rule depends on animation and no frame-rate claim is public.

The complete report is `.factory/verification-5.md`; fresh evidence is under `.factory/evidence/verification-5/`. There are zero findings and zero untested claims. Verdict: **PASS**.

The disclosed external dependency is unchanged: the US$8 archive purchase remains disabled until billing registration and entitlement validation are available. The free daily game and sample are complete.

## Repair 4 — PASS

The current implementation is `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` (`fix: strengthen keyboard focus contrast`). It is pushed to `main` and deployed to <https://patient-rail.sociobot.in>. This repair touched only the existing `sf-patient-rail` static app.

### What changed

- Replaced the low-contrast mustard general focus outline with a two-band focus marker: a 3 px dark-teal rail and a 3 px cream rail. A dark-teal band clears 7.02:1 on cream paper and 3.65:1 beside mustard; the cream band clears 13.68:1 on the navy desk.
- Applied the same treatment to the static HTTP 404 recovery link. Its new dark-teal rail clears 7.02:1 against the cream ticket.
- Added an outcome-based browser regression that focuses real controls on cream paper, navy, and the static 404 document, reads their rendered focus bands and adjacent opaque surfaces, and requires a visible 3 px band with at least 3:1 contrast. It does not assert stylesheet text.
- Recorded the focus treatment in the visual thesis.

### Current verification

From the documented clean setup (Node.js 22.23.2 and npm 10.9.8), `npm ci`, `npm test`, and `npm run build` passed. The full local result was 7 deterministic engine tests and 27 Chromium browser tests. All 12 commands in `.factory/claims.json` were then run separately and passed.

The deployed HTTPS URL was checked in fresh browser contexts. `PATIENT_RAIL_URL=https://patient-rail.sociobot.in npm test` passed all 7 engine tests and 27 browser tests, including axe checks on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`. The live static `/404` deliberately returned HTTP 404; it kept its same-origin stylesheet and recovery link.

Fresh 1440 × 950 desktop and 390 × 844 phone captures show the job, audience, sample action, first action, and active board before scrolling. The live fixed sample won after 15 Fire actions and lost after 11 Hold position actions; current screenshots and the end-screen summaries are in `.factory/evidence/`.

Fresh live mobile Lighthouse scores are 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 s, total blocking time 50 ms, CLS 0.049, and transfer size 83 KiB. The report is `.factory/evidence/lighthouse-live-mobile-repair-4.json`.

The deployed asset hashes match the clean local `dist/` build: JavaScript `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a` and CSS `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a`.

### Finding disposition

| Finding | Status |
| --- | --- |
| R1-1: focus outline below 3:1 on cream and static 404 | Closed by the two-band treatment and live regression. |
| V1-1: static 404 CSP error | Closed; the 404 stylesheet remains same-origin and the live CSP check passes. |
| V1-2: phone did not show a usable board | Closed; the 390 px test keeps the active cell fully visible and usable without scrolling. |
| V1-3: universal seed wording used a date sample | Closed; every one of 108 reachable tactical configurations wins through the tested safe route. |
| V2-1: touch targets below 44 px | Closed; browser coverage checks all routes and settings controls. |
| V3-1: nested complementary landmark | Closed; axe reports no violations on every application route. |
| V3-2: untested 20-minute claim | Closed; public copy uses the tested 15-turn shape and says no timer sets duration. |
| V3-3: incomplete keyboard and spoken-label proof | Closed; claim coverage includes Tab, four arrows, Enter, Space, B, W, focus recovery, and all 49 unique spoken labels. |

### Known dependency

The free daily game and sample are complete. The US$8 one-time offline/archive offer remains unavailable until the separate billing operator registers it and entitlement validation is implemented. Purchase stays disabled, activation does not assert ownership, and no billing request occurs. The public metadata is retained in `.factory/billing-offer.json` and copied to `/work/.evidence/billing-offer.json`.

### How to verify

```sh
npm ci
npm test
npm run build
```

Run each command in `.factory/claims.json` separately. To run the browser suite against production:

```sh
PATIENT_RAIL_URL=https://patient-rail.sociobot.in npm test
```

The following historical reports are retained below for traceability. Their FAIL verdicts predate this repair; the table above gives their current dispositions.

## Review 1 — FAIL

Fresh strict QA on 6 September 2026 reviewed implementation `09ec2c2f36dfd0951508dcc0957568973044726b`, documentation baseline `6a3f5ff6c77205dcf225765277072f6729344091`, and starting review commit `34ed638062a2d7b09e0730c20e81dd2b4d4d2181`.

One medium accessibility finding remains. General keyboard focus uses a mustard outline with only 1.92:1 contrast on cream content pages. The static 404 recovery link uses a cream outline on the same cream surface, producing 1.00:1 contrast. Both miss the required 3:1 focus-indicator contrast. Axe reports zero violations because it does not measure this condition.

The review made no product-code change. Full evidence, the repair target, and the unambiguous verdict are in `.factory/review-1.md`.

### Verification completed

- A clean clone passed `npm ci`, `npm test` (7 engine and 26 Chromium tests), all 12 claim commands separately, and `npm run build`.
- The full 7-engine/26-browser suite passed against live HTTPS.
- Fresh desktop and phone contexts showed the job, audience, first action, and active board before scrolling.
- The sample won after 15 Fire actions and lost after 11 Hold actions. Reset, restart, demo isolation, daily recovery, damaged-state recovery, settings, every advertised key, all 49 spoken cell labels, reduced motion, 200% text, and offline reload passed.
- All named routes, links, metadata files, legal pages, and the deliberate 404 were checked. Playwright axe reported zero violations on all application routes.
- Live JS and CSS hashes exactly matched the clean implementation build.
- Fresh Lighthouse mobile scored 100 in performance, accessibility, best practices, and SEO. LCP was 1.201 s, TBT 0 ms, and CLS 0.049.

### Required next step

Replace the focus indicator with a treatment that reaches at least 3:1 against every adjacent surface, including cream article pages and the static 404. Then rerun the full claim suite, live accessibility checks, and this review. Do not mark the product PASS until that finding is closed.

## Independent verification 4 — PASS

Independent QA on 6 September 2026 reviewed implementation `09ec2c2f36dfd0951508dcc0957568973044726b` and documentation `6a3f5ff6c77205dcf225765277072f6729344091`. The live JS and CSS hashes exactly matched a clean implementation build. A separate clean clone passed `npm ci`, `npm test` (7 engine and 26 browser tests), every one of the 12 declared claim commands, and `npm run build`.

Fresh desktop and 390 × 844 phone browsers showed the job, audience, first action, and playable board without scrolling. The fixed sample won in 15 Fire actions and lost in 11 Hold actions; the persistent demo label, reset isolation, restart, invalid-action recovery, daily reload recovery, keyboard controls, reduced motion, settings focus return, offline reload, all 49 spoken cell labels, and all named routes were checked live. Axe found zero violations on the seven application routes. Fresh Lighthouse mobile scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO (LCP 1.204 s, TBT 19 ms, CLS 0.049). The only remaining external dependency is the disclosed billing offer registration and entitlement validation; purchase remains disabled and sends no billing request.

Full evidence and the unambiguous result are in `.factory/verification-4.md`.

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
