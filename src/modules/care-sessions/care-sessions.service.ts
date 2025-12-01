import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareSession } from '../../entities/care-session.entity';
import { CreateCareSessionDto } from './dto/create-care-session.dto';
import { UpdateCareSessionDto } from './dto/update-care-session.dto';

@Injectable()
export class CareSessionsService {
  private readonly logger = new Logger(CareSessionsService.name);

  constructor(
    @InjectRepository(CareSession)
    private readonly careSessionRepository: Repository<CareSession>,
  ) {}

  async create(createCareSessionDto: CreateCareSessionDto): Promise<CareSession> {
    this.logger.log(`Creating new care session for pet: ${createCareSessionDto.petId}`);
    const careSession = this.careSessionRepository.create({
      ...createCareSessionDto,
      startTime: new Date(createCareSessionDto.startTime),
      endTime: createCareSessionDto.endTime ? new Date(createCareSessionDto.endTime) : undefined,
    });
    const savedSession = await this.careSessionRepository.save(careSession);
    this.logger.log(`Care session created successfully with ID: ${savedSession.id}`);
    return savedSession;
  }

  async findAll(): Promise<CareSession[]> {
    this.logger.log('Fetching all care sessions');
    const sessions = await this.careSessionRepository.find({
      relations: ['pet', 'sitter'],
      order: { startTime: 'DESC' },
    });
    this.logger.log(`Found ${sessions.length} care sessions`);
    return sessions;
  }

  async findOne(id: string): Promise<CareSession> {
    this.logger.log(`Fetching care session with ID: ${id}`);
    const session = await this.careSessionRepository.findOne({
      where: { id },
      relations: ['pet', 'sitter', 'sessionReports', 'photos'],
    });
    if (!session) {
      this.logger.warn(`Care session with ID ${id} not found`);
      throw new NotFoundException(`Sesión de cuidado con ID ${id} no encontrada`);
    }
    this.logger.log(`Care session found: ${session.id}`);
    return session;
  }

  async update(id: string, updateCareSessionDto: UpdateCareSessionDto): Promise<CareSession> {
    this.logger.log(`Updating care session with ID: ${id}`);
    const session = await this.findOne(id);
    
    const updateData: any = { ...updateCareSessionDto };
    if (updateCareSessionDto.startTime) {
      updateData.startTime = new Date(updateCareSessionDto.startTime);
    }
    if (updateCareSessionDto.endTime) {
      updateData.endTime = new Date(updateCareSessionDto.endTime);
    }
    
    Object.assign(session, updateData);
    const updatedSession = await this.careSessionRepository.save(session);
    this.logger.log(`Care session updated successfully: ${updatedSession.id}`);
    return updatedSession;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing care session with ID: ${id}`);
    const session = await this.findOne(id);
    await this.careSessionRepository.remove(session);
    this.logger.log(`Care session removed successfully: ${session.id}`);
  }

  async findByPetId(petId: string): Promise<CareSession[]> {
    this.logger.log(`Fetching care sessions for pet ID: ${petId}`);
    const sessions = await this.careSessionRepository.find({
      where: { petId },
      relations: ['pet', 'sitter'],
      order: { startTime: 'DESC' },
    });
    this.logger.log(`Found ${sessions.length} care sessions for pet ${petId}`);
    return sessions;
  }

  async findBySitterId(sitterId: number): Promise<CareSession[]> {
    this.logger.log(`Fetching care sessions for sitter ID: ${sitterId}`);
    const sessions = await this.careSessionRepository.find({
      where: { sitterId },
      relations: ['pet', 'sitter'],
      order: { startTime: 'DESC' },
    });
    this.logger.log(`Found ${sessions.length} care sessions for sitter ${sitterId}`);
    return sessions;
  }
}

