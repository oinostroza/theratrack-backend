import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionsController } from './emotions.controller';
import { EmotionsService } from './emotions.service';
import { EmotionLog } from '../../entities';
import { QueueModule } from '../queue/queue.module';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmotionLog]),
    QueueModule,
    AiAnalysisModule,
  ],
  controllers: [EmotionsController],
  providers: [EmotionsService],
  exports: [EmotionsService],
})
export class EmotionsModule {}
