import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TranscriptionsService } from './transcriptions.service';
import { CreateTranscriptionDto } from './dto/create-transcription.dto';
import { UpdateTranscriptionDto } from './dto/update-transcription.dto';

@Controller('transcriptions')
export class TranscriptionsController {
  constructor(private readonly transcriptionsService: TranscriptionsService) {}

  @Post()
  create(@Body() createTranscriptionDto: CreateTranscriptionDto) {
    return this.transcriptionsService.create(createTranscriptionDto);
  }

  @Get()
  findAll() {
    return this.transcriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transcriptionsService.findOne(id);
  }

  @Get('session/:sessionId')
  findBySessionId(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.transcriptionsService.findBySessionId(sessionId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTranscriptionDto: UpdateTranscriptionDto,
  ) {
    return this.transcriptionsService.update(id, updateTranscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transcriptionsService.remove(id);
  }
} 