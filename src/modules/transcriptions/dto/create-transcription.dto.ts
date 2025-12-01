import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTranscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  sessionId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
} 