import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entity/company.entity';
import { Hotel } from '../hotel/entity/hotel.entity';
import { User } from '../user/entity/user.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Hotel, User])],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
