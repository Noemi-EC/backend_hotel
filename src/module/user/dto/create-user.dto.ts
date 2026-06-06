import { IsString, MinLength, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsInt()
  @IsOptional()
  companyId?: number;

  @IsInt()
  @IsOptional()
  hotelId?: number;
}
