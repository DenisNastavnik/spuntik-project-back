import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/products.schema';
import { PaginationQueryDto } from './pagination-query';

export class ResponseDto {
  @ApiProperty({ description: 'Количество продукта' })
  quantity: number;

  @ApiProperty({ description: 'Продукт' })
  product: Product;
}

export class GetResponseDto {
  @ApiProperty()
  products: ResponseDto;

  @ApiProperty()
  pagination: PaginationQueryDto;
}
