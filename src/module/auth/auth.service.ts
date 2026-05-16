import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createAdminUser() {
    const existing = await this.userService.findOne('admin');
    if (existing) return { message: 'El usuario admin ya existe' };

    const admin = await this.userService.create({
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN',
    });
    return { message: 'Usuario admin creado', admin };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async login(dto: LoginAuthDto) {
    const user = await this.validateUser(dto.username, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}
