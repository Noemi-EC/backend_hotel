import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  // Alias esperado por el frontend
  @Post('create')
  async createAlias(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get('all')
  async findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-payments')
  async findByCustomer(@Req() req) {
    return this.paymentService.findByCustomer(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('voucher/:bookId')
  async getVoucher(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.paymentService.getVoucher(bookId);
  }
}
