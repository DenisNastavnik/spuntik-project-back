import { Injectable } from '@nestjs/common';
import { Vendor } from './vendors.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VendorsService {
  constructor(@InjectModel('Vendor') private readonly vendorModel: Model<Vendor>) {}

  async findAll(): Promise<Vendor[]> {
    return await this.vendorModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<Vendor> {
    const result = await this.vendorModel.findById(id).select('-password').exec();
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`);
    }
    return result;
  }

  async update(id: string, vendor: Vendor): Promise<Vendor> {
    const result = await this.vendorModel
      .findByIdAndUpdate(id, vendor, { new: true })
      .select('-password')
      .exec();
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`);
    }
    return result;
  }

  async delete(id: string): Promise<Vendor> {
    const result = await this.vendorModel.findByIdAndDelete(id).select('-password').exec();
    if (!result) {
      throw Error(`Пользователь с id ${id} не найден`);
    }
    return result;
  }
}
