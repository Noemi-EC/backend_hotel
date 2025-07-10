import { IsDateString, IsOptional, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsMongoId()
  roomId: string;

  // @IsMongoId()
  // customerId: string;

  @IsDateString()
  checkInDate: Date;

  @IsDateString()
  checkOutDate: Date;

  @IsOptional()
  @IsNumber()
  price?: number;
}
