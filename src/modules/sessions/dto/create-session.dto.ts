import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  MaxLength,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notasDelTerapeuta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  conceptoPrincipal?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;
}
