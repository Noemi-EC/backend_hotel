import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Hotel } from '../hotel/entity/hotel.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { UserFactory } from '../../factory/user.factory';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existing) throw new ConflictException('El usuario ya existe');

    const userData = await UserFactory.create(createUserDto);
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateLoginAttempts(
    id: number,
    attempts: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    await this.userRepository.update(id, {
      loginAttempts: attempts,
      lockedUntil: lockedUntil ?? undefined,
    });
  }

  async resetLoginAttempts(id: number): Promise<void> {
    await this.userRepository.update(id, {
      loginAttempts: 0,
      lockedUntil: undefined,
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // ── Gestión de administradores de hotel (para COMPANY_ADMIN / SUPERUSER) ──

  // Valida que un hotel pertenezca a la empresa indicada (cuando companyId está definido).
  private async assertHotelInCompany(hotelId: number, companyId?: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id: hotelId } });
    if (!hotel) throw new NotFoundException('Hotel no encontrado');
    if (companyId && hotel.companyId !== companyId) {
      throw new ForbiddenException('El hotel no pertenece a su empresa');
    }
    return hotel;
  }

  // Carga un usuario ADMIN y valida que pertenezca a la empresa (cuando companyId está definido).
  private async loadAdminInCompany(id: number, companyId?: number): Promise<User> {
    const admin = await this.userRepository.findOne({ where: { id } });
    if (!admin || admin.role !== 'ADMIN') throw new NotFoundException('Administrador no encontrado');
    if (companyId && admin.companyId !== companyId) {
      throw new ForbiddenException('El administrador no pertenece a su empresa');
    }
    return admin;
  }

  async findAdminsByCompany(companyId: number): Promise<User[]> {
    const admins = await this.userRepository.find({
      where: { role: 'ADMIN', companyId },
      relations: ['hotel'],
    });
    return admins.map((a) => this.sanitize(a));
  }

  async createAdmin(dto: CreateAdminDto, companyId?: number): Promise<User> {
    await this.assertHotelInCompany(dto.hotelId, companyId);

    const existing = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('El usuario ya existe');

    const hotel = await this.hotelRepository.findOne({ where: { id: dto.hotelId } });
    const userData = await UserFactory.create({
      username: dto.username,
      password: dto.password,
      role: 'ADMIN',
      companyId: hotel?.companyId,
      hotelId: dto.hotelId,
    });
    const admin = this.userRepository.create(userData);
    const saved = await this.userRepository.save(admin);
    return this.sanitize(saved);
  }

  async updateAdmin(id: number, dto: UpdateAdminDto, companyId?: number): Promise<User> {
    const admin = await this.loadAdminInCompany(id, companyId);

    if (dto.username && dto.username !== admin.username) {
      const existing = await this.userRepository.findOne({ where: { username: dto.username } });
      if (existing) throw new ConflictException('El usuario ya existe');
      admin.username = dto.username;
    }
    if (dto.password) {
      admin.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.hotelId && dto.hotelId !== admin.hotelId) {
      await this.assertHotelInCompany(dto.hotelId, companyId);
      admin.hotelId = dto.hotelId;
    }

    const saved = await this.userRepository.save(admin);
    return this.sanitize(saved);
  }

  async setAdminActive(id: number, active: boolean, companyId?: number): Promise<User> {
    const admin = await this.loadAdminInCompany(id, companyId);
    admin.active = active;
    const saved = await this.userRepository.save(admin);
    return this.sanitize(saved);
  }

  async removeAdmin(id: number, companyId?: number): Promise<{ message: string }> {
    await this.loadAdminInCompany(id, companyId);
    await this.userRepository.delete(id);
    return { message: 'Administrador eliminado correctamente' };
  }

  private sanitize(user: User): User {
    const { password: _pw, loginAttempts: _la, lockedUntil: _lu, ...rest } = user;
    return rest as User;
  }
}
