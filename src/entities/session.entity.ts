import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Transcription } from './transcription.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_inicio', type: 'timestamp', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fechaFin: Date;

  @Column({ name: 'notas_del_terapeuta', type: 'text', nullable: true })
  notasDelTerapeuta: string;

  @Column({ name: 'concepto_principal', nullable: true })
  conceptoPrincipal: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ default: false })
  pagado: boolean;

  @Column({ name: 'patient_id', nullable: true })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.sessions, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @OneToOne(() => Transcription, (transcription) => transcription.session, {
    cascade: true,
  })
  transcription: Transcription;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 