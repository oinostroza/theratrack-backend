import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { PatientsModule } from '../patients/patients.module';
import { SessionsModule } from '../sessions/sessions.module';
import { TranscriptionsModule } from '../transcriptions/transcriptions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PatientsModule,
    SessionsModule,
    TranscriptionsModule,
    UsersModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

