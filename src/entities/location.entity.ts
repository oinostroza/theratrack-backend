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
import { User } from './user.entity';

export enum LocationType {
  HOME = 'home',
  VET = 'vet',
  GROOMING = 'grooming',
  PARK = 'park',
  OTHER = 'other',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'pet_id', nullable: true })
  petId?: string;

  @Column({ name: 'owner_id', type: 'int' })
  ownerId: number;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.OTHER,
  })
  type: LocationType;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Pet, (pet) => pet.locations, { nullable: true })
  @JoinColumn({ name: 'pet_id' })
  pet?: Pet;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

