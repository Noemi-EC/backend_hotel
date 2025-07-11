import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schema/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existingRoom = await this.roomModel.findOne({
      code: createRoomDto.code,
      category: createRoomDto.category,
    });

    if (existingRoom) {
      throw new ConflictException(
        'La habitación ya existe con el mismo código y categoría',
      );
    }

    const newRoom = new this.roomModel({
      ...createRoomDto,
      status: createRoomDto.status ?? true,
    });

    return newRoom.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      id,
      updateRoomDto,
      { new: true, runValidators: true },
    );

    if (!updatedRoom) {
      throw new NotFoundException('Habitación no encontrada');
    }

    return updatedRoom;
  }
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.roomModel.findByIdAndDelete(id);
    if (!deleted) {
    throw new NotFoundException('Habitación no encontrada');
    }
    return { message: 'Habitación eliminada correctamente' };
  }
}
