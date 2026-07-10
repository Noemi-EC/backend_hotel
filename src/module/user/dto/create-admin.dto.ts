import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsNotEmpty()
  hotelId: number;
}

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsInt()
  @IsOptional()
  hotelId?: number;
}
