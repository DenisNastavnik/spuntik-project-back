import { ApiProperty } from '@nestjs/swagger';

class SubProduct {
  @ApiProperty({
    example: 'PET PRIDE Наполнитель Глиняный Комкующийся Цветочный 9000г.',
    description: 'Название продукта',
  })
  name: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/230/HttpStatus.OK/300',
    description: 'Изображение продукта',
  })
  thumbnail: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 'Иван Иваныч', description: 'Имя Фамилия покупателя' })
  customer_fullname: string;

  @ApiProperty({ type: SubProduct })
  readonly product_id: SubProduct;

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'id покупателя' })
  readonly customer_id: string;

  @ApiProperty({ example: 4, description: 'Рейтинг' })
  rating: number;

  @ApiProperty({ example: 'Все очень понравилось!', description: 'Отзыв' })
  body: string;
}
