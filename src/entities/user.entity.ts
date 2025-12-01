import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmotionLog } from './emotion-log.entity';

export enum UserRole {
  PATIENT = 'patient',
  THERAPIST = 'therapist',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  // Relations
  @OneToMany(() => EmotionLog, (emotionLog) => emotionLog.user)
  emotionLogs: EmotionLog[];
}
