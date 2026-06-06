import { Controller, Post, Body } from '@nestjs/common';
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
    return this.authService.createAdminUser();
  }

  @Post('init-super')
  async initSuper() {
    return this.authService.createSuperUser();
  }
}
