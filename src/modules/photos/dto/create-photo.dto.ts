import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreatePhotoDto {
  @IsOptional()
  @IsString()
  url?: string; // Se generará automáticamente después de subir el archivo

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

