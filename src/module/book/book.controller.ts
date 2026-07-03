import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthRequest } from '../auth/auth.request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('CUSTOMER', 'ADMIN', 'SUPERUSER')
  @Post('/add')
  async create(@Body() createBookDto: CreateBookDto, @Req() req: AuthRequest) {
    return this.bookService.create(createBookDto, req.user.userId);
  }

  // Alias esperado por el frontend
  @Roles('CUSTOMER', 'ADMIN', 'SUPERUSER')
  @Post('/create')
  async createAlias(
    @Body() createBookDto: CreateBookDto,
    @Req() req: AuthRequest,
  ) {
    return this.bookService.create(createBookDto, req.user.userId);
  }

  @Roles('CUSTOMER', 'ADMIN', 'SUPERUSER')
  @Patch(':id/status/:status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Param('status') status: 'pending' | 'booked' | 'cancelled',
  ) {
    return this.bookService.changeStatus(id, req.user.userId, status);
  }

  // Alias para status en body: PATCH /book/:id/status  { status: 'booked' }
  @Roles('CUSTOMER', 'ADMIN', 'SUPERUSER')
  @Patch(':id/status')
  async updateStatusBody(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
    @Body('status') status: 'pending' | 'booked' | 'cancelled',
  ) {
    return this.bookService.changeStatus(id, req.user.userId, status);
  }

  @Roles('ADMIN', 'SUPERUSER')
  @Get('admin/all')
  async findAll(@Req() req: AuthRequest) {
    return this.bookService.findAll(req.user.userId);
  }

  // Alias esperado por el frontend
  @Roles('ADMIN', 'SUPERUSER')
  @Get('all')
  async findAllAlias(@Req() req: AuthRequest) {
    return this.bookService.findAll(req.user.userId);
  }

  @Roles('CUSTOMER')
  @Get('customer/all')
  async findAllByCustomer(@Req() req: AuthRequest) {
    return this.bookService.findAllByCustomer(req.user.userId);
  }

  // Alias esperado por el frontend
  @Roles('CUSTOMER')
  @Get('customer')
  async findAllByCustomerAlias(@Req() req: AuthRequest) {
    return this.bookService.findAllByCustomer(req.user.userId);
  }
}
