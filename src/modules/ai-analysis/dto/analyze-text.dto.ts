import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class AnalyzeTextDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'El texto debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'El texto no puede exceder 2000 caracteres' })
  text: string;
}
