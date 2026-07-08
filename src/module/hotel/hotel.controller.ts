import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthRequest } from '../auth/auth.request';
import { UserService } from '../user/user.service';

@Controller('hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly userService: UserService,
  ) {}

  // Devuelve el companyId del COMPANY_ADMIN autenticado, o lanza si no lo tiene.
  private async getCompanyIdOfUser(userId: number): Promise<number> {
    const user = await this.userService.findById(userId);
    if (!user || !user.companyId) {
      throw new NotFoundException('Administrador de empresa sin companyId');
    }
    return user.companyId;
  }

  // Si el usuario es COMPANY_ADMIN, valida que el hotel pertenezca a su empresa.
  private async assertHotelOwnership(req: AuthRequest, hotelId: number): Promise<void> {
    if (req.user.role !== 'COMPANY_ADMIN') return;
    const companyId = await this.getCompanyIdOfUser(req.user.userId);
    const hotel = await this.hotelService.findOne(hotelId);
    if (hotel.companyId !== companyId) {
      throw new ForbiddenException('El hotel no pertenece a su empresa');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'COMPANY_ADMIN')
  @Post('add')
  async create(@Req() req: AuthRequest, @Body() dto: CreateHotelDto) {
    // El COMPANY_ADMIN solo puede crear hoteles en su propia empresa (se ignora el companyId del body)
    if (req.user.role === 'COMPANY_ADMIN') {
      dto.companyId = await this.getCompanyIdOfUser(req.user.userId);
    }
    return this.hotelService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER')
  @Get('all')
  findAll() {
    return this.hotelService.findAll();
  }

  // Hoteles de la empresa del COMPANY_ADMIN autenticado (incluye inactivos, para su gestión)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY_ADMIN', 'SUPERUSER')
  @Get('my-company')
  async findMyCompany(@Req() req: AuthRequest) {
    const companyId = await this.getCompanyIdOfUser(req.user.userId);
    return this.hotelService.findByCompany(companyId);
  }

  // Hoteles de una empresa. Público (portal HU-14) cuando activeOnly=true; si no, devuelve todos.
  @Get('by-company/:companyId')
  findByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.hotelService.findByCompany(companyId, activeOnly === 'true');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN', 'COMPANY_ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'COMPANY_ADMIN')
  @Put('update/:id')
  async update(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number, @Body() dto: CreateHotelDto) {
    await this.assertHotelOwnership(req, id);
    return this.hotelService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'COMPANY_ADMIN')
  @Patch(':id/active')
  async setActive(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body('active') active: boolean,
  ) {
    await this.assertHotelOwnership(req, id);
    return this.hotelService.setActive(id, active);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'COMPANY_ADMIN')
  @Delete('delete/:id')
  async remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    await this.assertHotelOwnership(req, id);
    return this.hotelService.remove(id);
  }
}
