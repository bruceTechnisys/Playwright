// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage.js';

test.describe('Home extra tests', () => {
  test('Get started navigates to docs intro', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    await home.clickGetStarted();
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(home.installationHeading()).toBeVisible();
  });

  test('Navbar shows key links', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  });
});


