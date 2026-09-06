import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseURL = process.env.PATIENT_RAIL_URL ?? 'http://127.0.0.1:4173';
const output = new URL('../.factory/evidence/', import.meta.url);
await mkdir(output, { recursive: true });

const browser = await chromium.launch();

async function freshPage(viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  return { context, page };
}

const desktop = await freshPage({ width: 1440, height: 950 });
await desktop.page.goto(`${baseURL}/`);
await desktop.page.screenshot({ path: new URL('desktop-first-screen.png', output).pathname });
await desktop.context.close();

const phone = await freshPage({ width: 390, height: 844 });
await phone.page.goto(`${baseURL}/`);
await phone.page.screenshot({ path: new URL('phone-first-screen.png', output).pathname });
await phone.context.close();

const win = await freshPage({ width: 1280, height: 900 });
await win.page.goto(`${baseURL}/demo`);
const winIntents = [];
for (let turn = 0; turn < 15; turn += 1) {
  winIntents.push((await win.page.locator('[data-testid="intent-text"]').textContent())?.trim());
  await win.page.locator('[data-cell].is-intent').click();
}
await win.page.locator('[data-end-panel]').scrollIntoViewIfNeeded();
await win.page.screenshot({ path: new URL('sample-win.png', output).pathname });
const winSummary = await win.page.locator('[data-end-panel]').innerText();
await win.context.close();

const loss = await freshPage({ width: 1280, height: 900 });
await loss.page.goto(`${baseURL}/demo`);
let lossTurns = 0;
while (await loss.page.getByRole('button', { name: 'Hold position' }).isVisible().catch(() => false)) {
  await loss.page.getByRole('button', { name: 'Hold position' }).click();
  lossTurns += 1;
}
await loss.page.locator('[data-end-panel]').scrollIntoViewIfNeeded();
await loss.page.screenshot({ path: new URL('sample-loss.png', output).pathname });
const lossSummary = await loss.page.locator('[data-end-panel]').innerText();
await loss.context.close();

await writeFile(new URL('run-summary.json', output), `${JSON.stringify({
  seed: 'SAMPLE-EMBER-7',
  win: { actions: winIntents.length, strategy: 'Fire on the shown intent', endScreen: winSummary },
  loss: { actions: lossTurns, strategy: 'Hold position', endScreen: lossSummary },
}, null, 2)}\n`);

await browser.close();
