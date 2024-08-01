import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '66929c15ab2be458ce36ed75', description: 'id продукта' })
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
