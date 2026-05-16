import { IsDateString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsInt()
  roomId: number;

  @IsDateString()
  checkInDate: Date;

  @IsDateString()
  checkOutDate: Date;

  @IsOptional()
  @IsNumber()
  price?: number;
}
