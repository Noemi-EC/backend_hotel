import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Book {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  price?: number;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
