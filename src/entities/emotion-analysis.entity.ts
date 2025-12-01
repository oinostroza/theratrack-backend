import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EmotionLog } from './emotion-log.entity';

@Entity()
export class EmotionAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emotionLogId: number;

  @Column()
  primaryEmotion: string;

  @Column('decimal', { precision: 3, scale: 2 })
  confidence: number;

  @Column({ type: 'jsonb', nullable: true })
  analysisData: any;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => EmotionLog, (emotionLog) => emotionLog.analyses)
  @JoinColumn({ name: 'emotionLogId' })
  emotionLog: EmotionLog;
} 