# ZAP por Informe de Escaneo Checkmarx

ZAP by [Checkmarx](https://checkmarx.com/).


## Sumario de Alertas

| Nivel de riesgo | Número de Alertas |
| --- | --- |
| Alto | 0 |
| Medio | 0 |
| Bajo | 0 |
| Informativo | 2 |




## Insights

| Level | Razón | Site | Descripción | Statistic |
| --- | --- | --- | --- | --- |
| Bajo | Advertencia |  | ZAP warnings logged - see the zap.log file for details | 254    |
| Información | Informativo | http://edge.microsoft.com | Percentage of responses with status code 4xx | 100 % |
| Información | Informativo | http://edge.microsoft.com | Percentage of slow responses | 100 % |
| Información | Informativo | http://localhost:3060 | Percentage of responses with status code 2xx | 26 % |
| Información | Informativo | http://localhost:3060 | Percentage of responses with status code 3xx | 1 % |
| Información | Informativo | http://localhost:3060 | Percentage of responses with status code 4xx | 72 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with content type application/json | 94 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method DELETE | 12 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method GET | 39 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method OPTIONS | 5 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method PATCH | 5 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method POST | 26 % |
| Información | Informativo | http://localhost:3060 | Percentage of endpoints with method PUT | 10 % |
| Información | Informativo | http://localhost:3060 | Count of total endpoints | 56    |
| Información | Informativo | http://localhost:3060 | Percentage of slow responses | 4 % |
| Información | Informativo | http://localhost:8080 | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | http://localhost:8080 | Percentage of endpoints with content type application/javascript | 28 % |
| Información | Informativo | http://localhost:8080 | Percentage of endpoints with content type image/jpeg | 28 % |
| Información | Informativo | http://localhost:8080 | Percentage of endpoints with content type image/vnd.microsoft.icon | 14 % |
| Información | Informativo | http://localhost:8080 | Percentage of endpoints with content type text/html | 28 % |
| Información | Informativo | http://localhost:8080 | Percentage of endpoints with method GET | 100 % |
| Información | Informativo | http://localhost:8080 | Count of total endpoints | 7    |
| Información | Informativo | http://msedge.b.tlu.dl.delivery.mp.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | http://msedge.b.tlu.dl.delivery.mp.microsoft.com | Percentage of slow responses | 10 % |
| Información | Informativo | http://msedge.f.tlu.dl.delivery.mp.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | http://msedge.f.tlu.dl.delivery.mp.microsoft.com | Percentage of slow responses | 42 % |
| Información | Informativo | https://data-edge.smartscreen.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://data-edge.smartscreen.microsoft.com | Percentage of slow responses | 100 % |
| Información | Informativo | https://edge-consumer-static.azureedge.net | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://edge-consumer-static.azureedge.net | Percentage of slow responses | 100 % |
| Información | Informativo | https://edge.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://edge.microsoft.com | Percentage of endpoints with content type application/json | 50 % |
| Información | Informativo | https://edge.microsoft.com | Percentage of endpoints with method GET | 25 % |
| Información | Informativo | https://edge.microsoft.com | Percentage of endpoints with method POST | 75 % |
| Información | Informativo | https://edge.microsoft.com | Count of total endpoints | 4    |
| Información | Informativo | https://edge.microsoft.com | Percentage of slow responses | 80 % |
| Información | Informativo | https://editor.svc.cloud.microsoft | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://editor.svc.cloud.microsoft | Percentage of slow responses | 100 % |
| Información | Informativo | https://msedgedriver.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://msedgedriver.microsoft.com | Percentage of endpoints with content type application/octet-stream | 100 % |
| Información | Informativo | https://msedgedriver.microsoft.com | Percentage of endpoints with method GET | 100 % |
| Información | Informativo | https://msedgedriver.microsoft.com | Count of total endpoints | 1    |
| Información | Informativo | https://msedgedriver.microsoft.com | Percentage of slow responses | 100 % |
| Información | Informativo | https://nav-edge.smartscreen.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://nav-edge.smartscreen.microsoft.com | Percentage of slow responses | 100 % |
| Información | Informativo | https://plausible.io | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://plausible.io | Percentage of slow responses | 100 % |
| Información | Informativo | https://telem-edge.smartscreen.microsoft.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://telem-edge.smartscreen.microsoft.com | Percentage of slow responses | 100 % |
| Información | Informativo | https://www.bing.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://www.bing.com | Percentage of slow responses | 100 % |
| Información | Informativo | https://www.googleapis.com | Percentage of responses with status code 2xx | 100 % |
| Información | Informativo | https://www.googleapis.com | Percentage of slow responses | 100 % |







## Alertas

| Nombre | Nivel de riesgo | Número de Instancias |
| --- | --- | --- |
| Petición de Autenticación Identificada | Informativo | 1 |
| Respuesta de Gestión de Sesión Identificada | Informativo | 1 |




## Detalles de la Alerta



### [ Petición de Autenticación Identificada ](https://www.zaproxy.org/docs/alerts/10111/)



##### Informativo (Alta)

### Descripción

La petición en cuestión se ha identificado como una petición de autenticación. El campo "Otra información" contiene un conjunto de líneas key=vvalue que identifican cualquier campo relevante. Si la solicitud está en un contexto que tiene un método de autenticación configurado como "Detección automática", esta regla cambiará la autenticación para que coincida con la petición identificada.

* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `username`
  * Ataque: ``
  * Evidencia: `password`
  * Otra información: `userParam=username
userValue=superuser
passwordParam=password`


Instancia: 1

### Solución

Se trata de una alerta informativa y no de una vulnerabilidad, por lo que no hay nada que corregir.

### Referencia


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)



#### ID de la Fuente: 3

### [ Respuesta de Gestión de Sesión Identificada ](https://www.zaproxy.org/docs/alerts/10112/)



##### Informativo (Media)

### Descripción

Se ha identificado que la respuesta dada contiene un token de gestión de sesión. El campo 'Other Info' contiene un conjunto de tokens de cabecera que pueden utilizarse en el método Header Based Session Management (gestión de sesión basado en cabecera). Si la petición se encuentra en un contexto que tiene un método Session Management establecido en "Auto-Detect", esta regla cambiará la gestión de sesión para utilizar los tokens identificados.

* URL: http://localhost:3060/api/v1/auth/login
  * Nombre del Nodo: `http://localhost:3060/api/v1/auth/login ()({username,password})`
  * Método: `POST`
  * Parámetros: `token`
  * Ataque: ``
  * Evidencia: `token`
  * Otra información: `json:token`


Instancia: 1

### Solución

Se trata de una alerta informativa y no de una vulnerabilidad, por lo que no hay nada que corregir.

### Referencia


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/session-mgmt-id/)



#### ID de la Fuente: 3


