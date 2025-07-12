import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Book, BookDocument } from '../book/schema/book.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<PaymentDocument> {
    const book = await this.bookModel.findById(dto.bookId);
    if (!book) throw new NotFoundException('Reserva no encontrada');

    if (book.status !== 'pending') {
      throw new BadRequestException('Esta reserva ya ha sido pagada o procesada');
    }

    // Simular obtener últimos 4 dígitos
    const cardLastDigits = dto.cardNumber.slice(-4);

    // Crear el pago
    const payment = new this.paymentModel({
      bookId: book._id,
      amount: book.price,
      status: 'completed',
      cardLastDigits,
    });

    // Guardar el pago
    await payment.save();

    // Actualizar la reserva a "booked"
    book.status = 'booked';
    await book.save();

    return payment;
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find()
      .populate({
        path: 'bookId',
        populate: {
           path: 'customerId',
           select: 'name lastName'
          }
        })
        .exec();
    }
    async findByCustomer(customerId: string): Promise<PaymentDocument[]> {
      // 1. Buscar primero los bookings del usuario
      const bookings = await this.bookModel.find({ customerId }).select('_id');
      const bookIds = bookings.map(b => b._id);
      // 2. Buscar pagos solo para esas reservas
      return this.paymentModel
        .find({ bookId: { $in: bookIds } })
        .populate({
          path: 'bookId',
          populate: [
            {
              path: 'roomId',
              select: 'code',
           },
           {
              path: 'customerId',
              select: 'name lastName',
           }
         ]
       })
       .exec();
} 
}