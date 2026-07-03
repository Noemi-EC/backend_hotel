import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthRequest } from '../auth/auth.request';
import { UserService } from '../user/user.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Post('/add')
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CUSTOMER', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('/all')
  async findAll(@Req() req: AuthRequest) {
    const user = await this.userService.findById(req.user.userId);
    if (
      (req.user.role === 'ADMIN' || req.user.role === 'CUSTOMER') &&
      !user?.hotelId
    ) {
      throw new NotFoundException('Usuario sin hotel asignado');
    }
    if (req.user.role === 'COMPANY_ADMIN') {
      const companyId = user?.companyId;
      if (!companyId)
        throw new NotFoundException('Administrador de empresa sin companyId');
      return this.roomService.findAll(undefined, companyId);
    }
    if (req.user.role === 'SUPERUSER') {
      return this.roomService.findAll();
    }

    // At this point non-superusers must have a resolved user with hotelId (validated above)
    if (!user || !user.hotelId) {
      throw new NotFoundException('Usuario sin hotel asignado');
    }

    return this.roomService.findAll(user.hotelId);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER')
  @Delete('/delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomService.remove(id);
  }
}
