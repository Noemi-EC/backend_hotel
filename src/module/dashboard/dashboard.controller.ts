import { Controller, Get, Query, ParseIntPipe, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { UserService } from '../user/user.service';
import { AuthRequest } from '../auth/auth.request';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Get('summary')
  async getSummary(@Req() req: AuthRequest) {
    if (req.user.role === 'ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.hotelId) {
        throw new NotFoundException('Administrador sin hotel asignado');
      }
      return this.dashboardService.getSummary(user.hotelId);
    }
    if (req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId) {
        throw new NotFoundException('Administrador de empresa sin companyId');
      }
      return this.dashboardService.getSummary(undefined, user.companyId);
    }
    return this.dashboardService.getSummary();
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
    const resolvedHotelId = hotelId ? Number(hotelId) : undefined;
    if (!resolvedHotelId && req.user.role === 'ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.hotelId) {
        throw new NotFoundException('Administrador sin hotel asignado');
      }
      return this.dashboardService.getMonthlyEarnings(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        user.hotelId,
      );
    }

    if (!resolvedHotelId && req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId) {
        throw new NotFoundException('Administrador de empresa sin companyId');
      }
      return this.dashboardService.getMonthlyEarnings(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        undefined,
        user.companyId,
      );
    }

    return this.dashboardService.getMonthlyEarnings(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      resolvedHotelId,
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
    const resolvedHotelId = hotelId ? Number(hotelId) : undefined;
    if (!resolvedHotelId && req.user.role === 'ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.hotelId) {
        throw new NotFoundException('Administrador sin hotel asignado');
      }
      return this.dashboardService.getMonthlyEarnings(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        user.hotelId,
      );
    }

    if (!resolvedHotelId && req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId) {
        throw new NotFoundException('Administrador de empresa sin companyId');
      }
      return this.dashboardService.getMonthlyEarnings(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        undefined,
        user.companyId,
      );
    }

    return this.dashboardService.getMonthlyEarnings(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      resolvedHotelId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('occupancy')
  async getOccupancy(
    @Req() req: AuthRequest,
    @Query('hotelId', ParseIntPipe) hotelId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    let resolvedHotelId = hotelId;
    if (req.user.role === 'ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.hotelId) {
        throw new NotFoundException('Administrador sin hotel asignado');
      }
      resolvedHotelId = user.hotelId;
    }

    if (req.user.role === 'COMPANY_ADMIN') {
      const user = await this.userService.findById(req.user.userId);
      if (!user || !user.companyId) {
        throw new NotFoundException('Administrador de empresa sin companyId');
      }
      // For company occupancy, pass undefined hotelId but companyId handled in service via other endpoints if needed
      // Here occupancy is inherently per hotel; so COMPANY_ADMIN should request per-hotel occupancy via hotelId param.
    }

    return this.dashboardService.getOccupancyRate(resolvedHotelId, new Date(startDate), new Date(endDate));
  }
}
