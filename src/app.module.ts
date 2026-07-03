import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { BookModule } from './module/book/book.module';
import { CustomerModule } from './module/customer/customer.module';
import { RoomModule } from './module/room/room.module';
import { PaymentModule } from './module/payment/payment.module';
import { DashboardModule } from './module/dashboard/dashboard.module';
import { CompanyModule } from './module/company/company.module';
import { HotelModule } from './module/hotel/hotel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.prod.env' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    UserModule,
    BookModule,
    CustomerModule,
    RoomModule,
    PaymentModule,
    DashboardModule,
    CompanyModule,
    HotelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
