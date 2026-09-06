# Patient Rail

Patient Rail is a 7 by 7 turn-based train-defense game for roguelike players who want a readable 20-minute daily run. You take one action, watch the single shown enemy intent resolve, and keep three train cars intact across three five-turn stops.

Play: <https://patient-rail.sociobot.in>  
Sample: <https://patient-rail.sociobot.in/demo>

## What ships

- One free UTC daily seed with a visible seed code.
- Seeded car order, enemy families, route names, and final weather.
- Fire, Patch, Brace, and Hold position actions.
- Keyboard board movement and spoken labels for every cell.
- Local run recovery after reload.
- A fixed sample stored separately from daily progress.
- A win screen, loss screen, and one-action restart.

A full run is 15 turns and is intended to take about 20 minutes when decisions are considered. The automated finishability check plays 366 dated seeds to a win by responding to the shown intent. It does not assert that every possible player choice wins.

## Offline archive offer

The free daily run is complete. The one-time offline archive offer costs US$8 and adds dated-seed selection plus saved offline routes. Purchase, entitlement validation, and activation are not available until the separate billing operator registers the offer. No checkout redirect is treated as ownership.

Public offer metadata is in `.factory/billing-offer.json`. The future activation route is `/license`.

## Privacy

Runs and settings stay in browser local storage. Playing sends no game or personal data off the product origin. The sample uses the `demo:patient-rail:*` namespace and never reads or writes daily run keys. The service worker caches same-origin files so the daily game can reload offline after one online visit.

See `/privacy` and `/terms` for the public policies.

## Clean setup

Requirements: Node.js 22 and npm 10.

```sh
git clone https://github.com/B-Divyesh/sf-patient-rail.git
cd sf-patient-rail
npm ci
npm test
npm run build
```

`npm test` runs deterministic engine tests and Playwright browser tests. The browser version is pinned to Playwright 1.58.2. The build writes the static product to `dist/`.

Run individual claim checks with the exact commands in `.factory/claims.json`. For example:

```sh
npm test -- --grep @claim:complete-seeded-run
npm test -- --grep @claim:offline-reload
```

## Local development

```sh
npm run dev
```

For the production build:

```sh
npm run build
npm run preview
```

## Deploy

Deploy the contents of `dist/` as a static site. The repository includes `staticwebapp.config.json`, a service worker, security headers, SPA fallbacks, and a designed HTTP 404 response. Factory deployment owns DNS and infrastructure.

## Product boundaries

Patient Rail has no real-time combat, multiplayer, account progression, procedural story generation, ads, analytics, or gambling mechanics. Game state does not need a backend or shared database.

The visual system and original asset provenance are in `.factory/design.md`. Verification and remaining dependencies are in `.factory/handoff.md`. The project is MIT licensed.
