import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../products/products.schema';
import { Customer } from '../customers';
import { AddToCartDto } from './dto/add-to-cart';
import { PaginationQueryDto } from './dto/pagination-query';
import { OrderProduct } from './cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Customer') private readonly customersModel: Model<Customer>,
    @InjectModel('Product') private readonly productsModel: Model<Product>,
  ) {}

  async getCartProducts(
    id: string,
    page: number,
    pageSize: number,
  ): Promise<{ products: OrderProduct[]; pagination: PaginationQueryDto }> {
    const skip = (page - 1) * pageSize;

    const populatedCustomer = await this.customersModel
      .findById(id, {
        cart: {
          $slice: [skip, pageSize],
        },
      })
      .populate({
        path: 'cart.product',
      })
      .exec();

    if (!populatedCustomer) {
      throw Error(`Пользователь с id: ${id} не найден`);
    }

    const customer = await this.customersModel.findById(id).exec();

    if (!customer) {
      throw Error(`Пользователь с id: ${id} не найден`);
    }

    const total = customer.cart.length;
    const products = populatedCustomer.cart;

    const pageCount = Math.ceil(total / pageSize);

    const pagination = {
      page: page,
      pageSize: pageSize,
      pageCount: pageCount,
      total: total,
    };

    return { products, pagination };
  }

  async addToCart(
    body: AddToCartDto,
    userId: string,
  ): Promise<{ product: Product; quantity: number }> {
    const quantity = 1;
    const product = await this.productsModel.findById(body.product_id).exec();

    if (!product) {
      throw Error(`Товар с id ${body.product_id}} не найден`);
    }
    const customer = await this.customersModel.findById(userId).exec();

    if (!customer) {
      throw Error(`Покупатель с id ${userId}} не найден`);
    }

    const isProductInCart = customer.cart.some((item) =>
      new Types.ObjectId(item.product).equals(body.product_id),
    );

    if (isProductInCart) {
      throw Error(`Товар с id ${body.product_id}} уже добавлен в корзину`);
    }

    await this.customersModel
      .findByIdAndUpdate(userId, {
        $push: { cart: { product: product._id, quantity } },
      })
      .exec();

    return { product, quantity };
  }

  async updateProductCart(
    id: string,
    userId: string,
    quantity: number,
  ): Promise<{ product: Product; quantity: number }> {
    const product = await this.productsModel.findById(id).exec();

    if (!product) {
      throw Error(`Товар с id ${id}} не найден`);
    }

    const customer = await this.customersModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          'cart.$[elem].quantity': quantity,
        },
      },
      {
        arrayFilters: [
          {
            'elem.product': new Types.ObjectId(id),
          },
        ],
      },
    );

    if (!customer) {
      throw Error(`Покупатель с id ${userId} не найден`);
    }

    return { product, quantity };
  }

  async removeFromCart(id: string, userId: string): Promise<Product> {
    const product = await this.productsModel.findById(id).exec();

    if (!product) {
      throw Error(`Товар с id ${id}} не найден`);
    }

    const customer = await this.customersModel
      .findByIdAndUpdate(userId, {
        $pull: { cart: { product: product._id } },
      })
      .exec();

    if (!customer) {
      throw Error(`Покупатель с id ${userId}} не найден`);
    }

    return product;
  }
}
