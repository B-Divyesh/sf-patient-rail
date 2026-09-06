# Patient Rail verification 1 — FAIL

**Verdict: FAIL.** Three findings remain. There is one incompletely tested public claim. The product must not be marked PASS until every finding is fixed and the full verification is repeated.

## Scope

- Live URL: <https://patient-rail.sociobot.in>
- Implementation candidate reviewed: `78effd5584066428b9a838540e06546e8eb89c56`
- Documentation commit reviewed: `3546e32d279e8127af0f49e746e80cf4bdcfb063`
- The documentation-only commit changes evidence and handoff files, not product source or build output. The live JavaScript asset `index-CfL6Wd2v.js` had the same SHA-256 as this checkout's production build.
- Earlier handoff states that no earlier review findings existed. Its prior assertion of no live console errors does not hold for `/404`; finding V1 below is the current disposition.

## Product checked

Patient Rail is a deterministic 7 by 7, turn-based train-defense run for roguelike players who want a readable daily game rather than real-time combat. The landing page says the first action plainly: choose the copper-marked enemy and Fire.

## Findings

### V1 — High — live 404 breaks its own CSP and logs a console error

`https://patient-rail.sociobot.in/404` returns the expected HTTP 404 and has a recovery link, but its inline `<style>` is blocked by the deployed `style-src 'self'` CSP. A fresh browser reports: `Applying inline style violates the following Content Security Policy directive 'style-src 'self''`. It also reports the expected failed 404 resource request.

This violates the required no-console-errors quality gate and means the bespoke 404 visual design is not applied. Move the page CSS to a same-origin stylesheet or authorize only a safe hash/nonce, then verify `/404` has no CSP error.

### V2 — Medium — phone first viewport does not show a usable game board

In a fresh 390 × 844 mobile context, the game card starts at y=595, but the board starts at y=823 and the first playable cell starts at y=831. Only 13 px of that first 44 px cell are in the initial viewport. The visitor sees the headline and game card heading, but not a usable active board without scrolling.

This misses the browser-game and controller requirement to show the game/active board immediately on the first screen. Rework the phone-first layout so at least a usable board area and its immediate action/intent are visible without a scroll, then add an automated viewport assertion for it.

### V3 — Medium — public universal seed claim is tested only for 366 dates

The landing page, README, and `finishable-seeds` claim say every dated seed has a safe route. Its declared command passes, but checks only 366 dates from `2028-01-01` through `2029-01-01`. That proves the reported 366-seed sample, not the unbounded public wording “every dated seed.”

Either change public copy and claim wording to “366 dated seeds verified” or add a test/proof that covers the full defined date domain. This is one incompletely tested public claim.

## Passing evidence

- Clean documented setup succeeded: `npm ci` (zero dependency vulnerabilities), `npm test` (6 unit and 24 browser tests), and `npm run build` (created `dist/`).
- All 12 declared claim commands were rerun individually and passed: complete seeded run, loss/restart, 366-seed finishability sample, demo isolation, local privacy, offline reload, keyboard play, resumed progress, persisted settings, invalid actions, seed variation, and billing pending state.
- In a fresh live desktop browser, the page had the correct title, one `h1`, one `main`, `lang="en"`, no console errors, a visible active board, the stated first action, and no third-party request origin.
- In fresh live demo play, the persistent sample label appeared; firing each displayed intent won in 15 turns; restarting restored turn one and the opening intent; holding position reached the loss end screen. Keyboard arrows plus B resolved a turn and retained a board focus target.
- In a fresh live offline context, the daily game reloaded after service-worker control and resolved a second turn with networking disabled.
- Live axe checks found no serious or critical violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`. The same check on `/404` found no axe serious/critical issue, but V1's CSP console error remains.
- Every named product route, robots, sitemap, manifest, and social card returned 200. `/404` returned the deliberate HTTP 404. An arbitrary fallback route rendered the app's designed not-found state with HTTP 200, which is expected under the SPA fallback and is not counted as a defect.
- All internal links returned 200. External links are the Param Factory site and the two displayed mailto contacts. The settings dialog opened modally, focused its close control, and returned focus to its opener.
- Live headers included the stated CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.

## Claim status

| Claim ID | Result |
| --- | --- |
| complete-seeded-run | Pass |
| loss-restart | Pass |
| finishable-seeds | Incomplete — V3 |
| demo-isolation | Pass |
| local-privacy | Pass |
| offline-reload | Pass |
| keyboard-play | Pass |
| resume-progress | Pass |
| settings-persist | Pass |
| invalid-no-turn | Pass |
| seed-variation | Pass |
| billing-pending | Pass |

## Counts

- Findings: 3
- Untested or incompletely tested public claims: 1
- Verdict: **FAIL**
