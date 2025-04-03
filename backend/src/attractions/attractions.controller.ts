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
  BadRequestException,
} from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// DTO для создания достопримечательности
interface CreateAttractionDto {
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

// DTO для обновления достопримечательности
interface UpdateAttractionDto {
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  rating?: number[];
  mapLink?: string;
  isVisited?: boolean;
}

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
          destination: './uploads',
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
      @Body() body: CreateAttractionDto,
      @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const { name, description, location, latitude, longitude, photoUrl } = body;
      const createAttractionDto: CreateAttractionDto = {
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
      const result = await this.attractionsService.create(createAttractionDto);
      return result;
    } catch (error) {
      console.error('AttractionsController: Error occurred:', error);
      throw error;
    }
  }

  @Put(':id')
  @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
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
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAttractionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('Updating attraction with ID:', id);
    console.log('Update data:', body);

    let rating: number[] = [];
    if (body.rating) {
      try {
        rating = JSON.parse(body.rating as string);
      } catch (error) {
        console.error('Failed to parse rating:', error);
        throw new BadRequestException('Invalid rating format');
      }
    }

    const latitude = body.latitude ? parseFloat(body.latitude.toString()) : undefined;
    const longitude = body.longitude ? parseFloat(body.longitude.toString()) : undefined;
    const isVisited = body.isVisited !== undefined ? Boolean(body.isVisited) : undefined;

    if (latitude !== undefined && isNaN(latitude)) {
      throw new BadRequestException('Invalid latitude value');
    }
    if (longitude !== undefined && isNaN(longitude)) {
      throw new BadRequestException('Invalid longitude value');
    }

    const updateAttractionDto: UpdateAttractionDto = {
      name: body.name,
      description: body.description,
      location: body.location,
      latitude,
      longitude,
      photoUrl: body.photoUrl || undefined,
      rating,
      mapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      isVisited,
    };

    if (file) {
      updateAttractionDto.photoUrl = `/uploads/${file.filename}`;
    }

    if (!updateAttractionDto || Object.keys(updateAttractionDto).length === 0) {
      throw new BadRequestException('Update data is missing or empty');
    }

    await this.attractionsService.update(id, updateAttractionDto);
    return this.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.attractionsService.remove(id);
  }
}