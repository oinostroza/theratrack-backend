import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranscriptionsService } from './transcriptions.service';
import { TranscriptionsController } from './transcriptions.controller';
import { Transcription } from '../../entities/transcription.entity';
import { Session } from '../../entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transcription, Session])],
  controllers: [TranscriptionsController],
  providers: [TranscriptionsService],
  exports: [TranscriptionsService],
})
export class TranscriptionsModule {} 