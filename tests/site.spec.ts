import { test, expect } from '@playwright/test';
import woodbank from '../src/content/woodbank/site.json' with { type: 'json' };

test('homepage has an accessible heading and visible keyboard skip link', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
  const badges = page.locator('[data-override]');
  await expect(badges).toHaveCount(2);
  await expect(badges).toHaveText(['Closed now', 'Closed now']);
  await page.clock.fastForward(60_000);
  await expect(badges).toHaveText(['Open now', 'Open now']);
  await page.clock.fastForward(3 * 60 * 60 * 1000);
  await expect(badges).toHaveText(['Closed now', 'Closed now']);
});

test('mobile menu supports Escape and releases scroll lock on desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
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
  await page.goto('/');
  await page.locator('#nav-burger').click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'Find us' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

for (const route of ['/menu', '/photos']) {
  test(`${route} lightbox contains focus and restores it on every close path`, async ({ page }) => {
    await page.goto(route);
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
}

test('Woodbank uses its own CMS menu and optional directions', async ({ page }) => {
  await page.goto('/woodbank');
  await expect(page.locator('.pizza-item__name')).toHaveText(woodbank.pizzas.map(pizza => pizza.name));
  const directions = page.locator('main').getByRole('link', { name: 'Get directions' });
  if (woodbank.googleMapsUrl) {
    await expect(directions).toHaveAttribute('href', woodbank.googleMapsUrl);
    await expect(directions).not.toHaveAttribute('href', /22\+Park\+Lane/);
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
    ['/', '.btn--primary', '.btn--primary', 4.5],
    ['/', '.section--beige .section-label', '.section--beige', 4.5],
    ['/woodbank', 'h1', '.page-hero', 3],
  ] as const) {
    await page.goto(route);
    const colour = await page.locator(selector).first().evaluate(el => getComputedStyle(el).color);
    const background = await page.locator(backgroundSelector).first().evaluate(el => getComputedStyle(el).backgroundColor);
    const values = [luminance(colour), luminance(background)].sort((a, b) => b - a);
    expect((values[0] + 0.05) / (values[1] + 0.05), selector).toBeGreaterThanOrEqual(minimum);
  }
});

test('Woodbank remains within a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/woodbank');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
