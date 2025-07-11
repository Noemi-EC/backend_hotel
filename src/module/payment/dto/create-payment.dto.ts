import { IsNotEmpty, IsString, IsMongoId, Length } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  bookId: string;

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