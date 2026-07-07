import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]{3,30}$/)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,50}$/)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,50}$/)
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/)
  dni!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsInt()
  companyId!: number;

  @IsInt()
  hotelId!: number;
}
