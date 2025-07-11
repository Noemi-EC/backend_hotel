import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UserService } from '../user/user.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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

  async update(id: string, updateData: UpdateCustomerDto): Promise<CustomerDocument | null> {
    return this.customerModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find().populate('userId').exec();
  }
}
