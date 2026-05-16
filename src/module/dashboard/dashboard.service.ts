import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { Room } from '../room/entity/room.entity';
import { Book } from '../book/entity/book.entity';
import { Payment } from '../payment/entity/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async getSummary() {
    const totalCustomers = await this.customerRepository.count();
    const totalRooms = await this.roomRepository.count();
    const totalBookings = await this.bookRepository.count();
    const totalPayments = await this.paymentRepository.count({ where: { status: 'completed' } });

    return {
      customers: totalCustomers,
      rooms: totalRooms,
      bookings: totalBookings,
      payments: totalPayments,
    };
  }

  async getMonthlyEarnings() {
    const raw = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('EXTRACT(MONTH FROM payment.created_at)', 'month')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'completed' })
      .groupBy('EXTRACT(MONTH FROM payment.created_at)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    return months.map((name, index) => {
      const found = raw.find((r) => Number(r.month) === index + 1);
      return { month: name, total: found ? Number(found.total) : 0 };
    });
  }
}
