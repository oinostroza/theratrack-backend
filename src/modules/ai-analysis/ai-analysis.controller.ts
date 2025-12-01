import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@Controller('ai-analysis')
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async analyzeText(
    @Body() analyzeTextDto: AnalyzeTextDto,
  ): Promise<AnalysisResponseDto> {
    const analysis = await this.aiAnalysisService.analyzeEmotion(analyzeTextDto.text);
    
    // For now, return the analysis without saving to database to avoid foreign key issues
    // TODO: Create proper emotion log entry when user system is implemented
    return {
      primaryEmotion: analysis.primaryEmotion,
      confidence: analysis.confidence,
      analysisData: analysis.analysisData,
      analysisId: 0, // Temporary ID since we're not saving to DB yet
    };
  }


}
