import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Book } from '../../book/schema/book.schema';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: Book.name, required: true })
  bookId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  cardLastDigits: string;

  @Prop({ required: true, enum: ['completed', 'refunded'], default: 'completed' })
  status: string;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);