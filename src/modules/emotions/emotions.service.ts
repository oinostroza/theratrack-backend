import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionLog } from '../../entities';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';

@Injectable()
export class EmotionsService {
  constructor(
    @InjectRepository(EmotionLog)
    private readonly emotionLogRepository: Repository<EmotionLog>,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  async findAll(): Promise<EmotionLog[]> {
    return this.emotionLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmotionLog> {
    const emotionLog = await this.emotionLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!emotionLog) {
      throw new NotFoundException(`Emotion log with ID ${id} not found`);
    }
    return emotionLog;
  }

  async findByUser(userId: number): Promise<EmotionLog[]> {
    return this.emotionLogRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createEmotionDto: {
    userId: number;
    text: string;
  }): Promise<EmotionLog> {
    // Save emotion to database
    const emotionLog = this.emotionLogRepository.create(createEmotionDto);
    const savedEmotion = await this.emotionLogRepository.save(emotionLog);

    // Analyze emotion using AI service
    const analysis = await this.aiAnalysisService.analyzeEmotion(
      savedEmotion.text,
    );
    // Save analysis results to database
    await this.aiAnalysisService.saveAnalysisResults(savedEmotion.id, analysis);

    return savedEmotion;
  }

  async update(
    id: number,
    updateEmotionDto: { text?: string },
  ): Promise<EmotionLog> {
    const emotionLog = await this.findOne(id);
    Object.assign(emotionLog, updateEmotionDto);
    return this.emotionLogRepository.save(emotionLog);
  }

  async remove(id: number): Promise<void> {
    const emotionLog = await this.findOne(id);
    await this.emotionLogRepository.remove(emotionLog);
  }
}
