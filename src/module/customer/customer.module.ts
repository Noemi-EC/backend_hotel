import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    UserModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [
    CustomerService,
    MongooseModule,
  ],
})
export class CustomerModule {}
