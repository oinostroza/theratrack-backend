import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  patientId?: number;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notasDelTerapeuta?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  conceptoPrincipal?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;
} 