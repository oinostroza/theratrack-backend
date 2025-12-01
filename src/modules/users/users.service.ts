import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Obtiene todos los usuarios con sus contraseñas del seed
   * IMPORTANTE: Solo para desarrollo/admin. Las contraseñas del seed son '123456'
   */
  async findAllWithPasswords(): Promise<any[]> {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'role'],
    });

    // Mapear usuarios con contraseñas conocidas del seed
    // Todos los usuarios del seed tienen contraseña '123456'
    return users.map(user => ({
      id: user.id.toString(),
      email: user.email,
      name: user.email.split('@')[0], // Usar parte del email como nombre
      role: user.role,
      password: '123456', // Contraseña conocida del seed
    }));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: { email: string; password: string; role: string }): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.role as UserRole,
    });
    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: { email?: string; password?: string; role?: string },
  ): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
} 