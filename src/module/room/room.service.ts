import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entity/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomRepository.findOne({
      where: { code: createRoomDto.code, hotelId: createRoomDto.hotelId },
    });
    if (existing) {
      throw new ConflictException('La habitación ya existe con el mismo código en este hotel');
    }

    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find({ relations: ['hotel'] });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    await this.roomRepository.update(id, updateRoomDto);
    return this.roomRepository.findOne({ where: { id } }) as Promise<Room>;
  }

  async remove(id: number): Promise<{ message: string }> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    await this.roomRepository.delete(id);
    return { message: 'Habitación eliminada correctamente' };
  }
}
