import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findAllCategories(): Promise<string[]> {
    const products = await this.productModel.find({}, 'category').exec();
    const categories: Set<string> = new Set();
    for (const product of products) {
      categories.add(product.category);
    }
    return Array.from(categories);
  }

  async findOne(id: string): Promise<Product> {
    const result = await this.productModel.findById(id).exec();
    if (result === null) {
      throw Error(`Товар с ${id} не найден`);
    }
    return result;
  }

  async create(product: Product): Promise<Product> {
    const newProduct = new this.productModel(product);
    return await newProduct.save();
  }

  async update(id: string, product: Product): Promise<Product> {
    const result = await this.productModel.findByIdAndUpdate(id, product, { new: true });
    if (result === null) {
      throw Error(`Товар с ${id} не найден`);
    }
    return result;
  }

  async delete(id: string): Promise<Product> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (result === null) {
      throw Error(`Товар с ${id} не найден`);
    }
    return result;
  }
}
