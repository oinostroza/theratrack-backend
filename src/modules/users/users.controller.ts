import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('with-passwords')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Get all users with passwords', 
    description: 'Returns all users with their seed passwords (123456). Only for admin/development purposes.' 
  })
  @ApiResponse({ status: 200, description: 'List of users with passwords' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllWithPasswords() {
    return this.usersService.findAllWithPasswords();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createUserDto: { email: string; password: string; role: string },
  ) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: { email?: string; password?: string; role?: string },
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('seed')
  async seedUsers() {
    const users = [
      {
        email: 'patient1@example.com',
        password: '123456',
        role: 'patient',
      },
      {
        email: 'patient2@example.com',
        password: '123456',
        role: 'patient',
      },
      {
        email: 'therapist1@example.com',
        password: '123456',
        role: 'therapist',
      },
      {
        email: 'therapist2@example.com',
        password: '123456',
        role: 'therapist',
      },
      {
        email: 'admin@example.com',
        password: '123456',
        role: 'therapist',
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      try {
        const user = await this.usersService.create(userData);
        createdUsers.push({ id: user.id, email: user.email, role: user.role });
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`User ${userData.email} already exists`);
        } else {
          throw error;
        }
      }
    }

    return {
      message: 'Users seeded successfully',
      users: createdUsers,
    };
  }
}
