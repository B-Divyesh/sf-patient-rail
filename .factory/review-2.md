# Review the 15-turn train-defense game — Patient Rail

**Verdict: PASS.** There are zero findings and zero untested or incompletely tested public claims.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire.

Fresh 1440 × 950 desktop and 390 × 844 phone contexts started at scroll position zero. Both showed the job, audience, sample action, active board, and acting enemy cell in the first viewport. The phone cell occupied y=752.6–796.6 and measured 44 × 44 px.

## Scope and candidate

- Live URL: <https://patient-rail.sociobot.in>
- Implementation reviewed: `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` (`fix: strengthen keyboard focus contrast`).
- Documentation starting point: `a4860db80f9b16048d290fbce016c17138090e09` (`docs: record independent verification 5`).
- Commits after the implementation change contain only reports and evidence; they do not change the product build.

The live JavaScript SHA-256 was `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a`; the live CSS SHA-256 was `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a`. Both exactly matched a clean production build of the implementation candidate.

The repository QA report `.factory/verification-5.md` was read in full. The work order also named `factory-evidence/patient-rail-verify-5/qa-report.md`, but that path was not present anywhere under `/work` in the supplied container. This review therefore repeated the live and clean-checkout checks instead of relying on that missing copy.

## Clean checkout and claims

The assigned checkout was clean at `a4860db`. It used Node.js 22.23.2, npm 10.9.8, and pinned Playwright 1.58.2.

- `npm ci`: passed with zero vulnerabilities.
- `npm test`: passed 7 engine tests and 27 Chromium tests.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.45 KB raw and 10.76 KB gzip.
- Production CSS: 21.18 KB raw and 5.50 KB gzip.
- The complete 7-engine/27-browser suite also passed against live HTTPS.

Every command in `.factory/claims.json` was run as a separate process and passed. Each claim ID has exactly one matching `@claim:` test.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The fixed sample reached Route complete after 15 shown-intent Fire actions. |
| `loss-restart` | Pass | Eleven Hold position actions reached Train stopped; restart restored turn 1 and three cars at 5/5. |
| `finishable-seeds` | Pass | All 108 reachable car-order, enemy-family, and weather configurations won in 15 turns. |
| `demo-isolation` | Pass | Sample play and reset left a seeded daily-storage value byte-for-byte unchanged. |
| `local-privacy` | Pass | Sample play and settings changes contacted only the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily run reloaded and advanced with networking disabled. |
| `keyboard-play` | Pass | All 49 unique cell names, Tab, four arrows, Enter, Space, B, W, and focus recovery passed. |
| `resume-progress` | Pass | Daily seed, turn, train state, and log persisted through reload. |
| `settings-persist` | Pass | The coordinate setting persisted through reload. |
| `invalid-no-turn` | Pass | Empty and full-car choices kept turn 1 and announced why. |
| `seed-variation` | Pass | Dated configurations varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Purchase remained disabled, activation disclosed its limit, and no billing request occurred. |

Live copy, route metadata, the README, and the planned offer were cross-checked. No material claim is absent from `.factory/claims.json`. The US$8 archive is clearly planned and unavailable; `billing-pending` tests that current state.

## Earlier finding disposition

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| V1-1: 404 CSP error | `/404` returned the deliberate 404, loaded its same-origin stylesheet, and produced no CSP error. | Closed |
| V1-2: phone did not show a usable board | The 390 × 844 first viewport showed a fully visible 44 × 44 px acting cell, which advanced the turn without scrolling. | Closed |
| V1-3: universal seed wording sampled dates | The claim check exhausted all 108 reachable tactical configurations. | Closed |
| V2-1: phone targets below 44 px | The live suite measured visible targets across nine routes and the settings dialog; none was undersized. | Closed |
| V3-1: nested complementary landmark | Live axe checks found zero violations on all seven application routes. | Closed |
| V3-2: untested 20-minute claim | Public copy uses the tested 15-turn shape and says no timer sets duration. | Closed |
| V3-3: incomplete keyboard and spoken-label proof | The claim covers every advertised key, focus recovery, and all 49 unique spoken cell labels. | Closed |
| R1-1: focus indicator below 3:1 | The live regression passed on cream, navy, mustard, and the static 404 with a visible band of at least 3:1. | Closed |

## Live game, boundaries, and recovery

- One click opened `/demo` with seed `SAMPLE-EMBER-7`, three full train cars, three stops, visible enemies, and the exact first intent: Copper beetle attacks Engine for 1; Brace blocks 1.
- The sample label remained after play. Reset restored turn 1 and the original intent while a daily sentinel remained unchanged. Leaving the sample deleted its demo key and preserved a separate daily sentinel.
- Fifteen Fire actions reached Route complete with 13 train integrity, 10 threats cleared, 15 turns used, and 3 brake tokens.
- Eleven Hold position actions reached Train stopped. Restart restored turn 1 and all three cars to 5/5.
- Empty-cell and full-car actions used no turn and explained why. Damaged saved state, daily reload recovery, and browser-history recovery passed in the live suite.
- `/license?purchase=complete` did not grant ownership. It displayed the pending-validation warning and made no billing request.

Fresh evidence: [desktop first screen](evidence/review-2/desktop-first-screen.png), [phone first screen](evidence/review-2/phone-first-screen.png), [win screen](evidence/review-2/sample-win.png), and [loss screen](evidence/review-2/sample-loss.png). Structured observations are in [game-runs.json](evidence/review-2/game-runs.json) and [manual-boundaries.json](evidence/review-2/manual-boundaries.json).

## Accessibility, privacy, routes, and performance

- Live Playwright axe checks found zero violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`.
- Keyboard play covered Tab, four arrow keys, Enter, Space, B, and W. The board exposed 49 unique action labels and restored board focus after keyboard actions.
- The settings dialog opened on its close control, exposed two labelled checkboxes, made background controls inert, and returned focus to Board settings. Chromium briefly reports `body` between the last and first dialog controls; no background interactive control receives focus, and the next Tab returns to the dialog.
- Reduced motion produced an effectively zero transition. At 200% root text size and 390 px width, the document retained its 390 px width, heading, and board.
- All checked phone targets were at least 44 × 44 px. Route changes updated the title, moved focus to the new `h1`, and worked with browser Back.
- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` returned 200 with distinct titles, one `h1`, and one `main`. Every discovered HTTP link returned 200; contact links used `mailto:`.
- `/404` deliberately returned HTTP 404 with the designed recovery page. Its expected failed-resource console entry records the requested 404 status and is not a defect. The application fallback also showed its designed not-found page.
- The factory URL check found the correct title and language, one `h1`, one `main`, no missing alternatives, no unlabeled buttons, and no console errors on `/`.
- Response headers included a same-origin CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- Sample and daily runs used separate local-storage namespaces. Recorded game traffic stayed on `https://patient-rail.sociobot.in`. There is no backend, tenant, health, server persistence, or rate-limit surface, so backend and 429 checks do not apply.
- Offline reload and play passed in a dedicated fresh context. No separate update behavior is advertised.
- Fresh mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.352 s, total blocking time 18 ms, CLS 0.049, and transfer size 84.5 KB.
- A fresh 3.00-second phone sample delivered 181 frames at 60.0 fps with a 16.8 ms maximum interval. The product makes no frame-rate claim, and game rules do not depend on animation.

## Disclosed dependency

The free daily game and sample are complete. The US$8 offline/archive offer remains disabled until the separate billing operator registers it and entitlement validation is implemented. The archive, activation, and terms pages disclose this limit; no checkout request occurs. This external dependency is not a finding in the available free game.

## Counts

- Findings: 0
- Untested or incompletely tested public claims: 0
- Verdict: **PASS**
