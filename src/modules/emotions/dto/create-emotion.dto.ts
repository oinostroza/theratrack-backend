import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEmotionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  text: string;
}
