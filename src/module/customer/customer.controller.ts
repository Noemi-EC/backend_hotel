import { Controller, Post, Get, Body, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('/add')
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get('/all')
  async findAll() {
    return this.customerService.findAll();
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCustomerDto) {
    return this.customerService.update(id, updateData);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }
}
