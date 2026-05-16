import { IsNotEmpty, IsString, IsInt, Length } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @IsString()
  @Length(3, 4, { message: 'El código debe tener 3 o 4 dígitos' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  expiry: string;
}
