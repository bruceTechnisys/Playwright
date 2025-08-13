// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage.js';

test('has title', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await home.assertTitleContainsPlaywright(expect);
});

test('get started link', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await home.clickGetStarted();
  await expect(home.installationHeading()).toBeVisible();
});
