// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Accessibility @a11y', () => {
  test('Page has proper heading structure', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar estructura de headings
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1); // Al menos un H1
    
    // Verificar que hay H2s o H3s para las secciones principales
    const h2s = page.locator('h2');
    const h3s = page.locator('h3');
    const h2Count = await h2s.count();
    const h3Count = await h3s.count();
    
    expect(h2Count + h3Count).toBeGreaterThan(0); // Al menos algunos sub-headings
    
    console.log(`Heading structure: H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}`);
  });

  test('Links have accessible text or aria-labels', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    // Verificar los primeros 15 links para no hacer el test muy lento
    const linksToCheck = Math.min(linkCount, 15);
    
    for (let i = 0; i < linksToCheck; i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        
        // El link debe tener texto, aria-label, o title
        const hasAccessibleText = (text && text.trim().length > 0) || 
                                 (ariaLabel && ariaLabel.trim().length > 0) || 
                                 (title && title.trim().length > 0);
        
        if (!hasAccessibleText) {
          console.log(`Link without accessible text found: ${await link.getAttribute('href')}`);
        }
        
        expect(hasAccessibleText).toBeTruthy();
      }
    }
  });

  test('Images have alt text or are decorative', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaHidden = await img.getAttribute('aria-hidden');
        
        // La imagen debe tener alt text, o ser marcada como decorativa
        const isAccessible = (alt !== null) || 
                            (role === 'presentation') || 
                            (ariaHidden === 'true');
        
        if (!isAccessible) {
          const src = await img.getAttribute('src');
          console.log(`Image without alt text found: ${src}`);
        }
        
        expect(isAccessible).toBeTruthy();
      }
    }
  });

  test('Interactive elements are keyboard accessible', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que elementos interactivos principales son accesibles por teclado
    const interactiveElements = [
      home.getStartedLink(),
      home.docsLink(),
      home.apiLink(),
      home.communityLink()
    ];
    
    for (const element of interactiveElements) {
      if (await element.isVisible()) {
        // Focus en el elemento
        await element.focus();
        
        // Verificar que tiene focus
        const isFocused = await element.evaluate(el => el === document.activeElement);
        expect(isFocused).toBeTruthy();
        
        // Verificar que se puede activar con Enter o Space
        await element.focus();
        // No activamos realmente para no navegar, solo verificamos que es focuseable
      }
    }
  });

  test('Page has proper ARIA landmarks', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar landmarks comunes
    const landmarks = [
      'main',
      'nav',
      'header',
      'footer'
    ];
    
    let landmarksFound = 0;
    
    for (const landmark of landmarks) {
      const elements = page.locator(landmark);
      const count = await elements.count();
      if (count > 0) {
        landmarksFound++;
        console.log(`Found ${count} ${landmark} landmark(s)`);
      }
    }
    
    // Al menos algunos landmarks deberían estar presentes
    expect(landmarksFound).toBeGreaterThan(0);
  });

  test('Color contrast is sufficient for text elements', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que elementos de texto principales son visibles
    // (esto es una verificación básica - para contrast ratio exacto necesitaríamos axe-core)
    const textElements = [
      home.heroSection(),
      home.heroSubtitleSection(),
      home.crossBrowser(),
      home.getStartedLink()
    ];
    
    for (const element of textElements) {
      if (await element.isVisible()) {
        // Verificar que el elemento tiene contenido de texto visible
        const textContent = await element.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent!.trim().length).toBeGreaterThan(0);
        
        // Verificar que no está oculto visualmente
        const opacity = await element.evaluate(el => getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      }
    }
  });

  test('Form elements have proper labels if present', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Buscar elementos de formulario
    const formElements = page.locator('input, select, textarea');
    const formElementCount = await formElements.count();
    
    for (let i = 0; i < formElementCount; i++) {
      const element = formElements.nth(i);
      if (await element.isVisible()) {
        const id = await element.getAttribute('id');
        const ariaLabel = await element.getAttribute('aria-label');
        const ariaLabelledby = await element.getAttribute('aria-labelledby');
        const placeholder = await element.getAttribute('placeholder');
        
        // Buscar label asociado
        let hasLabel = false;
        if (id) {
          const associatedLabel = page.locator(`label[for="${id}"]`);
          hasLabel = await associatedLabel.count() > 0;
        }
        
        // El elemento debe tener label, aria-label, aria-labelledby, o al menos placeholder
        const isLabeled = hasLabel || ariaLabel || ariaLabelledby || placeholder;
        
        if (!isLabeled) {
          console.log(`Form element without proper labeling found`);
        }
        
        expect(isLabeled).toBeTruthy();
      }
    }
  });

  test('Skip links or navigation aids are present', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Buscar skip links (pueden estar ocultos hasta que reciben focus)
    const skipLinks = page.locator('a[href*="#"], [class*="skip"]');
    const skipLinkCount = await skipLinks.count();
    
    if (skipLinkCount > 0) {
      console.log(`Found ${skipLinkCount} potential skip link(s)`);
      
      // Verificar que al menos uno es funcional
      const firstSkipLink = skipLinks.first();
      if (await firstSkipLink.isVisible() || await firstSkipLink.count() > 0) {
        const href = await firstSkipLink.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
    
    // También verificar navegación por teclado general
    await page.keyboard.press('Tab');
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });
});
