import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoomCategory, RoomStatus } from '../schema/room.schema';

export class CreateRoomDto {
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
