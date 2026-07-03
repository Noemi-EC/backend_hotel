import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  dni!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsInt()
  companyId!: number;

  @IsInt()
  hotelId!: number;
}
