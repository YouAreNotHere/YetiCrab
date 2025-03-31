import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractionsModule } from './attractions/attractions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadMiddleware } from './file-upload.middleware'; // Импортируем мидлвар

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Папка для статических файлов
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true, 
      }),
      inject: [ConfigService],
    }),
    AttractionsModule,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   console.log("app mod!")
  //   consumer
  //     .apply(FileUploadMiddleware) // Применяем мидлвар
  //     .forRoutes({ path: 'attractions', method: RequestMethod.POST }); // Только для POST /attractions
  //   console.log("app mod2!")
  // }
}