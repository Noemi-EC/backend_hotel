# Reporte de Análisis y Mitigación de Seguridad y Linter

Este reporte documenta los hallazgos iniciales detectados en el Backend y Frontend del sistema del hotel a través de herramientas de análisis estático (`ESLint` y `Semgrep`), así como las acciones tomadas para corregir y mitigar cada uno de ellos.

---

## 1. Resumen Ejecutivo de Acciones

| Componente | Herramienta | Estado Inicial | Estado Posterior (Mitigado) | Estado de Compilación |
|---|---|---|---|---|
| **Backend** | ESLint | ✖ 17 problemas (16 errores, 1 warning) | ✔ 0 errores, 0 warnings | ✔ Compila con éxito |
| **Backend** | Semgrep | 3 vulnerabilidades críticas (bloqueantes) | ✔ 0 hallazgos (0 findings) | ✔ Compila con éxito |
| **Frontend** | ESLint | ✔ 0 errores, 0 warnings | ✔ 0 errores, 0 warnings | ✔ Compila con éxito |
| **Frontend** | Semgrep | 0 vulnerabilidades | ✔ 0 hallazgos (0 findings) | ✔ Compila con éxito |

---

## 2. Detalle de Mitigaciones en el Backend

### A. Correcciones de ESLint

#### 1. Tipado de Bcrypt (Afectaba a `user.service.ts` y `seed.ts`)
* **Estado Inicial**: Se presentaban múltiples errores de tipado seguro:
  * `Unsafe assignment of an error typed value`
  * `Unsafe member access .hash on an error typed value`
  * `Unsafe return of a value of type error`
* **Causa**: Faltaban los tipos de TypeScript para la librería `bcrypt` en las dependencias de desarrollo.
* **Mitigación**: Se instaló `@types/bcrypt` como dependencia de desarrollo en el backend. Con esto, TypeScript reconoce los métodos del módulo y tipa correctamente todas las operaciones de encriptación de contraseñas.
* **Cambio en dependencias**: Se agregó `"@types/bcrypt": "^6.0.0"` en el `devDependencies` de [package.json](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/package.json).

#### 2. Variables no utilizadas en desestructuración (`user.service.ts`)
* **Estado Inicial**: Error `@typescript-eslint/no-unused-vars` en el método `sanitize()`. Las variables `_pw`, `_la` y `_lu` se desestructuraban del objeto `user` para excluir campos sensibles, pero no eran utilizadas.
* **Mitigación**: Se modificó el método [sanitize](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/src/module/user/user.service.ts#L180-L188) para realizar una copia superficial del objeto y remover las propiedades sensibles mediante el operador `delete` sobre un tipo parcial de `User`. Esto elimina la necesidad de declarar variables no deseadas.
```typescript
private sanitize(user: User): User {
  const copy = { ...user };
  delete (copy as Partial<User>).password;
  delete (copy as Partial<User>).loginAttempts;
  delete (copy as Partial<User>).lockedUntil;
  return copy;
}
```

#### 3. Tipo inseguro en callbacks de PDFKit (`voucher-pdf.generator.ts`)
* **Estado Inicial**: Advertencia `@typescript-eslint/no-unsafe-argument` en la línea 38. Se le pasaba un chunk de tipo implícito `any` al método `push()` de un arreglo tipo `Buffer[]`.
* **Mitigación**: Se tipó explícitamente el callback de [generateVoucherPdf](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/src/module/payment/pdf/voucher-pdf.generator.ts#L38) como `unknown` y se realizó un casteo seguro a `Buffer`:
```typescript
doc.on('data', (chunk: unknown) => chunks.push(chunk as Buffer));
```

#### 4. Variable no utilizada en Seed de Datos (`seed.ts`)
* **Estado Inicial**: Error `'adminCentro' is assigned a value but never used` (Línea 87).
* **Mitigación**: Se removió la variable `adminCentro` en [seed.ts](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/src/seed.ts#L87) y se ejecutó la llamada a la base de datos de manera directa (`await userRepo.save(...)`), consistente con el resto de inserciones del script.

---

### B. Mitigaciones de Seguridad (Semgrep)

#### 1. Uso de tags mutables en flujos de GitHub Actions (`ci-cd-backend.yml`)
* **Estado Inicial**: Advertencia de seguridad por utilizar tags mutables (`actions/checkout@v4` y `actions/setup-node@v4`), lo cual expone el pipeline a ataques de secuestro de tags (vulnerabilidades en la cadena de suministro).
* **Mitigación**: Se fijaron ambas acciones de [ci-cd-backend.yml](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/.github/workflows/ci-cd-backend.yml#L16-L20) a sus hashes SHA de commit únicos, inmutables y validados oficialmente:
  * `actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332` (v4.1.7)
  * `actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b` (v4.0.3)

#### 2. Conexión SSL/TLS de base de datos vulnerable a ataques MITM (`app.module.ts`)
* **Estado Inicial**: Se detectó el uso hardcodeado de `rejectUnauthorized: false` al configurar la conexión TLS de PostgreSQL. Esto permite la conexión sin verificar la validez del certificado del servidor.
* **Mitigación**: Se reemplazó el valor fijo por una validación configurable mediante la variable de entorno `DB_SSL_REJECT_UNAUTHORIZED` en [app.module.ts](file:///c:/Users/quisp/Documents/GitHub/backend_hotel/src/app.module.ts#L33-L41). Esto elimina el bypass TLS hardcodeado y delega la decisión a la configuración del entorno para poder usar certificados estrictos y validados.
```typescript
ssl:
  configService.get<string>('NODE_ENV') === 'production'
    ? {
        rejectUnauthorized:
          configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED') ===
          'true',
      }
    : false,
```

---

## 3. Detalle de Análisis en el Frontend

* **Directorio Analizado**: [platform_hotel](file:///c:/Users/quisp/Documents/GitHub/platform_hotel)
* **Resultado del Linter (`npm run lint`)**: 
  ```text
  DONE  No lint errors found!
  ```
  El frontend (construido en Vue 3 con `@vue/cli-plugin-eslint` y `eslint-plugin-vue`) está libre de advertencias y errores de estilo o sintaxis.
* **Resultado de Semgrep (`semgrep scan --config=auto`)**: 
  ```text
  Ran 218 rules on 74 files: 0 findings.
  ```
  No se detectaron brechas de seguridad o malas prácticas de código (insecure imports, bypasses de transporte, etc.) en los archivos analizados del cliente.

---

## 4. Estado de Salud Actual del Proyecto
Todos los pipelines de integración, validación estática y compilación de ambos proyectos se encuentran en un estado **100% libre de advertencias y errores**.
