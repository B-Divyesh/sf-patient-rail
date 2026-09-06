# Review the 15-turn train-defense game — Patient Rail

**Verdict: FAIL.** One medium finding remains. One public claim is incompletely tested. A PASS requires zero findings and zero untested or incompletely tested claims.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire.

Fresh production contexts at 1440 × 950 and 390 × 844 began at scroll position zero. Both showed the job, audience, sample action, first action, active board, and acting enemy without scrolling. The visible phone acting cell was usable and the live phone layout had no horizontal overflow.

## Scope and candidate

- Live URL: <https://patient-rail.sociobot.in>
- Implementation reviewed: `adf1a708d2e978f2a17aa2e5e3fd29516b8268c8` (`fix: strengthen keyboard focus contrast`).
- Documentation commit reviewed: `2851d520f0260acb5c38c9bdfae4f1338821b345` (`docs: record strict review 2`).

Every commit after the implementation candidate changes only `.factory` reports or evidence. A clean production build matched live exactly:

| Asset | SHA-256 |
| --- | --- |
| JavaScript | `7dbe137f2d97b069230fd906dd12e5b62776599b4be73d397c4f859a89447a8a` |
| CSS | `b2c9f7dc48d5766d628baec506d4a2a4ea9cba6d7e552d6e6306b54d7701390a` |

The clean bundle was 10.69 KB gzip JavaScript and 5.49 KB gzip CSS.

## Finding

### R3-1 — Medium — the published settings-persistence claim is only partly covered

The Board settings dialog has two choices—**Show cell coordinates** and **Use a heavier intent outline**—and says, “These settings are saved in this browser.” The single declared `settings-persist` claim is narrower (“Board coordinate settings persist in this browser”) and its tagged test only unchecks and verifies coordinate labels after reload. It never changes or verifies the heavier intent-outline setting.

The live feature works: in a fresh `/demo` context, the heavier intent outline changed from `true` to `false`, remained `false` after reload, and reopened unchecked. That manual result does not satisfy the claims contract: the broader visitor-facing statement needs a declared, tagged observable test covering both settings (or the UI copy must be narrowed to the tested coordinate setting). Until then, the claim is incompletely tested.

## Clean checkout and declared claims

A new clone of the assigned repository used the documented Node.js 22 / npm 10 setup. `npm ci` completed with zero vulnerabilities. `npm test` completed its 7 deterministic engine tests and 27 Chromium tests, and `npm run build` completed with `dist/` output.

Each command in `.factory/claims.json` was run separately. All 12 commands exited successfully, but the coverage issue above means `settings-persist` cannot clear the broader UI claim.

| Claim ID | Command result | Review disposition |
| --- | --- | --- |
| `complete-seeded-run` | Pass | Covered: sample reached Route complete in 15 Fire actions. |
| `loss-restart` | Pass | Covered: 11 Hold position actions lost; restart restored turn one and full cars. |
| `finishable-seeds` | Pass | Covered: all 108 reachable configurations won by the safe route. |
| `demo-isolation` | Pass | Covered: sample/reset left daily storage unchanged. |
| `local-privacy` | Pass | Covered: demo play and settings contacted only the product origin. |
| `offline-reload` | Pass | Covered: service-worker-controlled daily run reloaded and advanced offline. |
| `keyboard-play` | Pass | Covered: 49 cell labels and Tab, arrows, Enter, Space, B, W. |
| `resume-progress` | Pass | Covered: daily state survived reload. |
| `settings-persist` | Pass | **Incomplete:** verifies coordinates only, not both stated settings. |
| `invalid-no-turn` | Pass | Covered: empty and full-car choices used no turn. |
| `seed-variation` | Pass | Covered: dated seeds varied all three rule groups. |
| `billing-pending` | Pass | Covered: purchase/activation disabled with no checkout request. |

## Live game loop and recovery

The full live suite passed: 7 engine tests and 27 Chromium tests. Fresh live capture of `/demo` recorded the persistent label “Demo — sample run, nothing is saved to your daily game,” then:

- Fire on the shown intent for 15 actions: **Route complete**, three stops complete, 13 train integrity, 10 threats cleared, 15 turns, and 3 brake tokens.
- Hold position for 11 actions: **Train stopped**, 0 threats cleared, 11 turns, and 3 brake tokens.
- Restart sample: restored the opening state in one action.

The suite also covered reset isolation, daily reload recovery, malformed saved-data recovery, invalid actions, reduced motion, dialog focus, 200% text behavior, keyboard focus recovery, and the current offline reload behavior. The sample label persisted throughout play and reset; a seeded daily-storage sentinel was unaffected.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| V1-1: 404 CSP error | Closed. The deliberate HTTP 404 loads its same-origin stylesheet under CSP with no CSP console error. |
| V1-2: phone board not usable in first viewport | Closed. Fresh 390 × 844 context showed and used the active 44 px cell without scrolling. |
| V1-3: dated-seed claim sampled only calendar dates | Closed. The deterministic test exhausts all 108 reachable tactical configurations. |
| V2-1: undersized phone targets | Closed. Live route/settings target checks passed at 390 px. |
| V3-1: nested complementary landmark | Closed. Live axe checks report zero violations on all seven application routes. |
| V3-2: untested 20-minute promise | Closed. Public copy describes the tested 15-turn structure and no timer. |
| V3-3: incomplete advertised-key and spoken-label proof | Closed. The tagged claim checks every advertised key, focus recovery, and all 49 unique labels. |
| R1-1: focus contrast below 3:1 | Closed. Live regression passed the paper, navy, mustard, and static 404 treatments. |

R3-1 is new and does not reopen those closed findings.

## Accessibility, routes, privacy, and boundaries

- Live axe integration passed with zero violations on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms`; each has one `main` and one `h1`.
- The requested standalone `npx @axe-core/cli` invocation could not start because its installed ChromeDriver supports Chrome 152 while the supplied Playwright Chromium is 145. The configured Playwright axe integration ran the same audit successfully across every application route, so this environment mismatch leaves no untested accessibility claim.
- Live route statuses were 200 for `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, `/terms`, metadata files, and the SPA not-found route. `/404` deliberately returned 404 and displayed the designed recovery page.
- Live headers include CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`. The CSP is same-origin and includes `frame-ancestors` as a response header.
- No backend, account, tenant, SQLite, health, or rate-limit surface exists for this static local-storage game; backend persistence and 429 checks do not apply. The live privacy test observed only product-origin requests for the demo action and settings flow.
- The archive’s US$8 purchase and activation remain plainly unavailable; the tested disabled state makes no billing request. This is a disclosed dependency, not the finding above.

## Counts

- Findings: 1
- Untested or incompletely tested public claims: 1
- Verdict: **FAIL**
