import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema()
export class Vendor {
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

  @ApiProperty({ example: 'Ozon', description: 'Компания пользователя' })
  @Prop({ type: String })
  company_name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  catalogue: [mongoose.Schema.Types.ObjectId];
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
