import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    this.logger.log(`Creating new patient: ${createPatientDto.fullName}`);

    // Verificar si ya existe un paciente con el mismo email
    const existingPatient = await this.patientRepository.findOne({
      where: { email: createPatientDto.email },
    });

    if (existingPatient) {
      this.logger.warn(
        `Patient with email ${createPatientDto.email} already exists`,
      );
      throw new ConflictException('Ya existe un paciente con este email');
    }

    const patient = this.patientRepository.create(createPatientDto);
    const savedPatient = await this.patientRepository.save(patient);

    this.logger.log(`Patient created successfully with ID: ${savedPatient.id}`);
    return savedPatient;
  }

  async findAll(): Promise<Patient[]> {
    this.logger.log('Fetching all patients');
    const patients = await this.patientRepository.find({
      order: { fullName: 'ASC' },
    });
    this.logger.log(`Found ${patients.length} patients`);
    return patients;
  }

  async findOne(id: number): Promise<Patient> {
    this.logger.log(`Fetching patient with ID: ${id}`);
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['sessions'],
    });
    if (!patient) {
      this.logger.warn(`Patient with ID ${id} not found`);
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    this.logger.log(`Patient found: ${patient.fullName}`);
    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    this.logger.log(`Updating patient with ID: ${id}`);
    const patient = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista otro paciente con el mismo email
    if (updatePatientDto.email && updatePatientDto.email !== patient.email) {
      const existingPatient = await this.patientRepository.findOne({
        where: { email: updatePatientDto.email },
      });

      if (existingPatient) {
        this.logger.warn(
          `Patient with email ${updatePatientDto.email} already exists`,
        );
        throw new ConflictException('Ya existe un paciente con este email');
      }
    }

    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientRepository.save(patient);

    this.logger.log(`Patient updated successfully: ${updatedPatient.fullName}`);
    return updatedPatient;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing patient with ID: ${id}`);
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
    this.logger.log(`Patient removed successfully: ${patient.fullName}`);
  }

  async seed(): Promise<Patient[]> {
    this.logger.log('Seeding patients with test data');

    const testPatients = [
      {
        fullName: 'María González',
        email: 'maria.gonzalez@email.com',
        age: 28,
        gender: 'femenino',
        contactInfo: '+56 9 1234 5678',
        notes: 'Paciente con ansiedad moderada',
      },
      {
        fullName: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        age: 35,
        gender: 'masculino',
        contactInfo: '+56 9 8765 4321',
        notes: 'Paciente con depresión leve',
      },
      {
        fullName: 'Ana Silva',
        email: 'ana.silva@email.com',
        age: 42,
        gender: 'femenino',
        contactInfo: '+56 9 5555 1234',
        notes: 'Paciente con estrés laboral',
      },
    ];

    const createdPatients = [];

    for (const patientData of testPatients) {
      try {
        const existingPatient = await this.patientRepository.findOne({
          where: { email: patientData.email },
        });

        if (!existingPatient) {
          const patient = this.patientRepository.create(patientData);
          const savedPatient = await this.patientRepository.save(patient);
          createdPatients.push(savedPatient);
          this.logger.log(`Created test patient: ${savedPatient.fullName}`);
        } else {
          this.logger.log(
            `Patient with email ${patientData.email} already exists, skipping`,
          );
        }
      } catch (error) {
        this.logger.error(`Error creating test patient: ${error.message}`);
      }
    }

    this.logger.log(
      `Seeding completed. Created ${createdPatients.length} patients`,
    );
    return createdPatients;
  }
}
