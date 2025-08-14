// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Performance and Loading @performance', () => {
  test('Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Esperar a que el contenido principal esté visible
    await expect(home.heroSection()).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // 10 segundos máximo para ser conservador
  });

  test('Critical elements load quickly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    const startTime = Date.now();
    
    await home.goto();
    
    // Verificar que elementos críticos cargan rápido
    await expect(home.heroSection()).toBeVisible();
    await expect(home.getStartedLink()).toBeVisible();
    await expect(home.docsLink()).toBeVisible();
    
    const criticalLoadTime = Date.now() - startTime;
    console.log(`Critical elements load time: ${criticalLoadTime}ms`);
    expect(criticalLoadTime).toBeLessThan(8000); // 8 segundos para elementos críticos
  });

  test('Images load correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Esperar a que la página se cargue completamente
    await expect(home.heroSection()).toBeVisible();
    
    // Verificar que las imágenes se cargan
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Verificar las primeras 5 imágenes para no hacer el test muy lento
      const imagesToCheck = Math.min(imageCount, 5);
      
      for (let i = 0; i < imagesToCheck; i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          await expect(img).toHaveAttribute('src', /.+/);
          
          // Verificar que la imagen se ha cargado
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Navigation is responsive', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Medir tiempo de respuesta de navegación
    const startTime = Date.now();
    
    await home.clickGetStarted();
    await expect(home.installationHeading()).toBeVisible();
    
    const navigationTime = Date.now() - startTime;
    console.log(`Navigation time: ${navigationTime}ms`);
    expect(navigationTime).toBeLessThan(5000); // 5 segundos para navegación
  });

  test('Page handles multiple interactions efficiently', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Realizar múltiples interacciones y medir el tiempo total
    const startTime = Date.now();
    
    // Scroll a diferentes secciones
    await home.scrollToCompanies();
    await expect(home.companies()).toBeVisible();
    
    await home.scrollToFooter();
    await expect(home.footer()).toBeVisible();
    
    // Volver al top
    await page.keyboard.press('Home');
    await expect(home.heroSection()).toBeVisible();
    
    const totalTime = Date.now() - startTime;
    console.log(`Multiple interactions time: ${totalTime}ms`);
    expect(totalTime).toBeLessThan(3000); // 3 segundos para múltiples interacciones
  });

  test('Page resources load efficiently', async ({ page }) => {
    // Monitorear requests de la página
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Esperar a que la página se cargue completamente
    await expect(home.heroSection()).toBeVisible();
    
    // Dar tiempo para que se carguen todos los recursos
    await page.waitForTimeout(2000);
    
    console.log(`Total requests made: ${requests.length}`);
    
    // Verificar que no hay demasiadas requests (performance)
    expect(requests.length).toBeLessThan(100); // Límite razonable de requests
    
    // Verificar que se cargan recursos esenciales
    const hasCSS = requests.some(url => url.includes('.css'));
    const hasJS = requests.some(url => url.includes('.js'));
    
    expect(hasCSS || hasJS).toBeTruthy(); // Al menos CSS o JS debe cargarse
  });

  test('Search functionality responds quickly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Solo probar si hay funcionalidad de búsqueda
    const searchButton = page.locator('[aria-label="Search"]');
    
    if (await searchButton.isVisible()) {
      const startTime = Date.now();
      
      await home.openSearch();
      
      const searchOpenTime = Date.now() - startTime;
      console.log(`Search open time: ${searchOpenTime}ms`);
      expect(searchOpenTime).toBeLessThan(2000); // 2 segundos para abrir búsqueda
    }
  });
});
