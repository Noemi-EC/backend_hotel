import { Controller, Post, Get, Body, UseGuards, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Post('/add')
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CUSTOMER', 'SUPERUSER')
  @Get('/all')
  async findAll() {
    return this.roomService.findAll();
  }

  @Get('/available')
  async getAvailable(
    @Query('hotelId', ParseIntPipe) hotelId: number,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('category') category?: string,
    @Query('minCapacity') minCapacity?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.roomService.getAvailableRooms(
      hotelId,
      new Date(checkIn),
      new Date(checkOut),
      {
        category,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Put('/update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Delete('/delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }
}
