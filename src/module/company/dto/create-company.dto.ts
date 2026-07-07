import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

const SAFE_TEXT_REGEX = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,'#/-]{1,100}$/u;

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(SAFE_TEXT_REGEX, {
    message: 'El nombre contiene caracteres no permitidos',
  })
  name: string;

  @IsString()
  @Length(11, 11, { message: 'El RUC debe tener 11 dígitos' })
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(SAFE_TEXT_REGEX, {
    message: 'La dirección contiene caracteres no permitidos',
  })
  address: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9+() -]{4,20}$/, {
    message:
      'El teléfono solo puede contener números, espacios, +, paréntesis y guion',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;
}
