import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import { CreateAttractionDto } from './create-attraction.dto';
import { Attraction } from './attraction.interface';

@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

  @Get()
  findAll(): Attraction[] {
    return this.attractionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Attraction | undefined {
    return this.attractionsService.findOne(id);
  }

  @Post()
  create(@Body() createAttractionDto: CreateAttractionDto): Attraction {
    return this.attractionsService.create(createAttractionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttractionDto: Partial<CreateAttractionDto>,
  ): Attraction | undefined {
    return this.attractionsService.update(id, updateAttractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.attractionsService.remove(id);
  }
}
