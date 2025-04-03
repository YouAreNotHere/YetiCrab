import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class AttractionsService {
  constructor(
    @InjectRepository(Attraction)
    private readonly attractionsRepository: Repository<Attraction>,
  ) {}

  async findAll(): Promise<Attraction[]> {
    return this.attractionsRepository.find();
  }

  async findOne(id: string): Promise<Attraction | null> {
    return this.attractionsRepository.findOneBy({ id });
  }

  async create(createAttractionDto: CreateAttractionDto): Promise<Attraction> {
    console.log('AttractionsService: Starting to create attraction...'); // Логирование начала

    try {
      console.log('AttractionsService: DTO received:', createAttractionDto);

      const attraction = this.attractionsRepository.create({
        ...createAttractionDto,
        mapLink: `https://www.google.com/maps?q=${createAttractionDto.latitude},${createAttractionDto.longitude}`,
        isVisited: false,
        addedAt: new Date(),
        rating: [],
      });

      const savedAttraction = await this.attractionsRepository.save(attraction);
      console.log('AttractionsService: Attraction created and saved:', savedAttraction); // Логирование завершения
      return savedAttraction;
    } catch (error) {
      console.error('AttractionsService: Error occurred:', error); // Логирование ошибок
      throw error; // Передаём ошибку дальше
    }
  }

  async update(id: string, updateAttractionDto: Partial<CreateAttractionDto>): Promise<Attraction | null> {
    await this.attractionsRepository.update(id, updateAttractionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const attraction = await this.attractionsRepository.findOneBy({ id });

    if (!attraction) {
      throw new Error('Достопримечательность не найдена');
    }
    if (attraction.photoUrl && !attraction.photoUrl.startsWith('http')) {
      try {
        const fileName = path.basename(attraction.photoUrl); // Извлекаем имя файла
        const uploadsDir = path.join(process.cwd(), 'uploads'); // Путь к папке uploads
        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.log('Файл не найден');
        }
      } catch (error) {
        console.error('Ошибка при удалении файла:', error);
      }
    }
    await this.attractionsRepository.delete(id);
  }
}