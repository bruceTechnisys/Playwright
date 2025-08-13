// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Home extra tests @regression', () => {
  test('Get started navigates to docs intro', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    await home.clickGetStarted();
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(home.installationHeading()).toBeVisible();
  });

  test('Navbar shows key links @smoke', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  });
});


