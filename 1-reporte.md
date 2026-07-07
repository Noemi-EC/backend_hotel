# ZAP por Informe de Escaneo Checkmarx

ZAP by [Checkmarx](https://checkmarx.com/).


## Sumario de Alertas

| Nivel de riesgo | Número de Alertas |
| --- | --- |
| Alto | 1 |
| Medio | 8 |
| Bajo | 13 |
| Informativo | 9 |






## Alertas

| Nombre | Nivel de riesgo | Número de Instancias |
| --- | --- | --- |
| Inyección SQL | Alto | 1 |
| CSP: Directiva Wildcard | Medio | 4 |
| CSP: Failure to Define Directive with No Fallback | Medio | 6 |
| CSP: script-src unsafe-eval | Medio | 1 |
| CSP: script-src unsafe-inline | Medio | 5 |
| CSP: style-src unsafe-inline | Medio | 4 |
| Cabecera Content Security Policy (CSP) no configurada | Medio | Systemic |
| Configuración Incorrecta Cross-Domain | Medio | Systemic |
| Falta de cabecera Anti-Clickjacking | Medio | Systemic |
| Cookie Sin Flag HttpOnly | Bajo | 1 |
| Cookie Sin Flag de Seguridad | Bajo | 3 |
| Cookie con el atributo SameSite a None | Bajo | 1 |
| Cookie sin el atributo SameSite | Bajo | 3 |
| Divulgación de Información - Mensajes de Error de Depuración | Bajo | 3 |
| Divulgación de Marcas de Tiempo - Unix | Bajo | Systemic |
| Divulgación de error de aplicación | Bajo | 3 |
| El servidor divulga información mediante un campo(s) de encabezado de respuesta HTTP ''''X-Powered-By'''' | Bajo | Systemic |
| El servidor filtra información de versión a través del campo "Server" del encabezado de respuesta HTTP | Bajo | 1 |
| Falta encabezado X-Content-Type-Options | Bajo | Systemic |
| Revelación de IP privada | Bajo | 4 |
| Strict-Transport-Security Deshabilitado | Bajo | 1 |
| Strict-Transport-Security Header No Establecido | Bajo | Systemic |
| Aplicación Web Moderna | Informativo | Systemic |
| Cabecera Content-Type Perdida | Informativo | 1 |
| Divulgación de Información - Información sensible en URL | Informativo | 1 |
| Divulgación de información - Comentarios sospechosos | Informativo | 34 |
| Loosely Scoped Cookie | Informativo | 1 |
| Petición de Autenticación Identificada | Informativo | 3 |
| Recuperado de la Caché | Informativo | Systemic |
| Reexaminar las Directivas de Control de Caché | Informativo | Systemic |
| Respuesta de Gestión de Sesión Identificada | Informativo | 3 |




## Detalles de la Alerta



### [ Inyección SQL ](https://www.zaproxy.org/docs/alerts/40018/)



##### Alto (Baja)

### Descripción

Inyección SQL puede ser posible.

* URL: http://localhost:3060/api/v1/customer/add
  * Nombre del Nodo: `http://localhost:3060/api/v1/customer/add ()({username,password,name,lastName,dni,email,hotelId,companyId})`
  * Método: `POST`
  * Parámetros: `username`
  * Ataque: `enny'`
  * Evidencia: `HTTP/1.1 500 Internal Server Error`
  * Otra información: ``


Instancia: 1

### Solución

No confíe en los datos de entrada del lado del cliente, incluso si existe una validación del lado del cliente.
Como norma general, escriba la verificación de los datos en el lado del servidor.
Si la aplicación usa JDBC, use PreparedStatement o CallableStatement, con parámetros pasados ​​por '?'
Si la aplicación usa ASP, use objetos de comando ADO con verificación de tipo fuerte y consultas parametrizadas.
Si se pueden usar los procedimientos almacenados de la base de datos, utilícelos.
¡*No* concatene cadenas en consultas en el procedimiento almacenado, o use 'exec', 'exex immediate' o una función equivalente!
No cree consultas SQL dinámicas mediante la concatenación de cadenas simples.
Escape todos los datos recibidos del cliente.
Aplique una 'lista de permitidos' para caracteres permitidos o una 'lista de denegados' para caracteres no permitidos en la entrada del usuario.
Aplique el principio de privilegio mínimo utilizando el usuario de base de datos con el menor privilegio posible.
En particular, evite utilizar usuarios de bases de datos 'sa' o 'db-owner'. Esto no elimina la inyección SQL, pero minimiza su impacto.
Otorgue el acceso mínimo a la base de datos que sea necesario para la aplicación.

### Referencia


* [ https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)


#### CWE Id: [ 89 ](https://cwe.mitre.org/data/definitions/89.html)


#### WASC Id: 19

#### ID de la Fuente: 1

### [ CSP: Directiva Wildcard ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medio (Alta)

### Descripción

Content Security Policy (CSP) es una capa de seguridad añadida que ayuda a detectar y mitigar ciertos tipos de ataques. Incluyendo (pero no limitado a) Cross Site Scripting (XSS), y ataques de inyección de datos. Estos ataques se utilizan, para todo, desde el robo de datos a la desfiguración de sitios o la distribución de malware. CSP proporciona un conjunto de cabeceras HTTP estándar que permiten a los propietarios de sitios web declarar las fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página. Los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustables como applets Java, ActiveX y archivos de audio y vídeo.

* URL: http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7%3FP1=1783556336&P2=404&P3=2&P4=UoL7FLF4Qg4dCe4abmTkZZEw3L6Z2JhDZG0eKySeITN65e1VEa9b5jq33n0LtznqPuIpcADeLoHsFc9QzsU%252fKA%253d%253d
  * Nombre del Nodo: `http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `Las siguientes directivas permiten fuentes comodín (o ancestros), no están definidas, o están definidas de forma demasiado amplia:
script-src, style-src, img-src, connect-src, frame-src, font-src, media-src, object-src, manifest-src, worker-src`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7%3FP1=1783559134&P2=404&P3=2&P4=kUFrPpHfJSrzMVY8N7tToPDiDnes2vj7xojrZMMORsrTYos%252bjUgMtteesdrz58p06TONOtfXpWaR9YD2jgP1qA%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `Las siguientes directivas permiten fuentes comodín (o ancestros), no están definidas, o están definidas de forma demasiado amplia:
script-src, style-src, img-src, connect-src, frame-src, font-src, media-src, object-src, manifest-src, worker-src`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783556348&P2=404&P3=2&P4=TRh6tvf2YvUlBE05eIzl0ZaYnzWFtIoTB81r%252fAh17jYpifY0iMh78AGsS%252bhOR4AlassODS5t8zaGoJ%252fQak7%252fXQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `Las siguientes directivas permiten fuentes comodín (o ancestros), no están definidas, o están definidas de forma demasiado amplia:
script-src, style-src, img-src, connect-src, frame-src, font-src, media-src, object-src, manifest-src, worker-src`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783571119&P2=404&P3=2&P4=IEOkr0lQixRq7SWSMuvfQT3i4mcBGy3fBl%252fVZENOzKJGVTPeihy4qbK5rcA9l54eziDXvRY5ov0CsxiUSJAeZQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `Las siguientes directivas permiten fuentes comodín (o ancestros), no están definidas, o están definidas de forma demasiado amplia:
script-src, style-src, img-src, connect-src, frame-src, font-src, media-src, object-src, manifest-src, worker-src`


Instancia: 4

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ CSP: Failure to Define Directive with No Fallback ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medio (Alta)

### Descripción

The Content Security Policy fails to define one of the directives that has no fallback. Missing/excluding them is the same as allowing anything.

* URL: http://localhost:8080/.well-known/appspecific/com.chrome.devtools.json
  * Nombre del Nodo: `http://localhost:8080/.well-known/appspecific/com.chrome.devtools.json`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `default-src 'none'`
  * Otra información: `The directive(s): frame-ancestors, form-action is/are among the directives that do not fallback to default-src.`
* URL: http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7%3FP1=1783556336&P2=404&P3=2&P4=UoL7FLF4Qg4dCe4abmTkZZEw3L6Z2JhDZG0eKySeITN65e1VEa9b5jq33n0LtznqPuIpcADeLoHsFc9QzsU%252fKA%253d%253d
  * Nombre del Nodo: `http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `The directive(s): form-action is/are among the directives that do not fallback to default-src.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7%3FP1=1783559134&P2=404&P3=2&P4=kUFrPpHfJSrzMVY8N7tToPDiDnes2vj7xojrZMMORsrTYos%252bjUgMtteesdrz58p06TONOtfXpWaR9YD2jgP1qA%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `The directive(s): form-action is/are among the directives that do not fallback to default-src.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783556348&P2=404&P3=2&P4=TRh6tvf2YvUlBE05eIzl0ZaYnzWFtIoTB81r%252fAh17jYpifY0iMh78AGsS%252bhOR4AlassODS5t8zaGoJ%252fQak7%252fXQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `The directive(s): form-action is/are among the directives that do not fallback to default-src.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783571119&P2=404&P3=2&P4=IEOkr0lQixRq7SWSMuvfQT3i4mcBGy3fBl%252fVZENOzKJGVTPeihy4qbK5rcA9l54eziDXvRY5ov0CsxiUSJAeZQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `The directive(s): form-action is/are among the directives that do not fallback to default-src.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `content-security-policy`
  * Ataque: ``
  * Evidencia: `
  default-src 'none';
  script-src 'unsafe-eval' 'unsafe-inline';
  worker-src 'self'
`
  * Otra información: `The directive(s): form-action is/are among the directives that do not fallback to default-src.`


Instancia: 6

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ CSP: script-src unsafe-eval ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medio (Alta)

### Descripción

Content Security Policy (CSP) es una capa de seguridad añadida que ayuda a detectar y mitigar ciertos tipos de ataques. Incluyendo (pero no limitado a) Cross Site Scripting (XSS), y ataques de inyección de datos. Estos ataques se utilizan, para todo, desde el robo de datos a la desfiguración de sitios o la distribución de malware. CSP proporciona un conjunto de cabeceras HTTP estándar que permiten a los propietarios de sitios web declarar las fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página. Los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustables como applets Java, ActiveX y archivos de audio y vídeo.

* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `content-security-policy`
  * Ataque: ``
  * Evidencia: `
  default-src 'none';
  script-src 'unsafe-eval' 'unsafe-inline';
  worker-src 'self'
`
  * Otra información: `script-src incluye unsafe-eval.`


Instancia: 1

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ CSP: script-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medio (Alta)

### Descripción

Content Security Policy (CSP) es una capa de seguridad añadida que ayuda a detectar y mitigar ciertos tipos de ataques. Incluyendo (pero no limitado a) Cross Site Scripting (XSS), y ataques de inyección de datos. Estos ataques se utilizan, para todo, desde el robo de datos a la desfiguración de sitios o la distribución de malware. CSP proporciona un conjunto de cabeceras HTTP estándar que permiten a los propietarios de sitios web declarar las fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página. Los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustables como applets Java, ActiveX y archivos de audio y vídeo.

* URL: http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7%3FP1=1783556336&P2=404&P3=2&P4=UoL7FLF4Qg4dCe4abmTkZZEw3L6Z2JhDZG0eKySeITN65e1VEa9b5jq33n0LtznqPuIpcADeLoHsFc9QzsU%252fKA%253d%253d
  * Nombre del Nodo: `http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `script-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7%3FP1=1783559134&P2=404&P3=2&P4=kUFrPpHfJSrzMVY8N7tToPDiDnes2vj7xojrZMMORsrTYos%252bjUgMtteesdrz58p06TONOtfXpWaR9YD2jgP1qA%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `script-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783556348&P2=404&P3=2&P4=TRh6tvf2YvUlBE05eIzl0ZaYnzWFtIoTB81r%252fAh17jYpifY0iMh78AGsS%252bhOR4AlassODS5t8zaGoJ%252fQak7%252fXQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `script-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783571119&P2=404&P3=2&P4=IEOkr0lQixRq7SWSMuvfQT3i4mcBGy3fBl%252fVZENOzKJGVTPeihy4qbK5rcA9l54eziDXvRY5ov0CsxiUSJAeZQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `script-src incluye unsafe-inline.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `
  default-src 'none';
  script-src 'unsafe-eval' 'unsafe-inline';
  worker-src 'self'
`
  * Otra información: `script-src incluye unsafe-inline.`


Instancia: 5

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ CSP: style-src unsafe-inline ](https://www.zaproxy.org/docs/alerts/10055/)



##### Medio (Alta)

### Descripción

Content Security Policy (CSP) es una capa de seguridad añadida que ayuda a detectar y mitigar ciertos tipos de ataques. Incluyendo (pero no limitado a) Cross Site Scripting (XSS), y ataques de inyección de datos. Estos ataques se utilizan, para todo, desde el robo de datos a la desfiguración de sitios o la distribución de malware. CSP proporciona un conjunto de cabeceras HTTP estándar que permiten a los propietarios de sitios web declarar las fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página. Los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustables como applets Java, ActiveX y archivos de audio y vídeo.

* URL: http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7%3FP1=1783556336&P2=404&P3=2&P4=UoL7FLF4Qg4dCe4abmTkZZEw3L6Z2JhDZG0eKySeITN65e1VEa9b5jq33n0LtznqPuIpcADeLoHsFc9QzsU%252fKA%253d%253d
  * Nombre del Nodo: `http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `style-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7%3FP1=1783559134&P2=404&P3=2&P4=kUFrPpHfJSrzMVY8N7tToPDiDnes2vj7xojrZMMORsrTYos%252bjUgMtteesdrz58p06TONOtfXpWaR9YD2jgP1qA%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `style-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783556348&P2=404&P3=2&P4=TRh6tvf2YvUlBE05eIzl0ZaYnzWFtIoTB81r%252fAh17jYpifY0iMh78AGsS%252bhOR4AlassODS5t8zaGoJ%252fQak7%252fXQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `style-src incluye unsafe-inline.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783571119&P2=404&P3=2&P4=IEOkr0lQixRq7SWSMuvfQT3i4mcBGy3fBl%252fVZENOzKJGVTPeihy4qbK5rcA9l54eziDXvRY5ov0CsxiUSJAeZQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: `Content-Security-Policy`
  * Ataque: ``
  * Evidencia: `frame-ancestors 'self'`
  * Otra información: `style-src incluye unsafe-inline.`


Instancia: 4

### Solución

Asegúrese de que su servidor web, servidor de aplicación, balanceador de carga, etc. está configurado apropiadamente para establecer la cabecera de Política de Seguridad de Contenido.

### Referencia


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Cabecera Content Security Policy (CSP) no configurada ](https://www.zaproxy.org/docs/alerts/10038/)



##### Medio (Alta)

### Descripción

La Política de seguridad de contenido (CSP) es una capa adicional de seguridad que ayuda a detectar y mitigar ciertos tipos de ataques, incluidos Cross Site Scripting (XSS) y ataques de inyección de datos. Estos ataques se utilizan para todo, desde el robo de datos hasta la desfiguración del sitio o la distribución de malware. CSP proporciona un conjunto de encabezados HTTP estándar que permiten a los propietarios de sitios web declarar fuentes de contenido aprobadas que los navegadores deberían poder cargar en esa página; los tipos cubiertos son JavaScript, CSS, marcos HTML, fuentes, imágenes y objetos incrustados como applets de Java, ActiveX, archivos de audio y video.

* URL: http://localhost:8080/
  * Nombre del Nodo: `http://localhost:8080/`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/companies
  * Nombre del Nodo: `http://localhost:8080/companies`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/company/1
  * Nombre del Nodo: `http://localhost:8080/company/1`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/rooms
  * Nombre del Nodo: `http://localhost:8080/rooms`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``

Instancia: Systemic


### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. esté configurado para establecer la cabecera Content-Security-Policy.

### Referencia


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
* [ https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://w3c.github.io/webappsec-csp/ ](https://w3c.github.io/webappsec-csp/)
* [ https://web.dev/articles/csp ](https://web.dev/articles/csp)
* [ https://caniuse.com/#feat=contentsecuritypolicy ](https://caniuse.com/#feat=contentsecuritypolicy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Configuración Incorrecta Cross-Domain ](https://www.zaproxy.org/docs/alerts/10098/)



##### Medio (Media)

### Descripción

La carga de datos del navegador web puede ser posible, debido a una mala configuración de Cross Origin Resource Sharing (CORS) en el servidor web.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `access-control-allow-origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://edge-consumer-static.azureedge.net/mouse-gesture/config.json
  * Nombre del Nodo: `https://edge-consumer-static.azureedge.net/mouse-gesture/config.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://fonts.googleapis.com/css%3Ffamily=Roboto:100,300,400,500,700,900&display=swap
  * Nombre del Nodo: `https://fonts.googleapis.com/css (display,family)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://msedgedevtools.microsoft.com/docs/149/stable.json
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/docs/149/stable.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json
  * Nombre del Nodo: `https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `access-control-allow-origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `access-control-allow-origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `access-control-allow-origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `access-control-allow-origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`
* URL: https://plausible.io/api/event
  * Nombre del Nodo: `https://plausible.io/api/event ()({name,url,domain,props:{browser,browser_version,os,arch,lang,selenium_version}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Access-Control-Allow-Origin: *`
  * Otra información: `La configuración incorrecta de CORS en el servidor web permite solicitudes de lectura entre dominios de terceros arbitrarios, utilizando API no autenticadas en este dominio. Sin embargo, las implementaciones de los navegadores web no permiten que terceros arbitrarios lean la respuesta de las API autenticadas. Esto reduce un poco el riesgo. Esta configuración errónea podría ser utilizada por un atacante para acceder a datos que están disponibles de forma no autenticada, pero que utilizan alguna otra forma de seguridad, como la lista blanca de direcciones IP.`

Instancia: Systemic


### Solución

Asegúrese de que los datos confidenciales no estén disponibles de forma no autenticada (por ejemplo, mediante listas blancas de direcciones IP).
Configure el encabezado HTTP "Access-Control-Allow-Origin" a un conjunto más restrictivo de dominios, o elimine todos los encabezados CORS por completo, para permitir que el navegador web aplique la Política del Mismo Origen (SOP) de una manera más restrictiva.

### Referencia


* [ https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy ](https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy)


#### CWE Id: [ 264 ](https://cwe.mitre.org/data/definitions/264.html)


#### WASC Id: 14

#### ID de la Fuente: 3

### [ Falta de cabecera Anti-Clickjacking ](https://www.zaproxy.org/docs/alerts/10020/)



##### Medio (Media)

### Descripción

La respuesta no protege contra ataques de "ClickJacking". Debes incluir Content-Security-Policy con la directiva "frame-ancestors" o X-Frame-Options.

* URL: http://localhost:8080/
  * Nombre del Nodo: `http://localhost:8080/`
  * Método: `GET`
  * Parámetros: `x-frame-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/companies
  * Nombre del Nodo: `http://localhost:8080/companies`
  * Método: `GET`
  * Parámetros: `x-frame-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/company/1
  * Nombre del Nodo: `http://localhost:8080/company/1`
  * Método: `GET`
  * Parámetros: `x-frame-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: http://localhost:8080/rooms
  * Nombre del Nodo: `http://localhost:8080/rooms`
  * Método: `GET`
  * Parámetros: `x-frame-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `x-frame-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``

Instancia: Systemic


### Solución

Los navegadores web modernos admiten las cabeceras HTTP Content-Security-Policy y X-Frame-Options. Asegúrese de que una de ellas está configurada en todas las páginas web devueltas por su sitio/aplicación.
Si espera que la página esté enmarcada solo por páginas en su servidor (por ejemplo, si forma parte de un FRAMESET), utilice SAMEORIGIN; de lo contrario, si no espera que la página esté enmarcada, utilice DENY. Alternativamente, considere implementar la directiva "frame-ancestors" de la Política de Seguridad de Contenidos.

### Referencia


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)


#### CWE Id: [ 1021 ](https://cwe.mitre.org/data/definitions/1021.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Cookie Sin Flag HttpOnly ](https://www.zaproxy.org/docs/alerts/10010/)



##### Bajo (Media)

### Descripción

Se ha establecido una cookie sin el flag HttpOnly, lo que significa que JavaScript puede acceder a la cookie. Si un script malicioso puede ser ejecutado en esta página, entonces la cookie será accesible y puede ser transmitida a otro sitio. Si se trata de una cookie de sesión, el secuestro de sesión puede ser posible.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `MUID`
  * Ataque: ``
  * Evidencia: `Set-Cookie: MUID`
  * Otra información: ``


Instancia: 1

### Solución

Asegúrese de que la flag HttpOnly está establecida para todas las cookies.

### Referencia


* [ https://owasp.org/www-community/HttpOnly ](https://owasp.org/www-community/HttpOnly)


#### CWE Id: [ 1004 ](https://cwe.mitre.org/data/definitions/1004.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Cookie Sin Flag de Seguridad ](https://www.zaproxy.org/docs/alerts/10011/)



##### Bajo (Media)

### Descripción

Se ha establecido una cookie sin el indicador de seguridad, lo que significa que se puede acceder a la cookie a través de conexiones no cifradas.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `_EDGE_S`
  * Ataque: ``
  * Evidencia: `Set-Cookie: _EDGE_S`
  * Otra información: ``
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `_EDGE_V`
  * Ataque: ``
  * Evidencia: `Set-Cookie: _EDGE_V`
  * Otra información: ``
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `MUIDB`
  * Ataque: ``
  * Evidencia: `Set-Cookie: MUIDB`
  * Otra información: ``


Instancia: 3

### Solución

Siempre que una cookie contenga información sensible o sea un token de sesión, debe pasarse utilizando un canal cifrado. Asegúrese de que el flag de seguridad está activado para las cookies que contengan información confidencial.

### Referencia


* [ https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes.html ](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes.html)


#### CWE Id: [ 614 ](https://cwe.mitre.org/data/definitions/614.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Cookie con el atributo SameSite a None ](https://www.zaproxy.org/docs/alerts/10054/)



##### Bajo (Media)

### Descripción

Se ha establecido una cookie con su atributo SameSite establecido en «none», lo que significa que la cookie puede ser enviada como resultado de una solicitud 'cross-site'. El atributo SameSite es una medida efectiva para contrarrestar la falsificación de peticiones cross-site, la inclusión de scripts cross-site y los ataques de sincronización.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `MUID`
  * Ataque: ``
  * Evidencia: `Set-Cookie: MUID`
  * Otra información: ``


Instancia: 1

### Solución

Asegúrese que el atributo SameSite está establecido como 'lax' o idealmente 'strict' para todas las cookies.

### Referencia


* [ https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site ](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site)


#### CWE Id: [ 1275 ](https://cwe.mitre.org/data/definitions/1275.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Cookie sin el atributo SameSite ](https://www.zaproxy.org/docs/alerts/10054/)



##### Bajo (Media)

### Descripción

Se ha establecido una cookie sin el atributo SameSite, lo que significa que la cookie puede ser enviada como resultado de una solicitud 'cross-site'. El atributo SameSite es una medida eficaz para contrarrestar la falsificación de peticiones entre sitios, la inclusión de scripts entre sitios y los ataques de sincronización.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `_EDGE_S`
  * Ataque: ``
  * Evidencia: `Set-Cookie: _EDGE_S`
  * Otra información: ``
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `_EDGE_V`
  * Ataque: ``
  * Evidencia: `Set-Cookie: _EDGE_V`
  * Otra información: ``
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `MUIDB`
  * Ataque: ``
  * Evidencia: `Set-Cookie: MUIDB`
  * Otra información: ``


Instancia: 3

### Solución

Asegúrese que el atributo SameSite está establecido como 'lax' o idealmente 'strict' para todas las cookies.

### Referencia


* [ https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site ](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-same-site)


#### CWE Id: [ 1275 ](https://cwe.mitre.org/data/definitions/1275.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Divulgación de Información - Mensajes de Error de Depuración ](https://www.zaproxy.org/docs/alerts/10023/)



##### Bajo (Media)

### Descripción

La respuesta parecía contener mensajes de error comunes devueltos por plataformas como ASP.NET, y servidores Web como IIS y Apache. Puede configurar la lista de mensajes de depuración comunes.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/19`
  * Método: `DELETE`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Internal server error`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/delete/23
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/delete/23`
  * Método: `DELETE`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Internal server error`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/room/update/1
  * Nombre del Nodo: `http://localhost:3060/api/v1/room/update/1 ()({code,category,capacity,price,status,hotelId})`
  * Método: `PUT`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Internal server error`
  * Otra información: ``


Instancia: 3

### Solución

Desactivar los mensajes de depuración antes de pasar a producción.

### Referencia



#### CWE Id: [ 1295 ](https://cwe.mitre.org/data/definitions/1295.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Divulgación de Marcas de Tiempo - Unix ](https://www.zaproxy.org/docs/alerts/10096/)



##### Bajo (Baja)

### Descripción

Una marca de tiempo fue revelada por la aplicación/servidor web. - Unix

* URL: http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7%3FP1=1783556336&P2=404&P3=2&P4=UoL7FLF4Qg4dCe4abmTkZZEw3L6Z2JhDZG0eKySeITN65e1VEa9b5jq33n0LtznqPuIpcADeLoHsFc9QzsU%252fKA%253d%253d
  * Nombre del Nodo: `http://msedge.b.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/682f0409-daf0-4b68-9e13-25396fbb48a7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783556336`
  * Otra información: `1783556336, que se evalúa como: 2026-07-08 19:18:56.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7%3FP1=1783559134&P2=404&P3=2&P4=kUFrPpHfJSrzMVY8N7tToPDiDnes2vj7xojrZMMORsrTYos%252bjUgMtteesdrz58p06TONOtfXpWaR9YD2jgP1qA%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/7cbaa431-4e42-4b7f-9f58-9043d10961b7 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783559134`
  * Otra información: `1783559134, que se evalúa como: 2026-07-08 20:05:34.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783288280&P2=404&P3=2&P4=cD5gTYOdviF3OxOzKJKqTL%252f3vDbmCl2KCvlytS6%252b6BvCLPEGF%252f69AkbSzmwvlXaDy%252b10Ka9%252bipEvP36XDjlCAQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783288280`
  * Otra información: `1783288280, que se evalúa como: 2026-07-05 16:51:20.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67%3FP1=1783556348&P2=404&P3=2&P4=TRh6tvf2YvUlBE05eIzl0ZaYnzWFtIoTB81r%252fAh17jYpifY0iMh78AGsS%252bhOR4AlassODS5t8zaGoJ%252fQak7%252fXQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/954c48e2-6a88-44a1-a49e-0fcfaad93f67 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783556348`
  * Otra información: `1783556348, que se evalúa como: 2026-07-08 19:19:08.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783571119&P2=404&P3=2&P4=IEOkr0lQixRq7SWSMuvfQT3i4mcBGy3fBl%252fVZENOzKJGVTPeihy4qbK5rcA9l54eziDXvRY5ov0CsxiUSJAeZQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783571119`
  * Otra información: `1783571119, que se evalúa como: 2026-07-08 23:25:19.`
* URL: http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4%3FP1=1783609916&P2=404&P3=2&P4=FuCj8mREAm5dduCNOabSInrfqn%252fXCZyWBgUqvUKsdIpkzi4ZN1T9kiO6KLHtVc4vzJVemAv9D0onVHms9MFMfQ%253d%253d
  * Nombre del Nodo: `http://msedge.f.tlu.dl.delivery.mp.microsoft.com/filestreamingservice/files/dadee85a-ef0f-411e-a9da-4f5235a4c9e4 (P1,P2,P3,P4)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783609916`
  * Otra información: `1783609916, que se evalúa como: 2026-07-09 10:11:56.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1680825600`
  * Otra información: `1680825600, que se evalúa como: 2023-04-06 19:00:00.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1683158400`
  * Otra información: `1683158400, que se evalúa como: 2023-05-03 19:00:00.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1689897600`
  * Otra información: `1689897600, que se evalúa como: 2023-07-20 19:00:00.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1694649600`
  * Otra información: `1694649600, que se evalúa como: 2023-09-13 19:00:00.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1697155200`
  * Otra información: `1697155200, que se evalúa como: 2023-10-12 19:00:00.`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update ()({request:{@os,@updater,acceptformat,apps:[{appid,brand,enabled,events:[{download_time_ms,downloader,errorcode,eventresult,eventtype,extracode1,nextversion,pipeline_id,previousversion,total,url},{errorcat,errorcode,eventresult,eventtype,extracode1,install_time_ms,nextversion,previousversion}],installdate,lang,version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaterversion}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783556348`
  * Otra información: `1783556348, que se evalúa como: 2026-07-08 19:19:08.`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update ()({request:{@os,@updater,acceptformat,apps:[{appid,brand,enabled,events:[{download_time_ms,downloader,errorcode,eventresult,eventtype,extracode1,nextversion,pipeline_id,previousversion,total,url},{errorcat,errorcode,eventresult,eventtype,extracode1,install_time_ms,nextversion,previousversion}],installdate,lang,version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaterversion}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783571119`
  * Otra información: `1783571119, que se evalúa como: 2026-07-08 23:25:19.`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:Gei5nmRMTBUDCgAQKGMZJaLoHqzKmi8xZ5ueAv-2tA4&cup2hreq=f2c52b9d1768192b642e9a5060e3efef2a3890939b6478383f219e163b1ffdf3
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,installsource,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaters:{autoupdatecheckenabled,ismachine,lastchecked,laststarted,name,updatepolicy,version},updaterve...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783556348`
  * Otra información: `1783556348, que se evalúa como: 2026-07-08 19:19:08.`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:BXjE9eErPXCmDn6LAT_spb3Lhsw6V7q1wj6UvhRVYtE&cup2hreq=478cadfae0ec23a29bec94bdf5414f4805f1815db70eff202fb09376a66401a9
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,installsource,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaters:{autoupdatecheckenabled,ismachine,lastchecked,laststarted,name,updatepolicy,version},updaterve...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783571119`
  * Otra información: `1783571119, que se evalúa como: 2026-07-08 23:25:19.`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:G8F5OXiuA4m3DsDDF2Kxu1Y49skigxbZdFnVkWJPQ2k&cup2hreq=1f8ca9c1435d767abe267092c343e31ffbcaa5da444a816aa9a256d89cb8e4ce
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaters:{autoupdatecheckenabled,ismachine,lastchecked,laststarted,name,updatepolicy,version},updaterversion}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `1783557893`
  * Otra información: `1783557893, que se evalúa como: 2026-07-08 19:44:53.`

Instancia: Systemic


### Solución

Confirmar que los datos encontrados de información sobre la marca de tiempo no son sensibles, ni se pueden usar en patrones explotables de divulgación.

### Referencia


* [ https://cwe.mitre.org/data/definitions/200.html ](https://cwe.mitre.org/data/definitions/200.html)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Divulgación de error de aplicación ](https://www.zaproxy.org/docs/alerts/90022/)



##### Bajo (Media)

### Descripción

Esta página contiene un mensaje de error/advertencia que podría revelar información sensible como la ubicación del archivo que produjo la excepción no controlada. Esta información puede ser usada para lanzas futuros ataques contra la aplicación web. La alerta podría ser una falso positivo si el mensaje de error es encontrado dentro de una página de documentación.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/19`
  * Método: `DELETE`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `HTTP/1.1 500 Internal Server Error`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/delete/23
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/delete/23`
  * Método: `DELETE`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `HTTP/1.1 500 Internal Server Error`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/room/update/1
  * Nombre del Nodo: `http://localhost:3060/api/v1/room/update/1 ()({code,category,capacity,price,status,hotelId})`
  * Método: `PUT`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `HTTP/1.1 500 Internal Server Error`
  * Otra información: ``


Instancia: 3

### Solución

Revisar el código de fuente de esta página. Implementación de páginas de error personalizadas. Considerar implementar un mecanismos para proveer una única referencia/identificación de error para el cliente (navegador) mientras insertando los detalles en el sitio del navegador y no exponiéndolos al usuario.

### Referencia



#### CWE Id: [ 550 ](https://cwe.mitre.org/data/definitions/550.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ El servidor divulga información mediante un campo(s) de encabezado de respuesta HTTP ''''X-Powered-By'''' ](https://www.zaproxy.org/docs/alerts/10037/)



##### Bajo (Media)

### Descripción

El servidor de la web/aplicación está divulgando información mediante uno o más encabezados de respuesta HTTP ''''X-Powered-By''''. El acceso a tal información podría facilitarle a los atacantes la identificación de otros marcos/componentes de los que su aplicación web depende y las vulnerabilidades a las que pueden estar sujetos tales componentes.

* URL: http://localhost:3060/api/v1/company/all
  * Nombre del Nodo: `http://localhost:3060/api/v1/company/all`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:8080/
  * Nombre del Nodo: `http://localhost:8080/`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:8080/js/webfontloader.js
  * Nombre del Nodo: `http://localhost:8080/js/webfontloader.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `x-powered-by: Express`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/company/all
  * Nombre del Nodo: `http://localhost:3060/api/v1/company/all`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/dashboard/summary
  * Nombre del Nodo: `http://localhost:3060/api/v1/dashboard/summary`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `x-powered-by: Express`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `x-powered-by: Express`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `x-powered-by: Express`
  * Otra información: ``
* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `X-Powered-By: Express`
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `x-powered-by: Express`
  * Otra información: ``

Instancia: Systemic


### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. está configurado para suprimir las cabeceras "X-Powered-By".

### Referencia


* [ https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework ](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)
* [ https://www.troyhunt.com/shhh-dont-let-your-response-headers/ ](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ El servidor filtra información de versión a través del campo "Server" del encabezado de respuesta HTTP ](https://www.zaproxy.org/docs/alerts/10036/)



##### Bajo (Alta)

### Descripción

El servidor web/aplicación está filtrando información de versión a través de la cabecera de respuesta HTTP "Server". El acceso a dicha información puede facilitar a los atacantes la identificación de otras vulnerabilidades a las que está sujeto su servidor web/aplicación.

* URL: https://plausible.io/api/event
  * Nombre del Nodo: `https://plausible.io/api/event ()({name,url,domain,props:{browser,browser_version,os,arch,lang,selenium_version}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `BunnyCDN-PE1-787`
  * Otra información: ``


Instancia: 1

### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. está configurado para suprimir la cabecera "Server" o proporcionar detalles genéricos.

### Referencia


* [ https://httpd.apache.org/docs/current/mod/core.html#servertokens ](https://httpd.apache.org/docs/current/mod/core.html#servertokens)
* [ https://learn.microsoft.com/en-us/previous-versions/msp-n-p/ff648552(v=pandp.10) ](https://learn.microsoft.com/en-us/previous-versions/msp-n-p/ff648552(v=pandp.10))
* [ https://www.troyhunt.com/shhh-dont-let-your-response-headers/ ](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Falta encabezado X-Content-Type-Options ](https://www.zaproxy.org/docs/alerts/10021/)



##### Bajo (Media)

### Descripción

La cabecera Anti-MIME-Sniffing X-Content-Type-Options no se ha establecido en 'nosniff'. Esto permite que las versiones anteriores de Internet Explorer y Chrome realicen MIME-sniffing en el cuerpo de la respuesta, lo que puede provocar que el cuerpo dé la respuesta se interprete y se muestre como un tipo de contenido distinto del tipo de contenido declarado. Las versiones actuales (principios de 2014) y heredadas de Firefox utilizarán el tipo de contenido declarado (si se establece uno), en lugar de realizar MIME-sniffing.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/20
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/20`
  * Método: `DELETE`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: http://localhost:8080/
  * Nombre del Nodo: `http://localhost:8080/`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: http://localhost:8080/js/webfontloader.js
  * Nombre del Nodo: `http://localhost:8080/js/webfontloader.js`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/all`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge-consumer-static.azureedge.net/mouse-gesture/config.json
  * Nombre del Nodo: `https://edge-consumer-static.azureedge.net/mouse-gesture/config.json`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist
  * Nombre del Nodo: `https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-6106336998988376562
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-6106336998988376562`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/1720537294320060623
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/1720537294320060623`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://edge.microsoft.com/serviceexperimentation/v3/%3Fosname=win&channel=stable&osver=10.0.22631&devicefamily=desktop&installdate=1783117948&clientversion=149.0.4022.98&experimentationmode=2&scpguard=0&scpfull=0&scpver=0
  * Nombre del Nodo: `https://edge.microsoft.com/serviceexperimentation/v3/ (channel,clientversion,devicefamily,experimentationmode,installdate,osname,osver,scpfull,scpguard,scpver)`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://msedgedevtools.microsoft.com/docs/149/stable.json
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/docs/149/stable.json`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://msedgedriver.microsoft.com/LATEST_RELEASE_149_WINDOWS
  * Nombre del Nodo: `https://msedgedriver.microsoft.com/LATEST_RELEASE_149_WINDOWS`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json
  * Nombre del Nodo: `https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json
  * Nombre del Nodo: `https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://xpaywalletcdn-prod.azureedge.net/mswallet/CardRoaming/V1/GetRoamingSaveDisabledSites
  * Nombre del Nodo: `https://xpaywalletcdn-prod.azureedge.net/mswallet/CardRoaming/V1/GetRoamingSaveDisabledSites`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://xpaywalletcdn-prod.azureedge.net/mswallet/ExpressCheckout/v1/GetGlobalConfig%3FEdgeChannel=stable&EdgeVersion=149.0.4022.98&ConfigVersion=0&ConfigType=CMN_TOP_ECOM_CFG
  * Nombre del Nodo: `https://xpaywalletcdn-prod.azureedge.net/mswallet/ExpressCheckout/v1/GetGlobalConfig (ConfigType,ConfigVersion,EdgeChannel,EdgeVersion)`
  * Método: `GET`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/settings/3
  * Nombre del Nodo: `https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/settings/3 ()({identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},correlationId,debugInfo:{clientId}})`
  * Método: `POST`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/toptraffic/3
  * Nombre del Nodo: `https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/toptraffic/3 ()({identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},correlationId,debugInfo:{clientId}})`
  * Método: `POST`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://nav-edge.smartscreen.microsoft.com/api/browser/edge/navigate/3
  * Nombre del Nodo: `https://nav-edge.smartscreen.microsoft.com/api/browser/edge/navigate/3 ()({userAgent,redirectChain:[],enhancedRedirectChain:{redirectSource,referrerChain:[]},identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},config:{user:{uriReputation:{enforcedByPolicy,level}},device:{appControl:{level},appReputation:{enforcedByPolicy,level}}},destination:{uri,ip},...)`
  * Método: `POST`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`
* URL: https://plausible.io/api/event
  * Nombre del Nodo: `https://plausible.io/api/event ()({name,url,domain,props:{browser,browser_version,os,arch,lang,selenium_version}})`
  * Método: `POST`
  * Parámetros: `x-content-type-options`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: `Este problema aún se aplica a las páginas de tipo error (401, 403, 500, etc.), ya que esas páginas a menudo se ven afectadas por problemas de inyección, en cuyo caso aún existe la preocupación de que los navegadores husmeen las páginas lejos de su tipo de contenido real.
En el umbral «Alto» esta regla de análisis no alertará sobre respuestas de error del cliente o servidor.`

Instancia: Systemic


### Solución

Asegúrese de que la aplicación/servidor web establece el encabezado Content-Type adecuadamente, y que establece el encabezado X-Content-Type-Options a 'nosniff' para todas las páginas web.
Si es posible, asegúrese de que el usuario final utiliza un navegador web moderno y compatible con los estándares que no realiza MIME-sniffing en absoluto, o que puede ser dirigido por la aplicación web/servidor web para que no realice MIME-sniffing.

### Referencia


* [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Revelación de IP privada ](https://www.zaproxy.org/docs/alerts/2/)



##### Bajo (Media)

### Descripción

Se ha encontrado una IP privada (como 10.x.x.x, 172.x.x.x, 192.168.x.x) o un nombre de host privado de Amazon EC2 (por ejemplo, ip-10-0-56-78) en el cuerpo de la respuesta HTTP. Esta información podría ser útil para futuros ataques dirigidos a sistemas internos.

* URL: http://localhost:8080/js/app.js
  * Nombre del Nodo: `http://localhost:8080/js/app.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `10.250.238.156`
  * Otra información: `10.250.238.156
`
* URL: http://localhost:8080/js/chunk-vendors.js
  * Nombre del Nodo: `http://localhost:8080/js/chunk-vendors.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `10.250.238.156`
  * Otra información: `10.250.238.156
10.250.238.156
10.250.238.156
10.250.238.156
`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `10.1.124.8`
  * Otra información: `10.1.124.8
10.1.124.8
10.1.124.8
10.2.154.4
10.2.154.4
10.2.154.4
10.2.154.13
10.2.154.13
10.2.154.13
10.2.154.15
10.2.154.15
10.2.154.15
10.2.154.15
10.2.154.23
10.2.154.23
10.2.154.26
10.2.154.26
10.2.154.26
10.2.154.26
10.2.154.26
10.7.193.13
10.7.193.20
10.8.168.20
10.8.168.21
10.8.168.25
10.8.168.25
10.8.168.25
10.8.168.25
10.8.168.25
10.8.168.25
`
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:vMeAm5CjEGawbD7Ek2VftlxCKN9A37DUYKkeKz4ODCM&cup2hreq=6f33a73cc1ebd76826be48f6eb6dceadb70ab9a4aeca5ae9fd98b2489698b2ef
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}..,{appid,brand,cohort,enabled,installdate,lang,model_locale,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version},{appid,brand,cohort,enabled,installdate,lang,ping:{r},targetin...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `10.34.0.84`
  * Otra información: `10.34.0.84
`


Instancia: 4

### Solución

Eliminar la dirección IP privada del cuerpo de la respuesta HTTP. Para los comentarios, utilice comentarios JSP/ASP/PHP en lugar de comentarios HTML/JavaScript que pueden ser vistos por los navegadores de los clientes.

### Referencia


* [ https://datatracker.ietf.org/doc/html/rfc1918 ](https://datatracker.ietf.org/doc/html/rfc1918)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Strict-Transport-Security Deshabilitado ](https://www.zaproxy.org/docs/alerts/10035/)



##### Bajo (Alta)

### Descripción

Se encontró un encabezado HTTP Strict Transport Security (HSTS), pero contiene la directiva max-age=0 que desactiva el control e indica a los navegadores que restablezcan cualquier configuración anterior relacionada con HSTS. Consulte RFC 6797 para obtener más detalles.
HTTP Strict Transport Security (HSTS) es un mecanismo de política de seguridad web mediante el cual un servidor web declara que los agentes de usuario que cumplen (como un navegador web) deben interactuar con él utilizando sólo conexiones HTTPS seguras (ej., HTTP sobre TLS/SSL).

* URL: https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist
  * Nombre del Nodo: `https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `max-age=0`
  * Otra información: ``


Instancia: 1

### Solución

Revise la configuración de este control. Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. esté configurado para establecer Strict-Transport-Security con un valor de edad máxima adecuado.

### Referencia


* [ https://datatracker.ietf.org/doc/html/rfc6797#section-6.2 ](https://datatracker.ietf.org/doc/html/rfc6797#section-6.2)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Strict-Transport-Security Header No Establecido ](https://www.zaproxy.org/docs/alerts/10035/)



##### Bajo (Alta)

### Descripción

HTTP Strict Transport Security (HSTS) es un mecanismo de política de seguridad web mediante el cual un servidor web declara que los agentes de usuario conformes (como un navegador web) deben interactuar con él utilizando únicamente conexiones HTTPS seguras (es decir, HTTP superpuesto a TLS/SSL). HSTS es un protocolo de seguimiento de estándares del IETF y se especifica en RFC 6797.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge-consumer-static.azureedge.net/mouse-gesture/config.json
  * Nombre del Nodo: `https://edge-consumer-static.azureedge.net/mouse-gesture/config.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge.microsoft.com/serviceexperimentation/v3/%3Fosname=win&channel=stable&osver=10.0.22631&devicefamily=desktop&installdate=1783117948&clientversion=149.0.4022.98&experimentationmode=2&scpguard=0&scpfull=0&scpver=0
  * Nombre del Nodo: `https://edge.microsoft.com/serviceexperimentation/v3/ (channel,clientversion,devicefamily,experimentationmode,installdate,osname,osver,scpfull,scpguard,scpver)`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/docs/149/stable.json
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/docs/149/stable.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedriver.microsoft.com/LATEST_RELEASE_149_WINDOWS
  * Nombre del Nodo: `https://msedgedriver.microsoft.com/LATEST_RELEASE_149_WINDOWS`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json
  * Nombre del Nodo: `https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19`
  * Método: `OPTIONS`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/settings/3
  * Nombre del Nodo: `https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/settings/3 ()({identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},correlationId,debugInfo:{clientId}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/toptraffic/3
  * Nombre del Nodo: `https://data-edge.smartscreen.microsoft.com/api/browser/edge/data/toptraffic/3 ()({identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},correlationId,debugInfo:{clientId}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge.microsoft.com/componentupdater/api/v1/update
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update ()({request:{@os,@updater,acceptformat,apps:[{appid,brand,enabled,events:[{download_time_ms,downloader,errorcode,eventresult,eventtype,extracode1,nextversion,pipeline_id,previousversion,total,url},{errorcat,errorcode,eventresult,eventtype,extracode1,install_time_ms,nextversion,previousversion}],installdate,lang,version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaterversion}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:BXjE9eErPXCmDn6LAT_spb3Lhsw6V7q1wj6UvhRVYtE&cup2hreq=478cadfae0ec23a29bec94bdf5414f4805f1815db70eff202fb09376a66401a9
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,installsource,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaters:{autoupdatecheckenabled,ismachine,lastchecked,laststarted,name,updatepolicy,version},updaterve...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge.microsoft.com/componentupdater/api/v1/update%3Fcup2key=7:G8F5OXiuA4m3DsDDF2Kxu1Y49skigxbZdFnVkWJPQ2k&cup2hreq=1f8ca9c1435d767abe267092c343e31ffbcaa5da444a816aa9a256d89cb8e4ce
  * Nombre del Nodo: `https://edge.microsoft.com/componentupdater/api/v1/update (cup2hreq,cup2key)({request:{@os,@updater,acceptformat,apps:[{appid,brand,cohort,enabled,installdate,lang,ping:{r},targetingattributes:{AppCohort,AppMajorVersion,AppRollout,AppVersion,IsInternalUser,Priority,Updater,UpdaterVersion},updatecheck:{},version}],arch,dedup,domainjoined,hw:{avx,physmemory,sse,sse2,sse3,sse41,sse42,ssse3},ismachine,os:{arch,platform,version},prodversion,protocol,requestid,sessionid,updaters:{autoupdatecheckenabled,ismachine,lastchecked,laststarted,name,updatepolicy,version},updaterversion}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://editor.svc.cloud.microsoft/NLEditor/TileCheck/V1
  * Nombre del Nodo: `https://editor.svc.cloud.microsoft/NLEditor/TileCheck/V1 ()({SessionId,AppId,LanguageUxId,Content:[{TileId,RevisionId,TileElements:[{LanguageId,Text,TextUnit}]}],Descriptors:[{Name,Value}..]})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://nav-edge.smartscreen.microsoft.com/api/browser/edge/navigate/3
  * Nombre del Nodo: `https://nav-edge.smartscreen.microsoft.com/api/browser/edge/navigate/3 ()({userAgent,redirectChain:[],enhancedRedirectChain:{redirectSource,referrerChain:[]},identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},config:{user:{uriReputation:{enforcedByPolicy,level}},device:{appControl:{level},appReputation:{enforcedByPolicy,level}}},destination:{uri,ip},...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://plausible.io/api/event
  * Nombre del Nodo: `https://plausible.io/api/event ()({name,url,domain,props:{browser,browser_version,os,arch,lang,selenium_version}})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3
  * Nombre del Nodo: `https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3 ()({executionTime,random,samplingRates:{evaluateModel,serverCall,cacheHit},config:{user:{uriReputation:{enforcedByPolicy,level}},device:{appControl:{level},appReputation:{enforcedByPolicy,level}}},correlationId,identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},userAgent,events:[{...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3
  * Nombre del Nodo: `https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3 ()({executionTime,random,samplingRates:{evaluateModel,serverCall},config:{user:{uriReputation:{enforcedByPolicy,level}},device:{appControl:{level},appReputation:{enforcedByPolicy,level}}},correlationId,identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},userAgent,events:[{$type,nam...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3
  * Nombre del Nodo: `https://telem-edge.smartscreen.microsoft.com/api/browser/edge/telemetry/3 ()({executionTime,random,samplingRates:{serverCall},config:{user:{uriReputation:{enforcedByPolicy,level}},device:{appControl:{level},appReputation:{enforcedByPolicy,level}}},correlationId,identity:{user:{locale},device:{id,customId,onlineIdTicket,family,locale,osVersion,browser:{internetExplorer},netJoinStatus,enterprise:{},cloudSku,architecture},caller:{locale,name,version},client:{version,data:{topTraffic,customSynchronousLookupUris,edgeSettings,customSettings}}},userAgent,events:[{$type,name},{$type,tele...)`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://www.googleapis.com/chromewebstore/v1.1/items/verify
  * Nombre del Nodo: `https://www.googleapis.com/chromewebstore/v1.1/items/verify ()({hash,ids:[],protocol_version})`
  * Método: `POST`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``

Instancia: Systemic


### Solución

Asegúrese de que su servidor web, servidor de aplicaciones, balanceador de carga, etc. está configurado para aplicar Strict-Transport-Security.

### Referencia


* [ https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)
* [ https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security ](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
* [ https://caniuse.com/stricttransportsecurity ](https://caniuse.com/stricttransportsecurity)
* [ https://datatracker.ietf.org/doc/html/rfc6797 ](https://datatracker.ietf.org/doc/html/rfc6797)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Aplicación Web Moderna ](https://www.zaproxy.org/docs/alerts/10109/)



##### Informativo (Media)

### Descripción

La aplicación parece ser una aplicación web moderna. Si necesita explorarla automáticamente, el Ajax Spider puede ser más eficaz que el estándar.

* URL: http://localhost:8080/
  * Nombre del Nodo: `http://localhost:8080/`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `<script defer src="/js/chunk-vendors.js"></script>`
  * Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`
* URL: http://localhost:8080/companies
  * Nombre del Nodo: `http://localhost:8080/companies`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `<script defer src="/js/chunk-vendors.js"></script>`
  * Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`
* URL: http://localhost:8080/company/1
  * Nombre del Nodo: `http://localhost:8080/company/1`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `<script defer src="/js/chunk-vendors.js"></script>`
  * Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`
* URL: http://localhost:8080/rooms
  * Nombre del Nodo: `http://localhost:8080/rooms`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `<script defer src="/js/chunk-vendors.js"></script>`
  * Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `<script>
  const worker = new Worker('webhint.js');
  const channel = new MessageChannel();
  channel.port1.onmessage = event => worker.postMessage(event.data);
  worker.onmessage = event => channel.port1.postMessage(event.data);
  window.parent.postMessage('webhint-worker-port', '*', [channel.port2]);
</script>`
  * Otra información: `No se han encontrado enlaces aunque sí scripts, lo que indica que se trata de una aplicación web moderna.`

Instancia: Systemic


### Solución

Se trata de una alerta informativa, por lo que no es necesario realizar ningún cambio.

### Referencia




#### ID de la Fuente: 3

### [ Cabecera Content-Type Perdida ](https://www.zaproxy.org/docs/alerts/10019/)



##### Informativo (Media)

### Descripción

La cabecera Content-Type falta o está vacia.

* URL: https://edge.microsoft.com/notfoundpathwillgive404
  * Nombre del Nodo: `https://edge.microsoft.com/notfoundpathwillgive404 ()({clientId,domainSign,fields:[{fieldSign,label}..],formSign,pageLanguage})`
  * Método: `POST`
  * Parámetros: `content-type`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``


Instancia: 1

### Solución

Asegúrese de que cada página establezca el valor de tipo de contenido específico y apropiado para el contenido que se entrega.

### Referencia


* [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))


#### CWE Id: [ 345 ](https://cwe.mitre.org/data/definitions/345.html)


#### WASC Id: 12

#### ID de la Fuente: 3

### [ Divulgación de Información - Información sensible en URL ](https://www.zaproxy.org/docs/alerts/10024/)



##### Informativo (Media)

### Descripción

La solicitud parecía contener información sensible filtrada en la URL. Esto puede violar las políticas de cumplimiento de PCI y de la mayoría de las organizaciones. Puede configurar la lista de cadenas de esta comprobación para añadir o eliminar valores específicos de su entorno.

* URL: http://localhost:8080/company/1/hotel/1%3FhotelName=GroupSAC@gmail.com&companyName=Hotel+Group+SAC
  * Nombre del Nodo: `http://localhost:8080/company/1/hotel/1 (companyName,hotelName)`
  * Método: `GET`
  * Parámetros: `hotelName`
  * Ataque: ``
  * Evidencia: `GroupSAC@gmail.com`
  * Otra información: `El URL contiene dirección(es) de correo electrónico.`


Instancia: 1

### Solución

No pase información sensible en URIs.

### Referencia



#### CWE Id: [ 598 ](https://cwe.mitre.org/data/definitions/598.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Divulgación de información - Comentarios sospechosos ](https://www.zaproxy.org/docs/alerts/10027/)



##### Informativo (Media)

### Descripción

The response appears to contain suspicious comments which may help an attacker.

* URL: http://localhost:8080/js/app.js
  * Nombre del Nodo: `http://localhost:8080/js/app.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `// inherit from previous dispose ca`
  * Otra información: `The following pattern was used: \bFROM\b and was detected 5 times, the first in likely comment: "// inherit from previous dispose call", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/app.js
  * Nombre del Nodo: `http://localhost:8080/js/app.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/app.js
  * Nombre del Nodo: `http://localhost:8080/js/app.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `t useful stacktrace later`
  * Otra información: `The following pattern was used: \bLATER\b and was detected 3 times, the first in likely comment: "// create error before stack unwound to get useful stacktrace later", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/chunk-vendors.js
  * Nombre del Nodo: `http://localhost:8080/js/chunk-vendors.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/chunk-vendors.js
  * Nombre del Nodo: `http://localhost:8080/js/chunk-vendors.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `als/set-is-disjoint-from.js ***!
  \********`
  * Otra información: `The following pattern was used: \bFROM\b and was detected 2 times, the first in likely comment: "/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/set-is-disjoint-f", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/chunk-vendors.js
  * Nombre del Nodo: `http://localhost:8080/js/chunk-vendors.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `e-js/internals/enum-bug-keys.js ***!
  \***`
  * Otra información: `The following pattern was used: \bBUG\b and was detected 2 times, the first in likely comment: "/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  ", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/chunk-vendors.js
  * Nombre del Nodo: `http://localhost:8080/js/chunk-vendors.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ternals/environment-user-agent.js ***!
  \**`
  * Otra información: `The following pattern was used: \bUSER\b and was detected in likely comment: "/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/environment-use", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_sweetalert2_dist_sweetalert2_all_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_sweetalert2_dist_sweetalert2_all_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VAlert_VAlert_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VAlert_VAlert_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VAvatar_VAvatar_js-node_modules_vuetify_lib_composables_d-b36b15.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VAvatar_VAvatar_js-node_modules_vuetify_lib_composables_d-b36b15.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VBtn_VBtn_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VCard_VCard_js-node_modules_vuetify_lib_components_VDialo-e4022a.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VCard_VCard_js-node_modules_vuetify_lib_components_VDialo-e4022a.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VList_VList_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VList_VList_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VProgressCircular_VProgressCircular_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VProgressCircular_VProgressCircular_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VSelect_VSelect_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VSelect_VSelect_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_VTextField_VTextField_js.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_VTextField_VTextField_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js
  * Nombre del Nodo: `http://localhost:8080/js/node_modules_vuetify_lib_components_transitions_index_js-node_modules_vuetify_lib_composables-93b7a7.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_config_http_config_js.js
  * Nombre del Nodo: `http://localhost:8080/js/src_config_http_config_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_layouts_MasterLayout_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_layouts_MasterLayout_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_AdminDashboardView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_AdminDashboardView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_AdminPaymentView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_AdminPaymentView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_BookView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_BookView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_CompanyView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_CompanyView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_CustomerPaymentHistoryView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_CustomerPaymentHistoryView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_CustomerView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_CustomerView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_HotelView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_HotelView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_LoginView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_LoginView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_PaymentView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_PaymentView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_PublicHotelsView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_PublicHotelsView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_PublicRoomsView_vue-node_modules_vuetify_lib_util_createSimpleFunctional_js.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_PublicRoomsView_vue-node_modules_vuetify_lib_util_createSimpleFunctional_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_RegisterView_vue-node_modules_vuetify_lib_util_createSimpleFunctional_js.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_RegisterView_vue-node_modules_vuetify_lib_util_createSimpleFunctional_js.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/src_views_RoomView_vue.js
  * Nombre del Nodo: `http://localhost:8080/js/src_views_RoomView_vue.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: http://localhost:8080/js/webfontloader.js
  * Nombre del Nodo: `http://localhost:8080/js/webfontloader.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `ad the output file, select a different devtool`
  * Otra información: `The following pattern was used: \bSELECT\b and was detected in likely comment: "/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable out", see evidence field for the suspicious comment/snippet.`
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/webhint.js`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `* The buffer module from node.js, for the br`
  * Otra información: `The following pattern was used: \bFROM\b and was detected in likely comment: "/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MI", see evidence field for the suspicious comment/snippet.`


Instancia: 34

### Solución

Eliminar todos los comentarios que muestren información que pueda ayudar a un atacante y solucionar el problema al que se refieren.

### Referencia



#### CWE Id: [ 615 ](https://cwe.mitre.org/data/definitions/615.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Loosely Scoped Cookie ](https://www.zaproxy.org/docs/alerts/90033/)



##### Informativo (Baja)

### Descripción

Las Cookies pueden ser delimitadas por dominio o ruta. Esta comprobación solo se considera con ámbito de dominio. El ámbito de dominio aplicado a una cookie determina cuales dominios lo pueden acceder. Por ejemplo, una cookie puede ser delimitada estrictamente a un subdominio por ejemplo, www.nottrusted.com, o libremente delimitada a un dominio padre por ejemplo, nottrusted.com. En el último caso, cualquier subdominio de nottrusted.com puede acceder a la cookie. Las cookies libremente delimitadas son comunes en mega-aplicaciones como google.com y live.com. las cookies establecidas desde un subdominio como app.foo.bar son transmitidas solo al dominio del navegador. Sin embargo, las cookies delimitadas a un dominio de nivel de padre podría ser transmitida al padre, o cualquier subdominio del padre.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `domain=bing.com`
  * Otra información: `El dominio de origen utilizado para la comparación fue:
www.bing.com
Cookie name: _EDGE_S
Cookie name: _EDGE_V
Cookie name: MUID
`


Instancia: 1

### Solución

Siempre delimitar las cookies a FQDN (Fully Qualified Domain Name).

### Referencia


* [ https://datatracker.ietf.org/doc/html/rfc6265#section-4.1 ](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1)
* [ https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes.html ](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes.html)
* [ https://code.google.com/archive/p/browsersec/wikis/Part2.wiki ](https://code.google.com/archive/p/browsersec/wikis/Part2.wiki)


#### CWE Id: [ 565 ](https://cwe.mitre.org/data/definitions/565.html)


#### WASC Id: 15

#### ID de la Fuente: 3

### [ Petición de Autenticación Identificada ](https://www.zaproxy.org/docs/alerts/10111/)



##### Informativo (Alta)

### Descripción

La petición en cuestión se ha identificado como una petición de autenticación. El campo "Otra información" contiene un conjunto de líneas key=vvalue que identifican cualquier campo relevante. Si la solicitud está en un contexto que tiene un método de autenticación configurado como "Detección automática", esta regla cambiará la autenticación para que coincida con la petición identificada.

* URL: http://localhost:3060/api/v1/customer/add
  * Nombre del Nodo: `http://localhost:3060/api/v1/customer/add ()({username,password,name,lastName,dni,email,hotelId,companyId})`
  * Método: `POST`
  * Parámetros: `email`
  * Ataque: ``
  * Evidencia: `password`
  * Otra información: `userParam=email
userValue=rodrigoquispe@gmail.com
passwordParam=password
referer=http://localhost:8080/`
* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `username`
  * Ataque: ``
  * Evidencia: `password`
  * Otra información: `userParam=username
userValue=superuser
passwordParam=password
referer=http://localhost:8080/`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `username`
  * Ataque: ``
  * Evidencia: `password`
  * Otra información: `userParam=username
userValue=superuser
passwordParam=password
referer=http://localhost:8080/`


Instancia: 3

### Solución

Se trata de una alerta informativa y no de una vulnerabilidad, por lo que no hay nada que corregir.

### Referencia


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)



#### ID de la Fuente: 3

### [ Recuperado de la Caché ](https://www.zaproxy.org/docs/alerts/10050/)



##### Informativo (Media)

### Descripción

El contenido se ha recuperado de una caché compartida. Si los datos de respuesta son sensibles, personales o específicos del usuario, esto puede resultar en la filtración de información sensible. En algunos casos, esto puede incluso resultar en que un usuario obtenga el control completo de la sesión de otro usuario, dependiendo de la configuración de los componentes de caché en uso en su entorno. Este problema se produce principalmente cuando los servidores de caché, como los "proxy", están configurados en la red local. Esta configuración se encuentra típicamente en entornos corporativos o educativos, por ejemplo.

* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Age: 123703`
  * Otra información: `La presencia de la cabecera 'Age' indica que se está utilizando un servidor de caché compatible con HTTP/1.1.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Age: 129014`
  * Otra información: `La presencia de la cabecera 'Age' indica que se está utilizando un servidor de caché compatible con HTTP/1.1.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Age: 197537`
  * Otra información: `La presencia de la cabecera 'Age' indica que se está utilizando un servidor de caché compatible con HTTP/1.1.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMawCUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Age: 168999`
  * Otra información: `La presencia de la cabecera 'Age' indica que se está utilizando un servidor de caché compatible con HTTP/1.1.`
* URL: https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2
  * Nombre del Nodo: `https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMaxKUBGEe.woff2`
  * Método: `GET`
  * Parámetros: ``
  * Ataque: ``
  * Evidencia: `Age: 250022`
  * Otra información: `La presencia de la cabecera 'Age' indica que se está utilizando un servidor de caché compatible con HTTP/1.1.`

Instancia: Systemic


### Solución

Válida que la respuesta no contenga información confidencial, personal o específica del usuario. Si es así, considere el uso de los siguientes encabezados de respuesta HTTP para limitar o evitar que otro usuario almacene y recupere el contenido de la memoria caché:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
Esta configuración indica a los servidores de almacenamiento en caché compatibles con HTTP 1.0 y HTTP 1.1 que no almacenen la respuesta ni la recuperen (sin validación) de la memoria caché en respuesta a una solicitud similar.

### Referencia


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.rfc-editor.org/rfc/rfc9110.html ](https://www.rfc-editor.org/rfc/rfc9110.html)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### ID de la Fuente: 3

### [ Reexaminar las Directivas de Control de Caché ](https://www.zaproxy.org/docs/alerts/10015/)



##### Informativo (Baja)

### Descripción

La cabecera cache-control no se ha configurado correctamente o falta, lo que permite al navegador y a los proxies almacenar contenido en caché. Para activos estáticos como css, js, o archivos de imagen esto puede ser intencionado, sin embargo, los recursos deben ser revisados para asegurar que ningún contenido sensible será cacheado.

* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/20
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/delete/20`
  * Método: `DELETE`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/company/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/company/all`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/all
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/all`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/hotel/by-company/19`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://edge-consumer-static.azureedge.net/mouse-gesture/config.json
  * Nombre del Nodo: `https://edge-consumer-static.azureedge.net/mouse-gesture/config.json`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `public, max-age=432000`
  * Otra información: ``
* URL: https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist
  * Nombre del Nodo: `https://edge.microsoft.com/abusiveadblocking/api/v1/blocklist`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `public, max-age=43200`
  * Otra información: ``
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-6106336998988376562
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-6106336998988376562`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `max-age=691200`
  * Otra información: ``
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/-622179374294659602`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `max-age=691200`
  * Otra información: ``
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/1720537294320060623
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/1720537294320060623`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `max-age=691200`
  * Otra información: ``
* URL: https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/4705754093488172091
  * Nombre del Nodo: `https://edge.microsoft.com/autofillservice/core/page/3693946771987704403/4705754093488172091`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: `max-age=691200`
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/docs/149/stable.json
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/docs/149/stable.json`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html
  * Nombre del Nodo: `https://msedgedevtools.microsoft.com/serve_file/@d8414318246f5132427f455636044b6f79c4e03f/third_party/webhint/worker_frame.html`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json
  * Nombre del Nodo: `https://www.bing.com/bloomfilterfiles/ExpandedDomainsFilterGlobal.json`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json
  * Nombre del Nodo: `https://xpaycdn-prod.azureedge.net/json/card-roaming/zipcode.json`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://xpaywalletcdn-prod.azureedge.net/mswallet/CardRoaming/V1/GetRoamingSaveDisabledSites
  * Nombre del Nodo: `https://xpaywalletcdn-prod.azureedge.net/mswallet/CardRoaming/V1/GetRoamingSaveDisabledSites`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``
* URL: https://xpaywalletcdn-prod.azureedge.net/mswallet/ExpressCheckout/v1/GetGlobalConfig%3FEdgeChannel=stable&EdgeVersion=149.0.4022.98&ConfigVersion=0&ConfigType=CMN_TOP_ECOM_CFG
  * Nombre del Nodo: `https://xpaywalletcdn-prod.azureedge.net/mswallet/ExpressCheckout/v1/GetGlobalConfig (ConfigType,ConfigVersion,EdgeChannel,EdgeVersion)`
  * Método: `GET`
  * Parámetros: `cache-control`
  * Ataque: ``
  * Evidencia: ``
  * Otra información: ``

Instancia: Systemic


### Solución

Para contenido seguro, asegúrese de que la cabecera HTTP cache-control está configurada con «no-cache, no-store, must-revalidate». Si un activo debe almacenarse en caché, considere establecer las directivas «public, max-age, immutable».

### Referencia


* [ https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching ](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching)
* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
* [ https://grayduck.mn/2021/09/13/cache-control-recommendations/ ](https://grayduck.mn/2021/09/13/cache-control-recommendations/)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### WASC Id: 13

#### ID de la Fuente: 3

### [ Respuesta de Gestión de Sesión Identificada ](https://www.zaproxy.org/docs/alerts/10112/)



##### Informativo (Media)

### Descripción

Se ha identificado que la respuesta dada contiene un token de gestión de sesión. El campo 'Other Info' contiene un conjunto de tokens de cabecera que pueden utilizarse en el método Header Based Session Management (gestión de sesión basado en cabecera). Si la petición se encuentra en un contexto que tiene un método Session Management establecido en "Auto-Detect", esta regla cambiará la gestión de sesión para utilizar los tokens identificados.

* URL: https://www.bing.com/api/shopping/v1/user/shoppingsettings
  * Nombre del Nodo: `https://www.bing.com/api/shopping/v1/user/shoppingsettings`
  * Método: `GET`
  * Parámetros: `MUIDB`
  * Ataque: ``
  * Evidencia: `MUIDB`
  * Otra información: `cookie:MUIDB
cookie:_EDGE_S
cookie:MUID`
* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `token`
  * Ataque: ``
  * Evidencia: `token`
  * Otra información: `json:token`
* URL: https://backend-hotel-pqx6.onrender.com/api/v1/auth/login
  * Nombre del Nodo: `https://backend-hotel-pqx6.onrender.com/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `token`
  * Ataque: ``
  * Evidencia: `token`
  * Otra información: `json:token`


Instancia: 3

### Solución

Se trata de una alerta informativa y no de una vulnerabilidad, por lo que no hay nada que corregir.

### Referencia


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/)



#### ID de la Fuente: 3


