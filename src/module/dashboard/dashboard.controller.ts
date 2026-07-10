import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserService } from '../user/user.service';
import { HotelService } from '../hotel/hotel.service';
import { AuthRequest } from '../auth/auth.request';

interface DashboardScope {
  hotelId?: number;
  companyId?: number;
}

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
  ) {}

  private async assertHotelBelongsToCompany(
    hotelId: number,
    companyId: number,
  ) {
    const hotel = await this.hotelService.findOne(hotelId);
    if (hotel.companyId !== companyId) {
      throw new ForbiddenException(
        'El hotel seleccionado no pertenece a su empresa',
      );
    }
  }

  // Resuelve el alcance (hotelId o companyId) según el rol del usuario autenticado.
  // Si es COMPANY_ADMIN y pide un hotelId puntual, valida que ese hotel sea de su empresa.
  private async resolveScope(
    req: AuthRequest,
    hotelId?: string,
  ): Promise<DashboardScope> {
    const requestedHotelId = hotelId ? Number(hotelId) : undefined;

    if (req.user.role === 'ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.hotelId)
        throw new NotFoundException('Administrador sin hotel asignado');
      return { hotelId: user.hotelId };
    }

    if (req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId)
        throw new NotFoundException('Administrador de empresa sin companyId');

      if (requestedHotelId) {
        await this.assertHotelBelongsToCompany(
          requestedHotelId,
          user.companyId,
        );
        return { hotelId: requestedHotelId };
      }

      return { companyId: user.companyId };
    }

    // SUPERUSER (u otros roles con acceso global): usa el hotelId si lo mandan, si no ve todo
    return { hotelId: requestedHotelId };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('summary')
  async getSummary(
    @Req() req: AuthRequest,
    @Query('hotelId') hotelId?: string,
  ) {
    const scope = await this.resolveScope(req, hotelId);
    return this.dashboardService.getSummary(scope.hotelId, scope.companyId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('monthly')
  async getMonthly(
    @Req() req: AuthRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    const scope = await this.resolveScope(req, hotelId);
    return this.dashboardService.getMonthlyEarnings(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      scope.hotelId,
      scope.companyId,
    );
  }

  // Alias esperado por el frontend
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('monthly-earnings')
  async getMonthlyEarnings(
    @Req() req: AuthRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    return this.getMonthly(req, startDate, endDate, hotelId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('occupancy')
  async getOccupancy(
    @Req() req: AuthRequest,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('hotelId') hotelId?: string,
  ) {
    const scope = await this.resolveScope(req, hotelId);
    return this.dashboardService.getOccupancyRate(
      new Date(startDate),
      new Date(endDate),
      scope.hotelId,
      scope.companyId,
    );
  }
}
