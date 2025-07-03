import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dni: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export type CustomerDocument = HydratedDocument<Customer>;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
