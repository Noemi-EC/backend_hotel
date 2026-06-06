import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('monthly')
  async getMonthly(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    return this.dashboardService.getMonthlyEarnings(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      hotelId ? Number(hotelId) : undefined,
    );
  }

  // Alias esperado por el frontend
  @Get('monthly-earnings')
  async getMonthlyEarnings(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    return this.dashboardService.getMonthlyEarnings(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      hotelId ? Number(hotelId) : undefined,
    );
  }

  @Get('occupancy')
  async getOccupancy(
    @Query('hotelId', ParseIntPipe) hotelId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getOccupancyRate(hotelId, new Date(startDate), new Date(endDate));
  }
}
