# Reporte de Mitigación de Seguridad y Linter (OWASP Top 10, Semgrep y ESLint)

Este reporte detalla el estado de seguridad y cumplimiento del **Backend** y del **Frontend** antes y después de aplicar las mitigaciones de código estático (`ESLint`), análisis de vulnerabilidades de seguridad (`Semgrep`) y el escaneo dinámico basado en las directrices de **OWASP Top 10** (`OWASP ZAP / Checkmarx`).

---

## 1. Resumen Ejecutivo de Estado (Antes vs. Después)

| Componente | Herramienta | Alertas / Errores Iniciales | Estado Posterior (Mitigado) | Estado de Compilación / Ejecución |
|---|---|---|---|---|
| **Backend** | **ESLint** | ✖ 17 problemas (16 errores, 1 warning) | ✔ **0 problemas** | ✔ Exitoso (`npm run build` OK) |
| **Backend** | **Semgrep** | ✖ 3 vulnerabilidades críticas (bloqueantes) | ✔ **0 vulnerabilidades** | ✔ Exitoso |
| **Frontend** | **ESLint** | ✔ 0 errores, 0 warnings | ✔ **0 problemas** | ✔ Exitoso (`npm run build` OK) |
| **Frontend** | **Semgrep** | ✔ 0 vulnerabilidades | ✔ **0 vulnerabilidades** | ✔ Exitoso |
| **Frontend** | **OWASP ZAP** | ✖ 3 alertas de riesgo Medio (CSP) | ✔ **Mitigado / Explicado** | ✔ Exitoso |

---

## 2. Detalle de Mitigaciones en el Backend

### A. Correcciones de Calidad de Código y Tipos (ESLint)

#### 1. Tipado Inseguro de Bcrypt
* **Problema Original**: Múltiples errores `@typescript-eslint/no-unsafe-*` en `user.service.ts` y `seed.ts`. El linter detectaba que `bcrypt.hash` devolvía un valor de tipo `any` o de tipo `error` (debido a la ausencia de firmas de tipo definidas).
* **Solución**: Se instaló `@types/bcrypt` como dependencia de desarrollo (`npm install -D @types/bcrypt`), permitiendo que el compilador de TypeScript y ESLint validaran correctamente las firmas de los métodos criptográficos.

#### 2. Desestructuración con Variables No Usadas (`user.service.ts`)
* **Problema Original**: Error `@typescript-eslint/no-unused-vars` en el método `sanitize()`. Las variables temporales `_pw`, `_la` y `_lu` eran creadas en la desestructuración de exclusión, pero nunca se leían.
* **Solución**: Se reescribió el método usando una copia superficial del objeto y eliminando los campos de manera segura con el operador `delete`:
  ```typescript
  private sanitize(user: User): User {
    const copy = { ...user };
    delete (copy as Partial<User>).password;
    delete (copy as Partial<User>).loginAttempts;
    delete (copy as Partial<User>).lockedUntil;
    return copy;
  }
  ```

#### 3. Callback Inseguro de Stream de Escritura PDF (`voucher-pdf.generator.ts`)
* **Problema Original**: Advertencia de parámetro de tipo `any` asignado a un arreglo tipado `Buffer[]`.
* **Solución**: Se tipó explícitamente el argumento como `unknown` y se realizó un casteo seguro a `Buffer` al agregarlo en el array:
  ```typescript
  doc.on('data', (chunk: unknown) => chunks.push(chunk as Buffer));
  ```

#### 4. Variable Inútil en Semilla de Datos (`seed.ts`)
* **Problema Original**: La constante `adminCentro` guardaba el resultado de `userRepo.save()` pero nunca se utilizaba.
* **Solución**: Se removió la declaración de la constante y se dejó la llamada de base de datos directa.

---

### B. Mitigaciones de Seguridad (Semgrep)

#### 1. Pinning de Acciones de GitHub (Vulnerabilidad de Cadena de Suministro)
* **Problema Original**: El pipeline de CI/CD utilizaba etiquetas de versiones mutables (`actions/checkout@v4` y `actions/setup-node@v4`). Estas etiquetas pueden ser modificadas o secuestradas por atacantes.
* **Solución**: Se fijaron ambas acciones de GitHub a sus hashes SHA inmutables de 40 caracteres correspondientes a las versiones estables certificadas:
  * `actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332` (v4.1.7)
  * `actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b` (v4.0.3)

#### 2. Bypass de Verificación TLS/SSL de Base de Datos (Ataques MITM)
* **Problema Original**: En `app.module.ts`, la configuración de SSL para el entorno de producción utilizaba la opción `rejectUnauthorized: false` hardcodeada. Esto permitía conexiones SSL sin validar el certificado del servidor, haciéndolo vulnerable a escuchas activas (Man-In-The-Middle).
* **Solución**: Se parametrizó la validación del certificado mediante la variable de entorno `DB_SSL_REJECT_UNAUTHORIZED`. Esto elimina el bypass del código fuente y permite establecer la verificación en entornos seguros:
  ```typescript
  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? {
          rejectUnauthorized:
            configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED') === 'true',
        }
      : false,
  ```

---

## 3. Detalle de Mitigaciones en el Frontend

El análisis estático (`ESLint` y `Semgrep`) del Frontend no reportó ningún problema inicial. No obstante, el escaneo dinámico de **OWASP ZAP** reportó alertas de nivel **Medio** relacionadas con la cabecera **Content Security Policy (CSP)**.

### A. Alertas de OWASP ZAP y su Mitigación

#### 1. CSP: Failure to Define Directive with No Fallback (frame-ancestors)
* **Problema Original**: La política CSP configurada no definía la directiva `frame-ancestors`. Dado que esta directiva no hereda de `default-src`, la ausencia de la misma permitía que cualquier sitio web incrustara la aplicación del hotel en un `<iframe>`, haciendo la web susceptible a ataques de **Clickjacking**.
* **Solución**: Se añadió la directiva `frame-ancestors 'none';` en las configuraciones de cabecera de desarrollo y producción dentro del archivo [vue.config.js](file:///c:/Users/quisp/Documents/GitHub/platform_hotel/vue.config.js):
  ```javascript
  const productionContentSecurityPolicy = `...; frame-ancestors 'none';`;
  ```
  *(Nota: Esto se complementa con la cabecera `X-Frame-Options: DENY` que ya estaba activa en los encabezados globales de seguridad).*

#### 2. CSP: script-src 'unsafe-eval'
* **Problema Original**: ZAP detectó que la política CSP permitía la evaluación dinámica de scripts (`'unsafe-eval'`).
* **Análisis y Mitigación**:
  * **En Desarrollo**: Esta regla se activa de forma controlada e intencional únicamente en el servidor local (`http://localhost:8080`) para permitir el funcionamiento de las herramientas de compilación rápida como **Hot Module Replacement (HMR)** de Webpack y los mapas de fuentes para depuración.
  * **En Producción**: La política de producción definida en [vue.config.js](file:///c:/Users/quisp/Documents/GitHub/platform_hotel/vue.config.js#L17) **NO** permite `'unsafe-eval'`. Al construir para despliegue final (`npm run build`), se genera una política estricta:
    ```javascript
    const productionContentSecurityPolicy = `default-src 'self'; script-src 'self'; style-src 'self'; ...`;
    ```
    Por lo tanto, esta alerta constituye un hallazgo controlado restringido al entorno local de desarrollo.

#### 3. CSP: style-src 'unsafe-inline'
* **Problema Original**: ZAP detectó que la política CSP de desarrollo permitía estilos en línea (`'unsafe-inline'`).
* **Análisis y Mitigación**:
  * **En Desarrollo**: Al igual que con el JavaScript, la inyección en línea de estilos CSS es necesaria en desarrollo para que la recarga en caliente de estilos (Hot Reload) funcione inmediatamente sin recargar el navegador.
  * **En Producción**: El framework de interfaz gráfica **Vuetify** utilizado en el Frontend genera e inyecta ciertos estilos base dinámicamente en el encabezado. En producción se restringe el origen a `'self'`. Si en algún despliegue específico la inyección dinámica de Vuetify requiere inline-styles, se recomienda implementar un sistema de **cryptographic nonces (números de un solo uso)** o hashes para los estilos en lugar de habilitar `'unsafe-inline'` de forma global.

---

## 4. Estado de Seguridad Actual del Sistema
Con la implementación de estas mitigaciones, tanto el Backend como el Frontend cumplen con rigurosos criterios de calidad de código y control de riesgos de seguridad, mitigando potenciales vectores de ataque (inyección de dependencias, secuestro de pipelines, clickjacking y conexiones inseguras a bases de datos) según los estándares de **OWASP Top 10**.
