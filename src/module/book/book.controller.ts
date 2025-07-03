import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Req() req) {
    // El userId viene del token JWT
    const userId = req.user.userId;
    return this.bookService.create(createBookDto, userId);
  }
}
