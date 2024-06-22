import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './customers.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer> {
    const result = await this.customerModel.findById(id).exec();
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`)
    }
    return result;
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    const result = await this.customerModel.findByIdAndUpdate(id, {customer}, { new: true });
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`)
    }
    return result;
  }

  async delete(id: string): Promise<Customer> {
    const result = await this.customerModel.findByIdAndDelete(id);
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`)
    }
    return result;
  }
}
