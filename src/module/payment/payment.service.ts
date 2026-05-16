import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { Book } from '../book/entity/book.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

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

    await this.bookRepository.update(book.id, { status: 'booked' });

    return payment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['book', 'book.customer'],
    });
  }

  async findByCustomer(customerId: number): Promise<Payment[]> {
    const books = await this.bookRepository.find({ where: { customerId } });
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
}
