import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as crypto from 'crypto';

// Polyfill for crypto.randomUUID() in older Node.js versions
if (!global.crypto) {
  (global as any).crypto = crypto.webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TheraTrack API')
    .setDescription('API documentation for TheraTrack - Therapy session management system and PetTrack - Pet care management system')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('patients', 'Patient management')
    .addTag('sessions', 'Session management')
    .addTag('transcriptions', 'Transcription management')
    .addTag('seed', 'Database seeding endpoints')
    .addTag('pets', 'Pet management endpoints')
    .addTag('care-sessions', 'Care session management endpoints')
    .addTag('session-reports', 'Session report management endpoints')
    .addTag('locations', 'Location management endpoints')
    .addTag('photos', 'Photo management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
