import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsString() @IsNotEmpty() companyName: string;
  @IsString() @Length(11, 11, { message: 'El RUC debe tener 11 dígitos' }) ruc: string;
  @IsString() @IsNotEmpty() companyAddress: string;
  @IsString() @IsOptional() companyPhone?: string;
  @IsEmail() @IsOptional() companyEmail?: string;

  @IsString() @IsNotEmpty() hotelName: string;
  @IsString() @IsNotEmpty() hotelAddress: string;
  @IsString() @IsOptional() hotelPhone?: string;
  @IsEmail() @IsOptional() hotelEmail?: string;

  @IsString() @IsNotEmpty() adminUsername: string;
  @IsString() @MinLength(6) adminPassword: string;
}
