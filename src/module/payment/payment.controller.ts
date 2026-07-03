import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthRequest } from '../auth/auth.request';
import { UserService } from '../user/user.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('pay')
  async create(@Body() dto: CreatePaymentDto, @Req() req: AuthRequest) {
    return this.paymentService.createPayment(dto, req.user.userId);
  }

  // Alias esperado por el frontend
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAlias(@Body() dto: CreatePaymentDto, @Req() req: AuthRequest) {
    return this.paymentService.createPayment(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('all')
  async findAll(@Req() req: AuthRequest) {
    if (req.user.role === 'ADMIN') {
      const hotelId = (await this.userService.findById(req.user.userId))
        ?.hotelId;
      if (!hotelId)
        throw new NotFoundException('Administrador sin hotel asignado');
      return this.paymentService.findAll(hotelId);
    }

    if (req.user.role === 'COMPANY_ADMIN') {
      const companyId = (await this.userService.findById(req.user.userId))
        ?.companyId;
      if (!companyId)
        throw new NotFoundException('Administrador de empresa sin companyId');
      return this.paymentService.findAll(undefined, companyId);
    }

    return this.paymentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-payments')
  async findByCustomer(@Req() req: AuthRequest) {
    return this.paymentService.findByCustomer(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('voucher/:bookId')
  async getVoucher(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.paymentService.getVoucher(bookId);
  }
}
