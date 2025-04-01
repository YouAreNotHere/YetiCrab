import { IsString, IsNumber, IsObject } from 'class-validator';

export class CreateAttractionDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  photoUrl?: string | undefined; 

  @IsString()
  location!: string;

  @IsString()
  latitude!: number;

  @IsString() 
  longitude!: number;
}