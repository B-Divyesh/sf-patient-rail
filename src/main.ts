import '@fontsource-variable/ibm-plex-sans/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './styles.css';
import {
  BOARD_SIZE,
  FAMILY_LABELS,
  STOP_COUNT,
  TURNS_PER_STOP,
  WEATHER_RULES,
  applyAction,
  createRun,
  dailySeed,
  intentText,
  isRunState,
  type Car,
  type CarKind,
  type Enemy,
  type GameAction,
  type Position,
  type RunState,
} from './engine';

type RouteName = 'home' | 'demo' | 'how-to-play' | 'archive' | 'license' | 'privacy' | 'terms' | 'not-found';

interface Settings {
  showCoordinates: boolean;
  strongIntent: boolean;
}

const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) throw new Error('App root was not found');
const app: HTMLDivElement = appElement;

const SETTINGS_KEY = 'patient-rail:settings:v1';
const DEMO_KEY = 'demo:patient-rail:run:v1';
const DEMO_SEED = 'SAMPLE-EMBER-7';
const BUILD_ID = 'v1.0.0';
const defaultSettings: Settings = { showCoordinates: true, strongIntent: true };

let run: RunState;
let settings = loadSettings();
let storageNotice = '';
let statusMessage = '';
let selectedCell: Position | null = null;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function routeForPath(pathname: string): RouteName {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const routes: Record<string, RouteName> = {
    '/': 'home',
    '/demo': 'demo',
    '/how-to-play': 'how-to-play',
    '/archive': 'archive',
    '/license': 'license',
    '/privacy': 'privacy',
    '/terms': 'terms',
  };
  return routes[normalized] ?? 'not-found';
}

function isDemoRoute(): boolean {
  return routeForPath(window.location.pathname) === 'demo';
}

function storageKey(): string {
  return isDemoRoute() ? DEMO_KEY : `patient-rail:daily:${dailySeed()}:v1`;
}

function seedForRoute(): string {
  return isDemoRoute() ? DEMO_SEED : dailySeed();
}

function loadSettings(): Settings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') as Partial<Settings> | null;
    return {
      showCoordinates: parsed?.showCoordinates ?? defaultSettings.showCoordinates,
      strongIntent: parsed?.strongIntent ?? defaultSettings.strongIntent,
    };
  } catch {
    return { ...defaultSettings };
  }
}

function loadRun(): RunState {
  const seed = seedForRoute();
  const key = storageKey();
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return createRun(seed);
    const parsed: unknown = JSON.parse(saved);
    if (isRunState(parsed, seed)) return parsed;
    localStorage.removeItem(key);
    storageNotice = 'Saved progress could not be read, so a new run was started.';
  } catch {
    localStorage.removeItem(key);
    storageNotice = 'Saved progress was damaged, so a new run was started.';
  }
  return createRun(seed);
}

function saveRun(): void {
  localStorage.setItem(storageKey(), JSON.stringify(run));
}

function saveSettings(): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function setRouteMetadata(route: RouteName): void {
  const metadata: Record<RouteName, { title: string; description: string; path: string }> = {
    home: {
      title: 'Patient Rail — turn-based train defense',
      description: 'Defend a train across three route stops in a readable, turn-based daily game.',
      path: '/',
    },
    demo: {
      title: 'Demo — Patient Rail',
      description: 'Play a fixed sample of the three-stop turn-based train-defense game.',
      path: '/demo',
    },
    'how-to-play': {
      title: 'How to play — Patient Rail',
      description: 'Learn the board, turn actions, enemy intent and win conditions in Patient Rail.',
      path: '/how-to-play',
    },
    archive: {
      title: 'Offline archive — Patient Rail',
      description: 'See the one-time offline archive offer for replaying dated Patient Rail seeds.',
      path: '/archive',
    },
    license: {
      title: 'Archive activation — Patient Rail',
      description: 'Check the current activation status for the Patient Rail offline archive.',
      path: '/license',
    },
    privacy: {
      title: 'Privacy — Patient Rail',
      description: 'Read what Patient Rail stores in your browser and how to delete it.',
      path: '/privacy',
    },
    terms: {
      title: 'Terms — Patient Rail',
      description: 'Read the play and purchase terms for Patient Rail.',
      path: '/terms',
    },
    'not-found': {
      title: 'Page not found — Patient Rail',
      description: 'The requested Patient Rail page was not found.',
      path: window.location.pathname,
    },
  };
  const current = metadata[route];
  document.title = current.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', current.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://patient-rail.sociobot.in${current.path}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', current.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', current.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://patient-rail.sociobot.in${current.path}`);
}

function header(): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Patient Rail home">
        <span class="wordmark-mark" aria-hidden="true"><span></span></span>
        <span>Patient Rail</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="/" data-nav>Daily run</a>
        <a href="/demo" data-nav>Demo</a>
        <a href="/how-to-play" data-nav>How to play</a>
        <a href="/privacy" data-nav>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `
    <footer class="site-footer">
      <p>Patient Rail is a turn-based daily train-defense game.</p>
      <nav aria-label="Footer navigation">
        <a href="/privacy" data-nav>Privacy</a>
        <a href="/terms" data-nav>Terms</a>
        <a href="https://sociobot.in">Built by Param Factory <span class="sr-only">(external site)</span></a>
      </nav>
      <p class="build-id">${BUILD_ID}</p>
    </footer>`;
}

function demoBanner(): string {
  if (!isDemoRoute()) return '';
  return `
    <aside class="demo-banner" aria-label="Demo status">
      <strong>Demo — sample run, nothing is saved to your daily game</strong>
      <span class="demo-actions">
        <button type="button" class="text-button" data-reset-demo>Reset demo</button>
        <a href="/" data-nav>Start today’s run</a>
      </span>
    </aside>`;
}

function pieceAt(position: Position): { car?: Car; enemy?: Enemy } {
  return {
    car: run.cars.find((car) => car.position.x === position.x && car.position.y === position.y),
    enemy: run.enemies.find((enemy) => enemy.position.x === position.x && enemy.position.y === position.y),
  };
}

function coordinate(position: Position): string {
  return `${String.fromCharCode(65 + position.x)}${position.y + 1}`;
}

function cellLabel(position: Position, car?: Car, enemy?: Enemy): string {
  const name = coordinate(position);
  if (enemy) {
    const next = run.status === 'playing' && run.intent.enemyId === enemy.id ? ' This enemy acts next.' : '';
    return `${name}. ${enemy.name}, ${enemy.hp} of ${enemy.maxHp} health.${next} Press Enter to fire.`;
  }
  if (car) {
    const action = car.hp < car.maxHp ? 'Press Enter to patch.' : 'At full integrity.';
    return `${name}. ${car.name}, ${car.hp} of ${car.maxHp} integrity. ${action}`;
  }
  return `${name}. Empty ${position.y === 3 ? 'track' : 'ground'} cell.`;
}

function healthMarks(current: number, maximum: number): string {
  return `<span class="health-marks" aria-hidden="true">${Array.from({ length: maximum }, (_, index) => `<i class="${index < current ? 'filled' : ''}"></i>`).join('')}</span>`;
}

function boardCell(position: Position): string {
  const { car, enemy } = pieceAt(position);
  const isIntent = Boolean(enemy && run.status === 'playing' && run.intent.enemyId === enemy.id);
  const content = enemy
    ? `<span class="piece enemy-piece" aria-hidden="true"><b>${escapeHtml(enemy.short)}</b></span>${healthMarks(enemy.hp, enemy.maxHp)}${isIntent ? '<span class="next-tag" aria-hidden="true">NEXT</span>' : ''}`
    : car
      ? `<span class="piece car-piece ${car.id}" aria-hidden="true"><b>${escapeHtml(car.short)}</b></span>${healthMarks(car.hp, car.maxHp)}`
      : '<span class="empty-dot" aria-hidden="true"></span>';
  const selected = selectedCell?.x === position.x && selectedCell?.y === position.y;
  const defaultFocus = !selectedCell && isIntent;
  return `
    <button
      class="board-cell ${position.y === 3 ? 'track-cell' : ''} ${car ? 'has-car' : ''} ${enemy ? 'has-enemy' : ''} ${isIntent ? 'is-intent' : ''}"
      type="button"
      role="gridcell"
      aria-label="${escapeHtml(cellLabel(position, car, enemy))}"
      data-cell
      data-x="${position.x}"
      data-y="${position.y}"
      ${car ? `data-car="${car.id}"` : ''}
      ${enemy ? `data-enemy="${enemy.id}"` : ''}
      tabindex="${selected || defaultFocus ? '0' : '-1'}"
    >
      <span class="coordinate ${settings.showCoordinates ? '' : 'is-hidden'}" aria-hidden="true">${coordinate(position)}</span>
      ${content}
    </button>`;
}

function board(): string {
  const rows = Array.from({ length: BOARD_SIZE }, (_, y) => `
    <div class="board-row" role="row">
      ${Array.from({ length: BOARD_SIZE }, (_unused, x) => boardCell({ x, y })).join('')}
    </div>`).join('');
  return `
    <div class="board-scroll" data-strong-intent="${settings.strongIntent}">
      <div class="board" role="grid" aria-label="7 by 7 defense board. Use arrow keys to move. Enter or Space uses a piece. B braces. W holds position.">
        ${rows}
      </div>
    </div>
    <ul class="board-legend" aria-label="Board key">
      <li><span class="legend-swatch train" aria-hidden="true"></span>Train car</li>
      <li><span class="legend-swatch threat" aria-hidden="true"></span>Enemy</li>
      <li><span class="legend-swatch next" aria-hidden="true"></span>Acts next</li>
    </ul>`;
}

function routeProgress(): string {
  return `<ol class="route-progress" aria-label="Three route stops">
    ${run.config.routeNames.map((name, index) => {
      const state = index < run.stopIndex || run.status === 'won' ? 'complete' : index === run.stopIndex ? 'current' : 'upcoming';
      const suffix = state === 'complete' ? 'complete' : state === 'current' ? 'current stop' : 'upcoming';
      return `<li class="${state}" ${state === 'current' ? 'aria-current="step"' : ''}><span>${index + 1}</span><b>${escapeHtml(name)}</b><small>${suffix}</small></li>`;
    }).join('')}
  </ol>`;
}

function intentPanel(): string {
  if (run.status !== 'playing') return endPanel();
  const weather = WEATHER_RULES[run.config.weather];
  const finalWeather = run.stopIndex === 2
    ? `<p class="weather active"><b>${weather.name}:</b> ${weather.rule}</p>`
    : `<p class="weather"><b>Final weather:</b> ${weather.name}. Its rule starts at stop three.</p>`;
  return `
    <section class="turn-panel">
      <div class="turn-line">
        <p class="eyebrow">Turn <span data-turn>${run.totalTurns + 1}</span> of ${TURNS_PER_STOP * STOP_COUNT}</p>
        <p class="seed">${escapeHtml(run.config.seed)}</p>
      </div>
      <h3>Enemy intent</h3>
      <p class="intent-copy" data-testid="intent-text">${escapeHtml(intentText(run))}</p>
      ${finalWeather}
      <div class="action-help">
        <p><b>Your one action:</b> choose an enemy to Fire, a damaged car to Patch, or use a button below.</p>
        <div class="turn-actions">
          <button type="button" class="brace-button" data-action="brace" ${run.bracesLeft === 0 ? 'disabled' : ''}>
            Brace train <span>${run.bracesLeft} left</span>
          </button>
          <button type="button" class="hold-button" data-action="wait">Hold position</button>
        </div>
        <p class="key-help">Keys: arrows move · Enter acts · B braces · W holds</p>
      </div>
    </section>`;
}

function endPanel(): string {
  const won = run.status === 'won';
  const health = run.cars.reduce((total, car) => total + car.hp, 0);
  return `
    <section class="turn-panel end-panel ${won ? 'won' : 'lost'}" tabindex="-1" data-end-panel>
      <p class="eyebrow">${won ? 'Three stops complete' : `Stopped on turn ${run.totalTurns}`}</p>
      <h3>${won ? 'Route complete' : 'Train stopped'}</h3>
      <p>${won
        ? `You reached ${escapeHtml(run.config.routeNames[2])} with ${health} train integrity.`
        : 'A train car lost all integrity before the final stop.'}</p>
      <dl class="run-summary">
        <div><dt>Threats cleared</dt><dd>${run.threatsCleared}</dd></div>
        <div><dt>Turns used</dt><dd>${run.totalTurns}</dd></div>
        <div><dt>Brake tokens</dt><dd>${run.bracesLeft}</dd></div>
      </dl>
      <button type="button" class="primary-button" data-restart>Restart ${isDemoRoute() ? 'sample' : 'today’s seed'}</button>
    </section>`;
}

function carStatus(): string {
  return `<ul class="car-status" aria-label="Train integrity">
    ${run.cars.map((car) => `<li><span><b>${escapeHtml(car.name)}</b><small>${car.hp} / ${car.maxHp}</small></span><meter min="0" max="${car.maxHp}" value="${car.hp}">${car.hp} of ${car.maxHp}</meter></li>`).join('')}
  </ul>`;
}

function game(): string {
  const family = FAMILY_LABELS[run.config.families[run.stopIndex]];
  return `
    <section class="game-card" aria-labelledby="game-heading">
      <div class="game-card-heading">
        <div>
          <p class="eyebrow">${isDemoRoute() ? 'Fixed sample seed' : 'Free daily seed'}</p>
          <h2 id="game-heading">${isDemoRoute() ? 'Sample active board' : 'Today’s active board'}</h2>
        </div>
        <button type="button" class="settings-button" data-open-settings aria-haspopup="dialog">Board settings</button>
      </div>
      ${routeProgress()}
      <div class="stop-strip">
        <span>Stop ${run.stopIndex + 1} of 3</span>
        <b>${escapeHtml(family)}</b>
        <span>Move ${Math.min(run.turnAtStop + 1, TURNS_PER_STOP)} of 5</span>
      </div>
      <div class="game-layout">
        <div>
          ${board()}
          ${carStatus()}
        </div>
        <div>
          ${intentPanel()}
          <details class="turn-log">
            <summary>Turn log</summary>
            <ol>${[...run.log].reverse().map((entry) => `<li><span>${entry.turn === 0 ? 'Start' : `T${entry.turn}`}</span>${escapeHtml(entry.text)}</li>`).join('')}</ol>
          </details>
        </div>
      </div>
      <p class="status-line" role="status" aria-live="polite" aria-atomic="true" data-status>${escapeHtml(statusMessage || storageNotice || 'Choose the copper-marked enemy first, or use one of the turn buttons.')}</p>
    </section>
    <dialog class="settings-dialog" data-settings-dialog aria-labelledby="settings-title">
      <form method="dialog">
        <div class="dialog-heading"><h2 id="settings-title">Board settings</h2><button value="close" aria-label="Close board settings">×</button></div>
        <label><input type="checkbox" name="coordinates" ${settings.showCoordinates ? 'checked' : ''} /> Show cell coordinates</label>
        <label><input type="checkbox" name="strong-intent" ${settings.strongIntent ? 'checked' : ''} /> Use a heavier intent outline</label>
        <p>These settings are saved in this browser.</p>
        <button class="primary-button" value="close">Save and close</button>
      </form>
    </dialog>`;
}

function homePage(): string {
  return `
    ${header()}
    ${demoBanner()}
    <main id="main">
      <section class="first-screen">
        <div class="intro-copy">
          <p class="product-label">7 × 7 daily strategy game</p>
          <h1 tabindex="-1">Defend a train, one turn at a time</h1>
          <p class="audience">For roguelike players who want a readable 15-turn daily run without real-time combat.</p>
          <div class="primary-row">
            <a class="primary-button" href="/demo" data-nav>Try it with sample data</a>
            <span>Starts a fixed practice run.</span>
          </div>
          <p class="first-action"><b>First action:</b> choose the copper-marked enemy, then Fire.</p>
          <ul class="plain-facts">
            <li>One free daily seed</li>
            <li>Progress stays in this browser</li>
            <li>Offline archive: US$8 once; registration pending</li>
          </ul>
        </div>
        ${game()}
      </section>

      <section class="information-section" id="how-it-works">
        <div class="section-heading"><p class="eyebrow">How it works</p><h2>Finish three five-turn stops</h2></div>
        <ol class="steps">
          <li><span>1</span><div><h3>Read the enemy intent</h3><p>One copper-marked enemy moves or attacks after your action.</p></div></li>
          <li><span>2</span><div><h3>Take one action</h3><p>Fire, patch a damaged car, Brace, or Hold position.</p></div></li>
          <li><span>3</span><div><h3>Reach the final stop</h3><p>Keep every car above zero integrity for 15 turns. Every dated seed has a tested safe route.</p></div></li>
        </ol>
        <a href="/how-to-play" data-nav>Read all rules and keyboard controls</a>
      </section>

      <section class="information-section split-section">
        <div class="section-heading"><p class="eyebrow">Limits and privacy</p><h2>A bounded game with no account</h2></div>
        <div class="paper-note">
          <p>Patient Rail has no real-time combat, multiplayer, account progression, analytics, ads, or loot boxes.</p>
          <p>Playing sends no game or personal data off this product origin.</p>
          <a href="/privacy" data-nav>Read the privacy details</a>
        </div>
      </section>

      <section class="information-section offer-section" id="offline-archive">
        <div class="section-heading"><p class="eyebrow">One-time edition</p><h2>Replay dated seeds offline</h2></div>
        <div class="offer-copy">
          <p class="price"><strong>US$8</strong> once</p>
          <ul>
            <li>Choose any dated seed.</li>
            <li>Keep the full archive available offline.</li>
            <li>Get the complete game with no subscription.</li>
          </ul>
          <p class="offer-status">Purchase and activation are unavailable until the offer is registered. The free daily game works now.</p>
          <a class="secondary-button" href="/archive" data-nav>See the archive offer</a>
        </div>
      </section>
    </main>
    ${footer()}`;
}

function howToPlayPage(): string {
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page">
        <p class="eyebrow">Rules and controls</p>
        <h1 tabindex="-1">Learn the five-turn stop rules</h1>
        <p class="lede">Complete three stops without letting any train car reach zero integrity.</p>
        <h2>Read the board</h2>
        <p>The board has 49 cells. Cream shapes are train cars. Copper shapes are enemies.</p>
        <p>A heavy copper outline and NEXT label mark the only enemy that acts this turn.</p>
        <h2>Take one action</h2>
        <ul>
          <li><b>Fire:</b> choose an enemy to deal two damage.</li>
          <li><b>Patch:</b> choose a damaged car to restore one integrity.</li>
          <li><b>Brace:</b> spend one brake token to block up to two damage.</li>
          <li><b>Hold position:</b> use a turn without changing the board.</li>
        </ul>
        <p>After your valid action, the shown enemy acts. Invalid choices do not use a turn.</p>
        <h2>Use the keyboard</h2>
        <p>Tab reaches the board. Arrow keys move between cells. Enter or Space uses the focused piece.</p>
        <p>Press B to Brace. Press W to Hold position. Every cell has a spoken action label.</p>
        <h2>Finish the route</h2>
        <p>Each stop lasts five turns. Train cars recover one integrity between stops.</p>
        <p>The final stop adds the weather rule shown beside the board.</p>
        <a class="primary-button" href="/demo" data-nav>Practice with the sample seed</a>
      </article>
    </main>
    ${footer()}`;
}

function archivePage(): string {
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page offer-page">
        <p class="eyebrow">One-time offline edition</p>
        <h1 tabindex="-1">Replay any dated route offline</h1>
        <p class="lede">The archive is for players who want past seeds on a train or anywhere without a connection.</p>
        <div class="price-ticket"><strong>US$8</strong><span>one payment</span></div>
        <h2>What the archive includes</h2>
        <ul>
          <li>The complete three-stop game.</li>
          <li>A date picker for every published seed.</li>
          <li>Offline access to selected and saved routes.</li>
          <li>Local progress with no account progression.</li>
        </ul>
        <h2>Current purchase status</h2>
        <p class="notice warning">The billing offer is waiting for operator registration. Purchase and activation do not work yet.</p>
        <button class="primary-button" type="button" disabled>Purchase is not available</button>
        <p>The free daily seed remains complete and playable.</p>
        <p><a href="/license" data-nav>Check archive activation status</a> · <a href="/terms" data-nav>Read purchase terms</a></p>
      </article>
    </main>
    ${footer()}`;
}

function licensePage(): string {
  const returned = new URLSearchParams(window.location.search).get('purchase') === 'complete';
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page">
        <p class="eyebrow">Offline archive</p>
        <h1 tabindex="-1">Check archive activation</h1>
        ${returned ? '<p class="notice warning">No entitlement was activated. Offer registration and license validation are still pending.</p>' : ''}
        <p>The US$8 one-time offer is not registered yet. This page cannot validate a purchase.</p>
        <p>No checkout redirect or local flag is treated as proof of ownership.</p>
        <a class="primary-button" href="/" data-nav>Play today’s free seed</a>
      </article>
    </main>
    ${footer()}`;
}

function privacyPage(): string {
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page">
        <p class="eyebrow">Privacy</p>
        <h1 tabindex="-1">See what stays in your browser</h1>
        <p class="lede">Patient Rail needs no account and collects no analytics.</p>
        <h2>Data stored on your device</h2>
        <p>The game stores daily progress, the separate sample run, and board settings in local storage.</p>
        <p>The sample uses a separate key. Resetting it never reads or changes daily progress.</p>
        <h2>Network requests</h2>
        <p>Playing a run sends no game or personal data off the product origin.</p>
        <p>The service worker requests this site’s files so the daily game can reload offline after one online visit.</p>
        <h2>Delete your data</h2>
        <p>Use your browser’s site-data controls to remove all Patient Rail data.</p>
        <p>You can also reset the sample from its persistent demo banner.</p>
        <h2>Contact</h2>
        <p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> for a privacy question.</p>
        <p>Last updated: 6 September 2026.</p>
      </article>
    </main>
    ${footer()}`;
}

function termsPage(): string {
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page">
        <p class="eyebrow">Terms</p>
        <h1 tabindex="-1">Read the play and purchase terms</h1>
        <p class="lede">You may play the free daily seed without an account.</p>
        <h2>Game use</h2>
        <p>Patient Rail is provided as available. Runs and local progress may be lost when browser data is cleared.</p>
        <p>Do not misuse the site or interfere with access for other players.</p>
        <h2>Offline archive offer</h2>
        <p>The planned archive price is US$8 as one payment. It includes dated seeds and offline archive access.</p>
        <p>The offer is not registered, so purchase and activation are unavailable. No payment should be possible now.</p>
        <h2>Refunds</h2>
        <p>When sales open, the checkout receipt will name the seller and available refund process.</p>
        <p>Nothing on this site limits rights that consumer law gives you.</p>
        <h2>Contact</h2>
        <p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for a terms or purchase question.</p>
        <p>Last updated: 6 September 2026.</p>
      </article>
    </main>
    ${footer()}`;
}

function notFoundPage(): string {
  return `
    ${header()}
    <main id="main" class="article-main">
      <article class="paper-page not-found-page">
        <p class="eyebrow">404 · Route not found</p>
        <h1 tabindex="-1">This page is not on the route</h1>
        <p>The link may be old. Return to today’s train-defense run.</p>
        <a class="primary-button" href="/" data-nav>Open today’s run</a>
      </article>
    </main>
    ${footer()}`;
}

function render(moveFocus = false): void {
  const route = routeForPath(window.location.pathname);
  setRouteMetadata(route);
  if (route === 'home' || route === 'demo') {
    run = loadRunIfRouteChanged();
  }
  const pages: Record<RouteName, () => string> = {
    home: homePage,
    demo: homePage,
    'how-to-play': howToPlayPage,
    archive: archivePage,
    license: licensePage,
    privacy: privacyPage,
    terms: termsPage,
    'not-found': notFoundPage,
  };
  app.innerHTML = `${pages[route]()}<div class="sr-only" aria-live="polite" data-route-announcer>${escapeHtml(document.title)}</div>`;
  bindInteractions();
  document.body.dataset.route = route;
  if (moveFocus) requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus());
}

let loadedStorageKey = '';
function loadRunIfRouteChanged(): RunState {
  const key = storageKey();
  if (!run || key !== loadedStorageKey) {
    loadedStorageKey = key;
    storageNotice = '';
    statusMessage = '';
    selectedCell = null;
    return loadRun();
  }
  return run;
}

function navigate(url: URL): void {
  if (url.origin !== window.location.origin) {
    window.location.assign(url);
    return;
  }
  const leavingDemo = isDemoRoute() && url.pathname !== '/demo';
  if (leavingDemo) localStorage.removeItem(DEMO_KEY);
  history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  loadedStorageKey = '';
  window.scrollTo({ top: 0, behavior: 'instant' });
  render(true);
}

function act(action: GameAction, focus?: Position): void {
  const result = applyAction(run, action);
  statusMessage = result.message;
  if (!result.valid) {
    document.querySelector<HTMLElement>('[data-status]')!.textContent = result.message;
    return;
  }
  run = result.state;
  if (focus) selectedCell = focus;
  saveRun();
  render(false);
  requestAnimationFrame(() => {
    if (run.status === 'playing' && selectedCell) {
      document.querySelector<HTMLElement>(`[data-cell][data-x="${selectedCell.x}"][data-y="${selectedCell.y}"]`)?.focus();
    } else {
      document.querySelector<HTMLElement>('[data-end-panel]')?.focus();
    }
  });
}

function handleCell(button: HTMLButtonElement): void {
  const position = { x: Number(button.dataset.x), y: Number(button.dataset.y) };
  selectedCell = position;
  if (button.dataset.enemy) {
    act({ type: 'fire', enemyId: button.dataset.enemy }, position);
  } else if (button.dataset.car) {
    act({ type: 'patch', carId: button.dataset.car as CarKind }, position);
  } else {
    const message = 'Empty cell. Choose an enemy, a damaged car, Brace, or Hold position. No turn was used.';
    statusMessage = message;
    document.querySelector<HTMLElement>('[data-status]')!.textContent = message;
  }
}

function moveBoardFocus(button: HTMLButtonElement, xDelta: number, yDelta: number): void {
  const x = Math.min(BOARD_SIZE - 1, Math.max(0, Number(button.dataset.x) + xDelta));
  const y = Math.min(BOARD_SIZE - 1, Math.max(0, Number(button.dataset.y) + yDelta));
  document.querySelectorAll<HTMLElement>('[data-cell]').forEach((cell) => { cell.tabIndex = -1; });
  const next = document.querySelector<HTMLButtonElement>(`[data-cell][data-x="${x}"][data-y="${y}"]`);
  if (next) {
    next.tabIndex = 0;
    selectedCell = { x, y };
    next.focus();
  }
}

function bindGameInteractions(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach((button) => {
    button.addEventListener('click', () => handleCell(button));
    button.addEventListener('keydown', (event) => {
      const directions: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
      };
      if (directions[event.key]) {
        event.preventDefault();
        moveBoardFocus(button, ...directions[event.key]!);
      } else if (event.key.toLowerCase() === 'b') {
        event.preventDefault();
        act({ type: 'brace' }, { x: Number(button.dataset.x), y: Number(button.dataset.y) });
      } else if (event.key.toLowerCase() === 'w') {
        event.preventDefault();
        act({ type: 'wait' }, { x: Number(button.dataset.x), y: Number(button.dataset.y) });
      }
    });
  });
  document.querySelector<HTMLButtonElement>('[data-action="brace"]')?.addEventListener('click', () => act({ type: 'brace' }));
  document.querySelector<HTMLButtonElement>('[data-action="wait"]')?.addEventListener('click', () => act({ type: 'wait' }));
  document.querySelector<HTMLButtonElement>('[data-restart]')?.addEventListener('click', () => {
    run = createRun(seedForRoute());
    statusMessage = 'Run restarted at turn one with full train integrity.';
    selectedCell = null;
    saveRun();
    render(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-cell][tabindex="0"]')?.focus());
  });

  const dialog = document.querySelector<HTMLDialogElement>('[data-settings-dialog]');
  const opener = document.querySelector<HTMLButtonElement>('[data-open-settings]');
  opener?.addEventListener('click', () => dialog?.showModal());
  dialog?.querySelector<HTMLInputElement>('input[name="coordinates"]')?.addEventListener('change', (event) => {
    settings.showCoordinates = (event.currentTarget as HTMLInputElement).checked;
    saveSettings();
    document.querySelectorAll('.coordinate').forEach((item) => item.classList.toggle('is-hidden', !settings.showCoordinates));
  });
  dialog?.querySelector<HTMLInputElement>('input[name="strong-intent"]')?.addEventListener('change', (event) => {
    settings.strongIntent = (event.currentTarget as HTMLInputElement).checked;
    saveSettings();
    document.querySelector<HTMLElement>('.board-scroll')?.setAttribute('data-strong-intent', String(settings.strongIntent));
  });
  dialog?.addEventListener('close', () => opener?.focus());
}

function bindInteractions(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
      event.preventDefault();
      navigate(new URL(link.href));
    });
  });
  document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', () => {
    localStorage.removeItem(DEMO_KEY);
    run = createRun(DEMO_SEED);
    statusMessage = 'The sample was reset. Daily progress was not changed.';
    selectedCell = null;
    saveRun();
    render(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-cell][tabindex="0"]')?.focus());
  });
  bindGameInteractions();
}

window.addEventListener('popstate', () => {
  loadedStorageKey = '';
  render(true);
});

run = loadRun();
loadedStorageKey = storageKey();
render(false);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // The game remains playable online when service worker registration is unavailable.
    });
  });
}
