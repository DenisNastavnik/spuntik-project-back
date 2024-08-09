import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../customers';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<Order>,
    @InjectModel('Customer') private readonly customersModel: Model<Customer>,
  ) {}

  async findAll(id: string): Promise<Order[]> {
    const customer = await this.customersModel.findById(id).exec();

    if (!customer) {
      throw Error(`Заказ с ${id} для обновления не найден`);
    }

    return await this.ordersModel
      .find({ _id: { $in: customer.orders } })
      .populate({
        path: 'products.product',
        select: 'name images thumbnail discountPrice price',
      })
      .populate({
        path: 'pickup_point',
        select: 'address',
      })
      .populate({
        path: 'customer_id',
        select: 'first_name last_name email phone_number',
      })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const result = await this.ordersModel
      .findById(id)
      .populate({
        path: 'products.product',
        select: 'name images thumbnail discountPrice price',
      })
      .populate({
        path: 'pickup_point',
        select: 'address',
      })
      .populate({
        path: 'customer_id',
        select: 'first_name last_name email phone_number',
      })
      .exec();
    if (result === null) {
      throw Error(`Заказ с ${id} не найден`);
    }
    return result;
  }

  async create(id: string, order: CreateOrderDto): Promise<Order> {
    const newOrder = new this.ordersModel(order);

    await this.customersModel.findByIdAndUpdate(id, { $push: { orders: newOrder._id } }).exec();

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

  async delete(userId: string, id: string): Promise<Order> {
    const result = await this.ordersModel.findByIdAndDelete(id);
    if (result === null) {
      throw Error(`Заказ с ${id} для удаления не найден`);
    }
    await this.customersModel.findByIdAndUpdate(userId, { $pull: { orders: result._id } }).exec();

    return result;
  }
}
