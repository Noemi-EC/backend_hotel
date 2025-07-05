import { Controller, Post, Body, UseGuards, Req, Param, Patch, Get } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('CUSTOMER', 'ADMIN')
  @Post('/add')
  async create(@Body() createBookDto: CreateBookDto, @Req() req) {
    // El userId viene del token JWT
    const userId = req.user.userId;
    return this.bookService.create(createBookDto, userId);
  }

  @Roles('CUSTOMER', 'ADMIN')
  @Patch(':id/status/:status')
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Param('status') status: 'pending' | 'booked' | 'cancelled'
  ) {
    const userId = req.user.userId;
    return this.bookService.changeStatus(id, userId, status);
  }

  @Get('all')
  @Roles('ADMIN')
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.bookService.findAll(userId);
  }
}
