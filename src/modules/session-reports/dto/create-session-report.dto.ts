import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PetMood } from '../../../entities/session-report.entity';

class FeedingDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  foodType: string;
}

class MedicationDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  medication: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;
}

export class CreateSessionReportDto {
  @IsString()
  @IsNotEmpty()
  careSessionId: string;

  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsNumber()
  @IsNotEmpty()
  sitterId: number;

  @IsDateString()
  @IsNotEmpty()
  reportDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  activities: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  notes: string;

  @IsOptional()
  @IsEnum(PetMood)
  mood?: PetMood;

  @IsOptional()
  @ValidateNested()
  @Type(() => FeedingDto)
  feeding?: FeedingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MedicationDto)
  medication?: MedicationDto;
}

