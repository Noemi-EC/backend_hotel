import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './entity/customer.entity';
import { UserService } from '../user/user.service';

// ─────────────────────────────────────────────
// Mocks de repositorios
// ─────────────────────────────────────────────
const mockCustomerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

const mockUserService = {
  create: jest.fn(),
};

// ─────────────────────────────────────────────
describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  // HU-03 — Gestión de Clientes
  // ═══════════════════════════════════════════

  describe('HU-03 — Gestión de Clientes', () => {

    // ── Escenario 1: Crear cliente exitosamente
    it('[E1] debe crear un cliente vinculado al hotel y empresa del administrador', async () => {
      const dto = {
        username: 'juan123',
        password: '123456',
        name: 'Juan',
        lastName: 'Perez',
        dni: '12345678',
        email: 'juan@test.com',
        companyId: 1,
        hotelId: 1,
      };

      mockUserService.create.mockResolvedValue({ id: 1 });
      mockCustomerRepository.create.mockReturnValue({
        userId: 1,
        name: dto.name,
        lastName: dto.lastName,
        dni: dto.dni,
        email: dto.email,
      });
      mockCustomerRepository.save.mockResolvedValue({
        id: 1,
        userId: 1,
        name: dto.name,
        lastName: dto.lastName,
        dni: dto.dni,
        email: dto.email,
      });

      const result = await service.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith({
        username: dto.username,
        password: dto.password,
        role: 'CUSTOMER',
        companyId: dto.companyId,
        hotelId: dto.hotelId,
      });
      expect(mockCustomerRepository.create).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Juan');
      expect(result.dni).toBe('12345678');
    });

    // ── Escenario 3: Editar cliente
    it('[E3] debe actualizar los datos de un cliente existente correctamente', async () => {
      const customerId = 1;
      const customerUpdated = {
        id: customerId,
        name: 'Juan',
        lastName: 'Perez',
        dni: '12345678',
        email: 'nuevo@test.com',
      };

      mockCustomerRepository.update.mockResolvedValue(undefined);
      mockCustomerRepository.findOne.mockResolvedValue(customerUpdated);

      const result = await service.update(customerId, { email: 'nuevo@test.com' });

      expect(mockCustomerRepository.update).toHaveBeenCalledWith(
        customerId,
        { email: 'nuevo@test.com' },
      );
      expect(result?.email).toBe('nuevo@test.com');
    });

    // ── Escenario 4: Eliminar cliente con confirmación
    it('[E4] debe eliminar un cliente del sistema por su ID', async () => {
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockCustomerRepository.delete).toHaveBeenCalledWith(1);
    });

    // ── Escenario 5: Listar clientes (tabla actualizada)
    it('[E5] debe listar todos los clientes con sus relaciones de usuario', async () => {
      const customers = [
        { id: 1, name: 'Juan',  lastName: 'Perez', dni: '12345678' },
        { id: 2, name: 'Maria', lastName: 'Lopez', dni: '87654321' },
      ];

      mockCustomerRepository.find.mockResolvedValue(customers);

      const result = await service.findAll();

      expect(mockCustomerRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Juan');
      expect(result[1].name).toBe('Maria');
    });
  });
});
