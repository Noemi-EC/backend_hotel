import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsInt()
  companyId: number;

  @IsInt()
  hotelId: number;
}
