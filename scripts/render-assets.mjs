import { chromium } from '@playwright/test';

const browser = await chromium.launch();
for (const [name, width, height] of [
  ['social-card', 1200, 630],
  ['apple-touch-icon', 180, 180],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(new URL(`../public/${name}.svg`, import.meta.url).href);
  await page.screenshot({ path: new URL(`../public/${name}.png`, import.meta.url).pathname });
  await page.close();
}
await browser.close();
