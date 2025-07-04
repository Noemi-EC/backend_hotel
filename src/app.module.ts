import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { BookController } from './module/book/book.controller';
import { BookService } from './module/book/book.service';
import { BookModule } from './module/book/book.module';
import { CustomerModule } from './module/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.prod.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        return {
          uri,
          dbName: 'hotel',
        };
      },
    }),
    AuthModule,
    UserModule,
    BookModule,
    CustomerModule,
  ],
})
export class AppModule {}
