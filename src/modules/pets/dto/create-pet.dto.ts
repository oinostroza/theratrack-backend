import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  species: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  breed?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  age?: number;

  @IsNumber()
  @IsNotEmpty()
  ownerId: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

