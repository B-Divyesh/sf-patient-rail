export const BOARD_SIZE = 7;
export const TURNS_PER_STOP = 5;
export const STOP_COUNT = 3;

export type RunStatus = 'playing' | 'won' | 'lost';
export type CarKind = 'engine' | 'workshop' | 'cargo';
export type FamilyId = 'copper-beetles' | 'track-cutters' | 'storm-crows';
export type WeatherId = 'headwind' | 'heavy-rain' | 'hard-frost';

export interface Position {
  x: number;
  y: number;
}

export interface Car {
  id: CarKind;
  name: string;
  short: string;
  hp: number;
  maxHp: number;
  position: Position;
}

export interface Enemy {
  id: string;
  name: string;
  short: string;
  hp: number;
  maxHp: number;
  damage: number;
  position: Position;
  targetCarId: CarKind;
}

export interface RunConfig {
  seed: string;
  routeNames: [string, string, string];
  carOrder: [CarKind, CarKind, CarKind];
  families: [FamilyId, FamilyId, FamilyId];
  weather: WeatherId;
}

export interface Intent {
  enemyId: string;
  type: 'attack' | 'advance';
  targetCarId: CarKind;
  damage: number;
  from: Position;
  to?: Position;
  steps?: number;
}

export interface LogEntry {
  turn: number;
  text: string;
}

export interface RunState {
  version: 1;
  config: RunConfig;
  status: RunStatus;
  stopIndex: number;
  turnAtStop: number;
  totalTurns: number;
  enemyCursor: number;
  bracesLeft: number;
  threatsCleared: number;
  cars: Car[];
  enemies: Enemy[];
  intent: Intent;
  log: LogEntry[];
  startedAt: number;
  finishedAt?: number;
}

export type GameAction =
  | { type: 'fire'; enemyId: string }
  | { type: 'patch'; carId: CarKind }
  | { type: 'brace' }
  | { type: 'wait' };

export interface ActionResult {
  state: RunState;
  valid: boolean;
  message: string;
}

const CAR_DATA: Record<CarKind, Pick<Car, 'name' | 'short' | 'maxHp'>> = {
  engine: { name: 'Engine', short: 'EN', maxHp: 5 },
  workshop: { name: 'Workshop car', short: 'WK', maxHp: 5 },
  cargo: { name: 'Cargo car', short: 'CG', maxHp: 5 },
};

const FAMILY_DATA: Record<FamilyId, { name: string; short: string; hp: number; damage: number }> = {
  'copper-beetles': { name: 'Copper beetle', short: 'CB', hp: 2, damage: 1 },
  'track-cutters': { name: 'Track cutter', short: 'TC', hp: 3, damage: 2 },
  'storm-crows': { name: 'Storm crow', short: 'SC', hp: 2, damage: 2 },
};

export const FAMILY_LABELS: Record<FamilyId, string> = {
  'copper-beetles': 'Copper beetles',
  'track-cutters': 'Track cutters',
  'storm-crows': 'Storm crows',
};

export const WEATHER_RULES: Record<WeatherId, { name: string; rule: string }> = {
  headwind: { name: 'Headwind', rule: 'Advancing enemies move two cells at the final stop.' },
  'heavy-rain': { name: 'Heavy rain', rule: 'Patching restores two integrity at the final stop.' },
  'hard-frost': { name: 'Hard frost', rule: 'Brace blocks one damage at the final stop.' },
};

const ROUTE_NAMES = [
  'Alder Junction',
  'Copper Cut',
  'Marsh Signal',
  'North Weighhouse',
  'Quarry Loop',
  'Summit Shed',
  'Teal Crossing',
  'Willow Platform',
];

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string): () => number {
  let value = hashString(seed) || 1;
  return () => {
    value += 0x6d2b79f5;
    let output = value;
    output = Math.imul(output ^ (output >>> 15), output | 1);
    output ^= output + Math.imul(output ^ (output >>> 7), output | 61);
    return ((output ^ (output >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

export function dailySeed(date = new Date()): string {
  return `PR-${date.toISOString().slice(0, 10)}`;
}

export function configForSeed(seed: string): RunConfig {
  if (seed === 'SAMPLE-EMBER-7') {
    return {
      seed,
      routeNames: ['Alder Junction', 'Copper Cut', 'Summit Shed'],
      carOrder: ['engine', 'workshop', 'cargo'],
      families: ['copper-beetles', 'track-cutters', 'storm-crows'],
      weather: 'headwind',
    };
  }

  const random = seededRandom(seed);
  const routes = shuffled(ROUTE_NAMES, random).slice(0, 3) as [string, string, string];
  const cars = shuffled<CarKind>(['engine', 'workshop', 'cargo'], random) as [CarKind, CarKind, CarKind];
  const familyPool = shuffled<FamilyId>(['copper-beetles', 'track-cutters', 'storm-crows'], random);
  const weatherPool = shuffled<WeatherId>(['headwind', 'heavy-rain', 'hard-frost'], random);
  return {
    seed,
    routeNames: routes,
    carOrder: cars,
    families: familyPool as [FamilyId, FamilyId, FamilyId],
    weather: weatherPool[0]!,
  };
}

function buildCars(config: RunConfig): Car[] {
  return config.carOrder.map((id, index) => {
    const details = CAR_DATA[id];
    return {
      id,
      ...details,
      hp: details.maxHp,
      position: { x: index + 2, y: 3 },
    };
  });
}

function buildEnemies(config: RunConfig, stopIndex: number, cars: Car[]): Enemy[] {
  const family = config.families[stopIndex];
  const details = FAMILY_DATA[family];
  const positions: Position[] = [
    { x: cars[0]!.position.x, y: 2 },
    { x: cars[1]!.position.x, y: 1 },
    { x: cars[2]!.position.x, y: 4 },
    { x: cars[0]!.position.x, y: 1 },
    { x: cars[1]!.position.x, y: 5 },
  ];

  return positions.map((position, index) => ({
    id: `s${stopIndex + 1}-e${index + 1}`,
    name: details.name,
    short: details.short,
    hp: details.hp,
    maxHp: details.hp,
    damage: details.damage,
    position,
    targetCarId: cars[index % cars.length]!.id,
  }));
}

function carById(state: RunState, id: CarKind): Car {
  const car = state.cars.find((candidate) => candidate.id === id);
  if (!car) throw new Error(`Missing car ${id}`);
  return car;
}

function distance(first: Position, second: Position): number {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function nextPosition(enemy: Enemy, target: Car, steps: number): Position {
  const position = { ...enemy.position };
  for (let step = 0; step < steps && distance(position, target.position) > 1; step += 1) {
    if (position.y !== target.position.y) {
      position.y += Math.sign(target.position.y - position.y);
    } else if (position.x !== target.position.x) {
      position.x += Math.sign(target.position.x - position.x);
    }
  }
  return position;
}

function computeIntent(state: RunState): Intent {
  if (state.enemies.length === 0) throw new Error('Cannot compute intent without an enemy');
  const enemy = state.enemies[state.enemyCursor % state.enemies.length]!;
  const target = carById(state, enemy.targetCarId);
  if (distance(enemy.position, target.position) <= 1) {
    return {
      enemyId: enemy.id,
      type: 'attack',
      targetCarId: target.id,
      damage: enemy.damage,
      from: { ...enemy.position },
    };
  }
  const steps = state.stopIndex === 2 && state.config.weather === 'headwind' ? 2 : 1;
  return {
    enemyId: enemy.id,
    type: 'advance',
    targetCarId: target.id,
    damage: 0,
    from: { ...enemy.position },
    to: nextPosition(enemy, target, steps),
    steps,
  };
}

export function createRun(seed: string, now = Date.now()): RunState {
  const config = configForSeed(seed);
  const cars = buildCars(config);
  const state = {
    version: 1 as const,
    config,
    status: 'playing' as const,
    stopIndex: 0,
    turnAtStop: 0,
    totalTurns: 0,
    enemyCursor: 0,
    bracesLeft: 3,
    threatsCleared: 0,
    cars,
    enemies: buildEnemies(config, 0, cars),
    intent: {} as Intent,
    log: [{ turn: 0, text: `Arrived at ${config.routeNames[0]}. One enemy will act after your move.` }],
    startedAt: now,
  };
  state.intent = computeIntent(state);
  return state;
}

function cloneState(state: RunState): RunState {
  return structuredClone(state);
}

function currentEnemy(state: RunState): Enemy {
  const enemy = state.enemies.find((candidate) => candidate.id === state.intent.enemyId);
  if (!enemy) throw new Error(`Missing intending enemy ${state.intent.enemyId}`);
  return enemy;
}

function addLog(state: RunState, text: string): void {
  state.log = [...state.log, { turn: state.totalTurns + 1, text }].slice(-8);
}

function stationTransition(state: RunState): string {
  if (state.stopIndex === STOP_COUNT - 1) {
    state.status = 'won';
    state.finishedAt = Date.now();
    return `Route complete with ${state.threatsCleared} threats cleared.`;
  }

  state.stopIndex += 1;
  state.turnAtStop = 0;
  state.enemyCursor = 0;
  for (const car of state.cars) car.hp = Math.min(car.maxHp, car.hp + 1);
  state.enemies = buildEnemies(state.config, state.stopIndex, state.cars);
  state.intent = computeIntent(state);
  return `Reached ${state.config.routeNames[state.stopIndex]}. Each car recovered one integrity.`;
}

export function applyAction(input: RunState, action: GameAction): ActionResult {
  if (input.status !== 'playing') {
    return { state: input, valid: false, message: 'This run has ended. Restart to take another action.' };
  }

  const state = cloneState(input);
  let playerText = '';
  let braced = false;

  if (action.type === 'fire') {
    const enemy = state.enemies.find((candidate) => candidate.id === action.enemyId);
    if (!enemy) return { state: input, valid: false, message: 'That cell has no enemy. No turn was used.' };
    enemy.hp -= 2;
    playerText = `Fired on ${enemy.name} for 2 damage.`;
    if (enemy.hp <= 0) {
      state.enemies = state.enemies.filter((candidate) => candidate.id !== enemy.id);
      state.threatsCleared += 1;
      playerText += ' Threat cleared.';
    }
  } else if (action.type === 'patch') {
    const car = state.cars.find((candidate) => candidate.id === action.carId);
    if (!car) return { state: input, valid: false, message: 'That cell has no train car. No turn was used.' };
    if (car.hp >= car.maxHp) {
      return { state: input, valid: false, message: `${car.name} is already at full integrity. No turn was used.` };
    }
    const amount = state.stopIndex === 2 && state.config.weather === 'heavy-rain' ? 2 : 1;
    const restored = Math.min(amount, car.maxHp - car.hp);
    car.hp += restored;
    playerText = `Patched ${car.name} for ${restored} integrity.`;
  } else if (action.type === 'brace') {
    if (state.bracesLeft <= 0) {
      return { state: input, valid: false, message: 'No brake tokens remain. No turn was used.' };
    }
    state.bracesLeft -= 1;
    braced = true;
    playerText = 'Braced the train for the shown intent.';
  } else {
    playerText = 'Held position without firing or patching.';
  }

  const intendingEnemy = state.enemies.find((candidate) => candidate.id === state.intent.enemyId);
  let enemyText = '';
  if (!intendingEnemy) {
    enemyText = 'The shown intent was cancelled.';
  } else if (state.intent.type === 'advance') {
    intendingEnemy.position = { ...state.intent.to! };
    enemyText = `${intendingEnemy.name} advanced ${state.intent.steps} ${state.intent.steps === 1 ? 'cell' : 'cells'}.`;
  } else {
    const target = carById(state, state.intent.targetCarId);
    const normalBlock = state.stopIndex === 2 && state.config.weather === 'hard-frost' ? 1 : 2;
    const blocked = braced ? Math.min(normalBlock, intendingEnemy.damage) : 0;
    const taken = intendingEnemy.damage - blocked;
    target.hp = Math.max(0, target.hp - taken);
    enemyText = taken === 0
      ? `${intendingEnemy.name}'s ${intendingEnemy.damage} damage was blocked.`
      : `${intendingEnemy.name} dealt ${taken} damage to ${target.name}${blocked ? ` after ${blocked} was blocked` : ''}.`;
  }

  state.totalTurns += 1;
  state.turnAtStop += 1;
  state.enemyCursor += 1;
  addLog(state, `${playerText} ${enemyText}`);

  const wrecked = state.cars.find((car) => car.hp <= 0);
  if (wrecked) {
    state.status = 'lost';
    state.finishedAt = Date.now();
    const message = `${wrecked.name} lost all integrity. The run is over.`;
    addLog(state, message);
    return { state, valid: true, message };
  }

  if (state.turnAtStop >= TURNS_PER_STOP) {
    const transition = stationTransition(state);
    addLog(state, transition);
    return { state, valid: true, message: `${playerText} ${enemyText} ${transition}` };
  }

  state.intent = computeIntent(state);
  return { state, valid: true, message: `${playerText} ${enemyText}` };
}

export function intentText(state: RunState): string {
  const enemy = currentEnemy(state);
  const target = carById(state, state.intent.targetCarId);
  if (state.intent.type === 'advance') {
    return `${enemy.name} will advance ${state.intent.steps} ${state.intent.steps === 1 ? 'cell' : 'cells'} toward ${target.name}.`;
  }
  const block = state.stopIndex === 2 && state.config.weather === 'hard-frost' ? 1 : 2;
  return `${enemy.name} will attack ${target.name} for ${enemy.damage}. Brace would block ${Math.min(block, enemy.damage)}.`;
}

export function isRunState(value: unknown, seed: string): value is RunState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<RunState>;
  return candidate.version === 1
    && candidate.config?.seed === seed
    && ['playing', 'won', 'lost'].includes(candidate.status ?? '')
    && Array.isArray(candidate.cars)
    && candidate.cars.length === 3
    && Array.isArray(candidate.enemies)
    && typeof candidate.totalTurns === 'number';
}

export function playSafeRun(seed: string): RunState {
  let state = createRun(seed, 0);
  while (state.status === 'playing') {
    const result = applyAction(state, { type: 'fire', enemyId: state.intent.enemyId });
    if (!result.valid) throw new Error(`Safe action failed for ${seed}: ${result.message}`);
    state = result.state;
  }
  return state;
}
