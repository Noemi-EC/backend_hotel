import { Book, BookDocument } from './schema/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book as BookState } from './book.class';
import { CreateBookDto } from './dto/create-book.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookedState } from './state/booked.state';
import { CancelledState } from './state/cancelled.state';
import { PendingState } from './state/pending.state';
import { Customer, CustomerDocument } from '../customer/schema/customer.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { Room, RoomDocument } from '../room/schema/room.schema';
import { BookStateInterface } from './state/book-state.interface';

@Injectable()
export class BookService {
  private book: BookState;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {
    this.book = new BookState(new BookedState());
  }

  async create(createBookDto: CreateBookDto, userId: string): Promise<BookDocument> {
    const customer = await this.customerModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!customer) throw new NotFoundException('No existe ningún cliente asociado a este usuario');

    const room = await this.roomModel.findById(createBookDto.roomId).exec();
    if (!room) throw new NotFoundException('Habitación no encontrada');

    const customerId = customer._id;
    const roomId = room._id;

    const book = new this.bookModel({
      ...createBookDto,
      roomId: roomId,
      customerId,
      status: 'pending', // Estado inicial usando patrón State, manejar ello
    });
    return book.save();
  }

  public booked(): string {
    return this.book.booked();
  }

  public cancelled(): string {
    this.book.setState(new CancelledState());
    return this.book.cancelled();
  }

  public pending(): string {
    return this.book.pending();
  }

  // Mapa de estados
  stateMap: Record<string, new () => BookStateInterface> = {
    booked: BookedState,
    cancelled: CancelledState,
    pending: PendingState,
  };

  async changeStatus(
    bookId: string,
    userId: string,
    newStatus: 'pending' | 'booked' | 'cancelled'
  ): Promise<{ book: BookDocument; message: string }> {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const customer = await this.customerModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    const admin = await this.userModel.findOne({ _id: new Types.ObjectId(userId), role: 'ADMIN' }).exec();

    if (!customer && !admin) {
      throw new NotFoundException('No autorizado para cambiar el estado de la reserva');
    }

    if (customer && book.customerId.toString() !== customer._id.toString()) {
      throw new NotFoundException('No puedes cambiar el estado de reservas que no te pertenecen');
    }

    // Instancia el estado actual usando el mapa
    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookState(currentState);

    if (!currentState.canTransitionTo(newStatus)) {
      throw new BadRequestException('Transición de estado no permitida');
    }

    // Cambia el estado en la base de datos
    book.status = newStatus;
    await book.save();

    return { book, message: bookContext[newStatus]() };
  }

  // Mostrar todas las reservaciones para el administrador
  async findAll(userId: string): Promise<BookDocument[]> {
    const admin = await this.userModel.findOne({  _id: new Types.ObjectId(userId), role: 'ADMIN' }).exec();
    if (!admin) throw new NotFoundException('No autorizado para ver todas las reservas');
    return this.bookModel.find().populate('roomId').populate('customerId').exec();
  }
}
