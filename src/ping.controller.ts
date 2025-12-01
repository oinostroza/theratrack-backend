import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class PingController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('ping-db')
  async pingDatabase() {
    try {
      // Test database connection with a simple query
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        database: this.dataSource.options.database,
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
} 