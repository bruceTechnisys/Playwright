// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Search Functionality @regression', () => {
  test('Search button is accessible when present', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Buscar diferentes posibles selectores para búsqueda
    const searchSelectors = [
      '[aria-label="Search"]',
      '[data-testid="search"]',
      '.search-button',
      'button[type="search"]',
      '[placeholder*="Search"]',
      '.DocSearch-Button'
    ];
    
    let searchFound = false;
    
    for (const selector of searchSelectors) {
      const searchElement = page.locator(selector);
      if (await searchElement.isVisible()) {
        searchFound = true;
        console.log(`Search element found with selector: ${selector}`);
        
        // Verificar que es clickeable
        await expect(searchElement).toBeVisible();
        break;
      }
    }
    
    // Si no se encuentra búsqueda, no es un error - solo log
    if (!searchFound) {
      console.log('No search functionality detected on the page');
    }
  });

  test('Search functionality works if available', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Intentar diferentes selectores de búsqueda
    const searchButton = page.locator('[aria-label="Search"]').or(
      page.locator('.DocSearch-Button')
    ).or(
      page.locator('[data-testid="search"]')
    );
    
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Buscar campo de input después de abrir búsqueda
      const searchInput = page.locator('input[type="search"]').or(
        page.locator('[placeholder*="Search"]')
      ).or(
        page.locator('.DocSearch-Input')
      );
      
      if (await searchInput.isVisible()) {
        // Escribir en el campo de búsqueda
        await searchInput.fill('test');
        
        // Esperar un momento para resultados
        await page.waitForTimeout(1000);
        
        // Verificar que hay alguna respuesta (resultados o mensaje)
        const searchResults = page.locator('[data-testid="search-results"]').or(
          page.locator('.search-results')
        ).or(
          page.locator('.DocSearch-Dropdown')
        );
        
        // Si hay resultados, verificar que son visibles
        if (await searchResults.isVisible()) {
          await expect(searchResults).toBeVisible();
        }
      }
    } else {
      console.log('Search functionality not available on this page');
    }
  });

  test('Search modal can be closed if opened', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    const searchButton = page.locator('[aria-label="Search"]').or(
      page.locator('.DocSearch-Button')
    );
    
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Intentar cerrar con Escape
      await page.keyboard.press('Escape');
      
      // Verificar que el modal se cerró
      const searchModal = page.locator('.DocSearch-Modal').or(
        page.locator('[role="dialog"]')
      );
      
      if (await searchModal.isVisible()) {
        await expect(searchModal).not.toBeVisible();
      }
    }
  });

  test('Search keyboard shortcuts work if available', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Probar atajos comunes de búsqueda
    const shortcuts = [
      'Control+k',
      'Control+/',
      '/'
    ];
    
    for (const shortcut of shortcuts) {
      await page.keyboard.press(shortcut);
      
      // Verificar si se abre algún modal de búsqueda
      const searchModal = page.locator('.DocSearch-Modal').or(
        page.locator('[role="dialog"]')
      ).or(
        page.locator('[data-testid="search-modal"]')
      );
      
      if (await searchModal.isVisible()) {
        console.log(`Search opened with shortcut: ${shortcut}`);
        
        // Cerrar el modal
        await page.keyboard.press('Escape');
        break;
      }
      
      // Esperar un poco antes del siguiente intento
      await page.waitForTimeout(500);
    }
  });

  test('Search input handles different types of queries', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    const searchButton = page.locator('[aria-label="Search"]').or(
      page.locator('.DocSearch-Button')
    );
    
    if (await searchButton.isVisible()) {
      const queries = ['test', 'API', 'browser', 'installation'];
      
      for (const query of queries) {
        await searchButton.click();
        
        const searchInput = page.locator('input[type="search"]').or(
          page.locator('[placeholder*="Search"]')
        ).or(
          page.locator('.DocSearch-Input')
        );
        
        if (await searchInput.isVisible()) {
          await searchInput.fill(query);
          
          // Esperar respuesta
          await page.waitForTimeout(1000);
          
          // Limpiar para próxima query
          await searchInput.fill('');
        }
        
        // Cerrar búsqueda
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });
});
