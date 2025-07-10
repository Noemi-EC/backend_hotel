import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  
  @Roles('ADMIN')
  @Post('/add')
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }
  
  @Roles('ADMIN', 'CUSTOMER')
  @Get('/all')
  async findAll() {
    return this.roomService.findAll();
  }
}
