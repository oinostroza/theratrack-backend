import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareSessionsController } from './care-sessions.controller';
import { CareSessionsService } from './care-sessions.service';
import { CareSession } from '../../entities/care-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareSession])],
  controllers: [CareSessionsController],
  providers: [CareSessionsService],
  exports: [CareSessionsService],
})
export class CareSessionsModule {}

