import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';

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

  async findProductsByFilter(
    category: string,
    filters: {
      characteristics?: { characteristic: string; value: string }[];
      min?: number;
      max?: number;
      rating?: number;
    },
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filterConditions = [];

    filterConditions.push({ category: category });

    if (filters.characteristics && filters.characteristics.length > 0) {
      filters.characteristics.forEach((characteristic) => {
        filterConditions.push({
          characteristic: {
            $elemMatch: {
              0: characteristic.characteristic,
              1: characteristic.value,
            },
          },
        });
      });
    }

    if (filters.min !== undefined && filters.max !== undefined) {
      filterConditions.push({
        $and: [{ price: { $gte: filters.min } }, { price: { $lte: filters.max } }],
      });
    }

    if (filters.min !== undefined) {
      filterConditions.push({ price: { $gte: filters.min } });
    }

    if (filters.max !== undefined) {
      filterConditions.push({ price: { $lte: filters.max } });
    }

    if (filters.rating !== undefined) {
      filterConditions.push({ rating: { $gte: filters.rating } });
    }

    const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

    const [products, total] = await Promise.all([
      this.productModel.find(filter).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { products, totalPages };
  }

  async findProductsByCategory(category: string, page: number, limit: number): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return await this.productModel.find({ category }).skip(skip).limit(limit).exec();
  }

  async findCharacteristic(): Promise<string[]> {
    return await this.productModel.aggregate([
      { $unwind: '$characteristic' },
      {
        $group: {
          _id: {
            characteristic: { $arrayElemAt: ['$characteristic', 0] },
            value: { $arrayElemAt: ['$characteristic', 1] },
          },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 2 } } },
      {
        $group: {
          _id: '$_id.characteristic',
          values: { $addToSet: '$_id.value' },
        },
      },
      {
        $project: {
          _id: 0,
          characteristic: '$_id',
          values: 1,
        },
      },
    ]);
  }

  async findOne(id: string): Promise<Product> {
    const result = await this.productModel.findById(id).exec();
    if (result === null) {
      throw Error(`Товар с ${id} не найден`);
    }
    return result;
  }

  async create(product: CreateProductDto): Promise<Product> {
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
