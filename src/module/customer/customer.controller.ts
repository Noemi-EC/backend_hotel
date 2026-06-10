import { Controller, Post, Get, Body, Put, Delete, Param, ParseIntPipe, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthRequest } from '../auth/auth.request';
import { UserService } from '../user/user.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
  ) {}

  @Post('/add')
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  // Alias esperado por el frontend
  @Post('/create')
  async createAlias(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERUSER', 'COMPANY_ADMIN')
  @Get('/all')
  async findAll(@Req() req: AuthRequest) {
    if (req.user.role === 'ADMIN') {
      const hotelId = (await this.userService.findById(req.user.userId))?.hotelId;
      if (!hotelId) throw new NotFoundException('Administrador sin hotel asignado');
      return this.customerService.findAll(hotelId);
    }

    if (req.user.role === 'COMPANY_ADMIN') {
      const companyId = (await this.userService.findById(req.user.userId))?.companyId;
      if (!companyId) throw new NotFoundException('Administrador de empresa sin companyId');
      return this.customerService.findAll(undefined, companyId);
    }

    return this.customerService.findAll();
  }

  @Put('/update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateCustomerDto) {
    return this.customerService.update(id, updateData);
  }

  @Delete('/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.delete(id);
  }
}
