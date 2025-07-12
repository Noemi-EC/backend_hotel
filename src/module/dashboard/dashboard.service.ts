import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../customer/schema/customer.schema';
import { Room, RoomDocument } from '../room/schema/room.schema';
import { Book, BookDocument } from '../book/schema/book.schema';
import { Payment, PaymentDocument } from '../payment/schema/payment.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async getSummary() {
    const totalCustomers = await this.customerModel.countDocuments();
    const totalRooms = await this.roomModel.countDocuments();
    const totalBookings = await this.bookModel.countDocuments();
    const totalPayments = await this.paymentModel.countDocuments({ status: 'completed' });

    return {
      customers: totalCustomers,
      rooms: totalRooms,
      bookings: totalBookings,
      payments: totalPayments,
    };
  }

  async getMonthlyEarnings() {
  const raw = await this.paymentModel.aggregate([
    {
      $match: {
        status: 'completed'
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const earnings = months.map((name, index) => {
    const found = raw.find(r => r._id === index + 1);
    return {
      month: name,
      total: found?.total || 0
    };
  });

  return earnings;
}
}