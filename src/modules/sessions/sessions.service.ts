import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../entities/session.entity';
import { Patient } from '../../entities/patient.entity';
import { Transcription } from '../../entities/transcription.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Transcription)
    private readonly transcriptionRepository: Repository<Transcription>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    this.logger.log(
      `Creating new session for patient ID: ${createSessionDto.patientId || 'no patient'}`,
    );

    // Verificar que el paciente existe solo si se proporciona patientId
    if (createSessionDto.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: createSessionDto.patientId },
      });

      if (!patient) {
        this.logger.warn(
          `Patient with ID ${createSessionDto.patientId} not found`,
        );
        throw new BadRequestException('El paciente especificado no existe');
      }
    }

    // Validar que fechaInicio sea anterior a fechaFin solo si ambos están presentes
    if (createSessionDto.fechaInicio && createSessionDto.fechaFin) {
      const fechaInicio = new Date(createSessionDto.fechaInicio);
      const fechaFin = new Date(createSessionDto.fechaFin);

      if (fechaInicio >= fechaFin) {
        this.logger.warn('Session end date must be after start date');
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }
    }

    const sessionData = {
      ...createSessionDto,
      pagado: createSessionDto.pagado ?? false,
    };

    const session = this.sessionRepository.create(sessionData);
    const savedSession = await this.sessionRepository.save(session);

    this.logger.log(`Session created successfully with ID: ${savedSession.id}`);
    return savedSession;
  }

  async findAll(): Promise<Session[]> {
    this.logger.log('Fetching all sessions');
    const sessions = await this.sessionRepository.find({
      relations: ['patient'],
      order: { fechaInicio: 'DESC' },
    });
    this.logger.log(`Found ${sessions.length} sessions`);
    return sessions;
  }

  async findOne(id: number): Promise<Session> {
    this.logger.log(`Fetching session with ID: ${id}`);
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!session) {
      this.logger.warn(`Session with ID ${id} not found`);
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }
    this.logger.log(`Session found for patient: ${session.patient?.fullName}`);
    return session;
  }

  async update(
    id: number,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    this.logger.log(`Updating session with ID: ${id}`);
    const session = await this.findOne(id);

    // Si se está actualizando el paciente, verificar que existe
    if (updateSessionDto.patientId && updateSessionDto.patientId !== session.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: updateSessionDto.patientId },
      });

      if (!patient) {
        this.logger.warn(
          `Patient with ID ${updateSessionDto.patientId} not found`,
        );
        throw new BadRequestException('El paciente especificado no existe');
      }
    }

    // Validar fechas si se están actualizando
    if (updateSessionDto.fechaInicio && updateSessionDto.fechaFin) {
      const fechaInicio = new Date(updateSessionDto.fechaInicio);
      const fechaFin = new Date(updateSessionDto.fechaFin);

      if (fechaInicio >= fechaFin) {
        this.logger.warn('Session end date must be after start date');
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }
    }

    Object.assign(session, updateSessionDto);
    const updatedSession = await this.sessionRepository.save(session);

    this.logger.log(`Session updated successfully: ${updatedSession.id}`);
    return updatedSession;
  }

  async updateStatus(id: number, pagado: boolean): Promise<Session> {
    this.logger.log(`Updating session status with ID: ${id} to pagado: ${pagado}`);
    const session = await this.findOne(id);

    session.pagado = pagado;
    const updatedSession = await this.sessionRepository.save(session);

    this.logger.log(`Session status updated successfully: ${updatedSession.id}`);
    return updatedSession;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing session with ID: ${id}`);
    const session = await this.findOne(id);

    // Buscar y eliminar la transcripción asociada si existe
    try {
      const transcription = await this.transcriptionRepository.findOne({
        where: { sessionId: id },
      });

      if (transcription) {
        this.logger.log(
          `Found associated transcription with ID: ${transcription.id}, removing it first`,
        );
        await this.transcriptionRepository.remove(transcription);
        this.logger.log(`Transcription removed successfully: ${transcription.id}`);
      } else {
        this.logger.log(`No associated transcription found for session: ${id}`);
      }
    } catch (error) {
      this.logger.warn(
        `Error while trying to remove associated transcription: ${error.message}`,
      );
      // Continuar con la eliminación de la sesión incluso si hay error al eliminar la transcripción
    }

    // Eliminar la sesión
    await this.sessionRepository.remove(session);
    this.logger.log(`Session removed successfully: ${session.id}`);
  }

  async findPendingPayments(): Promise<Session[]> {
    this.logger.log('Fetching sessions with pending payments');
    const sessions = await this.sessionRepository.find({
      where: { pagado: false },
      relations: ['patient'],
      order: { fechaInicio: 'DESC' },
    });
    this.logger.log(`Found ${sessions.length} sessions with pending payments`);
    return sessions;
  }

  async cleanupOrphanedSessions(): Promise<{ deleted: number }> {
    this.logger.log('Cleaning up orphaned sessions (sessions without patient)');

    const orphanedSessions = await this.sessionRepository.find({
      where: { patientId: null },
    });

    if (orphanedSessions.length > 0) {
      await this.sessionRepository.remove(orphanedSessions);
      this.logger.log(`Deleted ${orphanedSessions.length} orphaned sessions`);
    } else {
      this.logger.log('No orphaned sessions found');
    }

    return { deleted: orphanedSessions.length };
  }
}
