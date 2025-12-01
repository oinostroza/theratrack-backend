import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
// @UseGuards(JwtAuthGuard) // Comentado temporalmente para pruebas
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Patch(':id/estado')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { pagado: boolean },
  ) {
    return this.sessionsService.updateStatus(id, body.pagado);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }

  @Get('pendientes/pago')
  findPendingPayments() {
    return this.sessionsService.findPendingPayments();
  }

  @Delete('cleanup/orphaned')
  async cleanupOrphanedSessions() {
    return this.sessionsService.cleanupOrphanedSessions();
  }
}
