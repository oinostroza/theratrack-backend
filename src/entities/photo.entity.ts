import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pet } from './pet.entity';
import { CareSession } from './care-session.entity';
import { SessionReport } from './session-report.entity';
import { User } from './user.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl?: string;

  @Column({ name: 'pet_id', nullable: true })
  petId?: string;

  @Column({ name: 'care_session_id', nullable: true })
  careSessionId?: string;

  @Column({ name: 'session_report_id', nullable: true })
  sessionReportId?: string;

  @Column({ name: 'uploaded_by', type: 'int' })
  uploadedBy: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  @ManyToOne(() => Pet, (pet) => pet.photos, { nullable: true })
  @JoinColumn({ name: 'pet_id' })
  pet?: Pet;

  @ManyToOne(() => CareSession, (careSession) => careSession.photos, { nullable: true })
  @JoinColumn({ name: 'care_session_id' })
  careSession?: CareSession;

  @ManyToOne(() => SessionReport, (sessionReport) => sessionReport.photos, { nullable: true })
  @JoinColumn({ name: 'session_report_id' })
  sessionReport?: SessionReport;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

