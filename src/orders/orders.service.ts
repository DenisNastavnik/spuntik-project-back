import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Orders') private readonly ordersModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return await this.ordersModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const result = await this.ordersModel.findById(id).exec();
    if (result === null) {
      throw Error(`Заказ с ${id} не найден`);
    }
    return result;
  }

  async create(order: CreateOrderDto): Promise<Order> {
    const newOrder = new this.ordersModel(order);
    return await newOrder.save();
  }

  async update(id: string, order: Order): Promise<Order> {
    const result = await this.ordersModel.findByIdAndUpdate(id, order, { new: true });
    if (result === null) {
      throw Error(`Заказ с ${id} для обновления не найден`);
    }
    return result;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const result = await this.ordersModel.findById(id).exec();
    if (!result) {
      throw new Error(`Заказ с id ${id} для обновления статуса не найден`);
    }

    result.status = status;
    return result;
  }

  async delete(id: string): Promise<Order> {
    const result = await this.ordersModel.findByIdAndDelete(id);
    if (result === null) {
      throw Error(`Заказ с ${id} для удаления не найден`);
    }
    return result;
  }
}
