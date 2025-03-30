import { IsString, IsNumber, IsObject } from 'class-validator';

export class CreateAttractionDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  photoUrl?: string; 

  @IsString()
  location!: string;

  @IsString()
  latitude!: number;

  @IsString() 
  longitude!: number;
}