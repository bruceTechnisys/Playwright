// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test('has title @smoke', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link @regression', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await home.clickGetStarted();
  await expect(home.installationHeading()).toBeVisible();
});


