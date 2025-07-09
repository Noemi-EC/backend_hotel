import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../module/user/dto/create-user.dto';
import { User } from '../module/user/schema/user.schema';

export class UserFactory {
  static async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return {
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role || 'CUSTOMER', // usa CUSTOMER por defecto si no se especifica
    };
  }
}
