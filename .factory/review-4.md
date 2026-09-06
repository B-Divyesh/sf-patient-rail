# Review the 15-turn train-defense game — Patient Rail

**Verdict: PASS.** There are zero findings and zero untested or incompletely tested public claims.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire.

Fresh 1440 × 950 desktop and 390 × 844 phone contexts began at scroll position zero. Both showed the job, audience, sample action, first-action instruction, active board, and acting enemy cell before scrolling. The phone cell occupied y=752.6–796.6 and measured 44 × 44 px.

## Scope and candidate

- Live URL: <https://patient-rail.sociobot.in>
- Implementation candidate reviewed: `d8ddaf502e55581ed69ed05767632270a1cf1499` (`test: cover both persisted board settings`).
- Documentation baseline reviewed: `51c96b92886b5ff23778e1df915968cf0cf342a2` (`docs: record independent verification 6`).
- Last shipped product-source change: `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` (`fix: strengthen keyboard focus contrast`).

The candidate changes claim coverage, not production assets. Later commits through the documentation baseline add reports and evidence only. Live JavaScript SHA-256 `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a` and CSS SHA-256 `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a` exactly matched the clean candidate build.

The repository report `.factory/verification-6.md` was read in full. The separately named path `factory-evidence/patient-rail-verify-6/qa-report.md` was not present under `/work` in the supplied container. This review repeated the clean-checkout and live checks rather than relying on that unavailable copy.

## Clean checkout and claims

A fresh clone of `51c96b9` used Node.js 22.23.2, npm 10.9.8, and pinned Playwright 1.58.2.

- `npm ci`: passed with zero vulnerabilities.
- `npm test`: passed 7 engine tests and 27 Chromium tests.
- `npm run build`: passed and produced `dist/`.
- Production JavaScript: 32.45 KB raw and 10.76 KB gzip.
- Production CSS: 21.18 KB raw and 5.50 KB gzip.
- `PATIENT_RAIL_URL=https://patient-rail.sociobot.in npm test`: passed all 7 engine and 27 browser tests against live HTTPS.

Every command in `.factory/claims.json` was run in a separate process from the clean clone. Every claim ID occurs in exactly one `@claim:` test.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The fixed sample reached Route complete after 15 shown-intent Fire actions. |
| `loss-restart` | Pass | Eleven Hold position actions reached Train stopped; restart restored turn 1 and full cars. |
| `finishable-seeds` | Pass | All 108 reachable car-order, enemy-family, and weather configurations won in 15 turns. |
| `demo-isolation` | Pass | Sample play, reset, and exit left a seeded daily value unchanged; exit removed only the demo key. |
| `local-privacy` | Pass | Sample play and a settings change contacted only the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily run reloaded and advanced with networking disabled. |
| `keyboard-play` | Pass | All 49 unique cell names, Tab, four arrows, Enter, Space, B, W, and focus recovery passed. |
| `resume-progress` | Pass | Daily seed, turn, train state, and log persisted through reload. |
| `settings-persist` | Pass | Both coordinates and the heavier intent outline changed visibly and remained off after reload; both controls reopened unchecked. |
| `invalid-no-turn` | Pass | Empty and full-car choices left turn 1 unchanged and announced the reason. |
| `seed-variation` | Pass | Dated configurations varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Purchase stayed disabled, activation disclosed its limit, and no billing request occurred. |

Live copy, README, offer metadata, legal pages, and route metadata were cross-checked against the claim list. No material public claim is missing or only partly tested.

## Earlier finding disposition

| Earlier finding | Fresh evidence | Status |
| --- | --- | --- |
| V1-1: 404 CSP error | `/404` returned the deliberate HTTP 404, loaded its same-origin style, and produced no CSP error. | Closed |
| V1-2: phone first view hid the board | The 390 × 844 first view contained the active 44 × 44 px cell, which advanced a turn without scrolling. | Closed |
| V1-3: universal seed wording sampled dates | The deterministic check exhausted all 108 reachable tactical configurations. | Closed |
| V2-1: phone targets below 44 px | The live suite checked visible controls across nine routes and the settings dialog; none was undersized. | Closed |
| V3-1: nested complementary landmark | Live Playwright axe checks found zero violations on all seven application routes. | Closed |
| V3-2: untested 20-minute claim | Public copy uses the tested 15-turn structure and states that no timer sets a duration. | Closed |
| V3-3: incomplete keyboard and spoken-label proof | The claim covers every advertised key, focus recovery, and all 49 unique spoken labels. | Closed |
| R1-1: focus indicator below 3:1 | The live outcome test passed on cream, navy, mustard, and the static 404 with a visible band of at least 3:1. | Closed |
| R3-1: only one of two settings tested | The current claim checks both rendered changes immediately, after reload, and in the reopened controls. | Closed |

## Live game, boundaries, and recovery

- One click from `/` opened `/demo` with `SAMPLE-EMBER-7`, Alder Junction, Copper Cut, Summit Shed, three full train cars, five enemies, and an exact visible intent.
- The persistent sample label remained after play. Reset restored turn 1 and the original seed without changing a seeded daily value. **Start today’s run** discarded the demo key and preserved the daily value.
- Fifteen Fire actions reached **Route complete** with 13 train integrity, 10 threats cleared, 15 turns used, and 3 brake tokens.
- Eleven Hold position actions reached **Train stopped**. Both end screens restarted at turn 1 with all three cars at 5/5.
- Empty-cell and full-car actions did not spend a turn. Damaged saved data recovered with an explanation. Daily reload, browser history, settings reload, and end-state restart recovery passed.
- `/license?purchase=complete` did not grant ownership and displayed the pending-validation warning.

Fresh evidence is in `.factory/evidence/review-4/`: desktop and phone first screens, both end screens, structured live results, URL-verifier output, and the Lighthouse report.

## Accessibility, privacy, routes, and performance

- The factory URL verifier returned 200, found the correct title and language, one `h1`, one `main`, no missing alternatives, no unnamed buttons, and no console errors.
- Playwright axe reported zero violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` locally and live.
- The first Tab focused **Skip to main content**; Enter moved focus to the `h1`. The board exposed 49 unique action labels. The settings dialog focused its close control, kept background controls inert, and returned focus to **Board settings**.
- Reduced motion shortened the transition to `0.00001s`. At 200% root text size on a 390 px viewport, the document retained its 390 px width, heading, and board.
- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` returned 200 with distinct titles, canonical metadata, one `h1`, and one `main`. Every discovered same-origin link and metadata asset returned 200. Contact links are explicit `mailto:` links. The external factory footer target was identified but not requested because the work order forbids connecting to another product.
- `/404` returned the expected 404 with its designed recovery page. An arbitrary SPA path returned 200 with the designed in-app not-found page. The deliberate 404 response is expected, not a defect.
- Required CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy` headers were present.
- The isolated sample produced no external runtime requests. There is no account, analytics, third-party script, model call, backend, tenant, health, restart-persistence, or 429 surface. Backend checks therefore do not apply.
- Offline reload and play passed in a dedicated fresh browser context. No separate update behavior is advertised.
- Fresh mobile Lighthouse scored 99 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.277 seconds, total blocking time 105 ms, CLS 0.049, and transfer size 80.2 KB.
- A fresh 3.016-second phone sample delivered 182 frames at 60.0 fps with a 16.8 ms maximum interval. The product makes no frame-rate claim, and no rule depends on animation.

## Design and product fit

The live product uses the documented cut-paper railway system: navy desk, cream route cards, mustard action controls, teal tracks, copper intent markers, and locally served IBM Plex Sans and Mono. The active 7 by 7 game appears on the first screen rather than behind a menu. Static intent text, turn count, car integrity, route stops, and action results make play understandable without animation. The repository records original CSS and vector asset provenance and uses no copyrighted game-world assets.

AI is not a missed feature for this deterministic, local-first tactics game. Real-time combat, account progression, and multiplayer remain correctly out of scope.

## Disclosed dependency

The free daily game and sample are complete. The US$8 offline/archive offer remains disabled until the separate billing operator registers it and entitlement validation is implemented. The archive, activation, and terms pages state this limit, the purchase control is disabled, and no checkout request occurs. This disclosed external dependency is not a finding in the available free game.

## Counts

- Findings: 0
- Untested or incompletely tested public claims: 0
- Verdict: **PASS**
