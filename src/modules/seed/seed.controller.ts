import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('data')
  async seedData() {
    return await this.seedService.seedData();
  }

  @Post('users')
  async seedUsers() {
    return await this.seedService.seedUsers();
  }

  @Post('all')
  async seedAll() {
    return await this.seedService.seedAll();
  }

  @Post('tables')
  async createTables() {
    return await this.seedService.createTables();
  }

  @Post('init')
  async init() {
    // Alias for seedAll - creates tables and seeds all data
    return await this.seedService.seedAll();
  }
}

