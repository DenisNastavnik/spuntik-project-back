import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderSchema } from './orders.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Orders', schema: OrderSchema }])],
  providers: [OrderService],
  controllers: [OrdersController],
})
export class OrdersModule {}
