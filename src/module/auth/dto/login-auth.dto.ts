import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  // @MinLength(4, {message : 'La contraseña debe tener al menos 4 digitos'})
  readonly password: string;
}
