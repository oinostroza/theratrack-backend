import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet', description: 'Creates a new pet with the provided information' })
  @ApiBody({ type: CreatePetDto })
  @ApiResponse({ status: 201, description: 'Pet created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pets', description: 'Retrieves all pets. Optionally filter by ownerId' })
  @ApiQuery({ name: 'ownerId', required: false, type: String, description: 'Filter pets by owner ID' })
  @ApiResponse({ status: 200, description: 'List of pets retrieved successfully' })
  findAll(@Query('ownerId') ownerId?: string) {
    if (ownerId) {
      return this.petsService.findByOwnerId(parseInt(ownerId));
    }
    return this.petsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pet by ID', description: 'Retrieves a specific pet by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Pet UUID' })
  @ApiResponse({ status: 200, description: 'Pet retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pet', description: 'Updates an existing pet' })
  @ApiParam({ name: 'id', type: String, description: 'Pet UUID' })
  @ApiBody({ type: UpdatePetDto })
  @ApiResponse({ status: 200, description: 'Pet updated successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pet', description: 'Deletes a pet by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Pet UUID' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}

