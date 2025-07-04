import { Book, BookDocument } from './schema/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book as BookState } from './book.class';
import { CreateBookDto } from './dto/create-book.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookedState } from './state/booked.state';
import { CancelledState } from './state/cancelled.state';
import { Customer, CustomerDocument } from '../customer/schema/customer.schema';

@Injectable()
export class BookService {
  private book: BookState;

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>
  ) {
    this.book = new BookState(new BookedState());
  }

  // ---------------------------------------------------------------------- 
  // Falta manejar la creación de los estados con el patrón State
  // ---------------------------------------------------------------------- 
  async create(createBookDto: CreateBookDto, userId: string): Promise<BookDocument> {
    // Buscar al cliente por su userId
    const customer = await this.customerModel.findOne({ userId }).exec();
    if (!customer) throw new NotFoundException('No existe ningún cliente asociado a este usuario');

      const customerId = customer._id;
      
    const book = new this.bookModel({
      ...createBookDto,
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
}
