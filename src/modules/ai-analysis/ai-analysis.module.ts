import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysisController } from './ai-analysis.controller';
import { AiAnalysisService } from './ai-analysis.service';
import { EmotionAnalysis } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([EmotionAnalysis])],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService],
  exports: [AiAnalysisService],
})
export class AiAnalysisModule {}
