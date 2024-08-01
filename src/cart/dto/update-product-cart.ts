import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductCartDto {
  @ApiProperty({ example: '1', description: 'Количество продуктов' })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
