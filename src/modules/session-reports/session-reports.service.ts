import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionReport } from '../../entities/session-report.entity';
import { CreateSessionReportDto } from './dto/create-session-report.dto';
import { UpdateSessionReportDto } from './dto/update-session-report.dto';

@Injectable()
export class SessionReportsService {
  private readonly logger = new Logger(SessionReportsService.name);

  constructor(
    @InjectRepository(SessionReport)
    private readonly sessionReportRepository: Repository<SessionReport>,
  ) {}

  async create(createSessionReportDto: CreateSessionReportDto): Promise<SessionReport> {
    this.logger.log(`Creating new session report for care session: ${createSessionReportDto.careSessionId}`);
    const sessionReport = this.sessionReportRepository.create({
      ...createSessionReportDto,
      reportDate: new Date(createSessionReportDto.reportDate),
    });
    const savedReport = await this.sessionReportRepository.save(sessionReport);
    this.logger.log(`Session report created successfully with ID: ${savedReport.id}`);
    return savedReport;
  }

  async findAll(): Promise<SessionReport[]> {
    this.logger.log('Fetching all session reports');
    const reports = await this.sessionReportRepository.find({
      relations: ['careSession', 'pet', 'sitter'],
      order: { reportDate: 'DESC' },
    });
    this.logger.log(`Found ${reports.length} session reports`);
    return reports;
  }

  async findOne(id: string): Promise<SessionReport> {
    this.logger.log(`Fetching session report with ID: ${id}`);
    const report = await this.sessionReportRepository.findOne({
      where: { id },
      relations: ['careSession', 'pet', 'sitter', 'photos'],
    });
    if (!report) {
      this.logger.warn(`Session report with ID ${id} not found`);
      throw new NotFoundException(`Reporte de sesión con ID ${id} no encontrado`);
    }
    this.logger.log(`Session report found: ${report.id}`);
    return report;
  }

  async update(id: string, updateSessionReportDto: UpdateSessionReportDto): Promise<SessionReport> {
    this.logger.log(`Updating session report with ID: ${id}`);
    const report = await this.findOne(id);
    
    const updateData: any = { ...updateSessionReportDto };
    if (updateSessionReportDto.reportDate) {
      updateData.reportDate = new Date(updateSessionReportDto.reportDate);
    }
    
    Object.assign(report, updateData);
    const updatedReport = await this.sessionReportRepository.save(report);
    this.logger.log(`Session report updated successfully: ${updatedReport.id}`);
    return updatedReport;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing session report with ID: ${id}`);
    const report = await this.findOne(id);
    await this.sessionReportRepository.remove(report);
    this.logger.log(`Session report removed successfully: ${report.id}`);
  }

  async findByCareSessionId(careSessionId: string): Promise<SessionReport[]> {
    this.logger.log(`Fetching session reports for care session ID: ${careSessionId}`);
    const reports = await this.sessionReportRepository.find({
      where: { careSessionId },
      relations: ['careSession', 'pet', 'sitter'],
      order: { reportDate: 'DESC' },
    });
    this.logger.log(`Found ${reports.length} session reports for care session ${careSessionId}`);
    return reports;
  }

  async findByPetId(petId: string): Promise<SessionReport[]> {
    this.logger.log(`Fetching session reports for pet ID: ${petId}`);
    const reports = await this.sessionReportRepository.find({
      where: { petId },
      relations: ['careSession', 'pet', 'sitter'],
      order: { reportDate: 'DESC' },
    });
    this.logger.log(`Found ${reports.length} session reports for pet ${petId}`);
    return reports;
  }
}

