import { IsString, IsNumber, IsArray, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '8745vb7v4r27483834h8', description: 'Id покупателя' })
  @IsString()
  @IsNotEmpty()
  readonly customer_id: string;

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
    example: '04jt34j003m540f3fm3o',
    description: 'Id точки выдачи',
  })
  @IsString()
  @IsNotEmpty()
  readonly pickup_point: string;

  @ApiProperty({
    example: ['04jt34j003m540f3fm3o', 'f0j4g39fn304nf03fn', 'f439hnf9n39fn39fn'],
    description: 'Id продуктов',
  })
  @IsArray()
  @IsNotEmpty()
  readonly products: string[];
}
