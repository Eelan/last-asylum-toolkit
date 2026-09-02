import { test, expect } from '@playwright/test';
import { TOOLS } from '../../src/lib/config/tools.js';

test('Every ready route loads without JavaScript errors or missing bundled assets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/');
  await expect(page.locator('.tool-card').first()).toBeVisible();
  for (const tool of TOOLS.filter((tool) => tool.ready)) {
    await page.goto('/#/' + tool.id);
    await expect(page.locator('.page-head h2')).toBeVisible();
    await expect(page.locator('#view [aria-busy]')).toHaveCount(0);
    await expect(page.locator('#view > :not(.page-head)').first()).toBeVisible();
    await expect(page.locator('#view')).not.toContainText('Impossible de charger');
  }
  expect(errors).toEqual([]);
});
test('Stocks persist across tools, rarity selection, reload, and old aliases', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lat-stock-ur-shards', '123');
  });
  await page.goto('/#/stocks');
  await page.locator('#stock-antitoxin').fill('100000');
  await page.goto('/#/antitoxin');
  await expect(page.locator('#anti-stock')).toHaveValue('100000');
  await page.locator('#anti-current').selectOption('90');
  await page.locator('#anti-target').selectOption('85');
  await expect(page.locator('#anti-total')).toHaveText('—');
  await page.goto('/#/shards');
  await expect(page.locator('#star-omni-stock')).toHaveValue('123');
  await page.locator('#star-omni-stock').fill('234');
  await page.locator('#star-rarity').selectOption('ssr');
  await page.locator('#star-omni-stock').fill('45');
  await page.locator('#star-rarity').selectOption('ur');
  await expect(page.locator('#star-omni-stock')).toHaveValue('234');
  await page.reload();
  await expect(page.locator('#star-omni-stock')).toHaveValue('234');
});
test('Hero filters, profiles, tracking and research modal remain interactive', async ({ page }) => {
  await page.goto('/#/heroes');
  await page.locator('#hero-search').fill('Arthur');
  await expect(page.locator('.catalog-hero')).toHaveCount(1);
  await page.locator('.catalog-hero-actions button').click();
  await page.locator('.catalog-hero-actions a').click();
  await expect(page.locator('.hero-skill').first()).toBeVisible();
  await page.goto('/#/my-heroes');
  await expect(page.locator('.tracked-hero')).toHaveCount(1);
  await page.locator('#hero-target').selectOption('5');
  await page.reload();
  await expect(page.locator('#hero-target')).toHaveValue('5');
  await page.goto('/#/researches');
  await page.locator('.research-node').first().click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Augmenter le niveau', exact: true }).click();
  await expect(page.locator('.research-level-controls strong')).toContainText('1/');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
});
test('Clock conversion retains timer instant, drafts and language selection', async ({ page }) => {
  await page.goto('/#/timers');
  await page.locator('#timer-name').fill('Test');
  await page.locator('[data-clock-mode="server"]').click();
  await page.locator('#timer-end').fill('2027-09-06T23:30');
  await page.locator('[data-clock-mode="local"]').click();
  await expect(page.locator('#timer-end')).toHaveValue('2027-09-07T03:30');
  await expect(page.locator('#timer-name')).toHaveValue('Test');
  await page.locator('.timer-submit').click();
  await expect(page.locator('.timer-card')).toHaveCount(1);
  await page.locator('[data-lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.timer-card-content strong')).toHaveText('Test');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
test('Mobile navigation hides planned tools and stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.tool-card').first()).toBeVisible();
  for (const tool of TOOLS.filter((tool) => !tool.ready))
    await expect(page.locator(`.tool-card[href="#/${tool.id}"],.nav-link[href="#/${tool.id}"]`)).toHaveCount(
      0
    );
  await page.locator('#mobile-menu').click();
  await expect(page.locator('.sidebar')).toHaveClass(/open/);
  await page.locator('.nav-link[href="#/antitoxin"]').click();
  await expect(page.locator('#anti-current')).toBeVisible();
  await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
