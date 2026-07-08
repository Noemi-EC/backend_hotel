# Reporte comparativo de seguridad ZAP

Fecha: 2026-07-07

## 1. Resumen ejecutivo

Este reporte compara los hallazgos del escaneo inicial (`1-reporte.md`) frente al escaneo posterior (`hola-2.md`) y presenta métricas, evidencias por punto del OWASP Top 10 y tecnologías usadas.

## 2. Métricas de comparación

| Métrica | 1-reporte.md | hola-2.md | Cambio |
| --- | --- | --- | --- |
| Alertas altas | 1 | 0 | -100% |
| Alertas medias | 8 | 0 | -100% |
| Alertas bajas | 13 | 0 | -100% |
| Alertas informativas | 9 | 2 | -78% |
| Total de alertas | 31 | 2 | -93.5% |
| Alertas con impacto real (alto+medio+bajo) | 22 | 0 | -100% |

> El análisis muestra que el proyecto pasó de tener múltiples hallazgos críticos y de riesgo medio/bajo a un estado en el que solo quedan dos alertas informativas.

## 3. Diferencias principales

### 3.1 1-reporte.md

Este informe señala problemas de seguridad importantes:
- Inyección SQL en el endpoint `POST /api/v1/customer/add`.
- Content Security Policy (CSP) mal definida o ausente.
- Configuración incorrecta de CORS.
- Falta de cabecera Anti-Clickjacking.
- Cookies sin flags `HttpOnly`, `Secure` o `SameSite`.
- Exposición de información por cabeceras `X-Powered-By`, `Server`, errores y metadatos.
- HSTS ausente o mal configurada.

### 3.2 hola-2.md

El escaneo posterior no reporta hallazgos críticos ni de impacto medio/bajo.
Se registran únicamente dos alertas informativas:
- Petición de autenticación identificada.
- Respuesta de gestión de sesión identificada.

Además, muestra métricas de tráfico y códigos de respuesta, pero no vulnerabilidades activas.

## 4. OWASP Top 10 en el proyecto

### A01 – Broken Access Control
- Evidencia: `hola-2.md` indica detección de autenticación y token de sesión.
- Código relevante: `src/module/auth/guard/jwt-auth.guard.ts`, `src/module/auth/guard/roles.guard.ts`.

### A02 – Cryptographic Failures
- No hay un hallazgo directo de ZAP en los escaneos.
- Evidencia en el proyecto: `src/module/auth/auth.module.ts`, `src/module/auth/jwt/jwt.strategy.ts`, `src/module/auth/jwt/jwt.config.ts`.

### A03 – Injection
- Evidencia directa: `1-reporte.md` reporta `Inyección SQL` en `/api/v1/customer/add`.
- Mitigación en el proyecto: validación global en `src/main.ts` y DTOs en `src/module/auth/dto/login-auth.dto.ts`.

### A04 – Insecure Design
- `1-reporte.md` muestra fallos de diseño en seguridad de cabeceras y configuración.
- Evidencia de diseño: `src/app.module.ts`, `src/module/auth/auth.module.ts`, `src/module/auth/auth.service.ts`.

### A05 – Security Misconfiguration
- `1-reporte.md` cubre múltiples hallazgos de configuración: CSP, CORS, X-Frame-Options, X-Content-Type-Options, HSTS.
- El código de seguridad está en `src/main.ts`.

### A06 – Vulnerable and Outdated Components
- No es un hallazgo directo de ZAP.
- Evidencia del proyecto: `package.json` con dependencias de NestJS, JWT, bcrypt, class-validator, TypeORM.

### A07 – Identification and Authentication Failures
- `1-reporte.md` y `hola-2.md` señalan alertas informativas relacionadas con autenticación y gestión de sesión.
- Evidencia en el proyecto: `src/module/auth/auth.service.ts`, `src/module/auth/auth.controller.ts`, `src/module/auth/dto/login-auth.dto.ts`.

### A08 – Software and Data Integrity Failures
- `1-reporte.md` muestra fugas de información y errores mal expuestos.
- Evidencia en el proyecto: `src/main.ts`, `src/module/auth/dto/login-auth.dto.ts`, `src/common/filters/http-exception.filter.ts`.

### A09 – Security Logging and Monitoring Failures
- ZAP no reporta un hallazgo directo, pero el uso de un filtro global de excepciones es evidencia de manejo más consistente.
- Evidencia en el proyecto: `src/common/filters/http-exception.filter.ts`.

### A10 – Server-Side Request Forgery
- No aparece en ninguno de los dos reportes.
- No hay evidencia de SSRF en el código fuente actual.

## 5. Tecnologías usadas en la validación

- **ZAP**: escaneo dinámico que detecta vulnerabilidades en ejecución, configuración de cabeceras, CORS, inyección y comportamiento de API.
- **Semgrep**: análisis estático de seguridad para detectar patrones de código inseguros (aunque no se muestra un reporte específico aquí, es parte del enfoque recomendado).
- **ESLint / lint**: revisión estática de calidad de código y seguridad de TypeScript; detecta tipos inseguros y problemas en el código.

### 5.1 Mapeo OWASP Top 10 por herramienta

- **ZAP**:
  - A03 – Injection
  - A05 – Security Misconfiguration
  - A07 – Identification and Authentication Failures
  - A08 – Software and Data Integrity Failures
  - A01 / A04 – de forma indirecta cuando detecta fallos de diseño o acceso inseguro en la API

- **Semgrep**:
  - A01 – Broken Access Control
  - A02 – Cryptographic Failures
  - A03 – Injection
  - A05 – Security Misconfiguration
  - A07 – Identification and Authentication Failures
  - A08 – Software and Data Integrity Failures
  - A09 – Security Logging and Monitoring Failures

- **ESLint / lint**:
  - A03 – Injection (detención de tipos inseguros y malas prácticas)
  - A05 – Security Misconfiguration (chequeo de código que configura seguridad)
  - A07 – Identification and Authentication Failures (validación de auth/DTOs y rutas seguras)
  - A08 – Software and Data Integrity Failures (manejo de `any`/`unknown` y errores)
  - A09 – Security Logging and Monitoring Failures (código más consistente y seguro)

## 6. Conclusión

La comparación muestra una mejora clara: el primer reporte detecta vulnerabilidades reales, mientras que el segundo deja solo avisos informativos. Esto indica que las acciones realizadas entre ambos escaneos tuvieron un impacto significativo en la seguridad detectable por ZAP.

Para completar la validación, conviene mantener la combinación de:
- escaneo dinámico con ZAP,
- análisis estático con Semgrep,
- calidad de código con ESLint.
