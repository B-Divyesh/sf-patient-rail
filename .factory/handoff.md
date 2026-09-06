# Patient Rail handoff

## Outcome

Patient Rail is a complete first-release browser game at <https://patient-rail.sociobot.in>. The active 7 by 7 board appears on the first screen. Each 15-turn run has three stops, one player action per turn, one visible enemy intent, seeded train layouts, seeded enemy families, and a final weather rule.

Implementation deployed: `78effd5584066428b9a838540e06546e8eb89c56`.

The repository started at scaffold `0060755e0f61082e429edde918b0d52e3cf511c6`. It contained no game, design file, tests, or substantive earlier handoff. No earlier review findings were present to carry forward.

## Delivered

- Daily UTC seed and fixed sample seed `SAMPLE-EMBER-7`.
- Fire, Patch, limited Brace, and Hold position actions.
- Win, loss, and restart paths with a visible turn log and run summary.
- Deterministic generator for car order, route names, enemy families, and weather.
- Saved daily progress, isolated sample storage, damaged-save recovery, and persistent board settings.
- Arrow-key grid movement, Enter and Space activation, B and W shortcuts, cell action labels, live status text, and designed focus states.
- Responsive desktop and 390 px phone layouts with 44 px board targets.
- Same-origin service worker for offline reload after the first online visit.
- Real routes for demo, rules, archive, activation status, privacy, and terms.
- A designed `/404` response with HTTP 404 status.
- Self-hosted IBM Plex Sans and IBM Plex Mono assets.
- Original cut-paper CSS/SVG artwork and raster social/touch exports.
- Exact US$8 one-time offline archive metadata for the billing operator.

## Verification

Clean checkout verification used Node.js 22 and npm 10:

```sh
npm ci
npm test
npm run build
```

Results:

- Unit tests: 6 passed.
- Browser, claim, route, mobile, recovery, and accessibility tests: 24 passed.
- Every one of the 12 commands in `.factory/claims.json` passed separately from the clean checkout.
- Finishability: 366 dated seeds reached a win in 15 turns by firing on each shown intent.
- Sample win: 15 actions, 10 threats cleared, 13 integrity left.
- Sample loss: 11 Hold position actions, then a train car reached zero.
- Restart returned the sample to turn one, full integrity, three brake tokens, and the opening intent.
- Axe found no serious or critical issue on `/`, `/demo`, `/how-to-play`, `/archive`, `/license`, `/privacy`, or `/terms`.
- `verify-url.sh` found one title, `lang="en"`, one main landmark, one h1, no missing alt text, no unlabeled buttons, and no console errors.
- Live `/404` returned HTTP 404 and the designed recovery page. All named routes, robots, sitemap, manifest, and social image returned 200.
- The deployed JavaScript SHA-256 matched the local production artifact.
- Dependency audit reported zero vulnerabilities.

Live mobile Lighthouse results:

- Performance: 97
- Accessibility: 100
- Best practices: 100
- SEO: 100
- FCP: 1.2 s
- LCP: 1.2 s
- CLS: 0.097
- Total blocking time: 0 ms
- Initial transfer: 84,389 bytes; JavaScript 11,133 bytes; fonts 61,060 bytes

A 390 by 844 browser with 4× CPU throttling produced 120 frames in 1,999.9 ms: 60.0 frames per second with a 16.8 ms maximum frame interval. Gameplay itself is turn-based and does not depend on animation.

Evidence is in `.factory/evidence/`: desktop and phone first screens, win and loss end screens, run summary, Lighthouse JSON, and local/live verifier output.

## Privacy and operations

There is no backend, account, telemetry, third-party script, or runtime model call. Game state is limited to namespaced browser local storage. The sample uses `demo:patient-rail:run:v1`; daily keys use `patient-rail:daily:*`. The live CSP restricts scripts, styles, fonts, images, connections, workers, and forms to the product origin.

The deployment used only `sf-patient-rail`, in Central US, with the factory static deployment path. No shared service, database, secret, staging slot, or unrelated resource was read or changed.

## Known dependency

The one-time offline/archive offer is not registered. Purchase, entitlement validation, archive date selection, and activation remain unavailable and are labeled that way in the product. The free daily game and fixed sample are complete.

The separate billing operator can use `/work/.evidence/billing-offer.json`. It defines `patient-rail-offline-archive`, US$8 once, the exact return URL, paid features, and `/license` validation route. A checkout redirect must not unlock the archive without verified entitlement.

## Next steps

1. Register the one-time offer through the Sociobot billing operator.
2. Add the documented entitlement validation call to `/license` after the operator provides the registered contract.
3. Re-test checkout, signed entitlement, restore purchase, and offline dated-seed selection before advertising activation.
4. Measure the brief’s completion and return-rate goals only if a future privacy-preserving, consented measurement plan is approved.
