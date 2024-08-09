import { IsString, IsNumber, IsArray, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Delivered', description: 'Статус заказа' })
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiProperty({ example: new Date('2022-01-01'), description: 'Дата создания заказа' })
  @IsDateString()
  @IsNotEmpty()
  readonly order_date: Date;

  @ApiProperty({ example: new Date('2022-01-02'), description: 'Примерная дата прибытия заказа' })
  @IsDateString()
  @IsNotEmpty()
  readonly estimated_delivery_date: Date;

  @ApiProperty({ example: new Date('2022-01-03'), description: 'Дата прибытия заказа' })
  @IsDateString()
  @IsNotEmpty()
  readonly delivery_date: Date;

  @ApiProperty({ example: 100, description: 'Стоимость заказа' })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({
    example: '66b3735e5193eac5d239487a',
    description: 'Id точки выдачи',
  })
  @IsString()
  @IsNotEmpty()
  readonly pickup_point: string;

  @ApiProperty({
    example: [
      { product: '6692a604ab2be458ce36edb4', quantity: 5 },
      { product: '66929c15ab2be458ce36ed75', quantity: 3 },
    ],
    description: 'Id продуктов',
  })
  @IsArray()
  @IsNotEmpty()
  readonly products: string[];
}
