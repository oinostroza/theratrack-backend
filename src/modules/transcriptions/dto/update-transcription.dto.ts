import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTranscriptionDto {
  @IsOptional()
  @IsNumber()
  sessionId?: number;

  @IsOptional()
  @IsString()
  content?: string;
} 