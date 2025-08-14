// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Responsive Design @regression', () => {
  test('Mobile navigation works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que el menú hamburguesa aparece en mobile
    const mobileMenuButton = home.mobileMenu();
    if (await mobileMenuButton.isVisible()) {
      await home.clickMobileMenu();
      await expect(home.docsLink()).toBeVisible();
    }
  });

  test('Content adapts to desktop screen size', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que el contenido principal es visible
    await expect(home.heroSection()).toBeVisible();
    await expect(home.heroSubtitleSection()).toBeVisible();
    await expect(home.crossBrowser()).toBeVisible();
  });

  test('Content adapts to tablet screen size', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que el contenido principal es visible en tablet
    await expect(home.heroSection()).toBeVisible();
    await expect(home.heroSubtitleSection()).toBeVisible();
    await expect(home.crossBrowser()).toBeVisible();
  });

  test('Content adapts to mobile screen size', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que el contenido principal es visible en mobile
    await expect(home.heroSection()).toBeVisible();
    await expect(home.heroSubtitleSection()).toBeVisible();
  });

  test('Large mobile screen displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 }); // iPhone 11 Pro Max
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar elementos principales
    await expect(home.heroSection()).toBeVisible();
    await expect(home.getStartedLink()).toBeVisible();
    await expect(home.crossBrowser()).toBeVisible();
  });

  test('Small desktop screen works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 }); // Small laptop
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar navegación y contenido
    await expect(home.docsLink()).toBeVisible();
    await expect(home.heroSection()).toBeVisible();
    await expect(home.crossBrowser()).toBeVisible();
  });

  test('Footer adapts to mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToFooter();
    
    // Verificar que los links del footer son accesibles en mobile
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(page.getByText('Copyright © 2025 Microsoft')).toBeVisible();
  });

  test('Features section layout adapts correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Test en diferentes tamaños
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Small laptop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Verificar que las características principales siguen siendo visibles
      await expect(home.crossBrowser()).toBeVisible();
      await expect(home.crossPlatform()).toBeVisible();
      await expect(home.crossLanguage()).toBeVisible();
    }
  });
});
