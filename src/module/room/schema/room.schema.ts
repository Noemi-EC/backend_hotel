import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomCategory = 'suite' | 'duplex' | 'standard' | 'deluxe';
export type RoomStatus = 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento';

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  status: RoomStatus;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: RoomCategory;
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
