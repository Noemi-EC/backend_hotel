import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS ANTES del prefijo global
  app.enableCors({
    origin: [
      'http://192.168.18.11:3000',
      'http://192.168.18.11:8080',
      'http://192.168.1.44:8080',
      //Colocar o añadir la IP de tu maquina 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
