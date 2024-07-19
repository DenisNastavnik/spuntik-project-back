import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Review {
  @ApiProperty({ example: 'Иван Иваныч', description: 'Имя Фамилия покупателя' })
  @Prop({ type: String })
  customer_fullname: string;

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'Product id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  product_id: [mongoose.Schema.Types.ObjectId];

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'Customer id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  customer_id: [mongoose.Schema.Types.ObjectId];

  @ApiProperty({ example: 4, description: 'Рейтинг' })
  @Prop({ type: Number })
  rating: number;

  @ApiProperty({ example: 'Все очень понравилось!', description: 'Отзыв' })
  @Prop({ type: String })
  body: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
