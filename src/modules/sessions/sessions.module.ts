import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from '../../entities/session.entity';
import { Patient } from '../../entities/patient.entity';
import { Transcription } from '../../entities/transcription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Patient, Transcription])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
