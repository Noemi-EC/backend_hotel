import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './entity/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Book } from '../book/entity/book.entity';
import { Customer } from '../customer/entity/customer.entity';

// ─────────────────────────────────────────────
// Mocks de repositorios
// ─────────────────────────────────────────────
type MockQueryBuilder = {
  leftJoinAndSelect: jest.Mock<
    MockQueryBuilder,
    [string, string] | [string, string, string]
  >;
  where: jest.Mock<
    MockQueryBuilder,
    | [string, Record<string, unknown>]
    | [string, Record<string, unknown>, string]
  >;
  getMany: jest.Mock<Payment[], []>;
};

const mockPaymentQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
} as unknown as MockQueryBuilder;

const mockPaymentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => mockPaymentQueryBuilder),
};

const mockBookRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
};

const mockCustomerRepository = {
  findOne: jest.fn(),
};

// ─────────────────────────────────────────────
// Datos de prueba reutilizables
// ─────────────────────────────────────────────
const mockCustomer = {
  id: 1,
  userId: 10,
  name: 'Carlos',
  lastName: 'García',
  email: 'carlos@test.com',
};

const mockPendingBook = {
  id: 1,
  status: 'pending',
  customerId: 1,
  roomId: 5,
  price: 1250.0,
  confirmationCode: null,
  checkInDate: new Date('2026-06-10'),
  checkOutDate: new Date('2026-06-15'),
};

const validPaymentDto = {
  bookId: 1,
  cardNumber: '4111111111111111', // 16 dígitos
  code: '123',
  expiry: '12/25',
};

// ─────────────────────────────────────────────
describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    jest.clearAllMocks();

    // Restaurar queryBuilder después de clearAllMocks
    mockPaymentRepository.createQueryBuilder.mockReturnValue(
      mockPaymentQueryBuilder,
    );
    mockPaymentQueryBuilder.leftJoinAndSelect.mockReturnThis();
    mockPaymentQueryBuilder.where.mockReturnThis();
  });

  // ═══════════════════════════════════════════
  // HU-10 — Pago de Reserva
  // ═══════════════════════════════════════════

  describe('HU-10 — Pago de Reserva', () => {
    // ── Escenario 1: Pago exitoso con tarjeta de crédito
    it('[E1] debe procesar el pago correctamente y actualizar la reserva a booked', async () => {
      // Arrange
      const savedPayment = {
        id: 1,
        bookId: 1,
        amount: 1250.0,
        cardLastDigits: '1111',
        status: 'completed',
        createdAt: new Date(),
      } as Payment;

      mockBookRepository.findOne.mockResolvedValue({ ...mockPendingBook });
      mockPaymentRepository.create.mockReturnValue(savedPayment);
      mockPaymentRepository.save.mockResolvedValue(savedPayment);
      mockBookRepository.update.mockResolvedValue(undefined);

      // Act
      const result: Payment = await service.createPayment(
        validPaymentDto as CreatePaymentDto,
        10,
      );

      // Assert — el pago se creó con los últimos 4 dígitos correctos
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookId: 1,
          amount: 1250.0,
          status: 'completed',
          cardLastDigits: '1111', // últimos 4 de "4111111111111111"
        }),
      );
      expect(mockPaymentRepository.save).toHaveBeenCalled();

      // La reserva debe actualizarse a "booked" con código de confirmación
      expect(mockBookRepository.update).toHaveBeenCalledTimes(1);
      const updateArgs = mockBookRepository.update.mock.calls[0] as [
        number,
        { status: string; confirmationCode: string },
      ];
      expect(updateArgs[0]).toBe(1);
      expect(updateArgs[1]).toEqual(
        expect.objectContaining({
          status: 'booked',
        }),
      );
      expect(updateArgs[1].confirmationCode).toMatch(/^RES-\d{8}-\d{3}$/);

      expect(result.amount).toBe(1250.0);
      expect(result.cardLastDigits).toBe('1111');
      expect(result.status).toBe('completed');
    });

    // ── Escenario 2: Reserva no existe
    it('[E2] debe lanzar NotFoundException si la reserva no existe', async () => {
      // Arrange
      mockBookRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.createPayment(validPaymentDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    });

    // ── Escenario 3: Reserva ya pagada (no está en "pending")
    it('[E3] debe lanzar BadRequestException si la reserva ya fue pagada (status: booked)', async () => {
      // Arrange — la reserva ya tiene status "booked"
      mockBookRepository.findOne.mockResolvedValue({
        ...mockPendingBook,
        status: 'booked',
        confirmationCode: 'RES-20260610-001',
      });

      // Act & Assert
      await expect(service.createPayment(validPaymentDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockPaymentRepository.save).not.toHaveBeenCalled();
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    // ── Escenario extra: cardLastDigits se extrae correctamente de cualquier tarjeta
    it('[E4] debe guardar solo los últimos 4 dígitos de la tarjeta', async () => {
      // Arrange — tarjeta diferente
      const dtoOtraTargeta = {
        ...validPaymentDto,
        cardNumber: '5500005555555559',
      };
      const savedPayment = {
        id: 2,
        bookId: 1,
        amount: 1250.0,
        cardLastDigits: '5559',
        status: 'completed',
        createdAt: new Date(),
      } as Payment;

      mockBookRepository.findOne.mockResolvedValue({ ...mockPendingBook });
      mockPaymentRepository.create.mockReturnValue(savedPayment);
      mockPaymentRepository.save.mockResolvedValue(savedPayment);
      mockBookRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.createPayment(
        dtoOtraTargeta as CreatePaymentDto,
        10,
      );

      // Assert
      expect(mockPaymentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ cardLastDigits: '5559' }),
      );
      expect(result.cardLastDigits).toBe('5559');
    });
  });

  // ═══════════════════════════════════════════
  // HU-11 — Historial de Pagos
  // ═══════════════════════════════════════════

  describe('HU-11 — Historial de Pagos', () => {
    // ── Escenario 1: Ver historial de pagos del cliente autenticado
    it('[E1] debe retornar los pagos del cliente con sus reservas y habitaciones', async () => {
      // Arrange
      const pagos = [
        {
          id: 1,
          bookId: 1,
          amount: 1250,
          status: 'completed',
          book: { ...mockPendingBook, room: { code: '102' } },
        },
        {
          id: 2,
          bookId: 2,
          amount: 750,
          status: 'completed',
          book: { id: 2, roomId: 5, room: { code: '201' } },
        },
      ];
      const reservasDelCliente = [{ id: 1 }, { id: 2 }];

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockBookRepository.find.mockResolvedValue(reservasDelCliente);
      mockPaymentQueryBuilder.getMany.mockResolvedValue(pagos);

      // Act
      const result = await service.findByCustomer(10);

      // Assert
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 10 },
      });
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        where: { customerId: mockCustomer.id },
      });
      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(1250);
    });

    // ── Escenario: Cliente sin reservas retorna array vacío
    it('[E2] debe retornar array vacío si el cliente no tiene reservas', async () => {
      // Arrange
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockBookRepository.find.mockResolvedValue([]); // sin reservas

      // Act
      const result = await service.findByCustomer(10);

      // Assert
      expect(result).toEqual([]);
      expect(mockPaymentRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    // ── Escenario: Cliente no existe
    it('[E3] debe lanzar NotFoundException si el userId no tiene cliente', async () => {
      // Arrange
      mockCustomerRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCustomer(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ═══════════════════════════════════════════
  // getVoucher
  // ═══════════════════════════════════════════

  describe('getVoucher', () => {
    it('debe retornar el voucher completo de un pago confirmado', async () => {
      // Arrange
      const bookedBook = {
        ...mockPendingBook,
        status: 'booked',
        confirmationCode: 'RES-20260610-001',
        room: { code: '102', category: 'Suite' },
        customer: mockCustomer,
      };
      const payment = {
        amount: 1250,
        cardLastDigits: '1111',
        createdAt: new Date(),
      };

      mockBookRepository.findOne.mockResolvedValue(bookedBook);
      mockPaymentRepository.findOne.mockResolvedValue(payment);

      // Act
      const result = await service.getVoucher(1);

      // Assert
      expect(result.confirmationCode).toBe('RES-20260610-001');
      expect(result.book.status).toBe('booked');
      expect(result.room.code).toBe('102');
      expect(result.customer.email).toBe('carlos@test.com');
      expect(result.payment.cardLastDigits).toBe('1111');
    });

    it('debe lanzar BadRequestException si la reserva no tiene pago registrado', async () => {
      // Arrange — reserva sin confirmationCode (aún pendiente)
      mockBookRepository.findOne.mockResolvedValue({
        ...mockPendingBook,
        room: { code: '102' },
        customer: mockCustomer,
        confirmationCode: null,
      });

      // Act & Assert
      await expect(service.getVoucher(1)).rejects.toThrow(BadRequestException);
    });
  });
});
