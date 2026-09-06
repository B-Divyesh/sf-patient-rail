# Patient Rail handoff

## Independent verification 3 result

Independent verification on 6 September 2026 reports **FAIL** for implementation `8231d0bff1695ee72d8d8a805c90f36d304d39d7` and documentation baseline `632b3ca4c0caa56cb90b254ca6d8df2844c9bc04`.

The live implementation still passes the functional release gates: clean `npm ci`, all 12 declared claim commands, 7 engine tests, 26 browser tests, build, the same 33 tests against live HTTPS, full phone and desktop sample runs, offline reload, route and link checks, all 181 touch targets, and Lighthouse mobile 97/100/100/100. Its JavaScript and CSS hashes exactly match the clean build.

Three findings remain:

1. Axe reports a moderate `landmark-complementary-is-top-level` violation because the current-turn `aside` is nested inside `main` on `/` and `/demo`.
2. The public 20-minute duration is quantitative but absent from `.factory/claims.json` and unmeasured.
3. `@claim:keyboard-play` does not assert Arrow-key destination changes, Enter, Space, W, or all 49 spoken cell labels. Those controls worked in the fresh manual live check, but their public claim lacks complete automated proof.

The full report is `.factory/verification-3.md`. Fresh evidence is under `.factory/evidence/verification-3/`, including first-screen, win, loss, axe, URL-verifier, runtime, and Lighthouse records. Do not mark the product PASS until the three findings are repaired and independently rechecked.

## Repair 2 result

The remaining touch-target finding is repaired and verified on 6 September 2026. The implementation commit is `8231d0bff1695ee72d8d8a805c90f36d304d39d7`. It is pushed to `main` and deployed at <https://patient-rail.sociobot.in>.

Independent verification 2 remains in `.factory/verification-2.md` as the pre-repair record. It reviewed implementation `0b56f836fbb81d7dfaaa7a5bf67464455336d640` and reported one medium finding.

## Finding disposition

### V2-1 — phone touch targets — closed

All links and buttons now have a 44 by 44 CSS-pixel minimum target. The text-style demo control, article links, footer links, activation link, and email links inherit that baseline without changing their labels or behavior.

The new browser regression measures rendered geometry instead of checking CSS text. At 390 by 844 it checks every visible link, button, summary, and labeled input target on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, `/terms`, the app not-found route, the standalone 404 page, and the open settings dialog.

Fresh live measurements found zero undersized targets:

| Route | Targets | Smallest width | Smallest height |
| --- | ---: | ---: | ---: |
| `/` | 64 | 44 px | 44 px |
| `/demo` | 66 | 44 px | 44 px |
| `/how-to-play` | 8 | 44 px | 44 px |
| `/archive` | 10 | 44 px | 44 px |
| `/license` | 8 | 44 px | 44 px |
| `/privacy` | 8 | 44 px | 44 px |
| `/terms` | 8 | 44 px | 44 px |
| App not found | 8 | 44 px | 44 px |
| HTTP 404 | 1 | 201.5 px | 48 px |

The controls named in the failed report now measure as follows: **Reset demo** 89 by 44; rules link 358 by 44; privacy link 174 by 44; **Terms** 44 by 44; activation link 227 by 44; and email links 145–149 by 44 pixels.

All three findings from verification 1 remain closed: the HTTP 404 loads same-origin CSS without a CSP error, the phone viewport shows a fully usable intent cell, and all 108 possible dated-seed configurations have a tested safe route.

## Product

Patient Rail is a deterministic 7 by 7, turn-based train-defense game for roguelike players who want a readable daily run instead of real-time combat. A 15-turn run has three stops, one action per turn, one visible enemy intent, seeded layouts, enemy families, and a final weather rule.

The first action is to choose the copper-marked enemy and Fire. The live first screen shows this instruction, the audience, the sample action, three facts, and the active board before scrolling on phone and desktop.

## Delivered behavior

- Daily UTC seed and fixed sample seed `SAMPLE-EMBER-7`.
- Fire, Patch, limited Brace, and Hold position actions.
- Visible intent, win, loss, restart, saved daily progress, damaged-save recovery, and saved board settings.
- Keyboard grid movement, screen-reader cell labels, live status text, and designed focus states.
- A persistent sample label, isolated sample storage, reset, and exit to the daily game.
- Same-origin service worker support for offline reload after the first online visit.
- Real rules, archive, activation, privacy, terms, app-not-found, and HTTP 404 routes.
- Self-hosted IBM Plex Sans and IBM Plex Mono plus original CSS and SVG cut-paper art.
- Exact US$8 one-time archive metadata for the separate billing operator.

## Verification

The documented clean setup used Node.js 22.23.2 and npm 10.9.8 in a fresh clone of the implementation commit.

```sh
npm ci
npm test
npm run build
```

- `npm ci`: passed with zero dependency vulnerabilities.
- Every command in `.factory/claims.json`: passed separately from the clean clone.
- `npm test`: 7 deterministic engine tests and 26 Chromium tests passed locally.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.43 KB raw and 10.78 KB gzip.
- Production CSS: 21.14 KB raw and 5.50 KB gzip.
- Live HTTPS: the same 7 engine and 26 browser tests passed after deployment.
- Axe: no serious or critical finding on any named product route.
- Factory URL verifier: correct title and language, one h1, one main, no missing labels, and no console error.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.20 seconds, TBT 0 ms, CLS 0.069, and the touch-target audit passed.
- Frame sample: 182 frames over 3.01 seconds, 60.0 fps, and a 16.8 ms maximum interval at 390 by 844. Gameplay does not depend on animation.
- Fresh desktop and phone: the intent cell was fully visible before scrolling. It measured 75.7 px square on desktop and 44 px square on phone.
- Live JavaScript SHA-256: `8e17c71b6883cbfeb9c0c1a32601cdd26ff68192f9877c1fbc10b680af5ddbdd`, matching `dist/`.
- Live CSS SHA-256: `09e267c81239c9974c7e0bc32589242434f7b3994840282ab9634f31fea64cf3`, matching `dist/`.
- All named product routes and public metadata returned 200. `/404` deliberately returned 404 with a working recovery action.
- The fixed sample reached **Route complete** in 15 Fire actions. Hold position reached **Train stopped** in 11 actions. Restart restored turn one.

Current evidence is under `.factory/evidence/`, including fresh phone, desktop, win, loss, URL-verifier, Lighthouse, run-summary, and touch-target records.

## Privacy and operations

There is no backend, account, telemetry, third-party script, or runtime model call. Game state stays in namespaced browser local storage. The sample uses `demo:patient-rail:run:v1`; daily progress uses `patient-rail:daily:*`.

This repair deployed only the existing `sf-patient-rail` static app. It did not change DNS, billing, a database, a staging slot, or any unrelated resource.

## Known dependency

The US$8 one-time offline/archive offer is not registered. Purchase, entitlement validation, archive date selection, and activation remain unavailable and are labeled that way. The free daily game and sample are complete.

The billing operator can use `/work/.evidence/billing-offer.json`. A checkout redirect must not unlock the archive without verified entitlement.

## Next steps

1. Register the one-time offer through the Sociobot billing operator.
2. Add entitlement validation to `/license` after registration.
3. Test checkout, restore purchase, and dated-seed selection before advertising activation.
4. Measure completion and return-rate goals only under an approved privacy-preserving plan.
