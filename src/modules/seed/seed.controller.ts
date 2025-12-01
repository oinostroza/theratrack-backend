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
    description: 'Creates all tables and seeds the database with initial data (users, patients, sessions, transcriptions, pets, care sessions, session reports, locations, photos). This is the main endpoint to set up the database from scratch.'
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
        therapyData: { type: 'object' },
        petsData: { type: 'object' }
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

  @Post('calendar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed calendar sessions for December',
    description: 'Generates many sessions for December, distributed across weekdays for multiple patients. Includes past dates (before today) and future dates. Creates 3-6 sessions per weekday, fewer on Saturdays, none on Sundays.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Calendar sessions created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Calendar sessions for December created successfully' },
        summary: {
          type: 'object',
          properties: {
            totalGenerated: { type: 'number', example: 150 },
            created: { type: 'number', example: 148 },
            errors: { type: 'number', example: 2 },
            patientsUsed: { type: 'number', example: 20 }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async seedCalendar() {
    try {
      return await this.seedService.seedCalendar();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Error seeding calendar',
          error: 'Internal Server Error',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('pets')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed pets data',
    description: 'Creates example pets. Requires users with role "owner" to exist first.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pets seeded successfully'
  })
  async seedPets() {
    return await this.seedService.seedPets();
  }

  @Post('pets-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Seed all pets data',
    description: 'Creates example data for pets system: pets, care sessions, session reports, locations, and photos. Requires users with roles "owner" and "sitter" to exist first.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pets data seeded successfully'
  })
  async seedPetsData() {
    return await this.seedService.seedPetsData();
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Complete database reset and seed',
    description: '⚠️ WARNING: This will DELETE ALL existing tables and data, then recreate everything from scratch. Creates all tables (therapy + pets) and seeds all data. Use this to completely reset the database.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Database completely reset and seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Database completely reset and seeded successfully' },
        summary: {
          type: 'object',
          properties: {
            users: { type: 'number' },
            therapy: {
              type: 'object',
              properties: {
                patients: { type: 'number' },
                sessions: { type: 'number' },
                transcriptions: { type: 'number' }
              }
            },
            pets: {
              type: 'object',
              properties: {
                pets: { type: 'number' },
                careSessions: { type: 'number' },
                sessionReports: { type: 'number' },
                locations: { type: 'number' },
                photos: { type: 'number' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async seedComplete() {
    try {
      return await this.seedService.seedComplete();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Error resetting and seeding database',
          error: 'Internal Server Error',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

