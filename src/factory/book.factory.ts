import { Book } from '../module/book/entity/book.entity';
import { CreateBookDto } from '../module/book/dto/create-book.dto';

export class BookFactory {
  static create(
    createBookDto: CreateBookDto,
    roomId: number,
    customerId: number,
  ): Partial<Book> {
    return {
      ...createBookDto,
      roomId,
      customerId,
      status: 'pending',
    };
  }
}
