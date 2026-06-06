import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @Length(11, 11, { message: 'El RUC debe tener 11 dígitos' }) @IsOptional() ruc?: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() email?: string;
}
