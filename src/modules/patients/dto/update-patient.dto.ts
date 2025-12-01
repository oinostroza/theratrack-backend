import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactInfo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
} 