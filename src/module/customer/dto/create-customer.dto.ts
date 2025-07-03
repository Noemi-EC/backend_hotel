import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  dni: string;

  @IsString()
  email: string;
}
