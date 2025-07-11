import { UserFactory } from '../../factory/user.factory';
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (existingUser) throw new ConflictException('El usuario ya existe');

    const userData = await UserFactory.create(createUserDto);
const createdUser = new this.userModel(userData);

    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
