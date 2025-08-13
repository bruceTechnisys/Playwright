## Playwright E2E Tests (Page Object Model)

### Descripción
Proyecto base de pruebas end‑to‑end con Playwright utilizando la metodología Page Object Model (POM). Incluye ejemplos sobre `https://playwright.dev/`, un `baseURL` preconfigurado y pruebas que demuestran navegación y aserciones básicas.

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
  PlaywrightHomePage.ts       # Page Object de la home de playwright.dev
tests/
  example.spec.ts             # Pruebas que usan el Page Object
```

### Metodología Page Object Model (POM)
Los Page Objects encapsulan selectores y acciones, manteniendo los specs limpios y orientados a comportamiento.

Ejemplo de Page Object (fragmento de `pages/PlaywrightHomePage.ts`):
```ts
import { expect, type Page } from '@playwright/test';

export class PlaywrightHomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async assertTitleContainsPlaywright() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }

  async clickGetStarted() {
    await this.page.getByRole('link', { name: 'Get started' }).click();
  }

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

### Convenciones recomendadas
- Ubicar Page Objects en `pages/` con nombre `XxxPage.js`.
- Mantener selectores dentro de los Page Objects; evitar usarlos directamente en los specs.
- Nombrar métodos de Page Object como acciones o consultas (p. ej. `login`, `fillForm`, `profileName`).

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

### Extender el proyecto
1) Crea un nuevo Page Object en `pages/` (por ejemplo, `LoginPage.js`).
2) Añade métodos que representen acciones/consultas de la página.
3) Úsalo desde tus specs en `tests/`.

### Licencia
ISC


