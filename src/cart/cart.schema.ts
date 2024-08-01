import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class OrderProduct {
  @Prop({ required: true })
  quantity: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product', required: true })
  product: mongoose.Types.ObjectId;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);
