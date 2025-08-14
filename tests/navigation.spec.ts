// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Navigation and Links @regression', () => {
  test('Language selector works correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar selector de lenguajes
    await expect(page.getByText('Node.js')).toBeVisible();
    await expect(page.getByText('Python')).toBeVisible();
    await expect(page.getByText('Java')).toBeVisible();
    await expect(page.getByText('.NET')).toBeVisible();
  });

  test('Main navigation links are present and visible', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar links principales de navegación
    await expect(home.docsLink()).toBeVisible();
    await expect(home.apiLink()).toBeVisible();
    await expect(home.communityLink()).toBeVisible();
  });

  test('Footer links are functional', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Scroll al footer
    await home.scrollToFooter();
    
    // Verificar links del footer
    await expect(page.getByRole('link', { name: 'Getting started' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Stack Overflow' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Discord' })).toBeVisible();
  });

  test('Footer sections are properly organized', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToFooter();
    
    // Verificar secciones del footer
    await expect(page.getByText('Learn')).toBeVisible();
    await expect(page.getByText('Community')).toBeVisible();
    await expect(page.getByText('More')).toBeVisible();
    
    // Verificar algunos links específicos de cada sección
    await expect(page.getByRole('link', { name: 'Playwright Training' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'YouTube' })).toBeVisible();
  });

  test('External links have proper attributes', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToFooter();
    
    // Verificar que los links externos tienen target="_blank"
    const githubLink = page.getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toBeVisible();
    
    const twitterLink = page.getByRole('link', { name: 'Twitter' });
    await expect(twitterLink).toBeVisible();
  });

  test('Copyright notice is present', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToFooter();
    
    // Verificar copyright
    await expect(page.getByText('Copyright © 2025 Microsoft')).toBeVisible();
  });

  test('Docs navigation leads to correct page', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Click en Docs y verificar navegación
    await home.docsLink().click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('API navigation leads to correct page', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Click en API y verificar navegación
    await home.apiLink().click();
    await expect(page).toHaveURL(/\/docs\/api/);
  });

  test('Community navigation leads to correct page', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Click en Community y verificar navegación
    await home.communityLink().click();
    await expect(page).toHaveURL(/\/community/);
  });
});
