import { test, expect, type Page } from '@playwright/test';
import woodbank from '../src/content/woodbank/site.json' with { type: 'json' };
import focaccia from '../src/content/menu/focaccia.json' with { type: 'json' };

async function openPage(page: Page, route: string) {
  const response = await page.goto(route);
  expect(response?.status(), `${route} should load successfully`).toBe(200);
  await expect(page.getByRole('main')).toBeVisible();
}

test('homepage has an accessible heading and visible keyboard skip link', async ({ page }) => {
  await openPage(page, '/');
  await expect(page.getByRole('heading', { level: 1, name: 'La Cucina Povera' })).toHaveCount(1);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS('clip', 'auto');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('both status badges use London time and refresh at opening and closing', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-14T17:59:30Z') });
  await openPage(page, '/');
  const badges = page.locator('[data-override]');
  await expect(badges).toHaveCount(2);
  const labels = badges.locator('[id^="status-badge-text"]');
  const expectStatus = async (text: string) => {
    await expect(labels).toHaveText([text, text]);
    for (const badge of await badges.all()) await expect(badge).toHaveAttribute('aria-label', text);
    await expect(page.locator('[data-override]:visible')).toHaveAccessibleName(text);
  };
  await expectStatus('Closed now');
  await page.clock.fastForward(60_000);
  await expectStatus('Open now');
  await page.clock.fastForward(3 * 60 * 60 * 1000);
  await expectStatus('Closed now');
});

test('mobile menu supports Escape and releases scroll lock on desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page, '/');
  const burger = page.locator('#nav-burger');
  const drawer = page.locator('#mobile-menu');
  await burger.click();
  await expect(burger).toHaveAccessibleName('Close menu');
  await expect(drawer.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(burger).toBeFocused();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await burger.click();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(drawer).toBeHidden();
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('mobile menu closes when keyboard focus leaves the navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page, '/');
  await page.locator('#nav-burger').click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'Find us' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('photo lightbox contains focus and restores it on every close path', async ({ page }) => {
  await openPage(page, '/photos');
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr');
  const trigger = page.getByRole('button', { name: /^View / }).first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close', exact: true });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await page.locator('.site-nav__logo').evaluate((element: HTMLElement) => element.focus());
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await trigger.click();
  await close.click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.click({ position: { x: 5, y: 5 } });
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('sandwich page renders CMS items, prices, and dietary labels', async ({ page }) => {
  await openPage(page, '/sandwiches');
  const items = page.getByRole('main').getByRole('article');
  await expect(items).toHaveCount(focaccia.items.length);
  for (const [index, item] of focaccia.items.entries()) {
    const row = items.nth(index);
    await expect(row.getByRole('heading', { level: 3 })).toContainText(item.name);
    await expect(row.locator('.menu-item__desc')).toHaveText(item.description);
    await expect(row.locator('.price-tag')).toHaveText(item.price);
    const dietary = { v: 'Veggie', vg: 'Vegan', gf: 'GF' }[item.dietary];
    if (dietary) await expect(row.locator('.menu-item__dietary')).toHaveText(dietary);
    else await expect(row.locator('.menu-item__dietary')).toHaveCount(0);
  }
});

test('pizza page renders its CMS menu, dippers, prices, and optional directions', async ({ page }) => {
  await openPage(page, '/pizzas');
  const entries = [...woodbank.pizzas, ...woodbank.dippers];
  const items = page.getByRole('main').getByRole('article');
  await expect(items).toHaveCount(entries.length);
  await expect(items.getByRole('heading', { level: 3 })).toHaveText(entries.map(item => item.name));
  await expect(items.locator('.price-tag')).toHaveText(entries.map(item => item.price));
  await expect(items.locator('.menu-item__desc')).toHaveText(woodbank.pizzas.map(pizza => pizza.description));
  const directions = page.getByRole('main').getByRole('link', { name: 'Get directions' });
  if (woodbank.googleMapsUrl) {
    await expect(directions).toHaveCount(2);
    for (const link of await directions.all()) await expect(link).toHaveAttribute('href', woodbank.googleMapsUrl);
  } else {
    await expect(directions).toHaveCount(0);
  }
});

test('important text colours meet contrast thresholds', async ({ page }) => {
  const luminance = (colour: string) => {
    const channels = colour.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const [route, selector, backgroundSelector, minimum] of [
    ['/', '.hero .btn--ink', '.hero .btn--ink', 4.5],
    ['/', '.hero-kicker .label', 'body', 4.5],
    ['/pizzas', 'h1', '.page-hero', 3],
    ['/pizzas', '.menu-sheet .menu-item__name', '.menu-sheet', 3],
  ] as const) {
    await openPage(page, route);
    const colour = await page.locator(selector).first().evaluate(el => getComputedStyle(el).color);
    const background = await page.locator(backgroundSelector).first().evaluate(el => getComputedStyle(el).backgroundColor);
    const values = [luminance(colour), luminance(background)].sort((a, b) => b - a);
    expect((values[0] + 0.05) / (values[1] + 0.05), selector).toBeGreaterThanOrEqual(minimum);
  }
});

for (const route of ['/', '/pizzas', '/sandwiches', '/photos']) {
  test(`${route} loads its content within a narrow mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await openPage(page, route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
}
