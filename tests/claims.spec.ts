import { expect, test } from '@playwright/test';
import { allDatedSeedConfigurations, configForSeed, playSafeConfiguration } from '../src/engine';

test('@claim:complete-seeded-run sample reaches a three-stop win', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Sample active board' })).toBeVisible();
  for (let turn = 0; turn < 15; turn += 1) {
    await page.locator('[data-cell].is-intent').click();
  }
  await expect(page.getByRole('heading', { name: 'Route complete' })).toBeVisible();
  await expect(page.getByText('Three stops complete')).toBeVisible();
  await expect(page.getByText('Turns used').locator('..').getByText('15')).toBeVisible();
});

test('@claim:loss-restart loss ends and restart restores the opening state', async ({ page }) => {
  await page.goto('/demo');
  for (let turn = 0; turn < 15; turn += 1) {
    const hold = page.getByRole('button', { name: 'Hold position' });
    if (!(await hold.isVisible().catch(() => false))) break;
    await hold.click();
  }
  await expect(page.getByRole('heading', { name: 'Train stopped' })).toBeVisible();
  await page.getByRole('button', { name: 'Restart sample' }).click();
  await expect(page.locator('[data-turn]')).toHaveText('1');
  await expect(page.getByText('Move 1 of 5')).toBeVisible();
  await expect(page.getByRole('button', { name: /Brace train 3 left/ })).toBeVisible();
  await expect(page.getByText('5 / 5')).toHaveCount(3);
});

test('@claim:finishable-seeds every dated-seed game configuration reaches a win', async () => {
  const configurations = allDatedSeedConfigurations();
  expect(configurations).toHaveLength(108);
  for (const config of configurations) {
    const result = playSafeConfiguration(config);
    expect(result.status, config.seed).toBe('won');
    expect(result.totalTurns, config.seed).toBe(15);
    expect(result.cars.every((car) => car.hp > 0), config.seed).toBe(true);
  }
});

test('@claim:demo-isolation sample actions and reset leave daily keys unchanged', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('patient-rail:daily:sentinel:v1', '{"daily":"unchanged"}');
  });
  await page.goto('/demo');
  const before = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('patient-rail:daily:'))));
  await page.locator('[data-cell].is-intent').click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const after = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('patient-rail:daily:'))));
  expect(after).toEqual(before);
  await expect(page.getByText('The sample was reset. Daily progress was not changed.')).toBeVisible();
});

test('@claim:local-privacy play and settings contact only the product origin', async ({ page, baseURL }) => {
  const externalOrigins = new Set<string>();
  const productOrigin = new URL(baseURL!).origin;
  page.on('request', (request) => {
    const requestOrigin = new URL(request.url()).origin;
    if (requestOrigin !== productOrigin) externalOrigins.add(requestOrigin);
  });
  await page.goto('/demo');
  await page.locator('[data-cell].is-intent').click();
  await page.getByRole('button', { name: 'Board settings' }).click();
  await page.getByLabel('Show cell coordinates').uncheck();
  await page.getByRole('button', { name: 'Save and close' }).click();
  expect([...externalOrigins]).toEqual([]);
});

test('@claim:offline-reload daily run reloads and plays offline', async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Today’s active board' })).toBeVisible();
  await page.locator('[data-cell].is-intent').click();
  await expect(page.locator('[data-turn]')).toHaveText('2');
  await context.close();
});

test('@claim:keyboard-play arrows and B resolve one turn and keep board focus', async ({ page }) => {
  await page.goto('/demo');
  const intent = page.locator('[data-cell].is-intent');
  await intent.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('b');
  await expect(page.locator('[data-turn]')).toHaveText('2');
  await expect(page.locator('[data-status]')).toContainText('Braced the train');
  await expect(page.locator('[data-cell]:focus')).toHaveCount(1);
});

test('@claim:resume-progress daily turn state survives reload', async ({ page }) => {
  await page.goto('/');
  const seed = await page.locator('.seed').textContent();
  await page.locator('[data-cell].is-intent').click();
  const carValues = await page.locator('.car-status small').allTextContents();
  await page.reload();
  await expect(page.locator('.seed')).toHaveText(seed ?? '');
  await expect(page.locator('[data-turn]')).toHaveText('2');
  expect(await page.locator('.car-status small').allTextContents()).toEqual(carValues);
  await page.locator('.turn-log').click();
  await expect(page.locator('.turn-log li')).toHaveCount(2);
});

test('@claim:settings-persist coordinate preference survives reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Board settings' }).click();
  await page.getByLabel('Show cell coordinates').uncheck();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await page.reload();
  await expect(page.locator('.coordinate:not(.is-hidden)')).toHaveCount(0);
  await expect(page.locator('.coordinate.is-hidden')).toHaveCount(49);
});

test('@claim:seed-variation dated seeds change all three generated rule groups', async () => {
  const configs = Array.from({ length: 40 }, (_, day) => configForSeed(`PR-2026-10-${String(day + 1).padStart(2, '0')}`));
  expect(new Set(configs.map((config) => config.carOrder.join(','))).size).toBeGreaterThan(1);
  expect(new Set(configs.map((config) => config.families.join(','))).size).toBeGreaterThan(1);
  expect(new Set(configs.map((config) => config.weather)).size).toBe(3);
});

test('@claim:billing-pending purchase and activation remain unavailable without registration', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/archive');
  await expect(page.getByRole('button', { name: 'Purchase is not available' })).toBeDisabled();
  await expect(page.getByText('Purchase and activation do not work yet.')).toBeVisible();
  await page.getByRole('link', { name: 'Check archive activation status' }).click();
  await expect(page.getByRole('heading', { name: 'Check archive activation' })).toBeVisible();
  await expect(page.getByText('This page cannot validate a purchase.')).toBeVisible();
  expect(requests.some((url) => url.includes('/api/v1/'))).toBe(false);
});
