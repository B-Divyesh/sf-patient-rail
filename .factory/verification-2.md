# Verify the turn-based train-defense game — Patient Rail

**Verdict: FAIL.** One medium finding remains. No public claim is untested or incompletely tested.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable 20-minute daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire. The first screen also shows the active board and a one-click **Try it with sample data** action.

## Scope

- Live URL: <https://patient-rail.sociobot.in>
- Implementation candidate: `0b56f836fbb81d7dfaaa7a5bf67464455336d640`
- Documentation and test-harness commit: `36afc80eef6b4473463ac21a9f92ca4237cee690`
- `36afc80` changes the handoff and the live-compatible 404 test. It does not change the shipped application or production build.
- Verification date: 6 September 2026.

## Finding

### V2-1 — Medium — several phone touch targets are below 44 by 44 pixels

At 390 by 844, automated measurement of every visible interactive element found several secondary actions below the required 44-pixel target height:

- **Reset demo:** 89 by 38 pixels.
- **Read all rules and keyboard controls:** 358 by 24 pixels.
- **Read the privacy details:** 174 by 20 pixels.
- Footer **Privacy**, **Terms**, and **Built by Param Factory** links: 21 pixels high.
- **Check archive activation status:** 227 by 20 pixels.
- Privacy and support email links: 20 pixels high.

The primary action, board cells, settings control, turn controls, and header navigation meet the target size. The undersized links remain operable, but they do not meet the attached accessibility and design contract requiring every touch target to be at least 44 by 44 CSS pixels.

## Earlier findings

All three findings from `.factory/verification-1.md` are closed:

- **V1, 404 CSP — closed.** Live `/404` returned HTTP 404. `/404.css` loaded from the same origin. Computed backgrounds were navy `rgb(16, 42, 67)` and cream `rgb(255, 247, 223)`. No CSP error occurred. Chromium logged only the expected failed-resource message for the deliberate 404 response.
- **V2, phone first viewport — closed.** In a fresh 390 by 844 touch context at scroll position zero, the intent cell occupied x=126–170 and y=752.6–796.6. It was fully visible, measured 44 by 44 pixels, advanced the run to turn 2 when tapped, and did not move the page scroll position.
- **V3, universal dated-seed proof — closed.** The finishability test enumerated all 108 tactical configurations: six car orders, six enemy-family orders, and three weather rules. The safe Fire route won each configuration in 15 turns with every car above zero integrity. Route labels do not affect play.

## Clean checkout and claim results

A fresh clone of `main` resolved to `36afc80eef6b4473463ac21a9f92ca4237cee690`. The documented environment was Node.js 22.23.2 and npm 10.9.8.

- `npm ci`: passed; 0 vulnerabilities.
- `npm test`: passed; 7 engine tests and 25 Chromium tests.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.43 KB raw, 10.78 KB gzip.
- Production CSS: 21.05 KB raw, 5.47 KB gzip.

Each command in `.factory/claims.json` was then run separately and passed:

| Claim | Result | Evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | Fixed sample reached **Route complete** after 15 visible-intent actions. |
| `loss-restart` | Pass | Holding position reached **Train stopped**; restart restored turn 1. |
| `finishable-seeds` | Pass | All 108 tactical configurations won in 15 turns. |
| `demo-isolation` | Pass | Sample action and reset left all daily keys byte-for-byte unchanged. |
| `local-privacy` | Pass | Play and settings requests stayed on the product origin. |
| `offline-reload` | Pass | A controlled daily page reloaded and accepted a turn while offline. |
| `keyboard-play` | Pass | Arrow navigation and B resolved one turn and retained board focus. |
| `resume-progress` | Pass | Seed, turn, car integrity, and log survived reload. |
| `settings-persist` | Pass | The coordinate preference survived reload. |
| `invalid-no-turn` | Pass | Empty-cell and full-car choices kept the run at turn 1 and announced why. |
| `seed-variation` | Pass | Forty dated seeds varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Purchase stayed disabled; no billing API request occurred. |

Every claim ID has exactly one matching `@claim:<id>` test. Cross-checking the live copy and README found no unlisted material claim.

## Live game evidence

The full suite also passed against live HTTPS: 7 engine tests and 25 browser tests.

- Fresh desktop: one h1, one main landmark, `lang="en"`, the correct title, the active 7 by 7 board, the audience, and the first action were visible before scrolling. No console or page error occurred.
- Fresh phone: the job, audience, sample action, three facts, board heading, route state, and actionable intent cell appeared before scrolling. There was no body-width overflow.
- Sample entry: one click opened `/demo`, seed `SAMPLE-EMBER-7`, three populated train cars, named stops, and a concrete enemy intent. The persistent banner said **Demo — sample run, nothing is saved to your daily game**.
- Sample reset: after one move, **Reset demo** restored turn 1 and announced that daily progress was not changed. Daily storage was unchanged.
- Win: 15 Fire actions reached **Route complete** with 10 threats cleared, 15 turns used, 3 brake tokens, and 13 total train integrity. The current win screenshot remains `.factory/evidence/sample-win.png`; an independent fresh rendering matched it.
- Loss: 11 Hold position actions reached **Train stopped** with the engine at zero integrity. The current loss screenshot remains `.factory/evidence/sample-loss.png`; an independent fresh rendering matched it.
- Restart: **Restart sample** returned to turn 1 and the opening state.
- Settings dialog: focus moved to **Close board settings**, both controls had labels, and close returned focus to **Board settings**.
- Keyboard and screen reader labels: every board cell exposes coordinate, piece, health or integrity, next-intent state, and available action. Arrow keys and B were exercised live.
- Reduced motion: the automated live test reported effectively zero transition duration.
- Recovery and boundaries: damaged saved JSON recovered with an explanation; invalid actions did not spend a turn; reload restored valid daily progress; win, loss, and restart boundaries passed.
- Frame cadence: a fresh 390 by 844 Chromium sample recorded 181 frames over 2,999.9 ms, averaging 60.0 fps with a 16.8 ms maximum interval. The game is turn based and does not depend on animation. No frame-rate claim is advertised.

## Accessibility, routes, privacy, and performance

- Axe found no serious or critical violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`.
- The factory `verify-url.sh` passed: load 793 ms, one title, `lang="en"`, one h1, one main, no missing alt text, no unlabeled buttons, and no console errors.
- All named product routes, `robots.txt`, `sitemap.xml`, the manifest, social card, and the external Param Factory link returned 200. `/404` deliberately returned 404. The SPA fallback showed the designed not-found screen.
- Every named route had its own plain title, one h1, and one main landmark. Browser history and route focus passed.
- Live response headers included the same-origin CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- Live requests during play and a settings change stayed on the product origin. There is no backend, account, telemetry, runtime model call, or shared database. Backend tenant, health, restart-persistence, and 429 checks do not apply.
- The daily game reloaded and played offline after one online visit. No separate update behavior is advertised.
- Fresh Lighthouse: mobile 99 performance, 100 accessibility, 100 best practices, and 100 SEO; desktop scored 100 in all four categories. Mobile LCP was 1.2 s, total blocking time 40 ms, and CLS 0.069.
- The live `index-DSD14DYL.js` SHA-256 was `349f5cd3760706d5496fff33900bcbe4e1d533c294bde9d96245599537fe8a21`, exactly matching the clean production build.

## Paid offer disposition

The US$8 one-time offline/archive offer remains visibly unavailable because billing registration has not occurred. The archive and activation routes explain this, the purchase button is disabled, and no checkout or billing request is made. This is an accurately disclosed external dependency, not a defect in the free daily game.

## Counts

- Findings: 1
- Untested or incompletely tested public claims: 0
- Verdict: **FAIL**
