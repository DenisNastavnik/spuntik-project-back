import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/products.schema';
import { Customer } from '../customers';
import { AddToFavoriteDto } from './dto/add-to-favorite';
import { PaginationQueryDto } from './dto/pagination-query';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel('Customer') private readonly customersModel: Model<Customer>,
    @InjectModel('Product') private readonly productsModel: Model<Product>,
  ) {}

  async getFavorites(
    id: string,
    page: number,
    pageSize: number,
  ): Promise<{ products: Product[]; pagination: PaginationQueryDto }> {
    const customer = await this.customersModel.findById(id).exec();
    const skip = (page - 1) * pageSize;

    if (!customer) {
      throw Error(`Пользователь с id ${id} не найден`);
    }

    const products = await this.productsModel
      .find({ _id: { $in: customer.featured } })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const total = await this.productsModel.countDocuments({ _id: { $in: customer.featured } });

    const pageCount = Math.ceil(total / pageSize);

    const pagination = {
      page: page,
      pageSize: pageSize,
      pageCount: pageCount,
      total: total,
    };

    return { products, pagination };
  }

  async addToFavorites(body: AddToFavoriteDto, userId: string): Promise<Product> {
    const product = await this.productsModel.findById(body.product_id).exec();

    if (!product) {
      throw Error(`Товар с id ${body.product_id}} не найден`);
    }

    const customer = await this.customersModel
      .findByIdAndUpdate(userId, { $push: { featured: product._id } })
      .exec();

    if (!customer) {
      throw Error(`Покупатель с id ${userId}} не найден`);
    }

    return product;
  }

  async removeFromFavorites(id: string, userId: string): Promise<Product> {
    const product = await this.productsModel.findById(id).exec();

    if (!product) {
      throw Error(`Товар с id ${id} не найден`);
    }

    const customer = await this.customersModel
      .findByIdAndUpdate(userId, {
        $pull: { featured: product._id },
      })
      .exec();

    if (!customer) {
      throw Error(`Покупатель с id ${userId} не найден`);
    }

    return product;
  }
}
