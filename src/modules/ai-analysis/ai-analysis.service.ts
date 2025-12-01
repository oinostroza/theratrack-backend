import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EmotionAnalysis } from '../../entities';

interface AnalysisResult {
  primaryEmotion: string;
  confidence: number;
  analysisData?: any;
}

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(EmotionAnalysis)
    private readonly emotionAnalysisRepository: Repository<EmotionAnalysis>,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async analyzeEmotion(text: string): Promise<AnalysisResult> {
    this.logger.log('Modo offline activado: usando análisis emocional local');
    this.logger.log(
      `Analizando emoción para texto: ${text.substring(0, 50)}...`,
    );
    // Usar análisis local directamente
    const result = this.fallbackAnalysis(text);
    this.logger.log(
      `Análisis local completado: ${result.primaryEmotion} (confianza: ${result.confidence})`,
    );
    return result;
  }

  private fallbackAnalysis(text: string): AnalysisResult {
    this.logger.warn('Using fallback emotion analysis');
    // Simple keyword-based emotion detection
    const lowerText = text.toLowerCase();
    let emotion = 'neutral';
    let confidence = 0.6;
    let reasoning = 'Análisis básico basado en palabras clave';
    let intensity = 'medium';

    // Check for joy/happiness keywords
    if (
      lowerText.includes('feliz') ||
      lowerText.includes('alegre') ||
      lowerText.includes('contento') ||
      lowerText.includes('dichoso') ||
      lowerText.includes('satisfecho') ||
      lowerText.includes('orgulloso')
    ) {
      emotion = 'joy';
      confidence = 0.7;
      reasoning =
        'Se detectaron palabras relacionadas con felicidad y satisfacción';
    }
    // Check for sadness keywords
    else if (
      lowerText.includes('triste') ||
      lowerText.includes('solo') ||
      lowerText.includes('deprimido') ||
      lowerText.includes('melancólico') ||
      lowerText.includes('desanimado')
    ) {
      emotion = 'sadness';
      confidence = 0.7;
      reasoning = 'Se detectaron palabras relacionadas con tristeza y soledad';
    }
    // Check for anger keywords
    else if (
      lowerText.includes('enojado') ||
      lowerText.includes('furioso') ||
      lowerText.includes('irritado') ||
      lowerText.includes('molesto') ||
      lowerText.includes('enfadado')
    ) {
      emotion = 'anger';
      confidence = 0.7;
      reasoning = 'Se detectaron palabras relacionadas con enojo e irritación';
    }
    // Check for fear keywords
    else if (
      lowerText.includes('miedo') ||
      lowerText.includes('asustado') ||
      lowerText.includes('aterrado') ||
      lowerText.includes('preocupado') ||
      lowerText.includes('ansioso')
    ) {
      emotion = 'fear';
      confidence = 0.7;
      reasoning =
        'Se detectaron palabras relacionadas con miedo y preocupación';
    }
    // Check for surprise keywords
    else if (
      lowerText.includes('sorprendido') ||
      lowerText.includes('asombrado') ||
      lowerText.includes('impactado') ||
      lowerText.includes('increíble') ||
      lowerText.includes('wow')
    ) {
      emotion = 'surprise';
      confidence = 0.7;
      reasoning = 'Se detectaron palabras relacionadas con sorpresa y asombro';
    }

    // Determine intensity based on text length and emotion words
    const emotionWords = lowerText
      .split(' ')
      .filter(
        (word) =>
          word.includes('muy') ||
          word.includes('mucho') ||
          word.includes('extremadamente') ||
          word.includes('totalmente') ||
          word.includes('completamente'),
      ).length;
    if (emotionWords > 2) {
      intensity = 'high';
    } else if (emotionWords > 0) {
      intensity = 'medium';
    } else {
      intensity = 'low';
    }

    return {
      primaryEmotion: emotion,
      confidence: confidence,
      analysisData: {
        reasoning: reasoning,
        intensity: intensity,
        timestamp: new Date().toISOString(),
        model: 'fallback',
        text: text,
      },
    };
  }

  async saveAnalysisResults(
    emotionLogId: number,
    analysis: AnalysisResult,
  ): Promise<EmotionAnalysis> {
    const emotionAnalysis = this.emotionAnalysisRepository.create({
      emotionLogId,
      primaryEmotion: analysis.primaryEmotion,
      confidence: analysis.confidence,
      analysisData: analysis.analysisData,
    });

    return this.emotionAnalysisRepository.save(emotionAnalysis);
  }

  async getAnalysisByEmotionLogId(
    emotionLogId: number,
  ): Promise<EmotionAnalysis[]> {
    return this.emotionAnalysisRepository.find({
      where: { emotionLogId },
      order: { createdAt: 'DESC' },
    });
  }

  async analyzeUserPatterns(userId: number) {
    // TODO: Implement user pattern analysis logic
    return {
      userId,
      patterns: [],
    };
  }

  async getUserInsights(userId: number) {
    // TODO: Implement user insights retrieval logic
    return {
      userId,
      insights: [],
    };
  }

  async generateReport(reportDto: { userId: number; dateRange: string }) {
    // TODO: Implement report generation logic
    return {
      userId: reportDto.userId,
      dateRange: reportDto.dateRange,
      report: 'Report content here',
    };
  }
}
