import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'Иван Иваныч', description: 'Имя Фамилия покупателя' })
  @IsString()
  @IsNotEmpty()
  customer_fullname: string;

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'id продукта' })
  @IsString()
  @IsNotEmpty()
  readonly product_id: string;

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'id покупателя' })
  @IsString()
  @IsNotEmpty()
  readonly customer_id: string;

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
