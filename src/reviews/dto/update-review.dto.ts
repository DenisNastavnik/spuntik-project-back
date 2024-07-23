import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Рейтинг' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Все очень понравилось!', description: 'Отзыв' })
  @IsNotEmpty()
  @IsString()
  body: string;
}
