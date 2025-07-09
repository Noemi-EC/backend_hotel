import { Book } from '../module/book/schema/book.schema';
import { CreateBookDto } from '../module/book/dto/create-book.dto';
import { Types } from 'mongoose';

export class BookFactory {
  static create(
    createBookDto: CreateBookDto,
    roomId: Types.ObjectId,
    customerId: Types.ObjectId,
  ): Partial<Book> {
    return {
      ...createBookDto,
      roomId,
      customerId,
      status: 'pending',
    };
  }
}