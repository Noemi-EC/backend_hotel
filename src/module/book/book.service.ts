import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
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
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  private stateMap: Record<string, new () => BookStateInterface> = {
    booked: BookedState,
    cancelled: CancelledState,
    pending: PendingState,
  };

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (!customer)
      throw new NotFoundException(
        'No existe ningún cliente asociado a este usuario',
      );

    const room = await this.roomRepository.findOne({
      where: { id: createBookDto.roomId },
    });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    const overlapping = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.roomId = :roomId', { roomId: room.id })
      .andWhere('book.status IN (:...statuses)', {
        statuses: ['pending', 'booked'],
      })
      .andWhere('book.checkInDate < :checkOut', {
        checkOut: createBookDto.checkOutDate,
      })
      .andWhere('book.checkOutDate > :checkIn', {
        checkIn: createBookDto.checkInDate,
      })
      .getCount();

    if (overlapping > 0) {
      throw new ConflictException(
        'La habitación no está disponible para las fechas seleccionadas',
      );
    }

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

    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    const admin = await this.userRepository.findOne({
      where: [
        { id: userId, role: 'ADMIN' },
        { id: userId, role: 'SUPERUSER' },
      ],
    });

    if (!customer && !admin) {
      throw new NotFoundException(
        'No autorizado para cambiar el estado de la reserva',
      );
    }

    if (customer && book.customerId !== customer.id) {
      throw new NotFoundException(
        'No puedes cambiar el estado de reservas que no te pertenecen',
      );
    }

    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    if (!bookContext.canTransitionTo(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar de ${book.status} a ${newStatus}`,
      );
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

  async getBookingStatus(
    bookId: number,
  ): Promise<{ status: string; availableTransitions: string[] }> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Reserva no encontrada');

    const StateClass = this.stateMap[book.status] || PendingState;
    const currentState = new StateClass();
    const bookContext = new BookContext(currentState);

    const allStates = ['pending', 'booked', 'cancelled'];
    const availableTransitions = allStates.filter(
      (s) => s !== book.status && bookContext.canTransitionTo(s),
    );

    return { status: book.status, availableTransitions };
  }

  async findAll(userId: number): Promise<Book[]> {
    const admin = await this.userRepository.findOne({
      where: [
        { id: userId, role: 'ADMIN' },
        { id: userId, role: 'SUPERUSER' },
        { id: userId, role: 'COMPANY_ADMIN' },
      ],
    });
    if (!admin)
      throw new NotFoundException('No autorizado para ver todas las reservas');

    if (admin.role === 'ADMIN') {
      if (!admin.hotelId) {
        throw new NotFoundException('Administrador sin hotel asignado');
      }
      return this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.room', 'room')
        .leftJoinAndSelect('book.customer', 'customer')
        .where('room.hotelId = :hotelId', { hotelId: admin.hotelId })
        .getMany();
    }

    if (admin.role === 'COMPANY_ADMIN') {
      if (!admin.companyId) {
        throw new NotFoundException('Administrador de empresa sin companyId');
      }
      return this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.room', 'room')
        .leftJoinAndSelect('book.customer', 'customer')
        .leftJoin('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId: admin.companyId })
        .getMany();
    }

    return this.bookRepository.find({ relations: ['room', 'customer'] });
  }

  async findAllByCustomer(userId: number): Promise<Book[]> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (!customer)
      throw new NotFoundException(
        'No existe ningún cliente asociado a este usuario',
      );
    return this.bookRepository.find({
      where: { customerId: customer.id },
      relations: ['room'],
    });
  }
}
