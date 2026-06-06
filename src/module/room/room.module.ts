import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entity/room.entity';
import { Book } from '../book/entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Book])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
