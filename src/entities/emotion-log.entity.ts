import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { EmotionAnalysis } from './emotion-analysis.entity';

@Entity()
export class EmotionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.emotionLogs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => EmotionAnalysis, (analysis) => analysis.emotionLog)
  analyses: EmotionAnalysis[];
}
