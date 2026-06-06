import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './jwt/jwt.payload';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 15;

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

  async createSuperUser() {
    const existing = await this.userService.findOne('superuser');
    if (existing) return { message: 'El superusuario ya existe' };

    const superuser = await this.userService.create({
      username: 'superuser',
      password: 'super123',
      role: 'SUPERUSER',
    });
    return { message: 'Superusuario creado', superuser };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      const minutesLeft = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Cuenta bloqueada. Intente de nuevo en ${minutesLeft} minuto(s)`,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newAttempts = (user.loginAttempts || 0) + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        await this.userService.updateLoginAttempts(user.id, newAttempts, lockedUntil);
        throw new UnauthorizedException(
          `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCK_MINUTES} minutos`,
        );
      }
      await this.userService.updateLoginAttempts(user.id, newAttempts, null);
      throw new UnauthorizedException(
        `Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`,
      );
    }

    await this.userService.resetLoginAttempts(user.id);
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
    const { password: _, loginAttempts: __, lockedUntil: ___, ...userWithoutSensitive } = user;

    return { token, user: userWithoutSensitive };
  }
}
