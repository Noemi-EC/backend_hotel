import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFactory } from '../../factory/user.factory';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
