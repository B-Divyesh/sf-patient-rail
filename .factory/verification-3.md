# Verify the turn-based train-defense game — Patient Rail

**Verdict: FAIL.** Three findings remain. Two public claims are untested or incompletely tested. A PASS requires zero findings at every severity and zero untested claims.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire. Fresh phone and desktop pages also showed the active board and **Try it with sample data** before scrolling.

## Scope

- Live URL: <https://patient-rail.sociobot.in>
- Implementation candidate: `8231d0bff1695ee72d8d8a805c90f36d304d39d7`
- Documentation baseline: `632b3ca4c0caa56cb90b254ca6d8df2844c9bc04`
- Verification date: 6 September 2026.
- The documentation baseline differs from the implementation only in `.factory` reports and evidence. The deployed JavaScript and CSS hashes exactly match a clean production build of the candidate.
- The product is static and has no backend. Tenant isolation, server restart persistence, health, and 429/`Retry-After` checks do not apply.

## Findings

### V3-1 — Medium — the current-turn aside is a nested complementary landmark

Axe reports `landmark-complementary-is-top-level` with moderate impact on both `/` and `/demo`. The affected element is `<aside class="turn-panel" aria-label="Current turn">` inside `<main>`.

The turn panel is part of the game’s primary content, not content complementary to the main landmark. Change it to a non-complementary section or move the complementary landmark outside `main`. Evidence: `.factory/evidence/verification-3/axe-details.json`.

### V3-2 — Medium — the public 20-minute duration has no declared claim test

The first screen calls this a “20-minute daily run,” and the README repeats that duration. `.factory/claims.json` has no entry for it, and no test measures the stated duration.

This is a quantitative public claim under the claims contract. Either replace it with a directly proven description such as “15-turn daily run,” or list it and add an appropriate measurement. This counts as one untested public claim.

### V3-3 — Medium — the keyboard and spoken-label claim test covers only part of the advertised controls

The rules advertise Arrow keys, Enter, Space, B, W, and a spoken action label for every cell. The sole `@claim:keyboard-play` test presses ArrowRight and B, then checks that a turn resolved and some board cell remains focused. It does not assert the changed arrow destination, Enter, Space, W, or the presence and content of all 49 cell labels.

Fresh manual live checks found the current implementation working: Enter and Space fired, W held position, B braced, arrow navigation retained a labeled cell, and all 49 cells had action labels. The finding is the incomplete automated proof required for the public claim, not a current runtime failure. This counts as one incompletely tested public claim.

## Earlier finding disposition

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| V1-1, 404 CSP error | `GET /404` returned 404; `/404.css` applied navy and cream styling; no CSP error occurred. | Closed |
| V1-2, phone first view hid the board | At 390 × 844 and scroll position 0, the acting cell occupied y=752.6–796.6 and measured 44 × 44 px. | Closed |
| V1-3, universal seed claim sampled dates | The test enumerated all 108 reachable combinations of six car orders, six enemy-family orders, and three weather rules. Every safe Fire route won in 15 turns. | Closed |
| V2-1, undersized phone targets | Fresh measurement found 181 visible targets across nine routes, with zero below 44 × 44 CSS px. | Closed |

## Clean checkout and declared claims

A clean clone of `632b3ca` used Node.js 22.23.2, npm 10.9.8, and the pinned Playwright 1.58.2 browser.

- `npm ci`: passed with zero vulnerabilities.
- `npm test`: passed with 7 engine tests and 26 Chromium tests.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.43 KB raw, 10.78 KB gzip.
- Production CSS: 21.14 KB raw, 5.50 KB gzip.
- Every one of the 12 commands in `.factory/claims.json` was run separately and exited successfully.
- The full suite also passed against live HTTPS: 7 engine tests and 26 browser tests.

| Claim | Result | Evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The sample reached **Route complete** after 15 displayed-intent Fire actions. |
| `loss-restart` | Pass | Hold position reached **Train stopped** after 11 actions; restart restored turn 1. |
| `finishable-seeds` | Pass | All 108 reachable tactical configurations won in 15 turns. |
| `demo-isolation` | Pass | A sample action and reset left seeded daily storage byte-for-byte unchanged. |
| `local-privacy` | Pass | Play and a settings change contacted only the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily page reloaded and accepted an action offline. |
| `keyboard-play` | Incomplete — V3-3 | The command covers ArrowRight and B, but not every advertised key or all spoken cell labels. |
| `resume-progress` | Pass | Seed, turn, integrity, and log survived reload. |
| `settings-persist` | Pass | The coordinate preference survived reload. |
| `invalid-no-turn` | Pass | Empty-cell and full-car choices kept the run at turn 1 and announced why. |
| `seed-variation` | Pass | Forty dated seeds varied car order, enemy family order, and all three weather rules. |
| `billing-pending` | Pass | Purchase stayed disabled, the limitation was clear, and no billing request occurred. |
| Unlisted 20-minute duration | Untested — V3-2 | No claim entry or duration measurement exists. |

Each listed claim ID has exactly one matching test tag. The command success does not override the two coverage findings above.

## Live game evidence

- Fresh phone and desktop contexts started at scroll position zero. Both showed the job, audience, sample action, active board, and acting enemy cell.
- One click opened `/demo` with seed `SAMPLE-EMBER-7`, three full train cars, named stops, and the concrete first intent: Copper beetle attacks Engine for 1; Brace blocks 1.
- The persistent sample label remained after play. **Reset demo** restored turn 1 and did not change a seeded daily key.
- Fifteen Fire actions reached **Route complete** with 10 threats cleared, 15 turns used, 3 brake tokens, and 13 train integrity.
- Eleven Hold position actions reached **Train stopped** with zero Engine integrity. Restart after either result restored turn 1 and all three cars to 5/5.
- Invalid empty-cell and full-car choices did not spend a turn. Damaged saved JSON recovered to a new run with an explanation. Daily progress resumed after reload.
- The settings dialog received focus on open and returned focus to **Board settings** on close. Reduced-motion mode reduced transitions and animations to `0.00001s`.
- A fresh 390 × 844 sample recorded 181 frames over 2,999.9 ms: 60.0 fps with a 16.8 ms maximum interval. No frame-rate claim is advertised, and game rules do not depend on animation.

Screenshots: [phone first screen](evidence/verification-3/phone-first-screen.png), [desktop first screen](evidence/verification-3/desktop-first-screen.png), [win screen](evidence/verification-3/sample-win.png), and [loss screen](evidence/verification-3/sample-loss.png). Structured observations are in [live-verification.json](evidence/verification-3/live-verification.json).

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` returned 200 with route-specific titles, one `h1`, and one `main`. The app fallback rendered its designed not-found page. `GET /404` deliberately returned 404 with a working recovery link.
- All discovered HTTP links and all public metadata assets returned 200. The two email links used `mailto:` as expected.
- The factory URL verifier passed with a 727 ms load, correct title and language, one `h1`, one `main`, no missing image text alternatives, no unlabeled buttons, and no console errors.
- Axe found no serious or critical violations on all routes, but the moderate landmark issue in V3-1 remains on both game routes.
- The phone layout had no horizontal overflow. A 200% root text-size check also retained a 390 px document width and visible main content.
- All 181 measured phone targets were at least 44 × 44 CSS px.
- Requests during sample play and a settings change stayed on `https://patient-rail.sociobot.in`. Storage contained only the demo run key and board settings in that clean context.
- The daily game loaded, reloaded, and advanced to turn 2 after networking was disabled. No separate update behavior is advertised.
- Fresh Lighthouse mobile scores: 97 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.2 s, TBT 140 ms, and CLS 0.069.
- Live JavaScript SHA-256: `8e17c71b6883cbfeb9c0c1a32601cdd26ff68192f9877c1fbc10b680af5ddbdd`.
- Live CSS SHA-256: `09e267c81239c9974c7e0bc32589242434f7b3994840282ab9634f31fea64cf3`.
- Both hashes exactly matched the clean `dist/` build from implementation `8231d0b`.

## Billing dependency

The US$8 archive remains unavailable because offer registration and entitlement validation have not occurred. The live archive, activation, and terms pages disclose that state; purchase is disabled and no checkout request occurs. This accurately disclosed external dependency is not counted as a product defect.

## Counts

- Findings: 3
- Untested or incompletely tested public claims: 2
- Verdict: **FAIL**
