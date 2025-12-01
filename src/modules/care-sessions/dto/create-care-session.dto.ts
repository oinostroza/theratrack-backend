import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { CareSessionStatus } from '../../../entities/care-session.entity';

export class CreateCareSessionDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsNumber()
  @IsNotEmpty()
  sitterId: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(CareSessionStatus)
  status?: CareSessionStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

