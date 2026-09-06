# Review the 15-turn train-defense game — Patient Rail

**Verdict: FAIL.** One medium finding remains. Zero public claims are untested or incompletely tested.

## Job, audience, and first action

- Job: defend three train cars for 15 turns across three route stops.
- Audience: roguelike players who want a readable daily run without real-time combat.
- First action before scrolling: choose the copper-marked enemy, then Fire.

Fresh 1440 × 950 desktop and 390 × 844 phone contexts started at scroll position zero. Both showed the job, audience, sample action, first-action instruction, active board, and acting enemy cell inside the first viewport.

## Scope and reviewed commits

- Live URL: <https://patient-rail.sociobot.in>
- Implementation reviewed: `09ec2c2f36dfd0951508dcc0957568973044726b`.
- Documentation baseline: `6a3f5ff6c77205dcf225765277072f6729344091`.
- Starting review commit: `34ed638062a2d7b09e0730c20e81dd2b4d4d2181`.
- Commits after the implementation change only `.factory` reports and evidence. They do not change product source or build output.

The live JavaScript SHA-256 is `090263dc0a898138cbab8f4fd6fc5ed9db7a164d2f90b47a2ea7fcfe2e97ac3c`. The live CSS SHA-256 is `09e267c81239c9974c7e0bc32589242434f7b3994840282ab9634f31fea64cf3`. Both exactly match a clean production build of the implementation candidate.

## Finding

### R1-1 — Medium — keyboard focus indicators fail the required 3:1 contrast on cream surfaces

The live site uses `outline: 4px solid #e3ac28` for general `:focus-visible` styling. On cream pages, that mustard outline has only **1.92:1** contrast against `#fff7df`. A fresh keyboard-focus check on the `/privacy` email link confirmed the live computed outline and adjacent colors.

The designed HTTP 404 has the same root problem in a stronger form. Its focused recovery link uses a cream outline against the same cream card, producing **1.00:1** contrast. The normal button border remains visible, but the keyboard focus change is not visually distinguishable.

This fails the attached accessibility requirement that the visible focus ring reach at least 3:1 contrast. Axe does not test focus-indicator contrast, so the zero-violation axe result does not close this finding. Use a focus treatment that reaches 3:1 against every adjacent surface, including cream content pages and the static 404.

Evidence: [focus contrast data](evidence/review-1/focus-contrast.json), [privacy focus capture](evidence/review-1/focus-privacy-link.png), and [404 focus capture](evidence/review-1/focus-404-link.png).

## Earlier finding disposition

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| V1-1: 404 CSP error | Live `/404` returned the expected 404, loaded `/404.css`, applied navy and cream styles, and logged no CSP error. The browser logged only the expected failed-resource message for the deliberate 404 response. | Closed |
| V1-2: phone first view hid the board | At 390 × 844, the acting cell occupied y=752.6–796.6, measured 44 × 44 px, and was fully visible before scrolling. | Closed |
| V1-3: universal seed wording sampled dates | The deterministic check enumerated all 108 reachable car-order, family-order, and weather configurations. Every safe Fire route won in 15 turns. | Closed |
| V2-1: undersized phone targets | The live suite measured visible controls across all nine checked routes and the settings dialog. None was below 44 × 44 CSS px. | Closed |
| V3-1: nested complementary landmark | Playwright axe reported zero violations, including moderate violations, on all seven application routes. The turn panel is no longer an `aside`. | Closed |
| V3-2: untested 20-minute claim | Public copy now says 15 turns and says no timer sets a duration. The 15-turn outcome is tested. | Closed |
| V3-3: partial keyboard and spoken-label proof | The claim test and live suite covered Tab, all four arrows, Enter, Space, B, W, focus recovery, and 49 unique spoken cell labels. | Closed |

R1-1 is a new focus-contrast finding. It does not reopen the earlier 404 CSP or touch-size issues.

## Clean checkout and claim commands

A clean clone of `34ed638` used Node.js 22.23.2, npm 10.9.8, and Playwright 1.58.2.

- `npm ci`: passed with zero vulnerabilities.
- `npm test`: passed 7 engine tests and 26 Chromium tests.
- `npm run build`: passed and created `dist/`.
- Production JavaScript: 32.45 KB raw and 10.76 KB gzip.
- Production CSS: 21.14 KB raw and 5.50 KB gzip.
- Every claim ID has exactly one matching `@claim:` test.
- The full 7-engine/26-browser suite also passed against the live HTTPS site.

Every command declared in `.factory/claims.json` was run separately from the clean checkout:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `complete-seeded-run` | Pass | The fixed sample reached **Route complete** after 15 shown-intent Fire actions. |
| `loss-restart` | Pass | Eleven Hold position actions reached **Train stopped**; restart restored turn 1 and full cars. |
| `finishable-seeds` | Pass | All 108 reachable tactical configurations won in 15 turns with every car above zero integrity. |
| `demo-isolation` | Pass | Sample play, reset, and exit left a seeded daily value byte-for-byte unchanged. |
| `local-privacy` | Pass | Sample play and settings changes contacted only the product origin. |
| `offline-reload` | Pass | A service-worker-controlled daily run reloaded and advanced with networking disabled. |
| `keyboard-play` | Pass | Tab, four arrows, Enter, Space, B, W, focus recovery, and all 49 unique spoken cell labels passed. |
| `resume-progress` | Pass | Seed, turn, train state, and log survived reload. |
| `settings-persist` | Pass | The coordinate setting survived reload. |
| `invalid-no-turn` | Pass | Empty-cell and full-car choices kept the run at turn 1 and explained why. |
| `seed-variation` | Pass | Dated seeds varied car order, enemy families, and all three weather rules. |
| `billing-pending` | Pass | Purchase stayed disabled, activation disclosed its limit, and no billing request occurred. |

Cross-checking live copy, route metadata, the README, and the pending offer found no unlisted material claim. The site does not advertise a frame-rate result. The US$8 archive is clearly described as planned and unavailable.

## Live game and recovery checks

- One click opened `/demo` with `SAMPLE-EMBER-7`, three train cars, three named stops, five visible enemies, and the concrete first intent.
- The demo label remained during play. Reset restored turn 1 and the first intent. **Start today’s run** discarded the demo key without changing the daily sentinel.
- Fifteen Fire actions reached **Route complete** with 10 threats cleared, 15 turns used, 3 brake tokens, and 13 total train integrity.
- Eleven Hold position actions reached **Train stopped**. Restart restored turn 1 and three cars at 5/5.
- Invalid empty and full-car choices did not use a turn. Damaged saved JSON started a new run with an explanation.
- Daily progress resumed at turn 2 after reload. The controlled page then reloaded offline and advanced to turn 3.
- The settings dialog focused its close button, returned focus to **Board settings**, and saved the coordinate preference.
- Reduced motion produced a `0.00001s` transition. At 200% root text size, the phone document remained 390 px wide.
- A phone sample recorded 181 frames over 3.01 seconds, averaging 59.8 fps with a 16.8 ms maximum gap. No rule depends on animation, and no frame-rate claim is public.

Fresh captures: [desktop first screen](evidence/review-1/desktop-first-screen.png), [phone first screen](evidence/review-1/phone-first-screen.png), [win screen](evidence/review-1/sample-win.png), and [loss screen](evidence/review-1/sample-loss.png). Structured results are in [live-review.json](evidence/review-1/live-review.json).

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, and `/terms` returned 200 with distinct titles, one `h1`, one `main`, and no console or page error.
- An arbitrary SPA path showed the designed app not-found screen. `/404` deliberately returned HTTP 404 with its styled recovery page. That status is expected, not a defect.
- Every discovered internal and external HTTP link returned 200. The privacy and support contacts are explicit `mailto:` links.
- `robots.txt`, `sitemap.xml`, the manifest, social card, favicon, touch icon, and 404 stylesheet returned 200. The social card is 1200 × 630.
- The factory URL check passed in 764 ms with the correct title and language, one `h1`, one `main`, no missing image alternatives, no unlabeled buttons, and no console errors.
- Playwright axe found zero violations on all seven application routes. R1-1 remains because axe does not test focus-indicator contrast.
- Live response headers include the same-origin CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- Fresh browser contexts sent requests only to `https://patient-rail.sociobot.in`. There is no account, analytics, external runtime script, model call, or backend.
- The only local storage observed during the demo check was the separate demo run, board settings, and the review’s seeded daily sentinel.
- Offline reload works after one online visit. No separate update behavior is advertised.
- Fresh Lighthouse mobile scores were 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.201 s, TBT 0 ms, CLS 0.049, and transferred content was 84.5 KB.
- This is a static browser game. Backend tenant isolation, server restart persistence, health, and 429/`Retry-After` checks do not apply.

## Counts

- Findings: 1
- Untested or incompletely tested public claims: 0
- Verdict: **FAIL**
