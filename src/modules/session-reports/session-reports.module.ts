import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionReportsController } from './session-reports.controller';
import { SessionReportsService } from './session-reports.service';
import { SessionReport } from '../../entities/session-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionReport])],
  controllers: [SessionReportsController],
  providers: [SessionReportsService],
  exports: [SessionReportsService],
})
export class SessionReportsModule {}

