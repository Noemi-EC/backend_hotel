import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthRequest } from '../auth/auth.request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // COMPANY_ADMIN: su propia empresa (desde token). SUPERUSER: sin restricción (undefined).
  private async resolveCompanyScope(req: AuthRequest): Promise<number | undefined> {
    if (req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId) throw new NotFoundException('Administrador de empresa sin companyId');
      return user.companyId;
    }
    return undefined;
  }

  // ── Gestión de administradores de hotel ──

  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Get('company-admins')
  async findCompanyAdmins(@Req() req: AuthRequest, @Query('companyId') companyId?: string) {
    if (req.user.role === 'COMPANY_ADMIN') {
      const scopedCompanyId = await this.resolveCompanyScope(req);
      return this.userService.findAdminsByCompany(scopedCompanyId as number);
    }
    // SUPERUSER debe indicar la empresa
    if (!companyId) throw new BadRequestException('Debe indicar companyId');
    return this.userService.findAdminsByCompany(Number(companyId));
  }

  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Post('admin')
  async createAdmin(@Req() req: AuthRequest, @Body() dto: CreateAdminDto) {
    const companyId = await this.resolveCompanyScope(req);
    return this.userService.createAdmin(dto, companyId);
  }

  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Put('admin/:id')
  async updateAdmin(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
  ) {
    const companyId = await this.resolveCompanyScope(req);
    return this.userService.updateAdmin(id, dto, companyId);
  }

  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Patch('admin/:id/active')
  async setAdminActive(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body('active') active: boolean,
  ) {
    const companyId = await this.resolveCompanyScope(req);
    return this.userService.setAdminActive(id, active, companyId);
  }

  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Delete('admin/:id')
  async removeAdmin(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    const companyId = await this.resolveCompanyScope(req);
    return this.userService.removeAdmin(id, companyId);
  }

  // ── Endpoints genéricos (solo SUPERUSER) ──

  @Roles('SUPERUSER')
  @Post('add')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Roles('SUPERUSER')
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Roles('SUPERUSER')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Roles('SUPERUSER')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
