import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';
import { Customer } from './entity/customer.entity';
import { UserService } from '../user/user.service';

describe('CustomerService', () => {
  let service: CustomerService;

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

  it('debe crear un cliente correctamente', async () => {
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

    mockUserService.create.mockResolvedValue({
      id: 1,
    });

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
  it('debe actualizar un cliente correctamente', async () => {
    const customerId = 1;

    const customerUpdated = {
      id: customerId,
      name: 'Juan',
      lastName: 'Perez',
      dni: '12345678',
      email: 'nuevo@test.com',
    };

    mockCustomerRepository.update = jest.fn().mockResolvedValue(undefined);

    mockCustomerRepository.findOne = jest
      .fn()
      .mockResolvedValue(customerUpdated);

    const result = await service.update(customerId, {
      email: 'nuevo@test.com',
    });

    expect(mockCustomerRepository.update).toHaveBeenCalledWith(customerId, {
      email: 'nuevo@test.com',
    });

    expect(result?.email).toBe('nuevo@test.com');
  });

  it('debe eliminar un cliente correctamente', async () => {
    mockCustomerRepository.delete = jest.fn().mockResolvedValue(undefined);

    await service.delete(1);

    expect(mockCustomerRepository.delete).toHaveBeenCalledWith(1);
  });

  it('debe listar todos los clientes', async () => {
    const customers = [
      {
        id: 1,
        name: 'Juan',
      },
      {
        id: 2,
        name: 'Maria',
      },
    ];

    mockCustomerRepository.find = jest.fn().mockResolvedValue(customers);

    const result = await service.findAll();

    expect(mockCustomerRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
    });

    expect(result.length).toBe(2);
  });
});
