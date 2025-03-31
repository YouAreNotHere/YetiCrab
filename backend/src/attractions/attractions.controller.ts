import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors, 
  UploadedFile,
} from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import { CreateAttractionDto } from './create-attraction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; 


@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

  @Get()
  async findAll() {
    console.log("get11122")
    return await this.attractionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.attractionsService.findOne(id);
  }

  @Post()
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('location') location: string,
    @Body('latitude') latitude: string,
    @Body('longitude') longitude: string,
    @Body('photoUrl') photoUrl: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('AttractionsController: Starting request processing...'); // Логирование начала

    try {
      console.log('AttractionsController: Received fields:', { name, description, location, latitude, longitude, photoUrl });
      console.log('AttractionsController: Uploaded file:', file);

      const createAttractionDto = {
        name,
        description,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        photoUrl: photoUrl || undefined,
      };

      if (file) {
        createAttractionDto.photoUrl = `/uploads/${file.filename}`;
      }

      console.log('AttractionsController: DTO created:', createAttractionDto);

      const result = await this.attractionsService.create(createAttractionDto);
      console.log('AttractionsController: Request completed successfully'); // Логирование завершения
      return result;
    } catch (error) {
      console.error('AttractionsController: Error occurred:', error); // Логирование ошибок
      throw error; // Передаём ошибку дальше
    }
  }


  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttractionDto: Partial<CreateAttractionDto>,
  ) {
    return await this.attractionsService.update(id, updateAttractionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.attractionsService.remove(id);
  }
}
