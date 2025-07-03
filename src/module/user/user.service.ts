import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role ?? 'CUSTOMER',
    });
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
