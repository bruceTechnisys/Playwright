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
playwright.config.js          # Configuración de Playwright (baseURL, proyectos/browsers, reporter)
pages/
  PlaywrightHomePage.js       # Page Object de la home de playwright.dev
tests/
  example.spec.js             # Pruebas que usan el Page Object
```

### Metodología Page Object Model (POM)
Los Page Objects encapsulan selectores y acciones, manteniendo los specs limpios y orientados a comportamiento.

Ejemplo de Page Object (fragmento de `pages/PlaywrightHomePage.js`):
```js
export class PlaywrightHomePage {
  constructor(page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('/');
  }
  async assertTitleContainsPlaywright(expect) {
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

Uso en un test (fragmento de `tests/example.spec.js`):
```js
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage.js';

test('get started link', async ({ page }) => {
  const home = new PlaywrightHomePage(page);
  await home.goto();
  await home.clickGetStarted();
  await expect(home.installationHeading()).toBeVisible();
});
```

### Configuración
- `baseURL`: definido en `playwright.config.js` como `https://playwright.dev/`. Ajusta este valor si tus tests apuntan a otra aplicación.
- Proyectos: configurados para `chromium`, `firefox` y `webkit` en desktop.
- Reporter: `html` por defecto.

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


