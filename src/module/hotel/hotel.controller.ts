import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN', 'COMPANY_ADMIN')
  @Post('add')
  create(@Body() dto: CreateHotelDto) {
    return this.hotelService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.hotelService.findAll();
  }

  @Get('by-company/:companyId')
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.hotelService.findByCompany(companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN', 'COMPANY_ADMIN')
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateHotelDto) {
    return this.hotelService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN', 'COMPANY_ADMIN')
  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }
}
