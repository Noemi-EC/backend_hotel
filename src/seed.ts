/**
 * Seed de datos demo para Hotel Cielo.
 *
 * Genera datos coherentes: superusuario, empresas, administradores de empresa,
 * hoteles (uno inactivo para demostrar la desactivación), administradores de hotel,
 * habitaciones, clientes, reservas y pagos.
 *
 * Ejecutar con:  npm run seed
 *
 * Limpia (TRUNCATE) las tablas antes de insertar, así que NO es necesario borrar la BD.
 * El esquema se crea automáticamente por `synchronize: true` de TypeORM.
 */
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';

import { Company } from './module/company/entity/company.entity';
import { Hotel } from './module/hotel/entity/hotel.entity';
import { User } from './module/user/entity/user.entity';
import { Customer } from './module/customer/entity/customer.entity';
import { Room } from './module/room/entity/room.entity';
import { Book } from './module/book/entity/book.entity';
import { Payment } from './module/payment/entity/payment.entity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const ds = app.get(DataSource);

  const hash = (plain: string) => bcrypt.hash(plain, 10);

  console.log('🧹 Limpiando tablas...');
  await ds.query(
    'TRUNCATE payments, books, rooms, customers, users, hotels, companies RESTART IDENTITY CASCADE',
  );

  const companyRepo = ds.getRepository(Company);
  const hotelRepo = ds.getRepository(Hotel);
  const userRepo = ds.getRepository(User);
  const customerRepo = ds.getRepository(Customer);
  const roomRepo = ds.getRepository(Room);
  const bookRepo = ds.getRepository(Book);
  const paymentRepo = ds.getRepository(Payment);

  // ─────────────────────────────────────────────
  // SUPERUSUARIO
  // ─────────────────────────────────────────────
  console.log('👑 Creando superusuario...');
  await userRepo.save({
    username: 'superuser',
    password: await hash('super123'),
    role: 'SUPERUSER',
    active: true,
  });

  // ─────────────────────────────────────────────
  // EMPRESA 1 — Cadena Hotelera Cielo SAC
  // ─────────────────────────────────────────────
  console.log('🏢 Creando empresa 1 (Cadena Hotelera Cielo)...');
  const cielo = await companyRepo.save({
    name: 'Cadena Hotelera Cielo SAC',
    ruc: '20123456789',
    address: 'Av. Javier Prado 1200, Lima',
    phone: '014567890',
    email: 'contacto@hotelcielo.pe',
  });

  await userRepo.save({
    username: 'company_cielo',
    password: await hash('comp123'),
    role: 'COMPANY_ADMIN',
    companyId: cielo.id,
    active: true,
  });

  // Hotel 1.1 — Cielo Centro (Lima)
  const cieloCentro = await hotelRepo.save({
    companyId: cielo.id,
    name: 'Hotel Cielo Centro',
    address: 'Jr. de la Unión 500, Cercado de Lima',
    phone: '014567891',
    email: 'centro@hotelcielo.pe',
    active: true,
  });
  const adminCentro = await userRepo.save({
    username: 'admin_centro',
    password: await hash('admin123'),
    role: 'ADMIN',
    companyId: cielo.id,
    hotelId: cieloCentro.id,
    active: true,
  });

  // Hotel 1.2 — Cielo Playa (Piura)
  const cieloPlaya = await hotelRepo.save({
    companyId: cielo.id,
    name: 'Hotel Cielo Playa',
    address: 'Malecón Los Incas 45, Máncora, Piura',
    phone: '073123456',
    email: 'playa@hotelcielo.pe',
    active: true,
  });
  await userRepo.save({
    username: 'admin_playa',
    password: await hash('admin123'),
    role: 'ADMIN',
    companyId: cielo.id,
    hotelId: cieloPlaya.id,
    active: true,
  });

  // ─────────────────────────────────────────────
  // EMPRESA 2 — Grupo Andino Hoteles EIRL
  // ─────────────────────────────────────────────
  console.log('🏢 Creando empresa 2 (Grupo Andino)...');
  const andino = await companyRepo.save({
    name: 'Grupo Andino Hoteles EIRL',
    ruc: '20987654321',
    address: 'Av. El Sol 800, Cusco',
    phone: '084234567',
    email: 'reservas@grupoandino.pe',
  });

  await userRepo.save({
    username: 'company_andino',
    password: await hash('comp123'),
    role: 'COMPANY_ADMIN',
    companyId: andino.id,
    active: true,
  });

  // Hotel 2.1 — Andino Cusco Plaza (activo)
  const andinoCusco = await hotelRepo.save({
    companyId: andino.id,
    name: 'Andino Cusco Plaza',
    address: 'Plaza de Armas 210, Cusco',
    phone: '084234568',
    email: 'cusco@grupoandino.pe',
    active: true,
  });
  await userRepo.save({
    username: 'admin_cusco',
    password: await hash('admin123'),
    role: 'ADMIN',
    companyId: andino.id,
    hotelId: andinoCusco.id,
    active: true,
  });

  // Hotel 2.2 — Andino Arequipa (INACTIVO — demo de desactivación)
  const andinoArequipa = await hotelRepo.save({
    companyId: andino.id,
    name: 'Andino Arequipa (En remodelación)',
    address: 'Calle Mercaderes 120, Arequipa',
    phone: '054345678',
    email: 'arequipa@grupoandino.pe',
    active: false,
  });
  await userRepo.save({
    username: 'admin_arequipa',
    password: await hash('admin123'),
    role: 'ADMIN',
    companyId: andino.id,
    hotelId: andinoArequipa.id,
    active: false,
  });

  // ─────────────────────────────────────────────
  // HABITACIONES
  // ─────────────────────────────────────────────
  console.log('🛏️  Creando habitaciones...');
  const [c101, , cSuite, cDeluxe] = await roomRepo.save([
    { hotelId: cieloCentro.id, code: '101', status: 'disponible', capacity: 2, price: 150, category: 'standard' },
    { hotelId: cieloCentro.id, code: '102', status: 'disponible', capacity: 2, price: 150, category: 'standard' },
    { hotelId: cieloCentro.id, code: '201', status: 'disponible', capacity: 3, price: 300, category: 'suite' },
    { hotelId: cieloCentro.id, code: '202', status: 'disponible', capacity: 4, price: 450, category: 'deluxe' },
  ]);

  await roomRepo.save([
    { hotelId: cieloPlaya.id, code: '101', status: 'disponible', capacity: 2, price: 180, category: 'standard' },
    { hotelId: cieloPlaya.id, code: '301', status: 'disponible', capacity: 3, price: 350, category: 'suite' },
    { hotelId: cieloPlaya.id, code: '401', status: 'disponible', capacity: 5, price: 600, category: 'duplex' },
  ]);

  const [aCusco205] = await roomRepo.save([
    { hotelId: andinoCusco.id, code: '205', status: 'disponible', capacity: 3, price: 400, category: 'suite' },
    { hotelId: andinoCusco.id, code: '101', status: 'disponible', capacity: 2, price: 200, category: 'standard' },
    { hotelId: andinoCusco.id, code: '102', status: 'disponible', capacity: 2, price: 200, category: 'standard' },
  ]);

  // ─────────────────────────────────────────────
  // CLIENTES (usuario CUSTOMER + registro de cliente)
  // ─────────────────────────────────────────────
  console.log('👤 Creando clientes...');
  const makeCustomer = async (
    username: string,
    password: string,
    name: string,
    lastName: string,
    dni: string,
    email: string,
    hotel: Hotel,
  ) => {
    const user = await userRepo.save({
      username,
      password: await hash(password),
      role: 'CUSTOMER',
      companyId: hotel.companyId,
      hotelId: hotel.id,
      active: true,
    });
    return customerRepo.save({ userId: user.id, name, lastName, dni, email });
  };

  const juan = await makeCustomer('cliente1', 'pass1234', 'Juan', 'Pérez', '12345678', 'juan@email.com', cieloCentro);
  const maria = await makeCustomer('cliente2', 'pass1234', 'María', 'López', '87654321', 'maria@email.com', cieloCentro);
  const carlos = await makeCustomer('cliente3', 'pass1234', 'Carlos', 'Ruiz', '11223344', 'carlos@email.com', andinoCusco);

  // ─────────────────────────────────────────────
  // RESERVAS + PAGOS
  // ─────────────────────────────────────────────
  console.log('📘 Creando reservas y pagos...');

  // Reserva pagada (booked) — Juan, habitación 101 Centro, 4 noches
  const book1 = await bookRepo.save({
    roomId: c101.id,
    customerId: juan.id,
    checkInDate: '2026-07-10',
    checkOutDate: '2026-07-14',
    status: 'booked',
    price: 600,
    confirmationCode: 'RES-20260705-001',
  });
  await paymentRepo.save({
    bookId: book1.id,
    amount: 600,
    cardLastDigits: '1111',
    status: 'completed',
  });

  // Reserva pendiente de pago — María, suite 201 Centro, 2 noches
  await bookRepo.save({
    roomId: cSuite.id,
    customerId: maria.id,
    checkInDate: '2026-07-20',
    checkOutDate: '2026-07-22',
    status: 'pending',
    price: 600,
  });

  // Reserva cancelada — Juan, deluxe 202 Centro
  await bookRepo.save({
    roomId: cDeluxe.id,
    customerId: juan.id,
    checkInDate: '2026-08-01',
    checkOutDate: '2026-08-05',
    status: 'cancelled',
    price: 1800,
  });

  // Reserva pagada (booked) — Carlos, suite 205 Cusco, 3 noches
  const book4 = await bookRepo.save({
    roomId: aCusco205.id,
    customerId: carlos.id,
    checkInDate: '2026-07-15',
    checkOutDate: '2026-07-18',
    status: 'booked',
    price: 1200,
    confirmationCode: 'RES-20260706-002',
  });
  await paymentRepo.save({
    bookId: book4.id,
    amount: 1200,
    cardLastDigits: '4242',
    status: 'completed',
  });

  console.log('\n✅ Datos demo generados correctamente.\n');
  console.log('── Credenciales ──────────────────────────────');
  console.log('SUPERUSER        superuser       / super123');
  console.log('COMPANY_ADMIN    company_cielo   / comp123   (Cadena Hotelera Cielo)');
  console.log('COMPANY_ADMIN    company_andino  / comp123   (Grupo Andino)');
  console.log('ADMIN            admin_centro    / admin123  (Hotel Cielo Centro)');
  console.log('ADMIN            admin_playa     / admin123  (Hotel Cielo Playa)');
  console.log('ADMIN            admin_cusco     / admin123  (Andino Cusco Plaza)');
  console.log('ADMIN            admin_arequipa  / admin123  (INACTIVO — no puede entrar)');
  console.log('CUSTOMER         cliente1        / pass1234  (Juan Pérez)');
  console.log('CUSTOMER         cliente2        / pass1234  (María López)');
  console.log('CUSTOMER         cliente3        / pass1234  (Carlos Ruiz)');
  console.log('──────────────────────────────────────────────\n');

  await app.close();
}

run().catch((err) => {
  console.error('❌ Error generando datos demo:', err);
  process.exit(1);
});
