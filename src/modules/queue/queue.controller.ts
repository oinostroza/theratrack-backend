import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('send')
  async sendMessage(@Body() messageDto: { queue: string; message: any }) {
    return this.queueService.sendMessage(messageDto.queue, messageDto.message);
  }

  @Get('receive')
  async receiveMessage(@Query('queue') queue: string) {
    return this.queueService.receiveMessage(queue);
  }
}
