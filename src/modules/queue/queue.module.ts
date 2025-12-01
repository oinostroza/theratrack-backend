import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { EmotionAnalysis } from '../../entities';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmotionAnalysis]), AiAnalysisModule],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
