# Informe de cumplimiento del OWASP Top 10

Fecha: 2026-07-06

## Introducción

Este informe resume cómo el proyecto fue fortalecido para cumplir con los principales riesgos del OWASP Top 10. La revisión se basó en la implementación del backend, especialmente en los módulos de autenticación, autorización, validación de entradas, manejo de errores y configuración de seguridad.

## 1. A01 - Broken Access Control

### Qué se hizo
- Se implementó autenticación basada en JWT para identificar al usuario antes de permitir el acceso a los recursos.
- Se agregó un guard de autenticación que valida el token recibido y un guard de roles que compara el rol del usuario con los permisos requeridos.
- La lógica de autorización quedó centralizada en los guards, lo que evita depender de validaciones dispersas en los controladores.

### Evidencia en el proyecto
- [src/module/auth/guard/jwt-auth.guard.ts](src/module/auth/guard/jwt-auth.guard.ts): protege las rutas mediante el guard de autenticación JWT.
- [src/module/auth/guard/roles.guard.ts](src/module/auth/guard/roles.guard.ts): valida que el rol del usuario pertenezca a los roles permitidos.
- [src/module/auth/guard/roles.decorator.ts](src/module/auth/guard/roles.decorator.ts): define la metadata de roles utilizada por el guard.
- [src/module/auth/jwt/jwt.strategy.ts](src/module/auth/jwt/jwt.strategy.ts): extrae la identidad y el rol del usuario a partir del token validado.

## 2. A02 - Cryptographic Failures

### Qué se hizo
- Se implementó la emisión y validación de tokens JWT con secretos y tiempos de expiración configurados desde variables de entorno.
- La configuración de autenticación quedó separada del código para evitar valores hardcodeados y facilitar la gestión segura de credenciales.
- El sistema exige la presencia de un secreto JWT para arrancar, reduciendo el riesgo de operar sin una configuración criptográfica válida.

### Evidencia en el proyecto
- [src/module/auth/auth.module.ts](src/module/auth/auth.module.ts): configura JwtModule con secret y expiresIn obtenidos desde ConfigService.
- [src/module/auth/jwt/jwt.config.ts](src/module/auth/jwt/jwt.config.ts): carga JWT_SECRET y JWT_EXPIRATION desde el entorno y falla si falta el secreto.
- [src/module/auth/jwt/jwt.strategy.ts](src/module/auth/jwt/jwt.strategy.ts): valida tokens usando la clave secreta configurada.

## 3. A03 - Injection

### Qué se hizo
- Se configuró un ValidationPipe global para rechazar entradas no permitidas, filtrar propiedades inesperadas y transformar datos antes de la lógica de negocio.
- Se definieron DTOs con validaciones explícitas para el login, lo que limita la entrada a campos esperados y evita datos maliciosos o incompletos.
- La capa de controladores recibe datos ya validados, reduciendo la posibilidad de inyección o procesamiento inseguro.

### Evidencia en el proyecto
- [src/main.ts](src/main.ts): registra un ValidationPipe global con whitelist, forbidNonWhitelisted, transform y forbidUnknownValues.
- [src/module/auth/dto/login-auth.dto.ts](src/module/auth/dto/login-auth.dto.ts): define validaciones para username y password mediante decoradores de class-validator.
- [src/module/auth/auth.controller.ts](src/module/auth/auth.controller.ts): expone el endpoint de login sobre el DTO validado.

## 4. A04 - Insecure Design

### Qué se hizo
- Se organizó la aplicación en módulos independientes para autenticación, usuarios, reservas, clientes, habitaciones, pagos y otros recursos.
- La lógica de negocio sensible quedó encapsulada en servicios, mientras que los controladores se enfocan en recibir y responder peticiones.
- La arquitectura facilita la separación de responsabilidades y reduce la probabilidad de que la lógica crítica se implemente de forma dispersa o insegura.

### Evidencia en el proyecto
- [src/app.module.ts](src/app.module.ts): estructura la aplicación con módulos principales importados de forma organizada.
- [src/module/auth/auth.module.ts](src/module/auth/auth.module.ts): encapsula autenticación, JWT y controladores en un módulo independiente.
- [src/module/auth/auth.service.ts](src/module/auth/auth.service.ts): concentra la lógica sensible de autenticación y control de accesos.

## 5. A05 - Security Misconfiguration

### Qué se hizo
- Se configuró CORS de forma explícita usando orígenes permitidos desde variables de entorno, en lugar de dejar la política abierta.
- Se añadieron headers de seguridad en las respuestas HTTP para reducir riesgos de clickjacking, MIME sniffing, XSS y exposición innecesaria de información.
- Se deshabilitó la cabecera X-Powered-By y se eliminó la información del servidor para reducir la superficie de ataque.

### Evidencia en el proyecto
- [src/main.ts](src/main.ts): configura CORS, desactiva x-powered-by, elimina el header Server y define cabeceras como X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security y Content-Security-Policy.

## 6. A06 - Vulnerable and Outdated Components

### Qué se hizo
- Se mantuvo la gestión de dependencias centralizada en el archivo de manifiesto del backend, lo que facilita la revisión periódica de versiones y paquetes críticos.
- El proyecto usa bibliotecas de seguridad reconocidas como @nestjs/jwt, @nestjs/passport, bcrypt, class-validator, passport-jwt y @nestjs/swagger, con versiones explícitas y controladas.
- La arquitectura deja preparada la práctica de auditorías continuas y actualizaciones de paquetes para reducir exposición a vulnerabilidades conocidas.

### Evidencia en el proyecto
- [package.json](package.json): define las versiones de las dependencias principales del backend, incluidas las relacionadas con autenticación, validación y seguridad.

## 7. A07 - Identification and Authentication Failures

### Qué se hizo
- Se reforzó el proceso de login con validación de existencia de usuario, comparación segura de contraseñas mediante bcrypt y emisión de token JWT al autenticarse correctamente.
- Se implementó un mecanismo de bloqueo temporal tras múltiples intentos fallidos, lo que dificulta ataques por fuerza bruta y uso indebido de credenciales.
- Se reinician los intentos fallidos al autenticarse con éxito y se devuelven mensajes controlados para evitar filtrar detalles innecesarios.

### Evidencia en el proyecto
- [src/module/auth/auth.service.ts](src/module/auth/auth.service.ts): valida usuarios, administra intentos fallidos, bloquea cuentas temporalmente y emite JWTs.
- [src/module/auth/dto/login-auth.dto.ts](src/module/auth/dto/login-auth.dto.ts): limita los datos del login a los campos esperados.

## 8. A08 - Software and Data Integrity Failures

### Qué se hizo
- Se centralizó la validación de entradas mediante un ValidationPipe global que rechaza payloads no permitidos y transforma los datos entrantes antes de procesarlos.
- Se implementaron DTOs con validaciones explícitas para asegurar que campos como usuario y contraseña cumplan con el formato esperado antes de llegar al servicio.
- Se estandarizó el tratamiento de errores para evitar respuestas inconsistentes y reducir la posibilidad de que datos mal formados afecten la lógica de negocio.

### Evidencia en el proyecto
- [src/main.ts](src/main.ts): se registra un ValidationPipe global con opciones como whitelist, forbidNonWhitelisted, transform y forbidUnknownValues.
- [src/module/auth/dto/login-auth.dto.ts](src/module/auth/dto/login-auth.dto.ts): el DTO define validaciones de entrada para el login mediante decoradores como @IsString() y @IsNotEmpty().
- [src/common/filters/http-exception.filter.ts](src/common/filters/http-exception.filter.ts): se aplica un manejo uniforme de excepciones para mantener respuestas consistentes.

## 9. A09 - Security Logging and Monitoring Failures

### Qué se hizo
- Se incorporó un filtro global de excepciones que captura errores y devuelve respuestas estructuradas con estado, ruta y marca de tiempo.
- Se evita exponer detalles internos en errores del servidor, lo que mejora el control de la información que se entrega al cliente y facilita una base más limpia para auditoría y monitoreo.
- La arquitectura deja preparada la integración futura de registros de autenticación, accesos sospechosos y errores críticos.

### Evidencia en el proyecto
- [src/common/filters/http-exception.filter.ts](src/common/filters/http-exception.filter.ts): el filtro centraliza la captura de excepciones y construye una respuesta segura y estandarizada.
- [src/main.ts](src/main.ts): se registra el filtro global con app.useGlobalFilters(new HttpExceptionFilter()), de modo que todas las excepciones pasan por el mismo flujo de manejo.

## 10. A10 - Server-Side Request Forgery

### Qué se hizo
- El proyecto no expone un flujo de SSRF visible en la implementación actual.
- El análisis del backend no detectó clientes HTTP salientes ni llamadas a URLs externas en el código fuente, lo que limita la superficie de riesgo vinculada a solicitudes externas.
- La arquitectura actual se enfoca en el procesamiento interno de peticiones y persistencia, por lo que no se evidencia un flujo de SSRF en el estado actual del sistema.

### Evidencia en el proyecto
- [src](src): el código fuente del backend no muestra clientes HTTP salientes ni integraciones con servicios externos en los módulos revisados.
- [src/app.module.ts](src/app.module.ts): la aplicación está organizada en módulos internos de negocio y no expone un flujo de solicitudes externas visible.

## Conclusión

El backend muestra un avance importante en seguridad al implementar autenticación, autorización, validación de entradas, configuración de headers y control de errores. Estos cambios contribuyen de forma directa a reducir los riesgos asociados al OWASP Top 10 y dejan la aplicación en una posición más sólida frente a ataques comunes.
