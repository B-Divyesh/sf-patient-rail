# Verify the 15-turn train-defense game — Patient Rail

**Verdict: PASS.** There are zero findings and zero untested or incomplete public claims.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire.

Fresh 1440 × 950 desktop and 390 × 844 phone contexts started at scroll position zero. Both showed the job, audience, sample action, first-action instruction, active board, and acting enemy cell inside the first viewport. The phone acting cell occupied y=752.6–796.6 and measured 44 × 44 px.

## Scope and candidate

- Live URL: <https://patient-rail.sociobot.in>
- Implementation reviewed: `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` (`fix: strengthen keyboard focus contrast`).
- Documentation baseline: `619cb5f723cb47d7f4e0fefc717bf4322ef414c9` (`docs: record focus contrast repair verification`).
- The documentation commit changes only the handoff and Lighthouse evidence. It does not change the product build.

The live JavaScript SHA-256 was `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a`; the live CSS SHA-256 was `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a`. Both exactly matched a clean production build of the implementation candidate.

## Clean checkout and claims

A separate clone at `619cb5f` used Node.js 22.23.2, npm 10.9.8, and Playwright 1.58.2.

- `npm ci`: passed with zero vulnerabilities.
- `npm test`: passed 7 engine tests and 27 Chromium tests.
- `npm run build`: passed and produced `dist/`.
- Production JavaScript: 32.45 KB raw and 10.76 KB gzip.
- Production CSS: 21.18 KB raw and 5.50 KB gzip.
- The full 7-engine/27-browser suite also passed against live HTTPS.

Every command declared in `.factory/claims.json` was run separately from the clean checkout and passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The fixed sample reached Route complete after 15 shown-intent Fire actions. |
| `loss-restart` | Pass | Eleven Hold position actions reached Train stopped; restart restored turn 1 and full cars. |
| `finishable-seeds` | Pass | All 108 reachable car-order, enemy-family, and weather configurations won in 15 turns. |
| `demo-isolation` | Pass | Sample play and reset left a seeded daily-storage value byte-for-byte unchanged. |
| `local-privacy` | Pass | Sample play and settings changes contacted only the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily run reloaded and advanced with networking disabled. |
| `keyboard-play` | Pass | All 49 unique cell names, Tab, four arrows, Enter, Space, B, W, and focus recovery passed. |
| `resume-progress` | Pass | Daily seed, turn, train state, and log persisted through reload. |
| `settings-persist` | Pass | The coordinate setting persisted through reload. |
| `invalid-no-turn` | Pass | Empty and full-car choices left turn 1 unchanged and explained why. |
| `seed-variation` | Pass | Dated configurations varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Purchase stayed disabled, activation disclosed its limit, and no billing request occurred. |

Each claim ID has exactly one matching `@claim:` test. Live copy, route metadata, the README, and the planned offer were cross-checked. No material claim is missing from the list. The US$8 archive is explicitly planned and unavailable; its current no-purchase state is covered by `billing-pending`.

## Earlier finding disposition

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| V1-1: 404 CSP error | `GET /404` returned the deliberate 404, loaded its same-origin stylesheet, and logged no CSP error. | Closed |
| V1-2: phone did not show a usable board | The 390 × 844 first viewport showed a fully visible 44 × 44 px acting cell that advanced the turn without scrolling. | Closed |
| V1-3: universal seed wording sampled only dates | The claim check exhausted all 108 reachable tactical configurations. | Closed |
| V2-1: phone targets below 44 px | The live suite measured visible targets across nine routes and the settings dialog; none was undersized. | Closed |
| V3-1: nested complementary landmark | Live axe checks reported zero violations on all seven application routes. | Closed |
| V3-2: untested 20-minute claim | Public copy uses the tested 15-turn shape and says no timer sets duration. | Closed |
| V3-3: incomplete keyboard and spoken-label proof | The claim covers every advertised key, focus recovery, and all 49 unique spoken cell labels. | Closed |
| R1-1: focus indicator below 3:1 | The live outcome regression and manual checks passed on cream, navy, mustard, and the static 404. | Closed |

The repaired focus style rendered a 3 px cream outline plus a 3 px dark-teal band on all three checked surfaces. Dark teal against cream measured 7.02:1, cream against navy measured 13.68:1, and dark teal beside mustard measured 3.65:1. Fresh captures are [paper focus](evidence/verification-5/focus-paper.png), [navy focus](evidence/verification-5/focus-navy.png), and [404 focus](evidence/verification-5/focus-404.png).

## Live game and recovery checks

- One click opened `/demo` with `SAMPLE-EMBER-7`, three populated train cars, three named stops, visible enemies, and one exact enemy intent.
- The persistent demo label remained after an action. Reset restored turn 1 and the fixed seed while a daily sentinel remained unchanged. Leaving the sample removed the demo key.
- Fifteen Fire actions reached Route complete with 13 train integrity, 10 threats cleared, 15 turns used, and 3 brake tokens.
- Eleven Hold position actions reached Train stopped. Restart restored turn 1, the first intent, and all three cars to 5/5.
- Empty-cell and full-car actions kept the run on turn 1 and announced why. Damaged saved state, daily reload recovery, and browser-history recovery passed in the live suite.
- Fresh evidence: [desktop first screen](evidence/verification-5/fresh-desktop-first-screen.png), [phone first screen](evidence/verification-5/fresh-phone-first-screen.png), [win screen](evidence/verification-5/sample-win.png), and [loss screen](evidence/verification-5/sample-loss.png).

## Accessibility, privacy, routes, and performance

- Live axe checks found zero violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`.
- Keyboard play covered Tab, four arrow keys, Enter, Space, B, and W. The board exposed 49 unique action labels. The settings dialog focused its close button, kept Tab inside, and returned focus to Board settings.
- Reduced motion produced a `0.00001s` transition. At 200% root text size and 390 px width, the page had no body overflow and retained the heading and board.
- All checked visible phone targets were at least 44 × 44 px. Route changes updated the title, moved focus to the new `h1`, and worked with browser Back.
- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` returned 200 with distinct titles, one `h1`, and one `main`. All discovered HTTP links returned 200; both contact links were explicit `mailto:` links.
- `GET /404` deliberately returned HTTP 404 with the designed cream ticket and working recovery link. Its expected failed-resource console message is not a defect. Arbitrary SPA paths showed the app’s designed not-found page.
- The license return boundary at `/license?purchase=complete` did not activate ownership and showed the pending-validation warning.
- Sample and daily state used separate local-storage namespaces. Recorded game traffic stayed on `https://patient-rail.sociobot.in`. There is no backend, tenant, health, restart-persistence, or rate-limit surface, so backend and 429 checks do not apply.
- Offline reload and play passed in a dedicated fresh context. No separate update behavior is advertised.
- The factory URL check found the correct title and language, one `h1`, one `main`, no missing alternatives, no unlabeled buttons, and no console errors on `/`.
- Fresh mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 s, total blocking time 50 ms, CLS 0.049, and transfer size 83 KiB. The report is [lighthouse-mobile.json](evidence/verification-5/lighthouse-mobile.json).
- A fresh 3.02-second phone sample delivered 181 frames at 60.0 fps with a 16.8 ms maximum interval. The product makes no frame-rate claim, and game rules do not depend on animation.

## Disclosed dependency

The free daily game and sample are complete. The US$8 offline/archive offer remains disabled until the separate billing operator registers it and entitlement validation is implemented. The archive, activation, and terms pages state this limit; no checkout request occurs. This disclosed external dependency is not a finding in the available free game.

## Counts

- Findings: 0
- Untested or incompletely tested public claims: 0
- Verdict: **PASS**
