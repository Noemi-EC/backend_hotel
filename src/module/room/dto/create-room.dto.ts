import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoomCategory, RoomStatus } from '../entity/room.entity';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  status: RoomStatus;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: RoomCategory;
}
