import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entity/room.entity';
import { Book } from '../book/entity/book.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomRepository.findOne({
      where: { code: createRoomDto.code, hotelId: createRoomDto.hotelId },
    });
    if (existing) {
      throw new ConflictException(
        'La habitación ya existe con el mismo código en este hotel',
      );
    }
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async findAll(hotelId?: number, companyId?: number): Promise<Room[]> {
    if (!hotelId && !companyId) {
      return this.roomRepository.find({ relations: ['hotel'] });
    }

    if (companyId) {
      return this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.hotel', 'hotel')
        .where('hotel.companyId = :companyId', { companyId })
        .getMany();
    }

    return this.roomRepository.find({
      where: { hotelId },
      relations: ['hotel'],
    });
  }

  async getAvailableRooms(
    hotelId: number,
    checkIn: Date,
    checkOut: Date,
    filters?: { category?: string; minCapacity?: number; maxPrice?: number },
  ): Promise<Room[]> {
    const overlapping = await this.bookRepository
      .createQueryBuilder('book')
      .innerJoin('book.room', 'room')
      .where('room.hotelId = :hotelId', { hotelId })
      .andWhere('book.status IN (:...statuses)', {
        statuses: ['pending', 'booked'],
      })
      .andWhere('book.checkInDate < :checkOut', { checkOut })
      .andWhere('book.checkOutDate > :checkIn', { checkIn })
      .select('book.roomId')
      .getMany();

    const occupiedIds = overlapping.map((b) => b.roomId);

    const query = this.roomRepository
      .createQueryBuilder('room')
      .where('room.hotelId = :hotelId', { hotelId })
      .andWhere('room.status = :status', { status: 'disponible' });

    if (occupiedIds.length > 0) {
      query.andWhere('room.id NOT IN (:...occupiedIds)', { occupiedIds });
    }

    if (filters?.category) {
      query.andWhere('room.category = :category', {
        category: filters.category,
      });
    }
    if (filters?.minCapacity) {
      query.andWhere('room.capacity >= :minCapacity', {
        minCapacity: filters.minCapacity,
      });
    }
    if (filters?.maxPrice) {
      query.andWhere('room.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return query.getMany();
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
