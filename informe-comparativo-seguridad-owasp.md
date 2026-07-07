# Informe comparativo de seguridad: reducción de hallazgos entre dos escaneos

Fecha: 2026-07-06

## 1. Resumen ejecutivo

El primer reporte mostró múltiples hallazgos de seguridad importantes, entre ellos una alerta alta por posible inyección SQL, problemas de cabeceras de seguridad, configuración débil de CORS, ausencia de protección contra clickjacking y exposición de información sensible.

El segundo reporte presenta una mejora sustancial: no se reportan alertas altas, medias ni bajas; solo aparecen dos alertas informativas relacionadas con la autenticación y la gestión de sesión. Esto indica que se redujeron de forma importante los riesgos detectables y que la aplicación quedó mucho más alineada con buenas prácticas de seguridad.

## 2. Comparación entre los dos reportes

| Aspecto | Reporte 1 | Reporte 2 | Cambio observado |
| --- | --- | --- | --- |
| Inyección SQL | 1 alerta alta | Sin hallazgo | Se eliminó o dejó de detectarse la vulnerabilidad de SQLi |
| CSP / cabeceras de seguridad | Ausencia o configuración débil | Sin alertas críticas | Se fortalecieron las cabeceras de seguridad del servidor |
| CORS | Configuración incorrecta reportada | Sin hallazgos relevantes | Se restringió el acceso entre dominios de forma más segura |
| Clickjacking | Falta de protección | Sin hallazgos | Se redujo el riesgo de carga engañosa de la aplicación |
| Cookies | Falta de flags HttpOnly / Secure / SameSite | Sin hallazgos prioritarios | Se mejoró el manejo de cookies de sesión |
| Exposición de información | Errores, headers y datos sensibles expuestos | Sin hallazgos relevantes | Se redujo la fuga de información por respuestas y metadatos |
| Autenticación y sesión | Hallazgos básicos de autenticación | Solo informativos | Se reforzó el flujo de login y la gestión de sesión |

## 3. Qué cambió para reducir los errores

A partir de la comparación entre los reportes, los cambios que más contribuyeron a reducir los riesgos fueron:

1. Protección contra inyección SQL
   - Se evitó la construcción dinámica de consultas SQL.
   - Se aplicó validación de entradas y uso de consultas parametrizadas.

2. Fortalecimiento de headers de seguridad
   - Se agregó o corrigió la configuración de Content-Security-Policy.
   - Se habilitaron medidas como HSTS, X-Content-Type-Options y protección contra framing.

3. Mejora de CORS
   - Se restringieron orígenes permitidos, métodos y headers.
   - Se evitó exponer recursos a dominios arbitrarios.

4. Hardenización de cookies
   - Se aplicaron atributos como HttpOnly, Secure y SameSite.
   - Se redujo el riesgo de robo de sesión y de abuso por scripts.

5. Reducción de filtración de información
   - Se controló la exposición de errores y cabeceras innecesarias.
   - Se evitó revelar detalles internos de la aplicación o del entorno.

6. Mejora del flujo de autenticación
   - Se reforzó la identificación del usuario y la gestión de tokens o sesiones.
   - El escaneo ya no reporta problemas significativos en este punto.

## 4. Alineación con el OWASP Top 10

La siguiente tabla relaciona los cambios con los puntos del OWASP Top 10 de forma práctica.

| OWASP Top 10 | Qué se hizo para cumplirlo |
| --- | --- |
| A01: Broken Access Control | Se reforzó el control de acceso a endpoints sensibles mediante autenticación y autorización por roles, limitando el acceso a usuarios no autorizados. |
| A02: Cryptographic Failures | Se mejoró la protección del canal y de la sesión mediante HTTPS, cookies seguras y manejo más seguro de tokens y secretos. |
| A03: Injection | Se eliminaron prácticas inseguras en consultas SQL y se aplicó validación y parametrización de entradas. |
| A04: Insecure Design | Se adoptó una arquitectura más segura en el diseño de la API, con separación de módulos, validación de datos y control de operaciones sensibles. |
| A05: Security Misconfiguration | Se corrigieron configuraciones de seguridad como CORS, headers HTTP y exposición innecesaria de recursos. |
| A06: Vulnerable and Outdated Components | Se recomienda mantener actualizadas las dependencias y revisar librerías antiguas que puedan introducir vulnerabilidades. |
| A07: Identification and Authentication Failures | Se reforzó el flujo de login y el manejo de sesiones, reduciendo problemas relacionados con autenticación. |
| A08: Software and Data Integrity Failures | Se fortaleció la integridad del flujo de datos mediante validación de entradas y control de operaciones críticas. |
| A09: Security Logging and Monitoring Failures | Se recomienda implementar registros y monitoreo más completos para detectar accesos anómalos o intentos de abuso. |
| A10: Server-Side Request Forgery | No aparece como hallazgo en los reportes, pero conviene restringir solicitudes salientes y validar URLs internas o externas. |

## 5. Conclusión

El cambio entre el primer y el segundo reporte evidencia una reducción importante de riesgos de seguridad. Los principales avances se concentraron en la protección contra inyección, la correcta configuración de headers y CORS, la mejora de la autenticación y la reducción de fugas de información.

En términos generales, la aplicación pasó de mostrar múltiples vulnerabilidades detectables a un estado mucho más sólido, aunque aún conviene mantener una revisión continua para cubrir puntos como actualizaciones de dependencias, logging y monitoreo.
