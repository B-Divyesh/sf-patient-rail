# Patient Rail handoff

## Independent verification 2 — FAIL

Independent QA on 6 September 2026 found one remaining medium issue and no untested claims. At 390 by 844, several secondary links are only 20–24 pixels high and **Reset demo** is 38 pixels high. This does not meet the required 44 by 44 CSS-pixel touch target baseline. See `.factory/verification-2.md` for measurements and complete evidence.

All three findings from verification 1 are closed, all 12 claim commands pass independently, and both the clean local suite and live HTTPS suite pass. The implementation reviewed remains `0b56f836fbb81d7dfaaa7a5bf67464455336d640`; the pre-verification documentation and test-harness commit is `36afc80eef6b4473463ac21a9f92ca4237cee690`.

## Repair verification results

The three findings from independent verification 1 are repaired and retested on 6 September 2026. The deployed product implementation is `0b56f836fbb81d7dfaaa7a5bf67464455336d640`.

- **V1 — 404 CSP:** `404.html` now loads the cut-paper styles from same-origin `/404.css`. A fresh HTTPS browser received HTTP 404, rendered the navy and cream recovery page, and reported no CSP errors.
- **V2 — phone first viewport:** at 390 by 844, the copper-marked playable cell is at y=752.6 through y=796.6. It is fully visible, resolves turn one on tap, and does not scroll the page. The first screen still states the job, audience, sample action, first action, and three facts.
- **V3 — dated seeds:** the finishability claim now plays the safe Fire route through all 108 possible tactical configurations: six car orders, six enemy-family orders, and three weather rules. Route labels never affect a turn. Every configuration won in 15 turns with all cars above zero integrity.

The earlier failing report remains at `.factory/verification-1.md` as history. Its documentation commit was `cf409a344b9d3142d78b35656e45faca832c5446`; it reported the pre-repair implementation `78effd5584066428b9a838540e06546e8eb89c56`.

## Product

Patient Rail is a deterministic 7 by 7, turn-based train-defense game for roguelike players who want a readable daily run instead of real-time combat. The active board is on the first screen. A 15-turn run has three stops, one player action per turn, one visible enemy intent, seeded train layouts, enemy families, and a final weather rule.

The live URL is <https://patient-rail.sociobot.in>.

## Delivered

- Daily UTC seed and fixed sample seed `SAMPLE-EMBER-7`.
- Fire, Patch, limited Brace, and Hold position actions.
- Visible intent, win, loss, restart, saved daily progress, damaged-save recovery, and saved board settings.
- Keyboard grid movement, Enter/Space actions, B and W shortcuts, spoken cell labels, live status text, and designed focus states.
- A compact phone layout that keeps the active intent cell usable before scroll.
- Same-origin service worker for offline reload after the first online visit.
- Real routes for demo, rules, archive, activation status, privacy, terms, and a designed HTTP 404 response.
- Self-hosted IBM Plex Sans and IBM Plex Mono assets plus original CSS/SVG cut-paper artwork.
- Exact US$8 one-time offline archive metadata for the billing operator.

## Verification

Clean setup used Node.js 22 and npm 10:

```sh
npm ci
npm test
npm run build
```

- `npm ci`: 0 dependency vulnerabilities.
- `npm run build`: passed and wrote `dist/`; production JavaScript is 10.78 KB gzip.
- Local `npm test`: 7 deterministic engine tests and 25 Chromium tests passed.
- All 12 commands declared in `.factory/claims.json` passed separately: complete run, loss/restart, complete seed-domain proof, demo isolation, local privacy, offline reload, keyboard play, resumed progress, settings, invalid actions, seed variation, and pending billing.
- Full `npm test` also passed against the HTTPS product after deployment: 7 engine tests and 25 browser tests.
- Fresh desktop HTTPS check: title, one h1, main landmark, active board, plain first action, and no console errors.
- Fresh phone HTTPS check: the intent cell was fully visible at 390 by 844; tapping it advanced to turn two with `scrollY` unchanged.
- Fresh demo HTTPS checks: the persistent sample label showed; 15 visible-intent actions reached the win screen; restart returned to turn one; Hold position reached the loss screen.
- Fresh `/404` HTTPS check: GET returned 404; the styled recovery page loaded; no CSP error occurred. An expected failed-resource notice for a deliberately 404 document is not counted as a page defect.
- Axe found no serious or critical issues on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`.
- The live JavaScript asset `index-DSD14DYL.js` matched the local production artifact by SHA-256: `349f5cd3760706d5496fff33900bcbe4e1d533c294bde9d96245599537fe8a21`.

Current evidence includes the corrected phone first screen in `.factory/evidence/phone-first-screen.png`. The existing desktop, win, and loss evidence remains applicable.

## Privacy and operations

There is no backend, account, telemetry, third-party script, or runtime model call. Game state is limited to namespaced browser local storage. The sample uses `demo:patient-rail:run:v1`; daily keys use `patient-rail:daily:*`. The CSP restricts scripts, styles, fonts, images, connections, workers, and forms to the product origin.

The repair deployed only the existing static product `sf-patient-rail` in Central US. It reused the existing static app and custom domain; no shared service, database, staging slot, unrelated resource, or secret was read or changed.

## Known dependency

The one-time offline/archive offer is not registered. Purchase, entitlement validation, archive date selection, and activation remain unavailable and are labeled that way in the product. The free daily game and fixed sample are complete.

The separate billing operator can use `/work/.evidence/billing-offer.json`. It defines `patient-rail-offline-archive`, US$8 once, the exact return URL, paid features, and `/license` validation route. A checkout redirect must not unlock the archive without verified entitlement.

## Next steps

1. Increase every phone interaction target to at least 44 by 44 CSS pixels, including demo, article, footer, activation, and email links; add an automated all-route target-size check.
2. Register the one-time offer through the Sociobot billing operator.
3. Add the documented entitlement validation call to `/license` after the operator provides the registered contract.
4. Re-test checkout, signed entitlement, restore purchase, and offline dated-seed selection before advertising activation.
5. Measure the brief’s completion and return-rate goals only if a privacy-preserving, consented measurement plan is approved.
