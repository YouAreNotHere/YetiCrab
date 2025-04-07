import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
const { AppDataSource } = require('../ormconfig.cjs'); 
// import { seedAttractions} from './attractions/attractions.seed'
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Attractions API')
    .setDescription('API for managing attractions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
  });

  try {

    if (!AppDataSource?.isInitialized) {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
    }
    
    // Запуск сидинга
    // await seedAttractions();

  } catch (err) {
    console.error('Error during Data Source initialization or seeding:', err);
  }
}
bootstrap();
