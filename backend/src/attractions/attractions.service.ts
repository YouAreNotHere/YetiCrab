import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Attraction } from './attraction.interface';
import { CreateAttractionDto } from './create-attraction.dto';

@Injectable()
export class AttractionsService {
  private attractions: Attraction[] = [];

  findAll(): Attraction[] {
    return this.attractions;
  }

  findOne(id: string): Attraction | undefined {
    return this.attractions.find((attraction) => attraction.id === id);
  }

  create(createAttractionDto: CreateAttractionDto): Attraction {
    const attraction: Attraction = {
      id: uuidv4(),
      name: createAttractionDto.name,
      description: createAttractionDto.description,
      addedAt: new Date(),
      rating: createAttractionDto.rating,
      photoUrl: createAttractionDto.photoUrl,
      location: createAttractionDto.location,
      coordinates: createAttractionDto.coordinates,
      mapLink: `https://www.google.com/maps?q=${createAttractionDto.coordinates.latitude},${createAttractionDto.coordinates.longitude}`,
      isVisites: false,
    };
    this.attractions.push(attraction);
    return attraction;
  }

  update(
    id: string,
    updateAttractionDto: Partial<CreateAttractionDto>,
  ): Attraction | undefined {
    const attraction = this.findOne(id);
    if (attraction) {
      Object.assign(attraction, updateAttractionDto);
    }
    return attraction;
  }

  remove(id: string): void {
    this.attractions = this.attractions.filter((attraction) => attraction.id !== id);
  }
}
