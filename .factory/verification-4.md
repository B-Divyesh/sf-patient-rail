# Verify the turn-based train-defense game — Patient Rail

**Verdict: PASS.** There are zero findings and zero untested or incomplete public claims.

## Job, audience, and first action

- Job: defend three train cars through three five-turn stops in a turn-based 7 by 7 game.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire. Fresh 1440 × 950 and 390 × 844 contexts showed that instruction, the audience, the sample action, and the active board at scroll position zero.

## Scope and candidate

- Live URL: <https://patient-rail.sociobot.in>
- Implementation reviewed: `09ec2c2f36dfd0951508dcc0957568973044726b` (`fix: close accessibility claim gaps`).
- Documentation reviewed: `6a3f5ff6c77205dcf225765277072f6729344091` (`docs: record repair 3 verification`).
- The documentation commit changes only handoff/evidence material. The live JS SHA-256 was `090263dc0a898138cbab8f4fd6fc5ed9db7a164d2f90b47a2ea7fcfe2e97ac3c` and live CSS SHA-256 was `09e267c81239c9974c7e0bc32589242434f7b3994840282ab9634f31fea64cf3`; both exactly match a clean build of the implementation.

## Clean checkout and claims

A separate clone at `6a3f5ff` used Node 22.23.2 and npm 10.9.8. `npm ci` completed with zero vulnerabilities; `npm test` passed 7 engine tests and 26 Chromium tests; `npm run build` passed and produced `dist/`. Production JavaScript was 32.45 KB raw / 10.76 KB gzip, and CSS was 21.14 KB raw / 5.50 KB gzip.

Every command declared in `.factory/claims.json` was rerun separately and passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The fixed sample won after 15 Fire actions across three stops. |
| `loss-restart` | Pass | Hold position reached the loss end screen; restart restored turn 1 and full cars. |
| `finishable-seeds` | Pass | All 108 car-order, enemy-family, and weather configurations won in 15 turns. |
| `demo-isolation` | Pass | Sample play and reset did not alter a seeded daily-storage value. |
| `local-privacy` | Pass | Sample play and settings requests stayed on the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily run reloaded and advanced while offline. |
| `keyboard-play` | Pass | All 49 unique cell names, Tab, four arrows, Enter, Space, B, W, and focus recovery passed. |
| `resume-progress` | Pass | Daily seed, turn, train state, and log persisted through reload. |
| `settings-persist` | Pass | Hidden coordinate preference persisted through reload. |
| `invalid-no-turn` | Pass | Empty and full-car choices left turn 1 unchanged and explained why. |
| `seed-variation` | Pass | Dated configurations varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Archive purchase was disabled, activation stated its limit, and no billing request occurred. |

Each claim ID has exactly one matching `@claim:` test. Cross-checking live copy, README, and the pending-offer wording found no unlisted material claim: the US$8 archive is explicitly planned and unavailable, and its no-purchase state is covered by `billing-pending`.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| V1-1: 404 CSP error | Closed. `GET /404` returned the deliberate 404 with a same-origin stylesheet and no CSP console error. |
| V1-2: phone did not show usable board | Closed. At 390 × 844 the active intent cell was visible, 44 px or larger, and advanced a turn without scrolling. |
| V1-3: universal seed wording sampled only dates | Closed. The claim test exhausts all 108 reachable tactical configurations. |
| V2-1: undersized phone targets | Closed. The live suite measured all visible targets across nine routes and the settings dialog; none was below 44 × 44 CSS px. |
| V3-1: nested complementary landmarks | Closed. Live axe returned zero violations on all seven named application routes. |
| V3-2: unmeasured 20-minute claim | Closed. Public copy now uses the tested 15-turn wording and states that no timer sets a duration. |
| V3-3: incomplete keyboard/spoken-label coverage | Closed. The live claim test covers 49 accessible names, all advertised keys, and post-action board focus. |

## Live game and browser checks

- Fresh desktop and phone pages showed the job, audience, first action, sample link, and active board before scrolling. The current captures are [desktop](evidence/desktop-first-screen.png) and [phone](evidence/phone-first-screen.png).
- One click entered `/demo` with `SAMPLE-EMBER-7`, populated cars, route stops, and a visible enemy intent. The persistent label remained through play. Reset restored the opening sample and did not change daily storage.
- A fresh sample reached **Route complete** after 15 Fire actions with 13 train integrity, 10 threats cleared, and 3 brake tokens. A fresh loss reached **Train stopped** after 11 Hold position actions. Both end screens had working restart controls; captures are [win](evidence/sample-win.png) and [loss](evidence/sample-loss.png).
- Invalid choices, damaged saved-state recovery, reload recovery, win/loss boundaries, settings persistence, and reduced-motion behavior passed in the live suite. The settings dialog focused its close button on open and returned focus to **Board settings** on close.
- A 200% root text-size check at 390 px retained a 390 px document width and visible main content. A fresh 3.00-second phone sample delivered 181 frames, 60.0 fps average, and a 16.8 ms maximum interval. The product advertises no frame-rate claim, and rules do not depend on animation.
- Routes `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` each returned 200 with a route-specific title, one `h1`, and one `main`. All discovered internal links and metadata assets returned 200; the external Param Factory link returned 200 and the two email links are explicit `mailto:` links. `GET /404` deliberately returned 404 with a designed recovery page; an arbitrary SPA fallback route returned its designed app not-found state as expected.
- Live response headers included the same-origin CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`. There was no console or page error on the checked application routes.
- Axe found zero violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`. The game has no backend, tenant, health, restart-persistence, or rate-limit surface, so backend isolation and 429 checks do not apply.
- Fresh live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.204 s, total blocking time 19 ms, CLS 0.049.

## Privacy and disclosed dependency

The sample and daily run use separate local-storage keys. No account, analytics, external runtime script, model call, or backend exists; test-recorded game traffic stayed on the product origin. The US$8 archive offer remains deliberately disabled until the external billing operator registers it and entitlement validation is added. That limitation is visible on the archive, license, and terms pages, makes no checkout request, and is not a defect in the free game.

## Counts

- Findings: 0
- Untested or incompletely tested public claims: 0
- Verdict: **PASS**
