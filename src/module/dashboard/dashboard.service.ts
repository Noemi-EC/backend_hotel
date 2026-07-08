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

  async getSummary(hotelId?: number, companyId?: number) {
    if (!hotelId && !companyId) {
      const totalCustomers = await this.customerRepository.count();
      const totalRooms = await this.roomRepository.count();
      const totalBookings = await this.bookRepository.count();
      const totalPayments = await this.paymentRepository.count({ where: { status: 'completed' } });

      return { customers: totalCustomers, rooms: totalRooms, bookings: totalBookings, payments: totalPayments };
    }

    if (companyId) {
      const totalCustomers = await this.customerRepository
        .createQueryBuilder('customer')
        .innerJoin('customer.user', 'user')
        .where('user.companyId = :companyId', { companyId })
        .getCount();

      const totalRooms = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId })
        .getCount();

      const totalBookings = await this.bookRepository
        .createQueryBuilder('book')
        .innerJoin('book.room', 'room')
        .innerJoin('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId })
        .getCount();

      const totalPayments = await this.paymentRepository
        .createQueryBuilder('payment')
        .innerJoin('payment.book', 'book')
        .innerJoin('book.room', 'room')
        .innerJoin('room.hotel', 'hotel')
        .where('payment.status = :status', { status: 'completed' })
        .andWhere('hotel.companyId = :companyId', { companyId })
        .getCount();

      return { customers: totalCustomers, rooms: totalRooms, bookings: totalBookings, payments: totalPayments };
    }

    // hotelId provided
    const totalCustomers = await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.user', 'user')
      .where('user.hotelId = :hotelId', { hotelId })
      .getCount();
    const totalRooms = await this.roomRepository.count({ where: { hotelId } });
    const totalBookings = await this.bookRepository
      .createQueryBuilder('book')
      .innerJoin('book.room', 'room')
      .where('room.hotelId = :hotelId', { hotelId })
      .getCount();
    const totalPayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.book', 'book')
      .innerJoin('book.room', 'room')
      .where('payment.status = :status', { status: 'completed' })
      .andWhere('room.hotelId = :hotelId', { hotelId })
      .getCount();

    return { customers: totalCustomers, rooms: totalRooms, bookings: totalBookings, payments: totalPayments };
  }

  async getMonthlyEarnings(startDate?: Date, endDate?: Date, hotelId?: number, companyId?: number) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select('EXTRACT(MONTH FROM payment.created_at)', 'month')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'completed' });

    if (startDate) query.andWhere('payment.created_at >= :startDate', { startDate });
    if (endDate)   query.andWhere('payment.created_at <= :endDate', { endDate });
    if (companyId) {
      query
        .innerJoin('payment.book', 'book')
        .innerJoin('book.room', 'room')
        .innerJoin('room.hotel', 'hotel')
        .andWhere('hotel.companyId = :companyId', { companyId });
    } else if (hotelId) {
      query
        .innerJoin('payment.book', 'book')
        .innerJoin('book.room', 'room')
        .andWhere('room.hotelId = :hotelId', { hotelId });
    }

    const raw = await query
      .groupBy('EXTRACT(MONTH FROM payment.created_at)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return months.map((name, i) => {
      const found = raw.find((r) => Number(r.month) === i + 1);
      return { month: name, total: found ? Number(found.total) : 0 };
    });
  }

  async getOccupancyRate(
    startDate: Date,
    endDate: Date,
    hotelId?: number,
    companyId?: number,
  ): Promise<{ occupancyRate: number }> {
    let totalRooms: number;
    const bookingsQuery = this.bookRepository.createQueryBuilder('book').innerJoin('book.room', 'room');

    if (hotelId) {
      totalRooms = await this.roomRepository.count({ where: { hotelId } });
      bookingsQuery.where('room.hotelId = :hotelId', { hotelId });
    } else if (companyId) {
      totalRooms = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId })
        .getCount();
      bookingsQuery.innerJoin('room.hotel', 'hotel').where('hotel.companyId = :companyId', { companyId });
    } else {
      totalRooms = await this.roomRepository.count();
    }

    if (totalRooms === 0) return { occupancyRate: 0 };

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
    const totalAvailable = totalRooms * totalDays;

    const bookings = await bookingsQuery
      .andWhere('book.status IN (:...statuses)', { statuses: ['pending', 'booked'] })
      .andWhere('book.checkInDate < :endDate', { endDate })
      .andWhere('book.checkOutDate > :startDate', { startDate })
      .getMany();

    let occupiedDays = 0;
    for (const b of bookings) {
      const s = new Date(Math.max(new Date(b.checkInDate).getTime(), startDate.getTime()));
      const e = new Date(Math.min(new Date(b.checkOutDate).getTime(), endDate.getTime()));
      occupiedDays += Math.ceil((e.getTime() - s.getTime()) / 86400000);
    }

    return { occupancyRate: Math.round((occupiedDays / totalAvailable) * 100 * 100) / 100 };
  }
}
