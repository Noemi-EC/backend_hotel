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

    const wantsHotelAdmin = !!(dto.hotelAdminUsername || dto.hotelAdminPassword);
    if (wantsHotelAdmin && !(dto.hotelAdminUsername && dto.hotelAdminPassword)) {
      throw new ConflictException('Debe proporcionar usuario y contraseña del administrador del hotel');
    }
    if (wantsHotelAdmin && dto.hotelAdminUsername === dto.adminUsername) {
      throw new ConflictException(
        'El usuario del administrador del hotel debe ser distinto al del administrador de la empresa',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      try {
        const existingCompanyAdmin = await manager.findOne(User, { where: { username: dto.adminUsername } });
        if (existingCompanyAdmin) throw new ConflictException('El usuario del administrador de la empresa ya existe');

        if (wantsHotelAdmin) {
          const existingHotelAdmin = await manager.findOne(User, { where: { username: dto.hotelAdminUsername } });
          if (existingHotelAdmin) throw new ConflictException('El usuario del administrador del hotel ya existe');
        }

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

        // Administrador de la empresa (COMPANY_ADMIN) — obligatorio, sin hotel asignado
        const hashedCompanyAdminPassword = String(await hash(dto.adminPassword, 10));
        const companyAdmin = manager.create(User, {
          username: dto.adminUsername,
          password: hashedCompanyAdminPassword,
          role: 'COMPANY_ADMIN',
          companyId: savedCompany.id,
        });
        const savedCompanyAdmin = await manager.save(companyAdmin);

        // Administrador del hotel (ADMIN) — opcional, credenciales independientes
        let savedHotelAdmin: User | null = null;
        if (wantsHotelAdmin) {
          const hashedHotelAdminPassword = String(await hash(dto.hotelAdminPassword as string, 10));
          const hotelAdmin = manager.create(User, {
            username: dto.hotelAdminUsername,
            password: hashedHotelAdminPassword,
            role: 'ADMIN',
            companyId: savedCompany.id,
            hotelId: savedHotel.id,
          });
          savedHotelAdmin = await manager.save(hotelAdmin);
        }

        return {
          message: 'Empresa y hotel registrados exitosamente',
          company: savedCompany,
          hotel: savedHotel,
          companyAdmin: {
            id: savedCompanyAdmin.id,
            username: savedCompanyAdmin.username,
            role: savedCompanyAdmin.role,
          },
          hotelAdmin: savedHotelAdmin
            ? {
                id: savedHotelAdmin.id,
                username: savedHotelAdmin.username,
                role: savedHotelAdmin.role,
              }
            : null,
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error en transacción de registro:', error.message);
          throw error;
        }

        console.error(
          'Error en transacción de registro:',
          'Error desconocido en la transacción',
        );
        throw new Error('Error desconocido en la transacción');
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
