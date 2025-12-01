import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('transcriptions')
export class Transcription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id', unique: true })
  sessionId: number;

  @Column({ type: 'text' })
  content: string;

  @OneToOne(() => Session, (session) => session.transcription)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 