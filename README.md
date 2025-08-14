## Playwright E2E Tests (Page Object Model)

### Descripción
Proyecto completo de pruebas end‑to‑end con Playwright utilizando la metodología Page Object Model (POM). Incluye una suite comprensiva de tests para `https://playwright.dev/` con cobertura de funcionalidad, performance, accesibilidad y diseño responsivo.

### Requisitos
- Node.js 18 o superior (recomendado LTS)
- Navegadores de Playwright instalados

### Inicio rápido
1) Instalar dependencias
```bash
npm install
```

2) Instalar navegadores (si es necesario)
```bash
npx playwright install
```

3) Ejecutar pruebas
```bash
npx playwright test
```

4) Modo UI (explorar tests, reintentar, ver trazas)
```bash
npx playwright test --ui
```

5) Ejecutar en un navegador específico y en modo headed
```bash
npx playwright test --project=chromium --headed
```

6) Abrir el último reporte HTML
```bash
npx playwright show-report
```

### Configuración de BASE_URL por entorno
Este proyecto lee `BASE_URL` desde un archivo `.env` en la raíz (cargado con dotenv). Si no está definido, usa `https://playwright.dev/`.

1) Crear `.env` con el valor de tu app
```bash
BASE_URL=https://mi-app.local/
```

2) Alternativa (Windows PowerShell) sin `.env`:
```powershell
$env:BASE_URL="https://mi-app.local/"; npm test
```

3) Alternativa (Unix) en una sola línea:
```bash
BASE_URL=https://mi-app.local/ npm test
```

### Scripts de npm
- test: ejecuta la suite en modo headless
- test:headed: ejecuta tests con navegador visible
- test:ui: abre el Test Runner UI
- test:debug: ejecuta en modo depuración con el inspector
- report:open / show-report: abre el reporte HTML más reciente
- codegen: graba pasos y genera código apuntando a `https://playwright.dev/`

Ejemplos:
```bash
npm test
npm run test:headed
npm run test:ui
npm run test:debug
npm run report:open
npm run codegen
```

### Estructura del proyecto
```
playwright.config.ts          # Configuración de Playwright (baseURL, proyectos/browsers, reporter)
pages/
  PlaywrightHomePage.ts       # Page Object extendido de la home de playwright.dev
tests/
  example.spec.ts             # Pruebas básicas de ejemplo
  home-more.spec.ts           # Pruebas adicionales de navegación
  content-validation.spec.ts  # Validación de contenido principal (@smoke)
  navigation.spec.ts          # Tests de navegación y links (@regression)
  responsive.spec.ts          # Tests de diseño responsivo (@regression) 
  performance.spec.ts         # Tests de performance y carga (@performance)
  search.spec.ts              # Tests de funcionalidad de búsqueda (@regression)
  accessibility.spec.ts       # Tests de accesibilidad (@a11y)
  companies-section.spec.ts   # Tests de sección de empresas (@smoke)
utils/
  todo-helpers.ts             # Utilidades adicionales
```

### Metodología Page Object Model (POM)
Los Page Objects encapsulan selectores y acciones, manteniendo los specs limpios y orientados a comportamiento.

Buenas prácticas clave:
- No realizar aserciones dentro del POM.
- No pasar `expect` al POM.
- Devolver locators o resultados y realizar las aserciones en el spec.
- Definir locators una sola vez en el constructor y reutilizarlos.

Ejemplo de Page Object (fragmento de `pages/PlaywrightHomePage.ts`):
```ts
import { type Page, type Locator } from '@playwright/test';

export class PlaywrightHomePage {
  private readonly page: Page;
  private readonly getStartedLink: Locator;
  private readonly heroHeading: Locator;
  private readonly companiesSection: Locator;
  // ... más locators

  constructor(page: Page) {
    this.page = page;
    // Define locators una vez y reutilízalos
    this.getStartedLink = this.page.getByRole('link', { name: 'Get started' });
    this.heroHeading = this.page.getByRole('heading', { name: /Playwright enables/ });
    this.companiesSection = this.page.locator('text=Chosen by companies');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async scrollToCompanies(): Promise<void> {
    await this.companiesSection.scrollIntoViewIfNeeded();
  }

  // Exponer locators para aserciones en tests
  heroSection() { return this.heroHeading; }
  companies() { return this.companiesSection; }
  installationHeading() {
    return this.page.getByRole('heading', { name: 'Installation' });
  }
}
```

Uso en un test (fragmento de `tests/example.spec.ts`):
```ts
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test('get started link', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await home.clickGetStarted();
  await expect(home.installationHeading()).toBeVisible();
});
```

### Configuración
- `baseURL`: definido en `playwright.config.ts` y puede venir de `BASE_URL` en `.env` (fallback `https://playwright.dev/`).
- Proyectos: configurados para `chromium`, `firefox` y `webkit` en desktop.
- Reporter: `html` por defecto.

### Artefactos (screenshots, video, trace)
Por defecto:
- Screenshots: `only-on-failure`
- Video: `retain-on-failure`
- Trace: `retain-on-failure` en CI, `on-first-retry` en local

Forzar artefactos por CLI (ejemplos):
```bash
# Forzar trace en todas las ejecuciones
npx playwright test --trace=on

# Forzar video y screenshots
npx playwright test --video=on --screenshot=on

# Abrir el reporte HTML (contiene enlaces a traces/videos)
npx playwright show-report

# Abrir un trace específico
npx playwright show-trace path/a/trace.zip
```

### Suite de Tests Implementada

#### Tests por Categoría (49 tests totales)

**Tests de Smoke (@smoke) - 13 tests**
- Verificación de elementos críticos y contenido principal
- Ejecución rápida para validación básica
```bash
npx playwright test --grep @smoke
```

**Tests de Regresión (@regression) - 28 tests**
- Navegación, links, responsive design, búsqueda
- Cobertura completa de funcionalidades
```bash
npx playwright test --grep @regression
```

**Tests de Performance (@performance) - 7 tests**
- Tiempos de carga, imágenes, navegación, recursos
- Validación de umbrales de performance
```bash
npx playwright test --grep @performance
```

**Tests de Accesibilidad (@a11y) - 8 tests**
- Headings, ARIA, navegación por teclado, contraste
- Cumplimiento de estándares de accesibilidad
```bash
npx playwright test --grep @a11y
```

#### Archivos de Test Específicos

```bash
# Tests de contenido principal
npx playwright test tests/content-validation.spec.ts

# Tests de navegación y links
npx playwright test tests/navigation.spec.ts

# Tests responsive (móvil, tablet, desktop)
npx playwright test tests/responsive.spec.ts

# Tests de performance y carga
npx playwright test tests/performance.spec.ts

# Tests de funcionalidad de búsqueda
npx playwright test tests/search.spec.ts

# Tests de accesibilidad
npx playwright test tests/accessibility.spec.ts

# Tests de sección de empresas
npx playwright test tests/companies-section.spec.ts
```

### Etiquetas y filtrado (grep)
- Etiqueta tests en el título con `@smoke`, `@regression`, etc.: por ejemplo `test('login @smoke', ...)` o `test.describe('Checkout @regression', ...)`.
- Ejecuta subconjuntos con `--grep`:
```bash
# Solo smoke
npm test -- --grep=@smoke

# Solo regression
npm test -- --grep=@regression

# Solo performance
npm test -- --grep=@performance

# Solo accesibilidad
npm test -- --grep=@a11y

# Excluir regression (invertir filtro)
npm test -- --grep=@regression --grep-invert

# Combinar (regex): smoke o critical
npm test -- --grep="@smoke|@critical"

# Ejecutar en navegador específico
npx playwright test --grep @smoke --project=chromium
```

### Convenciones recomendadas
- Ubicar Page Objects en `pages/` con nombre `XxxPage.ts`.
- Mantener selectores dentro de los Page Objects; evitar usarlos directamente en los specs.
- Nombrar métodos de Page Object como acciones o consultas (p. ej. `login`, `fillForm`, `profileName`).
- Hacer aserciones en los specs usando `expect`, no en el POM; el POM debe exponer locators o datos.
- Usar tags apropiados: `@smoke` para críticos, `@regression` para completos, `@performance` para rendimiento, `@a11y` para accesibilidad.
- Implementar manejo de errores gracioso - los tests deben fallar con información útil.
- Probar en múltiples viewports para garantizar diseño responsivo.
- Incluir timeouts razonables en tests de performance (conservadores para evitar flakiness).

Ejemplo de patrón de locators en el constructor (TypeScript):
```ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Solución de problemas
- Error TLS corporativo: `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`
  - Exporta el certificado raíz corporativo a un `.pem` y configura:
  ```powershell
  setx NODE_EXTRA_CA_CERTS "C:\ruta\a\corp-root.pem"
  npm config set cafile "C:\ruta\a\corp-root.pem"
  ```
  - Si usas proxy, define variables (ajusta URL/credenciales):
  ```powershell
  setx HTTPS_PROXY "http://usuario:password@proxy.midominio:8080"
  setx HTTP_PROXY  "http://usuario:password@proxy.midominio:8080"
  setx NO_PROXY    "localhost,127.0.0.1"
  ```

### Características Avanzadas de la Suite

#### Tests de Performance
- Monitoreo de tiempos de carga (< 10s página completa, < 8s elementos críticos)
- Validación de imágenes y recursos
- Medición de respuesta de navegación e interacciones
- Auditoría de requests HTTP

#### Tests de Accesibilidad
- Estructura semántica de headings (H1, H2, H3)
- Validación de alt text en imágenes
- Navegación por teclado funcional
- ARIA landmarks y roles
- Contraste y legibilidad

#### Tests Responsivos
- Viewports: Desktop (1920x1080), Laptop (1024x768), Tablet (768x1024), Mobile (375x667)
- Navegación móvil y menús hamburguesa
- Adaptación de contenido por pantalla
- Layout fluido y elementos accesibles

#### Manejo de Errores Robusto
- Tests que fallan graciosamente cuando elementos no existen
- Logging informativo para debugging
- Verificaciones condicionales para funcionalidades opcionales
- Timeouts apropiados y esperas inteligentes

### Extender el proyecto
1) Crea un nuevo Page Object en `pages/` (por ejemplo, `LoginPage.ts`).
2) Añade métodos que representen acciones/consultas de la página.
3) Úsalo desde tus specs en `tests/`.
4) Usa los tags apropiados (@smoke, @regression, @performance, @a11y).
5) Sigue las convenciones de naming y estructura establecidas.

### Licencia
ISC


