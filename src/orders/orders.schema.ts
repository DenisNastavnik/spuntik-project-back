import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  customer_id: [mongoose.Schema.Types.ObjectId];

  @ApiProperty({ example: 'active', description: 'Статус' })
  @Prop({ type: String })
  status: string;

  @ApiProperty({ example: new Date('2022-01-01'), description: 'Дата заказа' })
  @Prop({ type: Date })
  order_date: Date;

  @ApiProperty({ example: new Date('2022-01-02'), description: 'Примерная дата прибытия заказа' })
  @Prop({ type: Date })
  estimated_delivery_date: Date;

  @ApiProperty({ example: new Date('2022-01-03'), description: 'Дата прибытия заказа' })
  @Prop({ type: Date })
  delivery_date: Date;

  @ApiProperty({ example: 100, description: 'Стоимость' })
  @Prop({ type: Number })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pickup_point: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  products: mongoose.Schema.Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
