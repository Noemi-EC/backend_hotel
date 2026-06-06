# Contexto Backend para el Equipo Frontend
## Sistema de Gestión de Reservas Hoteleras

**Para:** Equipo frontend (platform_hotel — Vue 3 + Vuetify)
**Backend:** NestJS 11 + TypeORM + PostgreSQL
**URL base:** `http://localhost:3060/api/v1`
**Fecha:** Mayo 2026

---

## Estado de Implementación por HU

| HU | Descripción | Backend | Frontend |
|----|-------------|---------|----------|
| HU-01 | Registro de empresas y admins | ✅ Completo | ❌ Pendiente |
| HU-02 | Login con bloqueo por intentos | ✅ Completo | ⚠️ Falta mostrar bloqueo |
| HU-03 | Gestión de clientes | ✅ Completo | ⚠️ Falta búsqueda por DNI |
| HU-04 | Gestión de habitaciones | ✅ Completo | ✅ Completo |
| HU-05 | Disponibilidad en tiempo real | ✅ Completo | ❌ Pendiente |
| HU-06 | Filtros de búsqueda | ✅ Completo (en /room/available) | ❌ Pendiente |
| HU-07 | Visualización de disponibilidad | ✅ Completo | ⚠️ Depende de HU-05 |
| HU-08 | Creación de reservas | ✅ Completo + anti-solapamiento | ✅ Mayormente completo |
| HU-09 | Estados de reserva | ✅ Completo | ✅ Completo |
| HU-10 | Pago + código de confirmación | ✅ Completo | ⚠️ Falta mostrar código y voucher |
| HU-11 | Historial de pagos del cliente | ✅ Completo | ❌ Pendiente |
| HU-12 | Reportes con filtros + ocupación | ✅ Completo | ⚠️ Falta filtros y exportación |

---

## Autenticación

### Headers requeridos en requests protegidos
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Roles del sistema
| Rol | Acceso |
|-----|--------|
| `SUPERUSER` | Todo el sistema — gestión de empresas |
| `ADMIN` | Su hotel — habitaciones, reservas, clientes |
| `CUSTOMER` | Sus propias reservas y pagos |

### JWT Payload (lo que viene dentro del token)
```javascript
{
  sub: number,       // userId — úsalo como req.user.userId
  username: string,
  role: string       // 'SUPERUSER' | 'ADMIN' | 'CUSTOMER'
}
```

---

## Endpoints Completos

### AUTH `/api/v1/auth`

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/auth/login` | No | Login — devuelve token y user |
| POST | `/auth/init-admin` | No | Crea usuario admin inicial (solo 1 vez) |
| POST | `/auth/init-super` | No | Crea superusuario inicial (solo 1 vez) |

**Login — Body:**
```json
{ "username": "admin", "password": "admin123" }
```
**Login — Respuesta:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "username": "admin", "role": "ADMIN", "hotelId": 1, "companyId": 1 }
}
```

**Credenciales por defecto:**
- Admin: `admin` / `admin123`
- Superusuario: `superuser` / `super123`

**Bloqueo de seguridad (HU-02):**
- Tras 3 intentos fallidos la cuenta se bloquea 15 minutos
- El error devuelve: `"Cuenta bloqueada. Intente de nuevo en X minuto(s)"`

---

### COMPANY `/api/v1/company`

| Método | URL | Auth | Rol | Descripción |
|--------|-----|------|-----|-------------|
| POST | `/company/register` | No | Público | Registro de empresa + hotel + admin |
| POST | `/company/add` | Sí | SUPERUSER | Crear empresa |
| GET | `/company/all` | Sí | SUPERUSER, ADMIN | Listar empresas |
| GET | `/company/:id` | Sí | SUPERUSER, ADMIN | Ver empresa |
| PUT | `/company/update/:id` | Sí | SUPERUSER | Actualizar empresa |
| DELETE | `/company/delete/:id` | Sí | SUPERUSER | Eliminar empresa |

**Registro público — Body:**
```json
{
  "companyName": "Hotel Group SAC",
  "ruc": "12345678901",
  "companyAddress": "Av. Principal 123",
  "companyPhone": "555-1234",
  "companyEmail": "info@hotelgroup.com",
  "hotelName": "Hotel Central",
  "hotelAddress": "Calle 5 #10",
  "hotelPhone": "555-5678",
  "hotelEmail": "central@hotelgroup.com",
  "adminUsername": "admin_central",
  "adminPassword": "pass123"
}
```

---

### HOTEL `/api/v1/hotel`

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/hotel/add` | No | Crear hotel |
| GET | `/hotel/all` | No | Listar todos los hoteles |
| GET | `/hotel/:id` | No | Ver hotel por ID |
| GET | `/hotel/by-company/:companyId` | No | Hoteles de una empresa |
| PUT | `/hotel/update/:id` | No | Actualizar hotel |
| DELETE | `/hotel/delete/:id` | No | Eliminar hotel |

---

### ROOM `/api/v1/room`

| Método | URL | Auth | Rol | Descripción |
|--------|-----|------|-----|-------------|
| POST | `/room/add` | Sí | ADMIN, SUPERUSER | Crear habitación |
| GET | `/room/all` | Sí | Todos | Listar habitaciones |
| GET | `/room/available` | Sí | Todos | **HU-05** Habitaciones disponibles |
| PUT | `/room/update/:id` | Sí | ADMIN, SUPERUSER | Actualizar habitación |
| DELETE | `/room/delete/:id` | Sí | ADMIN, SUPERUSER | Eliminar habitación |

**Crear habitación — Body:**
```json
{
  "hotelId": 1,
  "code": "101",
  "status": "disponible",
  "capacity": 2,
  "price": 150.00,
  "category": "standard"
}
```
Status válidos: `disponible` | `ocupada` | `limpieza` | `mantenimiento`
Categorías válidas: `standard` | `suite` | `duplex` | `deluxe`

**Disponibilidad — Query params:**
```
GET /room/available?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05
GET /room/available?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05&category=suite
GET /room/available?hotelId=1&checkIn=2026-06-01&checkOut=2026-06-05&minCapacity=2&maxPrice=200
```

---

### CUSTOMER `/api/v1/customer`

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/customer/add` o `/customer/create` | No | Crear cliente + su usuario |
| GET | `/customer/all` | No | Listar clientes |
| PUT | `/customer/update/:id` | No | Actualizar cliente |
| DELETE | `/customer/delete/:id` | No | Eliminar cliente |

**Crear cliente — Body:**
```json
{
  "username": "juan123",
  "password": "pass1234",
  "name": "Juan",
  "lastName": "Pérez",
  "dni": "12345678",
  "email": "juan@email.com"
}
```
> Al crear un customer se crea automáticamente su User con role=CUSTOMER.

---

### BOOK `/api/v1/book`

| Método | URL | Auth | Rol | Descripción |
|--------|-----|------|-----|-------------|
| POST | `/book/add` o `/book/create` | Sí | CUSTOMER, ADMIN | Crear reserva |
| PATCH | `/book/:id/status/:status` | Sí | CUSTOMER, ADMIN | Cambiar estado (en URL) |
| PATCH | `/book/:id/status` | Sí | CUSTOMER, ADMIN | Cambiar estado (en body) |
| GET | `/book/all` o `/book/admin/all` | Sí | ADMIN, SUPERUSER | Todas las reservas |
| GET | `/book/customer` o `/book/customer/all` | Sí | CUSTOMER | Mis reservas |

**Crear reserva — Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2026-06-01",
  "checkOutDate": "2026-06-05",
  "price": 600
}
```
> El customerId se obtiene automáticamente del token JWT.
> Si la habitación no está disponible en esas fechas → error 409 Conflict.

**Cambiar estado en body:**
```json
{ "status": "booked" }
```
Transiciones válidas: `pending→booked`, `pending→cancelled`, `booked→cancelled`

---

### PAYMENT `/api/v1/payment`

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/payment/pay` o `/payment/create` | No | Procesar pago |
| GET | `/payment/all` | No | Todos los pagos |
| GET | `/payment/my-payments` | Sí | Pagos del cliente autenticado |
| GET | `/payment/voucher/:bookId` | Sí | Datos del voucher de reserva |

**Procesar pago — Body:**
```json
{
  "bookId": 1,
  "cardNumber": "1234567890123456",
  "code": "123",
  "expiry": "12/28"
}
```
**Respuesta del pago:**
```json
{
  "id": 1,
  "bookId": 1,
  "amount": "600.00",
  "cardLastDigits": "3456",
  "status": "completed"
}
```
> Al pagar, la reserva cambia automáticamente a `booked` y se genera el `confirmationCode` (ej: `RES-20260516-042`).

**Voucher — Respuesta:**
```json
{
  "confirmationCode": "RES-20260516-042",
  "book": { "id": 1, "checkInDate": "2026-06-01", "checkOutDate": "2026-06-05", "price": 600 },
  "room": { "code": "101", "category": "standard" },
  "customer": { "name": "Juan", "lastName": "Pérez", "email": "juan@email.com" },
  "payment": { "amount": 600, "cardLastDigits": "3456", "date": "2026-05-16T..." }
}
```

---

### DASHBOARD `/api/v1/dashboard`

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| GET | `/dashboard/summary` | No | KPIs generales |
| GET | `/dashboard/monthly` o `/dashboard/monthly-earnings` | No | Ganancias por mes |
| GET | `/dashboard/occupancy` | No | Tasa de ocupación |

**Resumen:**
```json
{ "customers": 10, "rooms": 25, "bookings": 48, "payments": 35 }
```

**Ganancias mensuales con filtros:**
```
GET /dashboard/monthly-earnings
GET /dashboard/monthly-earnings?startDate=2026-01-01&endDate=2026-06-30
GET /dashboard/monthly-earnings?hotelId=1
```

**Tasa de ocupación:**
```
GET /dashboard/occupancy?hotelId=1&startDate=2026-06-01&endDate=2026-06-30
```
```json
{ "occupancyRate": 75.50 }
```

---

## Flujo de Uso por Rol

### Flujo SUPERUSER
```
1. POST /auth/init-super           → Crear superusuario (solo 1 vez)
2. POST /auth/login                → Login como superuser/super123
3. POST /company/register          → Registrar empresa + hotel + admin
4. GET  /company/all               → Ver todas las empresas
```

### Flujo ADMIN
```
1. POST /auth/login                → Login
2. GET  /room/all                  → Ver habitaciones
3. POST /room/add                  → Crear habitación (necesita hotelId)
4. GET  /customer/all              → Ver clientes
5. GET  /book/admin/all            → Ver todas las reservas
6. PATCH /book/:id/status/:status  → Aprobar/cancelar reservas
7. GET  /dashboard/summary         → Ver KPIs
```

### Flujo CUSTOMER
```
1. POST /customer/create           → Registrarse (crea user + customer)
2. POST /auth/login                → Login
3. GET  /room/available?hotelId=1&checkIn=X&checkOut=Y  → Ver disponibilidad
4. POST /book/create               → Crear reserva
5. POST /payment/create            → Pagar reserva
6. GET  /payment/voucher/:bookId   → Obtener voucher con código
7. GET  /book/customer             → Ver mis reservas
8. GET  /payment/my-payments       → Ver mis pagos
```

---

## Manejo de Errores

Todos los errores siguen el formato estándar de NestJS:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request"
}
```

| Código | Significado |
|--------|-------------|
| 400 | Datos inválidos / regla de negocio violada |
| 401 | No autenticado / token inválido / cuenta bloqueada |
| 403 | Sin permisos para esa acción |
| 404 | Recurso no encontrado |
| 409 | Conflicto (duplicado / habitación no disponible) |

---

## Pendiente en el Frontend

### Prioridad Alta
- [ ] **HU-05**: Cambiar `getRooms()` por `getAvailableRooms(checkIn, checkOut)` en `CreateBook.vue`
- [ ] **HU-01**: Crear vista de registro público de empresa con formulario completo

### Prioridad Media
- [ ] **HU-10**: Mostrar `confirmationCode` después del pago exitoso
- [ ] **HU-10**: Botón "Ver Voucher" que llame a `GET /payment/voucher/:bookId`
- [ ] **HU-11**: Crear `CustomerPaymentHistoryView.vue` que llame a `GET /payment/my-payments`
- [ ] **HU-12**: Agregar filtros de fecha en dashboard, llamar a `GET /dashboard/occupancy`
- [ ] **HU-03**: Agregar búsqueda por DNI en `CustomerView.vue`

### Prioridad Baja
- [ ] **HU-02**: Mostrar mensaje de cuenta bloqueada con countdown

---

## Variables de Entorno del Frontend

El frontend debe apuntar a:
```javascript
const API_BASE_URL = 'http://localhost:3060/api/v1'
```

---

**Equipo:** Jefferson, Rodrigo, Mauro, María
**Curso:** Pruebas de Software - 38060
