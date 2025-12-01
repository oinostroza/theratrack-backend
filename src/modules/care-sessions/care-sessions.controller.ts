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
import { CareSessionsService } from './care-sessions.service';
import { CreateCareSessionDto } from './dto/create-care-session.dto';
import { UpdateCareSessionDto } from './dto/update-care-session.dto';

@ApiTags('care-sessions')
@Controller('care-sessions')
export class CareSessionsController {
  constructor(private readonly careSessionsService: CareSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new care session', description: 'Creates a new care session for a pet' })
  @ApiBody({ type: CreateCareSessionDto })
  @ApiResponse({ status: 201, description: 'Care session created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  create(@Body() createCareSessionDto: CreateCareSessionDto) {
    return this.careSessionsService.create(createCareSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all care sessions', description: 'Retrieves all care sessions. Optionally filter by petId or sitterId' })
  @ApiQuery({ name: 'petId', required: false, type: String, description: 'Filter sessions by pet ID' })
  @ApiQuery({ name: 'sitterId', required: false, type: String, description: 'Filter sessions by sitter ID' })
  @ApiResponse({ status: 200, description: 'List of care sessions retrieved successfully' })
  findAll(@Query('petId') petId?: string, @Query('sitterId') sitterId?: string) {
    if (petId) {
      return this.careSessionsService.findByPetId(petId);
    }
    if (sitterId) {
      return this.careSessionsService.findBySitterId(parseInt(sitterId));
    }
    return this.careSessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get care session by ID', description: 'Retrieves a specific care session by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Care session UUID' })
  @ApiResponse({ status: 200, description: 'Care session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Care session not found' })
  findOne(@Param('id') id: string) {
    return this.careSessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update care session', description: 'Updates an existing care session' })
  @ApiParam({ name: 'id', type: String, description: 'Care session UUID' })
  @ApiBody({ type: UpdateCareSessionDto })
  @ApiResponse({ status: 200, description: 'Care session updated successfully' })
  @ApiResponse({ status: 404, description: 'Care session not found' })
  update(@Param('id') id: string, @Body() updateCareSessionDto: UpdateCareSessionDto) {
    return this.careSessionsService.update(id, updateCareSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete care session', description: 'Deletes a care session by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Care session UUID' })
  @ApiResponse({ status: 200, description: 'Care session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Care session not found' })
  remove(@Param('id') id: string) {
    return this.careSessionsService.remove(id);
  }
}

