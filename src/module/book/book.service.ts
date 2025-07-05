import { Book, BookDocument } from './schema/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookContext } from './book-context.class';
import { CreateBookDto } from './dto/create-book.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookedState } from './state/booked.state';
import { CancelledState } from './state/cancelled.state';
import { PendingState } from './state/pending.state';
import { Customer, CustomerDocument } from '../customer/schema/customer.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { Room, RoomDocument } from '../room/schema/room.schema';
import { BookStateInterface } from './state/book-state.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(
    createBookDto: CreateBookDto,
    userId: string,
  ): Promise<BookDocument> {
    const customer = await this.customerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!customer)
      throw new NotFoundException(
        'No existe ningún cliente asociado a este usuario',
      );

    const room = await this.roomModel.findById(createBookDto.roomId).exec();
    if (!room) throw new NotFoundException('Habitación no encontrada');

    const customerId = customer._id;
    const roomId = room._id;

    const book = new this.bookModel({
      ...createBookDto,
      roomId: roomId,
      customerId,
      status: 'pending', // Estado inicial
    });
    return book.save();
  }

  // Mapa de estados
  private stateMap: Record<string, new () => BookStateInterface> = {
    booked: BookedState,
    cancelled: CancelledState,
    pending: PendingState,
  };

  async changeStatus(
    bookId: string,
    userId: string,
    newStatus: 'pending' | 'booked' | 'cancelled',
  ): Promise<{ book: BookDocument; message: string }> {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const customer = await this.customerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    const admin = await this.userModel
      .findOne({ _id: new Types.ObjectId(userId), role: 'ADMIN' })
      .exec();

    if (!customer && !admin) {
      throw new NotFoundException(
        'No autorizado para cambiar el estado de la reserva',
      );
    }

    if (customer && book.customerId.toString() !== customer._id.toString()) {
      throw new NotFoundException(
        'No puedes cambiar el estado de reservas que no te pertenecen',
      );
    }

    // Crear contexto con el estado actual
    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    // Verificar si la transición es válida
    if (!bookContext.canTransitionTo(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar de ${book.status} a ${newStatus}`,
      );
    }

    // Ejecutar la transición usando el patrón State
    let message: string;
    switch (newStatus) {
      case 'booked':
        message = bookContext.booked();
        break;
      case 'cancelled':
        message = bookContext.cancelled();
        break;
      case 'pending':
        message = bookContext.pending();
        break;
      default:
        throw new BadRequestException('Estado no válido');
    }

    // Actualizar la base de datos
    book.status = newStatus;
    await book.save();

    return { book, message };
  }

  // Métodos de utilidad para obtener información de estado
  async getBookingStatus(
    bookId: string,
  ): Promise<{ status: string; availableTransitions: string[] }> {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    const allStates = ['pending', 'booked', 'cancelled'];
    const availableTransitions = allStates.filter(
      (state) => state !== book.status && bookContext.canTransitionTo(state),
    );

    return {
      status: book.status,
      availableTransitions,
    };
  }

  async findAll(userId: string): Promise<BookDocument[]> {
    const admin = await this.userModel
      .findOne({ _id: new Types.ObjectId(userId), role: 'ADMIN' })
      .exec();
    if (!admin) {
      throw new NotFoundException('No autorizado para ver todas las reservas');
    }

    return this.bookModel
      .find()
      .populate('roomId')
      .populate('customerId')
      .exec();
  }

  async findByCustomer(userId: string): Promise<BookDocument[]> {
    const customer = await this.customerModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!customer) {
      throw new NotFoundException(
        'No existe ningún cliente asociado a este usuario',
      );
    }

    return this.bookModel
      .find({ customerId: customer._id })
      .populate('roomId')
      .exec();
  }
}
