import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddToFavoriteDto {
  @ApiProperty({ example: '66929c15ab2be458ce36ed75', description: 'id продукта' })
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
