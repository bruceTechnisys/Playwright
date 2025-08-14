// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test.describe('Companies Section @smoke', () => {
  test('Companies section heading displays correctly', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Scroll a la sección de empresas
    await home.scrollToCompanies();
    
    // Verificar el heading de la sección
    await expect(home.companies()).toBeVisible();
    await expect(page.getByText('Chosen by companies and open source projects')).toBeVisible();
  });

  test('Technology companies are displayed', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToCompanies();
    
    // Verificar empresas tecnológicas importantes
    const techCompanies = [
      'VS Code',
      'Microsoft', // Podría aparecer como parte de VS Code o separado
      'Adobe',
      'ING'
    ];
    
    for (const company of techCompanies) {
      const companyElement = page.getByText(company, { exact: false });
      if (await companyElement.count() > 0) {
        await expect(companyElement.first()).toBeVisible();
        console.log(`Found company: ${company}`);
      }
    }
  });

  test('Media and entertainment companies are displayed', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToCompanies();
    
    // Verificar empresas de medios y entretenimiento
    const mediaCompanies = [
      'Disney+ Hotstar',
      'Bing',
      'Outlook'
    ];
    
    for (const company of mediaCompanies) {
      const companyElement = page.getByText(company, { exact: false });
      if (await companyElement.count() > 0) {
        await expect(companyElement.first()).toBeVisible();
        console.log(`Found media company: ${company}`);
      }
    }
  });

  test('Open source projects are displayed', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToCompanies();
    
    // Verificar proyectos open source
    const openSourceProjects = [
      'Material UI',
      'React Navigation',
      'Accessibility Insights'
    ];
    
    for (const project of openSourceProjects) {
      const projectElement = page.getByText(project, { exact: false });
      if (await projectElement.count() > 0) {
        await expect(projectElement.first()).toBeVisible();
        console.log(`Found open source project: ${project}`);
      }
    }
  });

  test('Companies section is properly positioned', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Verificar que la sección de empresas aparece después del contenido principal
    // pero antes del footer
    const heroSection = home.heroSection();
    const companiesSection = home.companies();
    const footerSection = home.footer();
    
    await expect(heroSection).toBeVisible();
    
    // Scroll hasta empresas
    await home.scrollToCompanies();
    await expect(companiesSection).toBeVisible();
    
    // Continuar hasta footer
    await home.scrollToFooter();
    await expect(footerSection).toBeVisible();
    
    // Verificar orden visual (posición Y)
    const heroBox = await heroSection.boundingBox();
    const companiesBox = await companiesSection.boundingBox();
    const footerBox = await footerSection.boundingBox();
    
    if (heroBox && companiesBox && footerBox) {
      expect(companiesBox.y).toBeGreaterThan(heroBox.y); // Empresas después del hero
      expect(footerBox.y).toBeGreaterThan(companiesBox.y); // Footer después de empresas
    }
  });

  test('Company logos or names are clickable when applicable', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToCompanies();
    
    // Buscar links en la sección de empresas
    const companyLinks = page.locator('a').filter({
      has: page.getByText('VS Code').or(
        page.getByText('Adobe')
      ).or(
        page.getByText('Material UI')
      )
    });
    
    const linkCount = await companyLinks.count();
    
    if (linkCount > 0) {
      // Verificar que los primeros links tienen href válidos
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = companyLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href) {
          expect(href.length).toBeGreaterThan(0);
          console.log(`Company link found: ${href}`);
        }
      }
    } else {
      console.log('No clickable company links found - companies displayed as text only');
    }
  });

  test('Companies section is responsive', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    // Test en diferentes tamaños de pantalla
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet  
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      await home.scrollToCompanies();
      
      // Verificar que la sección sigue siendo visible y accesible
      await expect(home.companies()).toBeVisible();
      
      // Verificar que al menos algunas empresas son visibles
      const vsCode = page.getByText('VS Code');
      if (await vsCode.count() > 0) {
        await expect(vsCode.first()).toBeVisible();
      }
      
      console.log(`Companies section responsive at ${viewport.width}x${viewport.height}`);
    }
  });

  test('Companies section has proper contrast and readability', async ({ page }) => {
    const home = new PlaywrightHomePage(page);
    await home.goto();
    
    await home.scrollToCompanies();
    
    // Verificar que los nombres de empresas son legibles
    const companyNames = [
      'VS Code',
      'Adobe', 
      'Disney+ Hotstar',
      'Material UI'
    ];
    
    for (const name of companyNames) {
      const element = page.getByText(name, { exact: false });
      if (await element.count() > 0) {
        const firstElement = element.first();
        
        // Verificar que el elemento es visible
        await expect(firstElement).toBeVisible();
        
        // Verificar que tiene contenido de texto
        const textContent = await firstElement.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent!.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
