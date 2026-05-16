import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
