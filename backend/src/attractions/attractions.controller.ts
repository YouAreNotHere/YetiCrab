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
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Папка для сохранения файлов
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new Error('Invalid file type'), false);
        }
        callback(null, true);
      },
    })
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('AttractionsController: Starting request processing...');
    console.log('Uploaded file:', file);
  
    try {
      const { name, description, location, latitude, longitude, photoUrl } = body;
  
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
    console.log("delete")
    console.log(id);
    await this.attractionsService.remove(id);
  }
}