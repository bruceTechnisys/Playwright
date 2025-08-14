// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Content and Messaging @smoke', () => {
  test('Main hero section displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar el título principal
    await expect(home.heroSection()).toBeVisible();
    
    // Verificar el subtítulo sobre navegadores
    await expect(home.heroSubtitleSection()).toBeVisible();
    
    // Verificar los contadores de estrellas en GitHub
    await expect(home.githubStarsElement()).toBeVisible();
  });

  test('Key features section is present', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar las características principales
    await expect(home.crossBrowser()).toBeVisible();
    await expect(home.crossPlatform()).toBeVisible();
    await expect(home.crossLanguage()).toBeVisible();
    await expect(home.testMobileWeb()).toBeVisible();
  });

  test('Feature descriptions contain expected content', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que las descripciones de features están presentes
    await expect(page.getByText('Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox')).toBeVisible();
    await expect(page.getByText('Test on Windows, Linux, and macOS, locally or on CI, headless or headed')).toBeVisible();
    await expect(page.getByText('Use the Playwright API in TypeScript, JavaScript, Python, .NET, Java')).toBeVisible();
  });

  test('Resilient testing section displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar sección de testing resiliente
    await expect(page.getByText('Resilient • No flaky tests')).toBeVisible();
    await expect(page.getByText('Auto-wait')).toBeVisible();
    await expect(page.getByText('Web-first assertions')).toBeVisible();
    await expect(page.getByText('Tracing')).toBeVisible();
  });

  test('No trade-offs section displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar sección de sin compromisos
    await expect(page.getByText('No trade-offs • No limits')).toBeVisible();
    await expect(page.getByText('Multiple everything')).toBeVisible();
    await expect(page.getByText('Trusted events')).toBeVisible();
    await expect(page.getByText('Test frames, pierce Shadow DOM')).toBeVisible();
  });

  test('Full isolation section displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar sección de aislamiento completo
    await expect(page.getByText('Full isolation • Fast execution')).toBeVisible();
    await expect(page.getByText('Browser contexts')).toBeVisible();
    await expect(page.getByText('Log in once')).toBeVisible();
  });

  test('Powerful tooling section displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar sección de herramientas
    await expect(page.getByText('Powerful Tooling')).toBeVisible();
    await expect(page.getByText('Codegen')).toBeVisible();
    await expect(page.getByText('Playwright inspector')).toBeVisible();
    await expect(page.getByText('Trace Viewer')).toBeVisible();
  });
});
