import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entity/book.entity';
import { Customer } from '../customer/entity/customer.entity';
import { User } from '../user/entity/user.entity';
import { Room } from '../room/entity/room.entity';
import { BookFactory } from '../../factory/book.factory';
import { BookContext } from './book-context.class';
import { CreateBookDto } from './dto/create-book.dto';
import { BookedState } from './state/booked.state';
import { CancelledState } from './state/cancelled.state';
import { PendingState } from './state/pending.state';
import { BookStateInterface } from './state/book-state.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  private stateMap: Record<string, new () => BookStateInterface> = {
    booked: BookedState,
    cancelled: CancelledState,
    pending: PendingState,
  };

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    const customer = await this.customerRepository.findOne({ where: { userId } });
    if (!customer) throw new NotFoundException('No existe ningún cliente asociado a este usuario');

    const room = await this.roomRepository.findOne({ where: { id: createBookDto.roomId } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    const bookData = BookFactory.create(createBookDto, room.id, customer.id);
    const book = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(book);

    if (savedBook.status === 'booked') {
      await this.roomRepository.update(room.id, { status: 'ocupada' });
    }

    return savedBook;
  }

  async changeStatus(
    bookId: number,
    userId: number,
    newStatus: 'pending' | 'booked' | 'cancelled',
  ): Promise<{ book: Book; message: string }> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const customer = await this.customerRepository.findOne({ where: { userId } });
    const admin = await this.userRepository.findOne({ where: { id: userId, role: 'ADMIN' } });

    if (!customer && !admin) {
      throw new NotFoundException('No autorizado para cambiar el estado de la reserva');
    }

    if (customer && book.customerId !== customer.id) {
      throw new NotFoundException('No puedes cambiar el estado de reservas que no te pertenecen');
    }

    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    if (!bookContext.canTransitionTo(newStatus)) {
      throw new BadRequestException(`No se puede cambiar de ${book.status} a ${newStatus}`);
    }

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

    await this.bookRepository.update(bookId, { status: newStatus });
    book.status = newStatus;

    if (newStatus === 'cancelled') {
      await this.roomRepository.update(book.roomId, { status: 'disponible' });
    }
    if (newStatus === 'booked') {
      await this.roomRepository.update(book.roomId, { status: 'ocupada' });
    }

    return { book, message };
  }

  async getBookingStatus(bookId: number): Promise<{ status: string; availableTransitions: string[] }> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    const allStates = ['pending', 'booked', 'cancelled'];
    const availableTransitions = allStates.filter(
      (state) => state !== book.status && bookContext.canTransitionTo(state),
    );

    return { status: book.status, availableTransitions };
  }

  async findAll(userId: number): Promise<Book[]> {
    const admin = await this.userRepository.findOne({ where: { id: userId, role: 'ADMIN' } });
    if (!admin) throw new NotFoundException('No autorizado para ver todas las reservas');

    return this.bookRepository.find({ relations: ['room', 'customer'] });
  }

  async findAllByCustomer(userId: number): Promise<Book[]> {
    const customer = await this.customerRepository.findOne({ where: { userId } });
    if (!customer) throw new NotFoundException('No existe ningún cliente asociado a este usuario');

    return this.bookRepository.find({
      where: { customerId: customer.id },
      relations: ['room'],
    });
  }
}
