# Backend Hotel — Documentación del Sistema

## Descripción General

API REST para la gestión de un sistema hotelero multi-tenant. Permite administrar empresas, hoteles (sucursales), habitaciones, clientes, reservas y pagos.

Desarrollado con **NestJS** (Node.js + TypeScript) y **PostgreSQL** como base de datos relacional.

---

## Tecnologías Utilizadas

| Tecnología | Versión | Para qué sirve |
|------------|---------|----------------|
| NestJS | 11 | Framework principal del backend |
| TypeScript | 5.7 | Lenguaje de programación |
| TypeORM | 0.3 | ORM para interactuar con PostgreSQL |
| PostgreSQL | 16 | Base de datos relacional |
| JWT (JSON Web Token) | — | Autenticación y autorización |
| bcrypt | — | Encriptación de contraseñas |
| class-validator | — | Validación de datos entrantes |

---

## Requisitos Previos

- Node.js v18 o superior
- PostgreSQL 16 instalado y corriendo
- npm

---

## Configuración del Entorno

### 1. Clonar el repositorio e instalar dependencias

```bash
npm install
```

### 2. Crear la base de datos en PostgreSQL

Conectarse a PostgreSQL como superusuario:

```bash
sudo -u postgres psql
```

Ejecutar dentro de psql:

```sql
CREATE USER hotel_user WITH PASSWORD 'hotel1234';
CREATE DATABASE hotel_db OWNER hotel_user;
GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;
\q
```

### 3. Archivo de variables de entorno

El archivo `.prod.env` en la raíz del proyecto debe contener:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=hotel_user
DB_PASS=hotel1234
DB_NAME=hotel_db
PORT=3060
```

### 4. Levantar el servidor

**Modo desarrollo (con reinicio automático):**

```bash
npm run start:dev
```

**Modo producción:**

```bash
npm run build
npm run start:prod
```

El servidor corre en: `http://localhost:3060`  
Prefijo de todas las rutas: `/api/v1`

> **Nota:** Con `synchronize: true` activado en TypeORM, las tablas se crean automáticamente en la base de datos al iniciar el servidor por primera vez. No se necesitan migraciones manuales en desarrollo.

---

## Arquitectura del Proyecto

```
src/
├── main.ts                          # Punto de entrada
├── app.module.ts                    # Módulo raíz (registra todos los módulos)
├── factory/
│   ├── user.factory.ts              # Encripta contraseñas al crear usuarios
│   └── book.factory.ts              # Construye datos de reserva
└── module/
    ├── auth/                        # Autenticación JWT
    ├── company/                     # Gestión de empresas
    ├── hotel/                       # Gestión de hoteles/sucursales
    ├── user/                        # Gestión de usuarios del sistema
    ├── customer/                    # Gestión de clientes
    ├── room/                        # Gestión de habitaciones
    ├── book/                        # Gestión de reservas (patrón State)
    ├── payment/                     # Gestión de pagos
    └── dashboard/                   # Métricas y estadísticas
```

Cada módulo contiene:
- `*.module.ts` — Registra entidad, controlador y servicio
- `*.controller.ts` — Define los endpoints HTTP
- `*.service.ts` — Lógica de negocio
- `entity/*.entity.ts` — Definición de la tabla en PostgreSQL
- `dto/*.dto.ts` — Validación de datos de entrada

---

## Modelo de Base de Datos

### Diagrama de Relaciones

```
companies (1) ──────────── (N) hotels
hotels    (1) ──────────── (N) rooms
hotels    (1) ──────────── (N) users (ADMIN)
companies (1) ──────────── (N) users (ADMIN_COMPANY)
users     (1) ──────────── (1) customers
customers (1) ──────────── (N) books
rooms     (1) ──────────── (N) books
books     (1) ──────────── (1) payments
```

### Tablas

#### companies
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| name | VARCHAR(100) | Nombre de la empresa |
| address | VARCHAR(255) | Dirección |
| phone | VARCHAR(20) | Teléfono (opcional) |
| email | VARCHAR(150) | Email (opcional) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### hotels
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| company_id | FK → companies | Empresa a la que pertenece |
| name | VARCHAR(100) | Nombre del hotel |
| address | VARCHAR(255) | Dirección |
| phone | VARCHAR(20) | Teléfono (opcional) |
| email | VARCHAR(150) | Email (opcional) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| username | VARCHAR(50) UNIQUE | Nombre de usuario |
| password | VARCHAR(255) | Contraseña encriptada con bcrypt |
| role | VARCHAR(20) | Rol del usuario (ver tabla de roles) |
| company_id | FK → companies | Solo para ADMIN_COMPANY |
| hotel_id | FK → hotels | Solo para ADMIN |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### customers
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| user_id | FK → users UNIQUE | Usuario asociado |
| name | VARCHAR(100) | Nombre |
| last_name | VARCHAR(100) | Apellido |
| dni | VARCHAR(20) UNIQUE | Documento de identidad |
| email | VARCHAR(150) UNIQUE | Correo electrónico |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### rooms
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| hotel_id | FK → hotels | Hotel al que pertenece |
| code | VARCHAR(20) | Código de habitación (único por hotel) |
| status | VARCHAR(20) | disponible / ocupada / limpieza / mantenimiento |
| capacity | INTEGER | Capacidad de personas |
| price | DECIMAL(10,2) | Precio por noche |
| category | VARCHAR(20) | standard / suite / duplex / deluxe |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

> UNIQUE: (hotel_id, code) — dos hoteles distintos pueden tener habitación "101"

#### books
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| room_id | FK → rooms | Habitación reservada |
| customer_id | FK → customers | Cliente que reserva |
| check_in_date | DATE | Fecha de entrada |
| check_out_date | DATE | Fecha de salida |
| status | VARCHAR(20) | pending / booked / cancelled |
| price | DECIMAL(10,2) | Precio total |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### payments
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PK | Identificador único |
| book_id | FK → books UNIQUE | Reserva pagada (1 pago por reserva) |
| amount | DECIMAL(10,2) | Monto pagado |
| card_last_digits | VARCHAR(4) | Últimos 4 dígitos de la tarjeta |
| status | VARCHAR(20) | completed / refunded |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

## Roles y Permisos

| Rol | company_id | hotel_id | Acceso |
|-----|-----------|----------|--------|
| SUPER_ADMIN | NULL | NULL | Todo el sistema |
| ADMIN_COMPANY | FK | NULL | Todos los hoteles de su empresa |
| ADMIN | NULL | FK | Solo su hotel |
| CUSTOMER | NULL | NULL | Sus propias reservas |

---

## API — Endpoints

La URL base es: `http://localhost:3060/api/v1`

Los endpoints marcados con 🔒 requieren el header:
```
Authorization: Bearer <token_jwt>
```

---

### Autenticación (`/auth`)

#### Crear usuario admin inicial
```
POST /api/v1/auth/init-admin
```
Solo se llama una vez al configurar el sistema por primera vez.

**Respuesta:**
```json
{
  "message": "Usuario admin creado",
  "admin": { "id": 1, "username": "admin", "role": "ADMIN" }
}
```

---

#### Login
```
POST /api/v1/auth/login
```

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

> Guardar el `token` para usarlo en los endpoints protegidos.

---

### Empresas (`/company`)

#### Crear empresa
```
POST /api/v1/company/add
```

**Body:**
```json
{
  "name": "Hotel Group SA",
  "address": "Av. Principal 123",
  "phone": "555-1234",
  "email": "info@hotelgroup.com"
}
```

#### Listar empresas
```
GET /api/v1/company/all
```

#### Ver empresa por ID
```
GET /api/v1/company/:id
```

#### Actualizar empresa
```
PUT /api/v1/company/update/:id
```

#### Eliminar empresa
```
DELETE /api/v1/company/delete/:id
```

---

### Hoteles (`/hotel`)

#### Crear hotel
```
POST /api/v1/hotel/add
```

**Body:**
```json
{
  "companyId": 1,
  "name": "Hotel Central",
  "address": "Calle 5 #10",
  "phone": "555-5678",
  "email": "central@hotelgroup.com"
}
```

#### Listar todos los hoteles
```
GET /api/v1/hotel/all
```

#### Ver hotel por ID
```
GET /api/v1/hotel/:id
```

#### Hoteles de una empresa
```
GET /api/v1/hotel/by-company/:companyId
```

#### Actualizar hotel
```
PUT /api/v1/hotel/update/:id
```

#### Eliminar hotel
```
DELETE /api/v1/hotel/delete/:id
```

---

### Habitaciones (`/room`) 🔒

Todos los endpoints requieren JWT. Crear, actualizar y eliminar requieren rol `ADMIN`.

#### Crear habitación
```
POST /api/v1/room/add
```

**Body:**
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

Valores válidos para `status`: `disponible`, `ocupada`, `limpieza`, `mantenimiento`  
Valores válidos para `category`: `standard`, `suite`, `duplex`, `deluxe`

#### Listar habitaciones
```
GET /api/v1/room/all
```
Roles: `ADMIN`, `CUSTOMER`

#### Actualizar habitación
```
PUT /api/v1/room/update/:id
```

#### Eliminar habitación
```
DELETE /api/v1/room/delete/:id
```

---

### Clientes (`/customer`)

Al crear un cliente se crea automáticamente su usuario de acceso.

#### Crear cliente
```
POST /api/v1/customer/add
```

**Body:**
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

#### Listar clientes
```
GET /api/v1/customer/all
```

#### Actualizar cliente
```
PUT /api/v1/customer/update/:id
```

#### Eliminar cliente
```
DELETE /api/v1/customer/delete/:id
```

---

### Reservas (`/book`) 🔒

#### Crear reserva
```
POST /api/v1/book/add
```
Rol: `CUSTOMER` o `ADMIN`. El cliente se detecta automáticamente desde el token JWT.

**Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2026-06-01",
  "checkOutDate": "2026-06-05",
  "price": 600
}
```

#### Cambiar estado de reserva
```
PATCH /api/v1/book/:id/status/:status
```
Donde `:status` puede ser: `pending`, `booked`, `cancelled`

**Transiciones válidas:**
- `pending` → `booked` o `cancelled`
- `booked` → `cancelled`
- `cancelled` → (sin transiciones posibles)

#### Ver todas las reservas (admin)
```
GET /api/v1/book/admin/all
```
Rol: `ADMIN`

#### Ver mis reservas (cliente)
```
GET /api/v1/book/customer/all
```
Rol: `CUSTOMER`

---

### Pagos (`/payment`)

#### Procesar pago
```
POST /api/v1/payment/pay
```
Al pagar, la reserva cambia automáticamente de `pending` a `booked`.

**Body:**
```json
{
  "bookId": 1,
  "cardNumber": "1234567890123456",
  "code": "123",
  "expiry": "12/28"
}
```

#### Listar todos los pagos
```
GET /api/v1/payment/all
```

---

### Dashboard (`/dashboard`)

#### Resumen general
```
GET /api/v1/dashboard/summary
```

**Respuesta:**
```json
{
  "customers": 10,
  "rooms": 25,
  "bookings": 48,
  "payments": 35
}
```

#### Ganancias por mes
```
GET /api/v1/dashboard/monthly
```

**Respuesta:**
```json
[
  { "month": "Enero", "total": 0 },
  { "month": "Febrero", "total": 1500 },
  ...
]
```

---

## Flujo Completo de Uso

El orden correcto para usar el sistema desde cero es:

```
1. POST /auth/init-admin          → Crear usuario admin (solo la primera vez)
2. POST /auth/login               → Obtener token JWT
3. POST /company/add              → Crear empresa
4. POST /hotel/add                → Crear hotel (asignado a la empresa)
5. POST /room/add         🔒      → Crear habitaciones (asignadas al hotel)
6. POST /customer/add             → Registrar clientes
7. POST /auth/login               → Login del cliente
8. POST /book/add         🔒      → Cliente hace una reserva
9. POST /payment/pay              → Procesar el pago
10. GET  /dashboard/summary       → Ver estadísticas
```

---

## Patrones de Diseño Implementados

### Patrón State (Reservas)
Las reservas implementan el patrón State para controlar las transiciones de estado. Cada estado define qué transiciones son válidas, evitando cambios inválidos (ej: de `cancelled` a `booked`).

### Patrón Factory (Usuarios y Reservas)
- `UserFactory`: Se encarga de encriptar la contraseña antes de guardar el usuario.
- `BookFactory`: Construye el objeto de reserva con los IDs correctos.

---

## Conexión con DBeaver

Para visualizar la base de datos con DBeaver:

| Campo | Valor |
|-------|-------|
| Host | localhost |
| Port | 5432 |
| Database | hotel_db |
| Username | hotel_user |
| Password | hotel1234 |

---

## Notas para Desarrolladores

- **`synchronize: true`** está activado en desarrollo. Esto crea/modifica tablas automáticamente. En producción debe cambiarse a `false` y usar migraciones de TypeORM.
- Las contraseñas siempre se almacenan encriptadas con bcrypt (nunca en texto plano).
- El token JWT expira según la configuración en `src/module/auth/jwt/jwt.config.ts`.
- Los IDs son enteros autoincremental (no MongoDB ObjectIds).
