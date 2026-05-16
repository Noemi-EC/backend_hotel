import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entity/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async create(dto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(dto);
    return this.hotelRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find({ relations: ['company'] });
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id }, relations: ['company'] });
    if (!hotel) throw new NotFoundException('Hotel no encontrado');
    return hotel;
  }

  async findByCompany(companyId: number): Promise<Hotel[]> {
    return this.hotelRepository.find({ where: { companyId }, relations: ['company'] });
  }

  async update(id: number, dto: Partial<CreateHotelDto>): Promise<Hotel> {
    await this.findOne(id);
    await this.hotelRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.hotelRepository.delete(id);
    return { message: 'Hotel eliminado correctamente' };
  }
}
