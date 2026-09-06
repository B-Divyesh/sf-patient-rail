import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('@claim:invalid-no-turn invalid empty and full-car actions do not spend a turn', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('[data-cell][data-x="0"][data-y="0"]').click();
  await expect(page.locator('[data-turn]')).toHaveText('1');
  await expect(page.locator('[data-status]')).toContainText('No turn was used');
  await page.locator('[data-cell][data-car="engine"]').click();
  await expect(page.locator('[data-turn]')).toHaveText('1');
  await expect(page.locator('[data-status]')).toContainText('full integrity');
});

test('damaged saved data recovers to a new run with an explanation', async ({ page }) => {
  await page.addInitScript(() => {
    const day = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`patient-rail:daily:PR-${day}:v1`, '{broken');
  });
  await page.goto('/');
  await expect(page.locator('[data-turn]')).toHaveText('1');
  await expect(page.locator('[data-status]')).toContainText('damaged');
});

test('real routes update title, focus, and browser history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page).toHaveTitle('Privacy — Patient Rail');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page).toHaveTitle('Patient Rail — turn-based train defense');
});

test('demo label persists during play and reset returns the fixed layout', async ({ page }) => {
  await page.goto('/demo');
  const firstIntent = await page.locator('[data-testid="intent-text"]').textContent();
  await page.locator('[data-cell].is-intent').click();
  await expect(page.getByText('Demo — sample run, nothing is saved to your daily game')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-testid="intent-text"]')).toHaveText(firstIntent ?? '');
});

test('reduced motion removes meaningful transition time', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  const duration = await page.locator('.primary-button').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test('phone layout shows job, action, and usable game without body overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Defend a train, one turn at a time' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(size.scroll).toBe(size.client);
  const intent = page.locator('[data-cell].is-intent');
  const viewport = await page.evaluate(() => ({ height: window.innerHeight, scrollY: window.scrollY }));
  const intentBox = await intent.boundingBox();
  expect(intentBox?.height).toBeGreaterThanOrEqual(44);
  expect(intentBox?.y).toBeGreaterThanOrEqual(0);
  expect((intentBox?.y ?? Infinity) + (intentBox?.height ?? Infinity)).toBeLessThanOrEqual(viewport.height);
  await intent.click();
  await expect(page.locator('[data-turn]')).toHaveText('2');
  expect(await page.evaluate(() => window.scrollY)).toBe(viewport.scrollY);
});

test('designed 404 loads its same-origin stylesheet under the production CSP', async ({ page }) => {
  const [htmlResponse, configResponse] = await Promise.all([
    page.request.get('/404.html'),
    page.request.get('/staticwebapp.config.json'),
  ]);
  expect(htmlResponse.ok()).toBe(true);
  expect(configResponse.ok()).toBe(true);
  const html = await htmlResponse.text();
  const config = await configResponse.json() as { globalHeaders: { 'Content-Security-Policy': string } };
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.route('**/404-csp-check', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'text/html',
      headers: { 'Content-Security-Policy': config.globalHeaders['Content-Security-Policy'] },
      body: html,
    });
  });

  const response = await page.goto('/404-csp-check');
  await expect(page.locator('.ticket')).toBeVisible();
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(16, 42, 67)');
  await expect(page.locator('.ticket')).toHaveCSS('background-color', 'rgb(255, 247, 223)');
  expect(errors.filter((message) => message.includes('Content Security Policy'))).toEqual([]);
});

for (const path of ['/', '/demo', '/how-to-play', '/archive', '/license', '/privacy', '/terms']) {
  test(`@a11y ${path} has no serious accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}
