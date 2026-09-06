import { describe, expect, it } from 'vitest';
import { allDatedSeedConfigurations, applyAction, configForSeed, createRun, playSafeConfiguration, playSafeRun } from './engine';

describe('deterministic run engine', () => {
  it('builds the same game from the same seed', () => {
    const first = createRun('PR-2026-09-06', 100);
    const second = createRun('PR-2026-09-06', 100);
    expect(second).toEqual(first);
  });

  it('varies layouts, families and final weather across dated seeds', () => {
    const configs = Array.from({ length: 40 }, (_, day) => configForSeed(`PR-2026-10-${String(day + 1).padStart(2, '0')}`));
    expect(new Set(configs.map((config) => config.carOrder.join(','))).size).toBeGreaterThan(1);
    expect(new Set(configs.map((config) => config.families.join(','))).size).toBeGreaterThan(1);
    expect(new Set(configs.map((config) => config.weather)).size).toBe(3);
  });

  it('does not spend a turn on an invalid patch', () => {
    const state = createRun('SAMPLE-EMBER-7');
    const result = applyAction(state, { type: 'patch', carId: 'engine' });
    expect(result.valid).toBe(false);
    expect(result.state.totalTurns).toBe(0);
    expect(result.state).toBe(state);
  });

  it('resolves exactly the intent shown before the action', () => {
    const state = createRun('SAMPLE-EMBER-7');
    const target = state.cars.find((car) => car.id === state.intent.targetCarId)!;
    const otherEnemy = state.enemies.find((enemy) => enemy.id !== state.intent.enemyId)!;
    const result = applyAction(state, { type: 'fire', enemyId: otherEnemy.id });
    expect(result.valid).toBe(true);
    expect(result.state.totalTurns).toBe(1);
    expect(result.state.cars.find((car) => car.id === target.id)!.hp).toBe(target.hp - 1);
  });

  it('reaches a loss when the sample player holds position', () => {
    let state = createRun('SAMPLE-EMBER-7');
    while (state.status === 'playing') state = applyAction(state, { type: 'wait' }).state;
    expect(state.status).toBe('lost');
    expect(state.totalTurns).toBeLessThan(15);
    expect(state.cars.some((car) => car.hp === 0)).toBe(true);
  });

  it('reaches a win by firing on each shown intent', () => {
    const state = playSafeRun('SAMPLE-EMBER-7');
    expect(state.status).toBe('won');
    expect(state.stopIndex).toBe(2);
    expect(state.totalTurns).toBe(15);
    expect(state.cars.every((car) => car.hp > 0)).toBe(true);
  });

  it('finds a winning route in every possible dated-seed game configuration', () => {
    const configurations = allDatedSeedConfigurations();

    expect(configurations).toHaveLength(108);
    for (const config of configurations) {
      const state = playSafeConfiguration(config);
      expect(state.status).toBe('won');
      expect(state.totalTurns).toBe(15);
      expect(state.cars.every((car) => car.hp > 0)).toBe(true);
    }
  });
});
