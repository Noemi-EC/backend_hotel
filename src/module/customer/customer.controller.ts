import { Controller, Post, Get, Body, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/add')
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get('/all')
  async findAll() {
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
