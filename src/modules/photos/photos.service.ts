import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../../entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    this.logger.log(`Creating new photo: ${createPhotoDto.url}`);
    const photo = this.photoRepository.create(createPhotoDto);
    const savedPhoto = await this.photoRepository.save(photo);
    this.logger.log(`Photo created successfully with ID: ${savedPhoto.id}`);
    return savedPhoto;
  }

  async createWithFile(file: Express.Multer.File, createPhotoDto: CreatePhotoDto): Promise<Photo> {
    this.logger.log(`Creating new photo with file: ${file.originalname}`);
    
    // Generar URL del archivo (en producción, esto debería subirse a S3, Cloudinary, etc.)
    // Por ahora, usamos una URL relativa o base64
    const fileUrl = `/uploads/photos/${Date.now()}-${file.originalname}`;
    
    // En un entorno real, aquí subirías el archivo a un servicio de almacenamiento
    // y obtendrías la URL real. Por ahora, usamos la URL generada.
    
    const photoData: CreatePhotoDto = {
      ...createPhotoDto,
      url: fileUrl, // URL generada después de subir el archivo
    };
    
    const photo = this.photoRepository.create(photoData);
    const savedPhoto = await this.photoRepository.save(photo);
    this.logger.log(`Photo created successfully with ID: ${savedPhoto.id}`);
    return savedPhoto;
  }

  async findAll(): Promise<Photo[]> {
    this.logger.log('Fetching all photos');
    const photos = await this.photoRepository.find({
      relations: ['uploader', 'pet', 'careSession', 'sessionReport'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${photos.length} photos`);
    return photos;
  }

  async findOne(id: string): Promise<Photo> {
    this.logger.log(`Fetching photo with ID: ${id}`);
    const photo = await this.photoRepository.findOne({
      where: { id },
      relations: ['uploader', 'pet', 'careSession', 'sessionReport'],
    });
    if (!photo) {
      this.logger.warn(`Photo with ID ${id} not found`);
      throw new NotFoundException(`Foto con ID ${id} no encontrada`);
    }
    this.logger.log(`Photo found: ${photo.id}`);
    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    this.logger.log(`Updating photo with ID: ${id}`);
    const photo = await this.findOne(id);
    Object.assign(photo, updatePhotoDto);
    const updatedPhoto = await this.photoRepository.save(photo);
    this.logger.log(`Photo updated successfully: ${updatedPhoto.id}`);
    return updatedPhoto;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing photo with ID: ${id}`);
    const photo = await this.findOne(id);
    await this.photoRepository.remove(photo);
    this.logger.log(`Photo removed successfully: ${photo.id}`);
  }

  async findByPetId(petId: string): Promise<Photo[]> {
    this.logger.log(`Fetching photos for pet ID: ${petId}`);
    const photos = await this.photoRepository.find({
      where: { petId },
      relations: ['uploader', 'pet'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${photos.length} photos for pet ${petId}`);
    return photos;
  }

  async findByCareSessionId(careSessionId: string): Promise<Photo[]> {
    this.logger.log(`Fetching photos for care session ID: ${careSessionId}`);
    const photos = await this.photoRepository.find({
      where: { careSessionId },
      relations: ['uploader', 'careSession'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${photos.length} photos for care session ${careSessionId}`);
    return photos;
  }

  async findBySessionReportId(sessionReportId: string): Promise<Photo[]> {
    this.logger.log(`Fetching photos for session report ID: ${sessionReportId}`);
    const photos = await this.photoRepository.find({
      where: { sessionReportId },
      relations: ['uploader', 'sessionReport'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${photos.length} photos for session report ${sessionReportId}`);
    return photos;
  }
}

