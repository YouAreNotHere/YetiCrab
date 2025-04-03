import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractionsModule } from './attractions/attractions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Response } from 'express'; // Импортируем тип Response

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res: Response, path: string) => {
          if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
          } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
          }
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: configService.get<number>('DB_PORT'),
        username: 'YouAreNotHere',
        password: '123456',
        database: 'world',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AttractionsModule,
  ],
})
export class AppModule {}