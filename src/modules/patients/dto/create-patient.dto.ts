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

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactInfo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
} 