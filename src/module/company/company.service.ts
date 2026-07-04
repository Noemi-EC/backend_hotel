import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Company } from './entity/company.entity';
import { Hotel } from '../hotel/entity/hotel.entity';
import { User } from '../user/entity/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterCompanyDto) {
    const existing = await this.companyRepository.findOne({
      where: { ruc: dto.ruc },
    });
    if (existing) throw new ConflictException('El RUC ya está registrado');

    return this.dataSource.transaction(async (manager) => {
      try {
        const company = manager.create(Company, {
          name: dto.companyName,
          ruc: dto.ruc,
          address: dto.companyAddress,
          phone: dto.companyPhone,
          email: dto.companyEmail,
        });
        const savedCompany = await manager.save(company);

        const hotel = manager.create(Hotel, {
          companyId: savedCompany.id,
          name: dto.hotelName,
          address: dto.hotelAddress,
          phone: dto.hotelPhone,
          email: dto.hotelEmail,
        });
        const savedHotel = await manager.save(hotel);

        const hashedPassword = await hash(dto.adminPassword, 10);
        const admin = manager.create(User, {
          username: dto.adminUsername,
          password: hashedPassword,
          role: 'ADMIN',
          companyId: savedCompany.id,
          hotelId: savedHotel.id,
        });
        const savedAdmin = await manager.save(admin);

        return {
          message: 'Empresa y hotel registrados exitosamente',
          company: savedCompany,
          hotel: savedHotel,
          admin: {
            id: savedAdmin.id,
            username: savedAdmin.username,
            role: savedAdmin.role,
          },
        };
      } catch (error) {
        console.error('Error en transacción de registro:', error);
        throw error;
      }
    });
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    if (dto.ruc) {
      const existing = await this.companyRepository.findOne({
        where: { ruc: dto.ruc },
      });
      if (existing) throw new ConflictException('El RUC ya está registrado');
    }
    const company = this.companyRepository.create(dto);
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Empresa no encontrada');
    return company;
  }

  async update(id: number, dto: Partial<CreateCompanyDto>): Promise<Company> {
    await this.findOne(id);
    await this.companyRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.companyRepository.delete(id);
    return { message: 'Empresa eliminada correctamente' };
  }
}
