import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('add')
  create(@Body() dto: CreateHotelDto) {
    return this.hotelService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  @Get('by-company/:companyId')
  findByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.hotelService.findByCompany(companyId);
  }

  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateHotelDto) {
    return this.hotelService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }
}
