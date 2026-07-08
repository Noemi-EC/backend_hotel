import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Endpoint público — cualquiera puede registrar su empresa
  @Post('register')
  register(@Body() dto: RegisterCompanyDto) {
    return this.companyService.register(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER')
  @Post('add')
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN')
  @Get('all')
  findAll() {
    return this.companyService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER', 'ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER')
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCompanyDto) {
    return this.companyService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSER')
  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
