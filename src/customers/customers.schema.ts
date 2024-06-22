import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Customer {
  @ApiProperty({ example: 'Jonn', description: 'Имя пользователя' })
  @Prop({ type: String })
  first_name: string;

  @ApiProperty({ example: 'Smit', description: 'Фамилия пользователя' })
  @Prop({ type: String })
  last_name: string;

  @ApiProperty({ example: 'jonn.smit@mail.ru', description: 'Email пользователя' })
  @Prop({ type: String })
  email: string;

  @ApiProperty({ example: '1q34w17', description: 'Пароль пользователя' })
  @Prop({ type: String })
  password: string;

  @ApiProperty({ example: '+79099091100', description: 'Номер телефона пользователя' })
  @Prop({ type: String })
  phone_number: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  featured: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  cart: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  orders: [mongoose.Schema.Types.ObjectId];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  reviews: [mongoose.Schema.Types.ObjectId];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
