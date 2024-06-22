import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from "@nestjs/swagger";
import mongoose from 'mongoose';

@Schema()
export class Product {

  @ApiProperty({example: 'PET PRIDE Наполнитель Глиняный Комкующийся Цветочный 9000г.', description: 'Название продукта'})
  @Prop({type: String})
  name: string;

  @ApiProperty({example: 'Гранулы из специально подобранной смеси природных бентонитовых глин прошли процедуру двойного обеспыливания и напоминают естественную среду обитания кошек', description: 'Описание продукта'})
  @Prop({type: String})
  description: string;

  @ApiProperty({example: 599, description: 'Цена продукта'})
  @Prop({type: Number})
  price: number;

  @ApiProperty({example: 359, description: 'Цена со скидкой'})
  @Prop({type: Number})
  discountPrice: number;

  @ApiProperty({example: 3.75, description: 'рейтинг продукта'})
  @Prop({type: Number})
  rating: number;

  @ApiProperty({example: 'https://picsum.photos/id/230/200/300', description: 'Идентификатор миниатюрного изображения'})
  @Prop({type: String})
  thumbnail: string;

  @ApiProperty({example: ['https://picsum.photos/id/22/200/300', 'https://picsum.photos/id/23/200/300', 'https://picsum.photos/id/24/200/300'], description: 'Массив идентификаторов изображений'})
  @Prop([String])
  images: string[];

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId}]})
  reviews: [mongoose.Schema.Types.ObjectId]

  @Prop({type: mongoose.Schema.Types.ObjectId})
  vendor_id: [mongoose.Schema.Types.ObjectId]

  @Prop({type: Number})
  reviews_count: number;

  @ApiProperty({example: "кошачий наполнитель", description: 'Категория товара'})
  @Prop({type: String})
  category: string;

  @ApiProperty({example: 10, description: 'Остаток товара'})
  @Prop({type: Number})
  remaining: number;

  @ApiProperty({example: [["Состав наполнителя","Глина"]], description: 'Характеристики товара'})
  @Prop()
  characteristic: string[][];
}

export const ProductSchema = SchemaFactory.createForClass(Product)