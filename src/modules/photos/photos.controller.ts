import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@ApiTags('photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new photo', description: 'Creates a new photo entry' })
  @ApiBody({ type: CreatePhotoDto })
  @ApiResponse({ status: 201, description: 'Photo created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all photos', description: 'Retrieves all photos. Optionally filter by petId, careSessionId or sessionReportId' })
  @ApiQuery({ name: 'petId', required: false, type: String, description: 'Filter photos by pet ID' })
  @ApiQuery({ name: 'careSessionId', required: false, type: String, description: 'Filter photos by care session ID' })
  @ApiQuery({ name: 'sessionReportId', required: false, type: String, description: 'Filter photos by session report ID' })
  @ApiResponse({ status: 200, description: 'List of photos retrieved successfully' })
  findAll(
    @Query('petId') petId?: string,
    @Query('careSessionId') careSessionId?: string,
    @Query('sessionReportId') sessionReportId?: string,
  ) {
    if (petId) {
      return this.photosService.findByPetId(petId);
    }
    if (careSessionId) {
      return this.photosService.findByCareSessionId(careSessionId);
    }
    if (sessionReportId) {
      return this.photosService.findBySessionReportId(sessionReportId);
    }
    return this.photosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get photo by ID', description: 'Retrieves a specific photo by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Photo UUID' })
  @ApiResponse({ status: 200, description: 'Photo retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update photo', description: 'Updates an existing photo' })
  @ApiParam({ name: 'id', type: String, description: 'Photo UUID' })
  @ApiBody({ type: UpdatePhotoDto })
  @ApiResponse({ status: 200, description: 'Photo updated successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete photo', description: 'Deletes a photo by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Photo UUID' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}

