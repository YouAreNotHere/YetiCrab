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
    return await this.attractionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.attractionsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('location') location: string,
    @Body('latitude') latitude: string,
    @Body('longitude') longitude: string,
    @Body('photoUrl') photoUrl: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('AttractionsController: Starting request processing...');

    try {
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
      console.log('AttractionsController: Request completed successfully');
      return result;
    } catch (error) {
      console.error('AttractionsController: Error occurred:', error);
      throw error;
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
    await this.attractionsService.remove(id);
  }
}