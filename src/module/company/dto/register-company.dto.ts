import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterCompanyDto {
  @IsString() @IsNotEmpty() companyName: string;
  @IsString()
  @Length(11, 11, { message: 'El RUC debe tener 11 dígitos' })
  ruc: string;
  @IsString() @IsNotEmpty() companyAddress: string;
  @IsString() @IsOptional() companyPhone?: string;
  @IsEmail() @IsOptional() companyEmail?: string;

  @IsString() @IsNotEmpty() hotelName: string;
  @IsString() @IsNotEmpty() hotelAddress: string;
  @IsString() @IsOptional() hotelPhone?: string;
  @IsEmail() @IsOptional() hotelEmail?: string;

  // Administrador de la empresa (COMPANY_ADMIN) — obligatorio, no vinculado a un hotel específico
  @IsString() @IsNotEmpty() adminUsername: string;
  @IsString() @MinLength(6) adminPassword: string;

  // Administrador del hotel (ADMIN) — opcional, credenciales independientes del admin de empresa
  @IsString() @IsOptional() hotelAdminUsername?: string;
  @IsString() @IsOptional() @MinLength(6) hotelAdminPassword?: string;
}
