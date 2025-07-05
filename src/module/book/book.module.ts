import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/book.schema';
import { Customer, CustomerSchema } from '../customer/schema/customer.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { Room, RoomSchema } from '../room/schema/room.schema';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    CustomerModule,
    UserModule,
    RoomModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
