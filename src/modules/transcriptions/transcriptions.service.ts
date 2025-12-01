import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transcription } from '../../entities/transcription.entity';
import { Session } from '../../entities/session.entity';
import { CreateTranscriptionDto } from './dto/create-transcription.dto';
import { UpdateTranscriptionDto } from './dto/update-transcription.dto';

@Injectable()
export class TranscriptionsService {
  private readonly logger = new Logger(TranscriptionsService.name);

  constructor(
    @InjectRepository(Transcription)
    private readonly transcriptionRepository: Repository<Transcription>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createTranscriptionDto: CreateTranscriptionDto): Promise<Transcription> {
    this.logger.log(`Creating transcription for session ID: ${createTranscriptionDto.sessionId}`);
    
    // Verificar que la sesión existe
    const session = await this.sessionRepository.findOne({
      where: { id: createTranscriptionDto.sessionId }
    });
    
    if (!session) {
      this.logger.warn(`Session with ID ${createTranscriptionDto.sessionId} not found`);
      throw new BadRequestException('La sesión especificada no existe');
    }

    // Verificar si ya existe una transcripción para esta sesión
    const existingTranscription = await this.transcriptionRepository.findOne({
      where: { sessionId: createTranscriptionDto.sessionId }
    });

    if (existingTranscription) {
      this.logger.warn(`Transcription already exists for session ID ${createTranscriptionDto.sessionId}`);
      throw new BadRequestException('Ya existe una transcripción para esta sesión');
    }

    const transcription = this.transcriptionRepository.create({
      sessionId: createTranscriptionDto.sessionId,
      content: createTranscriptionDto.content,
    });

    const savedTranscription = await this.transcriptionRepository.save(transcription);
    
    this.logger.log(`Transcription created successfully with ID: ${savedTranscription.id}`);
    return savedTranscription;
  }

  async findAll(): Promise<Transcription[]> {
    this.logger.log('Fetching all transcriptions');
    const transcriptions = await this.transcriptionRepository.find({
      relations: ['session'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${transcriptions.length} transcriptions`);
    return transcriptions;
  }

  async findOne(id: number): Promise<Transcription> {
    this.logger.log(`Fetching transcription with ID: ${id}`);
    const transcription = await this.transcriptionRepository.findOne({ 
      where: { id },
      relations: ['session']
    });
    if (!transcription) {
      this.logger.warn(`Transcription with ID ${id} not found`);
      throw new NotFoundException(`Transcripción con ID ${id} no encontrada`);
    }
    this.logger.log(`Transcription found for session: ${transcription.sessionId}`);
    return transcription;
  }

  async findBySessionId(sessionId: number): Promise<Transcription | null> {
    this.logger.log(`Fetching transcription for session ID: ${sessionId}`);
    const transcription = await this.transcriptionRepository.findOne({ 
      where: { sessionId },
      relations: ['session']
    });
    if (transcription) {
      this.logger.log(`Transcription found for session: ${sessionId}`);
    } else {
      this.logger.log(`No transcription found for session: ${sessionId}`);
    }
    return transcription;
  }

  async update(id: number, updateTranscriptionDto: UpdateTranscriptionDto): Promise<Transcription> {
    this.logger.log(`Updating transcription with ID: ${id}`);
    const transcription = await this.findOne(id);
    
    // Si se está actualizando la sesión, verificar que existe
    if (updateTranscriptionDto.sessionId && updateTranscriptionDto.sessionId !== transcription.sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id: updateTranscriptionDto.sessionId }
      });
      
      if (!session) {
        this.logger.warn(`Session with ID ${updateTranscriptionDto.sessionId} not found`);
        throw new BadRequestException('La sesión especificada no existe');
      }
    }
    
    Object.assign(transcription, updateTranscriptionDto);
    const updatedTranscription = await this.transcriptionRepository.save(transcription);
    
    this.logger.log(`Transcription updated successfully: ${updatedTranscription.id}`);
    return updatedTranscription;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing transcription with ID: ${id}`);
    const transcription = await this.findOne(id);
    await this.transcriptionRepository.remove(transcription);
    this.logger.log(`Transcription removed successfully: ${transcription.id}`);
  }
} 