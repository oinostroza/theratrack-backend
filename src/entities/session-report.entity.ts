import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CareSession } from './care-session.entity';
import { Pet } from './pet.entity';
import { User } from './user.entity';
import { Photo } from './photo.entity';

export enum PetMood {
  HAPPY = 'happy',
  CALM = 'calm',
  ANXIOUS = 'anxious',
  PLAYFUL = 'playful',
  TIRED = 'tired',
}

@Entity('session_reports')
export class SessionReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'care_session_id' })
  careSessionId: string;

  @Column({ name: 'pet_id' })
  petId: string;

  @Column({ name: 'sitter_id', type: 'int' })
  sitterId: number;

  @Column({ name: 'report_date', type: 'date' })
  reportDate: Date;

  @Column({ type: 'text', array: true })
  activities: string[];

  @Column({ type: 'text' })
  notes: string;

  @Column({
    type: 'enum',
    enum: PetMood,
    nullable: true,
  })
  mood?: PetMood;

  @Column({ type: 'jsonb', nullable: true })
  feeding?: {
    time: string;
    amount: string;
    foodType: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  medication?: {
    time: string;
    medication: string;
    dosage: string;
  };

  @ManyToOne(() => CareSession, (careSession) => careSession.sessionReports, { nullable: false })
  @JoinColumn({ name: 'care_session_id' })
  careSession: CareSession;

  @ManyToOne(() => Pet, { nullable: false })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sitter_id' })
  sitter: User;

  @OneToMany(() => Photo, (photo) => photo.sessionReport)
  photos: Photo[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

