import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from './attraction.entity';
import { CreateAttractionDto } from './create-attraction.dto';

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
    const attraction = this.attractionsRepository.create({
      ...createAttractionDto,
      mapLink: `https://www.google.com/maps?q=${createAttractionDto.latitude},${createAttractionDto.longitude}`,
      isVisited: false,
      addedAt: new Date(),
    });
    return this.attractionsRepository.save(attraction);
  }

  async update(id: string, updateAttractionDto: Partial<CreateAttractionDto>): Promise<Attraction | null> {
    await this.attractionsRepository.update(id, updateAttractionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.attractionsRepository.delete(id);
  }
}