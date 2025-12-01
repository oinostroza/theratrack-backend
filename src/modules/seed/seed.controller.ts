import { Controller, Post, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('init')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Initialize database',
    description: 'Creates all tables and seeds the database with initial data (users, patients, sessions, transcriptions). This is the main endpoint to set up the database from scratch.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Database initialized successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Database initialized and seeded successfully' },
        tables: { type: 'object' },
        users: { type: 'object' },
        data: { type: 'object' }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  async init() {
    try {
      return await this.seedService.seedAll();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Error initializing database',
          error: 'Internal Server Error',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tables')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Create database tables',
    description: 'Creates all required database tables if they do not exist. Safe to call multiple times.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tables created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Tables created successfully' },
        success: { type: 'boolean', example: true }
      }
    }
  })
  async createTables() {
    return await this.seedService.createTables();
  }

  @Post('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed users',
    description: 'Creates example users (2 patients, 3 therapists) with password: 123456'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Users seeded successfully' },
        users: { type: 'array' },
        total: { type: 'number', example: 5 }
      }
    }
  })
  async seedUsers() {
    return await this.seedService.seedUsers();
  }

  @Post('data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed data',
    description: 'Creates example data: 20 patients, ~80 sessions, and ~43 transcriptions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Data seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data seeded successfully' },
        summary: {
          type: 'object',
          properties: {
            patients: { type: 'number', example: 20 },
            sessions: { type: 'number', example: 80 },
            transcriptions: { type: 'number', example: 43 }
          }
        }
      }
    }
  })
  async seedData() {
    return await this.seedService.seedData();
  }

  @Post('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed all data',
    description: 'Seeds both users and data (does not create tables). Use /seed/init for complete setup.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All data seeded successfully'
  })
  async seedAll() {
    return await this.seedService.seedAll();
  }
}

