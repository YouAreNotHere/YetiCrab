import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan'; // Импортируем morgan для логирования HTTP-запросов

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальное логирование HTTP-запросов
  app.use(morgan('dev'));

  // // Включение глобальной валидации
  app.useGlobalPipes(new ValidationPipe());

  // Настройка CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Поддержка cookies и авторизации
  });

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Attractions API')
    .setDescription('API for managing attractions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Запуск сервера
  await app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
  });
}
bootstrap();