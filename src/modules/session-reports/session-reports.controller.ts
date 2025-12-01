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
import { SessionReportsService } from './session-reports.service';
import { CreateSessionReportDto } from './dto/create-session-report.dto';
import { UpdateSessionReportDto } from './dto/update-session-report.dto';

@ApiTags('session-reports')
@Controller('session-reports')
export class SessionReportsController {
  constructor(private readonly sessionReportsService: SessionReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session report', description: 'Creates a new session report for a care session' })
  @ApiBody({ type: CreateSessionReportDto })
  @ApiResponse({ status: 201, description: 'Session report created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  create(@Body() createSessionReportDto: CreateSessionReportDto) {
    return this.sessionReportsService.create(createSessionReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all session reports', description: 'Retrieves all session reports. Optionally filter by careSessionId or petId' })
  @ApiQuery({ name: 'careSessionId', required: false, type: String, description: 'Filter reports by care session ID' })
  @ApiQuery({ name: 'petId', required: false, type: String, description: 'Filter reports by pet ID' })
  @ApiResponse({ status: 200, description: 'List of session reports retrieved successfully' })
  findAll(@Query('careSessionId') careSessionId?: string, @Query('petId') petId?: string) {
    if (careSessionId) {
      return this.sessionReportsService.findByCareSessionId(careSessionId);
    }
    if (petId) {
      return this.sessionReportsService.findByPetId(petId);
    }
    return this.sessionReportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session report by ID', description: 'Retrieves a specific session report by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Session report UUID' })
  @ApiResponse({ status: 200, description: 'Session report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session report not found' })
  findOne(@Param('id') id: string) {
    return this.sessionReportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session report', description: 'Updates an existing session report' })
  @ApiParam({ name: 'id', type: String, description: 'Session report UUID' })
  @ApiBody({ type: UpdateSessionReportDto })
  @ApiResponse({ status: 200, description: 'Session report updated successfully' })
  @ApiResponse({ status: 404, description: 'Session report not found' })
  update(@Param('id') id: string, @Body() updateSessionReportDto: UpdateSessionReportDto) {
    return this.sessionReportsService.update(id, updateSessionReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session report', description: 'Deletes a session report by its ID' })
  @ApiParam({ name: 'id', type: String, description: 'Session report UUID' })
  @ApiResponse({ status: 200, description: 'Session report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session report not found' })
  remove(@Param('id') id: string) {
    return this.sessionReportsService.remove(id);
  }
}

