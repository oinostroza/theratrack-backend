import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating new location: ${createLocationDto.name}`);
    const location = this.locationRepository.create(createLocationDto);
    const savedLocation = await this.locationRepository.save(location);
    this.logger.log(`Location created successfully with ID: ${savedLocation.id}`);
    return savedLocation;
  }

  async findAll(): Promise<Location[]> {
    this.logger.log('Fetching all locations');
    const locations = await this.locationRepository.find({
      relations: ['owner', 'pet'],
      order: { name: 'ASC' },
    });
    this.logger.log(`Found ${locations.length} locations`);
    return locations;
  }

  async findOne(id: string): Promise<Location> {
    this.logger.log(`Fetching location with ID: ${id}`);
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['owner', 'pet'],
    });
    if (!location) {
      this.logger.warn(`Location with ID ${id} not found`);
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }
    this.logger.log(`Location found: ${location.name}`);
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Updating location with ID: ${id}`);
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    const updatedLocation = await this.locationRepository.save(location);
    this.logger.log(`Location updated successfully: ${updatedLocation.name}`);
    return updatedLocation;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing location with ID: ${id}`);
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
    this.logger.log(`Location removed successfully: ${location.name}`);
  }

  async findByOwnerId(ownerId: number): Promise<Location[]> {
    this.logger.log(`Fetching locations for owner ID: ${ownerId}`);
    const locations = await this.locationRepository.find({
      where: { ownerId },
      relations: ['owner', 'pet'],
      order: { name: 'ASC' },
    });
    this.logger.log(`Found ${locations.length} locations for owner ${ownerId}`);
    return locations;
  }

  async findByPetId(petId: string): Promise<Location[]> {
    this.logger.log(`Fetching locations for pet ID: ${petId}`);
    const locations = await this.locationRepository.find({
      where: { petId },
      relations: ['owner', 'pet'],
      order: { name: 'ASC' },
    });
    this.logger.log(`Found ${locations.length} locations for pet ${petId}`);
    return locations;
  }
}

