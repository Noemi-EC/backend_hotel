import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Customer } from '../customer/entity/customer.entity';
import { Room } from '../room/entity/room.entity';
import { Book } from '../book/entity/book.entity';
import { Payment } from '../payment/entity/payment.entity';
import { UserModule } from '../user/user.module';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Room, Book, Payment]), UserModule, HotelModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
