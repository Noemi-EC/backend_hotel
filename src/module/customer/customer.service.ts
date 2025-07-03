import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    // Crea el usuario
    const user = await this.userService.create({
      username: createCustomerDto.username,
      password: createCustomerDto.password,
      role: 'CUSTOMER',
    });

    // Crea el cliente asociado al usuario
    const customer = new this.customerModel({
      name: createCustomerDto.name,
      lastName: createCustomerDto.lastName,
      dni: createCustomerDto.dni,
      email: createCustomerDto.email,
      userId: user._id,
    });

    return customer.save();
  }
}
