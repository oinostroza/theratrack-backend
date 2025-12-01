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
import { SessionReportsService } from './session-reports.service';
import { CreateSessionReportDto } from './dto/create-session-report.dto';
import { UpdateSessionReportDto } from './dto/update-session-report.dto';

@Controller('session-reports')
export class SessionReportsController {
  constructor(private readonly sessionReportsService: SessionReportsService) {}

  @Post()
  create(@Body() createSessionReportDto: CreateSessionReportDto) {
    return this.sessionReportsService.create(createSessionReportDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.sessionReportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionReportDto: UpdateSessionReportDto) {
    return this.sessionReportsService.update(id, updateSessionReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionReportsService.remove(id);
  }
}

