import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../../entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);

  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    this.logger.log(`Creating new pet: ${createPetDto.name}`);
    const pet = this.petRepository.create(createPetDto);
    const savedPet = await this.petRepository.save(pet);
    this.logger.log(`Pet created successfully with ID: ${savedPet.id}`);
    return savedPet;
  }

  async findAll(): Promise<Pet[]> {
    this.logger.log('Fetching all pets');
    const pets = await this.petRepository.find({
      relations: ['owner'],
      order: { name: 'ASC' },
    });
    this.logger.log(`Found ${pets.length} pets`);
    return pets;
  }

  async findOne(id: string): Promise<Pet> {
    this.logger.log(`Fetching pet with ID: ${id}`);
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner', 'careSessions', 'locations', 'photos'],
    });
    if (!pet) {
      this.logger.warn(`Pet with ID ${id} not found`);
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    this.logger.log(`Pet found: ${pet.name}`);
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    this.logger.log(`Updating pet with ID: ${id}`);
    const pet = await this.findOne(id);
    Object.assign(pet, updatePetDto);
    const updatedPet = await this.petRepository.save(pet);
    this.logger.log(`Pet updated successfully: ${updatedPet.name}`);
    return updatedPet;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing pet with ID: ${id}`);
    const pet = await this.findOne(id);
    await this.petRepository.remove(pet);
    this.logger.log(`Pet removed successfully: ${pet.name}`);
  }

  async findByOwnerId(ownerId: number): Promise<Pet[]> {
    this.logger.log(`Fetching pets for owner ID: ${ownerId}`);
    const pets = await this.petRepository.find({
      where: { ownerId },
      relations: ['owner'],
      order: { name: 'ASC' },
    });
    this.logger.log(`Found ${pets.length} pets for owner ${ownerId}`);
    return pets;
  }
}

