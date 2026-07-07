import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressInstance = app.getHttpAdapter().getInstance() as {
    disable?: (header: string) => void;
  };
  if (typeof expressInstance.disable === 'function') {
    expressInstance.disable('x-powered-by');
  }

  // Configurar CORS ANTES del prefijo global
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin)
    : ['http://localhost:8080', 'http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
    const isProd = process.env.NODE_ENV === 'production';
    const styleDirective = isProd
      ? "style-src 'self'"
      : "style-src 'self' 'unsafe-inline'";
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self'; ${styleDirective}; img-src 'self' data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'`,
    );
    res.setHeader('X-Powered-By', '');
    res.removeHeader('Server');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');

  // --- 2. CONFIGURACIÓN DE SWAGGER AQUÍ ---
  const config = new DocumentBuilder()
    .setTitle('API Hotel Backend')
    .setDescription(
      'Especificación de endpoints para la auditoría con OWASP ZAP',
    )
    .setVersion('1.0')
    .addBearerAuth() // Actívalo si usas JWT Tokens en tus cabeceras
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Esto creará la UI en /docs y el JSON para ZAP en /docs-json
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
