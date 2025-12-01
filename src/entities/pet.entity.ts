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
import { User } from './user.entity';
import { CareSession } from './care-session.entity';
import { Location } from './location.entity';
import { Photo } from './photo.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column({ nullable: true })
  breed?: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ name: 'owner_id', type: 'int' })
  ownerId: number;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => CareSession, (careSession) => careSession.pet)
  careSessions: CareSession[];

  @OneToMany(() => Location, (location) => location.pet)
  locations: Location[];

  @OneToMany(() => Photo, (photo) => photo.pet)
  photos: Photo[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

