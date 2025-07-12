import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../customer/schema/customer.schema';
import { Room, RoomSchema } from '../room/schema/room.schema';
import { Book, BookSchema } from '../book/schema/book.schema';
import { Payment, PaymentSchema } from '../payment/schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Book.name, schema: BookSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}