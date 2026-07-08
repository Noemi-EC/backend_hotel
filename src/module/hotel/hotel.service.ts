import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Hotel } from './entity/hotel.entity';
import { User } from '../user/entity/user.entity';
import { UserFactory } from '../../factory/user.factory';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateHotelDto): Promise<Hotel | { hotel: Hotel; admin: { id: number; username: string; role: string } }> {
    const {
      username,
      password,
      adminUsername,
      adminPassword,
      ...hotelData
    } = dto as CreateHotelDto & {
      username?: string;
      password?: string;
      adminUsername?: string;
      adminPassword?: string;
    };

    return this.dataSource.transaction(async (manager) => {
      const hotel = await manager.save(Hotel, hotelData);
      const newAdminUsername = username || adminUsername;
      const newAdminPassword = password || adminPassword;

      if (newAdminUsername || newAdminPassword) {
        if (!newAdminUsername || !newAdminPassword) {
          throw new ConflictException('Debe proporcionar usuario y contraseña de administrador');
        }

        const existingUser = await manager.findOne(User, { where: { username: newAdminUsername } });
        if (existingUser) {
          throw new ConflictException('El usuario admin ya existe');
        }

        const userData = await UserFactory.create({
          username: newAdminUsername,
          password: newAdminPassword,
          role: 'ADMIN',
          companyId: hotel.companyId,
          hotelId: hotel.id,
        });

        const admin = await manager.save(User, userData);
        return { hotel, admin: { id: admin.id, username: admin.username, role: admin.role } };
      }

      return hotel;
    });
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find({ relations: ['company'] });
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id }, relations: ['company'] });
    if (!hotel) throw new NotFoundException('Hotel no encontrado');
    return hotel;
  }

  async findByCompany(companyId: number, activeOnly = false): Promise<Hotel[]> {
    const where = activeOnly ? { companyId, active: true } : { companyId };
    return this.hotelRepository.find({ where, relations: ['company'] });
  }

  async update(id: number, dto: Partial<CreateHotelDto>): Promise<Hotel> {
    await this.findOne(id);
    // Solo persistimos los campos propios del hotel (evita que lleguen datos de admin al update)
    const { name, address, phone, email, companyId } = dto;
    await this.hotelRepository.update(id, { name, address, phone, email, companyId });
    return this.findOne(id);
  }

  async setActive(id: number, active: boolean): Promise<Hotel> {
    await this.findOne(id);
    await this.hotelRepository.update(id, { active });
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.hotelRepository.delete(id);
    return { message: 'Hotel eliminado correctamente' };
  }
}
