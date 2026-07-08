import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }

  @Post('init-admin')
  async initAdmin() {
    if (process.env.ENABLE_BOOTSTRAP !== 'true') {
      throw new ForbiddenException('Endpoint deshabilitado');
    }

    const password = process.env.ADMIN_INITIAL_PASSWORD;
    if (!password) {
      throw new ForbiddenException('ADMIN_INITIAL_PASSWORD no configurado');
    }

    return this.authService.createAdminUser(password);
  }

  @Post('init-super')
  async initSuper() {
    if (process.env.ENABLE_BOOTSTRAP !== 'true') {
      throw new ForbiddenException('Endpoint deshabilitado');
    }

    const password = process.env.SUPERUSER_INITIAL_PASSWORD;
    if (!password) {
      throw new ForbiddenException('SUPERUSER_INITIAL_PASSWORD no configurado');
    }

    return this.authService.createSuperUser(password);
  }
}
