import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { Book } from '../book/entity/book.entity';
import { Customer } from '../customer/entity/customer.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
  ) {}

  private generateConfirmationCode(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RES-${date}-${random}`;
  }

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const book = await this.bookRepository.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Reserva no encontrada');
    if (book.status !== 'pending') {
      throw new BadRequestException('Esta reserva ya ha sido pagada o procesada');
    }

    const cardLastDigits = dto.cardNumber.slice(-4);
    const payment = this.paymentRepository.create({
      bookId: book.id,
      amount: book.price,
      status: 'completed',
      cardLastDigits,
    });
    await this.paymentRepository.save(payment);

    const confirmationCode = this.generateConfirmationCode();
    await this.bookRepository.update(book.id, { status: 'booked', confirmationCode });

    return payment;
  }

  async findAll(hotelId?: number, companyId?: number): Promise<Payment[]> {
    if (!hotelId && !companyId) {
      return this.paymentRepository.find({ relations: ['book', 'book.customer'] });
    }

    if (companyId) {
      return this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.book', 'book')
        .leftJoinAndSelect('book.customer', 'customer')
        .leftJoin('book.room', 'room')
        .leftJoin('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId })
        .getMany();
    }

    return this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.book', 'book')
      .leftJoinAndSelect('book.customer', 'customer')
      .leftJoin('book.room', 'room')
      .where('room.hotelId = :hotelId', { hotelId })
      .getMany();
  }

  async findByCustomer(userId: number): Promise<Payment[]> {
    const customer = await this.customerRepository.findOne({ where: { userId } });
    if (!customer) throw new NotFoundException('Cliente no encontrado');

    const books = await this.bookRepository.find({ where: { customerId: customer.id } });
    const bookIds = books.map((b) => b.id);
    if (bookIds.length === 0) return [];

    return this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.book', 'book')
      .leftJoinAndSelect('book.room', 'room')
      .leftJoinAndSelect('book.customer', 'customer')
      .where('payment.book_id IN (:...bookIds)', { bookIds })
      .getMany();
  }

  async getVoucher(bookId: number) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['room', 'customer'],
    });
    if (!book) throw new NotFoundException('Reserva no encontrada');
    if (!book.confirmationCode) throw new BadRequestException('Esta reserva no tiene pago registrado');

    const payment = await this.paymentRepository.findOne({ where: { bookId } });

    return {
      confirmationCode: book.confirmationCode,
      book: {
        id: book.id,
        checkInDate: book.checkInDate,
        checkOutDate: book.checkOutDate,
        status: book.status,
        price: book.price,
      },
      room: { code: book.room?.code, category: book.room?.category },
      customer: { name: book.customer?.name, lastName: book.customer?.lastName, email: book.customer?.email },
      payment: { amount: payment?.amount, cardLastDigits: payment?.cardLastDigits, date: payment?.createdAt },
    };
  }
}
