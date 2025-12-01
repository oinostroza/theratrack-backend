import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Pet } from './pet.entity';
import { User } from './user.entity';
import { SessionReport } from './session-report.entity';
import { Photo } from './photo.entity';

export enum CareSessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('care_sessions')
export class CareSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pet_id' })
  petId: string;

  @Column({ name: 'sitter_id', type: 'int' })
  sitterId: number;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({
    type: 'enum',
    enum: CareSessionStatus,
    default: CareSessionStatus.SCHEDULED,
  })
  status: CareSessionStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Pet, (pet) => pet.careSessions, { nullable: false })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sitter_id' })
  sitter: User;

  @OneToMany(() => SessionReport, (sessionReport) => sessionReport.careSession)
  sessionReports: SessionReport[];

  @OneToMany(() => Photo, (photo) => photo.careSession)
  photos: Photo[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

