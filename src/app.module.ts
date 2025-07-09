import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { BookModule } from './module/book/book.module';
import { CustomerModule } from './module/customer/customer.module';
import { RoomModule } from './module/room/room.module';
import { getMongooseInstance } from './mongoose-singleton.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.prod.env',
    }),
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const uri: string = configService.get('MONGODB_URI') as string;
    const options = { dbName: 'hotel' };
    await getMongooseInstance(uri, options);
    return {
      uri,
      ...options,
    };
  },
}),
    AuthModule,
    UserModule,
    BookModule,
    CustomerModule,
    RoomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
