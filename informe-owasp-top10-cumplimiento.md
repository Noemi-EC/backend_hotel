# Informe de cumplimiento del OWASP Top 10

Fecha: 2026-07-06

## Introducción

Este informe resume cómo el proyecto fue fortalecido para cumplir con los principales riesgos del OWASP Top 10. La revisión se basó en la implementación del backend, especialmente en los módulos de autenticación, autorización, validación de entradas, manejo de errores y configuración de seguridad.

## 1. A01 - Broken Access Control

### Qué se hizo
- Se implementó autenticación con JWT mediante el módulo de auth.
- Se protegieron endpoints sensibles con guards de autenticación y roles.
- Se agregó un guard de roles que bloquea el acceso cuando el usuario no tiene los permisos requeridos.

### Evidencia en el proyecto
- [backend_hotel/src/module/auth/guard/jwt-auth.guard.ts](backend_hotel/src/module/auth/guard/jwt-auth.guard.ts)
- [backend_hotel/src/module/auth/guard/roles.guard.ts](backend_hotel/src/module/auth/guard/roles.guard.ts)
- Uso de decoradores como @UseGuards en controladores.

## 2. A02 - Cryptographic Failures

### Qué se hizo
- Se implementó autenticación basada en tokens JWT.
- Los secretos y tiempos de expiración se gestionan mediante variables de entorno.
- Se reforzó la seguridad del canal y la sesión al evitar la exposición de información sensible en respuestas.

### Evidencia en el proyecto
- [backend_hotel/src/module/auth/auth.module.ts](backend_hotel/src/module/auth/auth.module.ts)
- [backend_hotel/src/module/auth/auth.service.ts](backend_hotel/src/module/auth/auth.service.ts)
- [backend_hotel/src/module/auth/jwt/jwt.config.ts](backend_hotel/src/module/auth/jwt/jwt.config.ts)

## 3. A03 - Injection

### Qué se hizo
- Se configuró un ValidationPipe global para validar y limpiar las entradas entrantes.
- Se habilitaron medidas que rechazan datos inesperados o no permitidos.
- Se reforzó el flujo de login y la validación de datos antes de procesarlos.

### Evidencia en el proyecto
- [backend_hotel/src/main.ts](backend_hotel/src/main.ts)
- [backend_hotel/src/module/auth/dto/login-auth.dto.ts](backend_hotel/src/module/auth/dto/login-auth.dto.ts)

## 4. A04 - Insecure Design

### Qué se hizo
- Se estructuró la aplicación con módulos separados para auth, users, customers, rooms, payments y otros recursos.
- Se aplicó un diseño orientado a roles y permisos desde la capa de controladores.
- La lógica sensible quedó encapsulada en servicios y protegida por guards.

### Evidencia en el proyecto
- Estructura modular en [backend_hotel/src/module](backend_hotel/src/module)
- Uso de guards y services para separar responsabilidades.

## 5. A05 - Security Misconfiguration

### Qué se hizo
- Se configuró CORS de forma explícita para permitir únicamente orígenes definidos.
- Se agregaron headers de seguridad como X-Content-Type-Options, X-Frame-Options, Referrer-Policy y CSP.
- Se deshabilitó la exposición de X-Powered-By y se ocultó la información del servidor.

### Evidencia en el proyecto
- [backend_hotel/src/main.ts](backend_hotel/src/main.ts)

## 6. A06 - Vulnerable and Outdated Components

### Qué se hizo
- Se dejó la arquitectura preparada para mantener las dependencias bajo revisión periódica.
- Se recomienda actualizar librerías y paquetes con frecuencia para evitar vulnerabilidades conocidas.
- Se promovió una base de desarrollo más segura mediante control de versiones y revisión continua.

### Evidencia en el proyecto
- [backend_hotel/package.json](backend_hotel/package.json)

## 7. A07 - Identification and Authentication Failures

### Qué se hizo
- Se reforzó el login con validación de usuario y contraseña.
- Se implementó bloqueo temporal por múltiples intentos fallidos.
- Se manejan errores de autenticación de forma controlada y segura.

### Evidencia en el proyecto
- [backend_hotel/src/module/auth/auth.service.ts](backend_hotel/src/module/auth/auth.service.ts)

## 8. A08 - Software and Data Integrity Failures

### Qué se hizo
- Se centralizó la validación de entradas para evitar datos inconsistentes o maliciosos.
- Se usaron DTOs y validación global para controlar la integridad de los datos que ingresan al sistema.
- Se aplicó un manejo uniforme de errores para evitar comportamientos inesperados.

### Evidencia en el proyecto
- [backend_hotel/src/main.ts](backend_hotel/src/main.ts)
- [backend_hotel/src/common/filters/http-exception.filter.ts](backend_hotel/src/common/filters/http-exception.filter.ts)

## 9. A09 - Security Logging and Monitoring Failures

### Qué se hizo
- Se incorporó un filtro global de excepciones para centralizar el manejo de errores.
- Se dejó la base preparada para registrar eventos de seguridad y monitorear accesos sospechosos.
- Se recomienda ampliar los logs de autenticación, accesos y errores críticos.

### Evidencia en el proyecto
- [backend_hotel/src/common/filters/http-exception.filter.ts](backend_hotel/src/common/filters/http-exception.filter.ts)

## 10. A10 - Server-Side Request Forgery

### Qué se hizo
- El proyecto no expone un flujo de SSRF visible en la implementación actual.
- Se mantiene una arquitectura que limita el uso de solicitudes externas y se recomienda validar y restringir cualquier llamada saliente en futuras mejoras.

### Evidencia en el proyecto
- No se detectó un flujo de SSRF en la implementación actual.
- Se recomienda reforzar la validación de URLs en integraciones futuras.

## Conclusión

El backend muestra un avance importante en seguridad al implementar autenticación, autorización, validación de entradas, configuración de headers y control de errores. Estos cambios contribuyen de forma directa a reducir los riesgos asociados al OWASP Top 10 y dejan la aplicación en una posición más sólida frente a ataques comunes.
