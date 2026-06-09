import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entity/book.entity';
import { Customer } from '../customer/entity/customer.entity';
import { User } from '../user/entity/user.entity';
import { Room } from '../room/entity/room.entity';

// BookFactory se mockea a nivel de módulo para evitar problemas con implementaciones
// estáticas o funcionales — el test no debe depender de su lógica interna
jest.mock('../../factory/book.factory', () => ({
  BookFactory: {
    create: jest.fn(),
  },
}));
import { BookFactory } from '../../factory/book.factory';

// ─────────────────────────────────────────────
// Mocks de repositorios
// ─────────────────────────────────────────────
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getCount: jest.fn(),
};

const mockBookRepository = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockCustomerRepository = {
  findOne: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockRoomRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
};

// ─────────────────────────────────────────────
// Datos de prueba reutilizables
// ─────────────────────────────────────────────
const mockCustomer = { id: 1, userId: 10, name: 'Carlos', lastName: 'García' };
const mockRoom     = { id: 5, code: '102', category: 'Suite', status: 'disponible' };
const mockAdmin    = { id: 20, role: 'ADMIN' };

const baseBookDto = {
  roomId: 5,
  checkInDate: new Date('2026-06-10'),
  checkOutDate: new Date('2026-06-15'),
  price: 1250,
};

// ─────────────────────────────────────────────
describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getRepositoryToken(Book),     useValue: mockBookRepository },
        { provide: getRepositoryToken(Customer), useValue: mockCustomerRepository },
        { provide: getRepositoryToken(User),     useValue: mockUserRepository },
        { provide: getRepositoryToken(Room),     useValue: mockRoomRepository },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    jest.clearAllMocks();

    // Restaurar el queryBuilder en cada test (jest.clearAllMocks() limpia llamadas pero no el retorno)
    mockBookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.andWhere.mockReturnThis();
  });

  // ═══════════════════════════════════════════
  // HU-08 — Creación de Reservas
  // ═══════════════════════════════════════════

  describe('HU-08 — Creación de Reservas', () => {

    // ── Escenario 1: Crear reserva exitosamente
    it('[E1] debe crear una reserva exitosamente sin solapamiento', async () => {
      // Arrange
      const savedBook = {
        id: 1,
        roomId: mockRoom.id,
        customerId: mockCustomer.id,
        checkInDate: baseBookDto.checkInDate,
        checkOutDate: baseBookDto.checkOutDate,
        status: 'pending',
        price: 1250,
        confirmationCode: null,
      };

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockQueryBuilder.getCount.mockResolvedValue(0);          // sin solapamiento
      (BookFactory.create as jest.Mock).mockReturnValue({ ...savedBook });
      mockBookRepository.create.mockReturnValue(savedBook);
      mockBookRepository.save.mockResolvedValue(savedBook);

      // Act
      const result = await service.create(baseBookDto, 10);

      // Assert
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { userId: 10 } });
      expect(mockRoomRepository.findOne).toHaveBeenCalledWith({ where: { id: baseBookDto.roomId } });
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockBookRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.status).toBe('pending');
      expect(result.price).toBe(1250);
    });

    // ── Escenario 2: Anti-solapamiento de reservas (HU-05 E4)
    it('[E2] debe lanzar ConflictException si la habitación ya está reservada en esas fechas', async () => {
      // Arrange
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockRoomRepository.findOne.mockResolvedValue(mockRoom);
      mockQueryBuilder.getCount.mockResolvedValue(1);          // hay solapamiento

      // Act & Assert
      await expect(service.create(baseBookDto, 10))
        .rejects
        .toThrow(ConflictException);

      expect(mockBookRepository.save).not.toHaveBeenCalled();
    });

    // ── Escenario 3: Cliente no existe
    it('[E3] debe lanzar NotFoundException si el userId no tiene cliente asociado', async () => {
      // Arrange
      mockCustomerRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(baseBookDto, 99))
        .rejects
        .toThrow(NotFoundException);

      expect(mockRoomRepository.findOne).not.toHaveBeenCalled();
    });

    // ── Escenario: Ver mis reservas (findAllByCustomer)
    it('[E4] debe retornar las reservas del cliente autenticado', async () => {
      // Arrange
      const reservas = [
        { id: 1, customerId: 1, roomId: 5, status: 'pending', room: mockRoom },
        { id: 2, customerId: 1, roomId: 5, status: 'booked',  room: mockRoom },
      ];
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockBookRepository.find.mockResolvedValue(reservas);

      // Act
      const result = await service.findAllByCustomer(10);

      // Assert
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { userId: 10 } });
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { customerId: mockCustomer.id },
        relations: ['room'],
      });
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('pending');
    });
  });

  // ═══════════════════════════════════════════
  // HU-09 — Gestión de Estados de Reserva
  // ═══════════════════════════════════════════

  describe('HU-09 — Gestión de Estados de Reserva', () => {

    // ── Escenario 1: Cambiar reserva de Pendiente a Confirmada (check-in)
    it('[E1] ADMIN puede cambiar estado de pending a booked (check-in)', async () => {
      // Arrange
      const book = { id: 1, status: 'pending', customerId: 1, roomId: 5 };
      mockBookRepository.findOne.mockResolvedValue(book);
      mockCustomerRepository.findOne.mockResolvedValue(null);   // no es cliente
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);   // es ADMIN
      mockBookRepository.update.mockResolvedValue(undefined);
      mockRoomRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.changeStatus(1, 20, 'booked');

      // Assert
      expect(mockBookRepository.update).toHaveBeenCalledWith(1, { status: 'booked' });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(5, { status: 'ocupada' });
      expect(result.book.status).toBe('booked');
      expect(result.message).toBeDefined();
    });

    // ── Escenario 2: Cancelar reserva confirmada (libera habitación)
    it('[E2] ADMIN puede cancelar una reserva booked y la habitación queda disponible', async () => {
      // Arrange
      const book = { id: 2, status: 'booked', customerId: 1, roomId: 5 };
      mockBookRepository.findOne.mockResolvedValue(book);
      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);
      mockBookRepository.update.mockResolvedValue(undefined);
      mockRoomRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.changeStatus(2, 20, 'cancelled');

      // Assert
      expect(mockBookRepository.update).toHaveBeenCalledWith(2, { status: 'cancelled' });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(5, { status: 'disponible' });
      expect(result.book.status).toBe('cancelled');
    });

    // ── Escenario 3: Transición inválida — booked no puede volver a pending
    // BookedState.canTransitionTo('pending') retorna false (confirmado en booked.state.ts)
    it('[E3] debe lanzar BadRequestException para transiciones de estado no permitidas', async () => {
      // Arrange — reserva confirmada intentando volver a pendiente (no permitido)
      const book = { id: 3, status: 'booked', customerId: 1, roomId: 5 };
      mockBookRepository.findOne.mockResolvedValue(book);
      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockUserRepository.findOne.mockResolvedValue(mockAdmin);

      // Act & Assert
      await expect(service.changeStatus(3, 20, 'pending'))
        .rejects
        .toThrow(BadRequestException);

      expect(mockBookRepository.update).not.toHaveBeenCalled();
      expect(mockRoomRepository.update).not.toHaveBeenCalled();
    });

    // ── Escenario extra: CLIENTE cancela su propia reserva pendiente
    it('[E4] CLIENTE puede cancelar su propia reserva pendiente', async () => {
      // Arrange
      const book = { id: 4, status: 'pending', customerId: 1, roomId: 5 };
      mockBookRepository.findOne.mockResolvedValue(book);
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer); // sí es cliente
      mockUserRepository.findOne.mockResolvedValue(null);             // no es admin
      mockBookRepository.update.mockResolvedValue(undefined);
      mockRoomRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.changeStatus(4, 10, 'cancelled');

      // Assert
      expect(mockBookRepository.update).toHaveBeenCalledWith(4, { status: 'cancelled' });
      expect(mockRoomRepository.update).toHaveBeenCalledWith(5, { status: 'disponible' });
      expect(result.book.status).toBe('cancelled');
    });
  });

  // ═══════════════════════════════════════════
  // HU-09 extra — getBookingStatus
  // ═══════════════════════════════════════════

  describe('getBookingStatus', () => {

    it('debe retornar estado actual y transiciones disponibles para una reserva pending', async () => {
      // Arrange
      mockBookRepository.findOne.mockResolvedValue({ id: 1, status: 'pending', roomId: 5, customerId: 1 });

      // Act
      const result = await service.getBookingStatus(1);

      // Assert
      expect(result.status).toBe('pending');
      expect(Array.isArray(result.availableTransitions)).toBe(true);
    });

    it('debe lanzar NotFoundException si la reserva no existe', async () => {
      // Arrange
      mockBookRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getBookingStatus(999)).rejects.toThrow(NotFoundException);
    });
  });
});