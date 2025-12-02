import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  filename: string; // Nombre del archivo guardado en el frontend

  @IsString()
  @IsNotEmpty()
  folder: string; // 'avatars' o 'sessions' - subcarpeta donde se guardó

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  petId?: string;

  @IsOptional()
  @IsString()
  careSessionId?: string;

  @IsOptional()
  @IsString()
  sessionReportId?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  uploadedBy: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

