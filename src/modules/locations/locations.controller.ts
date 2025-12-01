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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location', description: 'Creates a new location (home, vet, park, etc.)' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations', description: 'Retrieves all locations. Optionally filter by ownerId or petId' })
  @ApiQuery({ name: 'ownerId', required: false, type: String, description: 'Filter locations by owner ID' })
  @ApiQuery({ name: 'petId', required: false, type: String, description: 'Filter locations by pet ID' })
  @ApiResponse({ status: 200, description: 'List of locations retrieved successfully' })
  findAll(@Query('ownerId') ownerId?: string, @Query('petId') petId?: string) {
    if (ownerId) {
      return this.locationsService.findByOwnerId(parseInt(ownerId));
    }
    if (petId) {
      return this.locationsService.findByPetId(petId);
    }
    return this.locationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID', description: 'Retrieves a specific location by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update location', description: 'Updates an existing location' })
  @ApiParam({ name: 'id', type: String, description: 'Location UUID' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location', description: 'Deletes a location by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Location UUID' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}

