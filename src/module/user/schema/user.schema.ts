import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'ADMIN' })
  role: string;
}

export type UserDocument = User & Document & { _id: Types.ObjectId };

export const UserSchema = SchemaFactory.createForClass(User);
