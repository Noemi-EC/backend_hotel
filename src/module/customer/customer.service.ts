import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly userService: UserService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const user = await this.userService.create({
      username: createCustomerDto.username,
      password: createCustomerDto.password,
      role: 'CUSTOMER',
      companyId: createCustomerDto.companyId,
      hotelId: createCustomerDto.hotelId,
    });

    const customer = this.customerRepository.create({
      name: createCustomerDto.name,
      lastName: createCustomerDto.lastName,
      dni: createCustomerDto.dni,
      email: createCustomerDto.email,
      userId: user.id,
    });

    return this.customerRepository.save(customer);
  }

  async update(id: number, updateData: UpdateCustomerDto): Promise<Customer | null> {
    await this.customerRepository.update(id, updateData);
    return this.customerRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['user'] });
  }
}
