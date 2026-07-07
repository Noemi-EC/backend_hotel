import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { RoomCategory, RoomStatus } from '../entity/room.entity';

export class CreateRoomDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  hotelId: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]{1,20}$/, {
    message: 'El código solo puede contener letras, números y guiones',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(RoomStatus, { message: 'El estado no es válido' })
  status: RoomStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(RoomCategory, { message: 'La categoría no es válida' })
  category: RoomCategory;
}
