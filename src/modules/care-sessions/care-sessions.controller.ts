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
import { CareSessionsService } from './care-sessions.service';
import { CreateCareSessionDto } from './dto/create-care-session.dto';
import { UpdateCareSessionDto } from './dto/update-care-session.dto';

@Controller('care-sessions')
export class CareSessionsController {
  constructor(private readonly careSessionsService: CareSessionsService) {}

  @Post()
  create(@Body() createCareSessionDto: CreateCareSessionDto) {
    return this.careSessionsService.create(createCareSessionDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.careSessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCareSessionDto: UpdateCareSessionDto) {
    return this.careSessionsService.update(id, updateCareSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careSessionsService.remove(id);
  }
}

