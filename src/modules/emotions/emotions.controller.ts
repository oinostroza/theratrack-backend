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
import { EmotionsService } from './emotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { User } from '../../entities';

@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Get()
  async findAll() {
    return this.emotionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.emotionsService.findOne(+id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.emotionsService.findByUser(+userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEmotion(
    @CurrentUser() user: User,
    @Body() createEmotionDto: CreateEmotionDto,
  ) {
    return this.emotionsService.create({
      userId: user.id,
      text: createEmotionDto.text,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmotionDto: { text?: string },
  ) {
    return this.emotionsService.update(+id, updateEmotionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.emotionsService.remove(+id);
  }
}
