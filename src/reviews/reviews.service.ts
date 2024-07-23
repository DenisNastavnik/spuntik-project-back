import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './reviews.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Customer } from '../customers';
import { Product } from '../products/products.schema';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    @InjectModel('Customer') private customersModel: Model<Customer>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(review: CreateReviewDto): Promise<Review> {
    const newReview = await new this.reviewModel(review).populate({
      path: 'product_id',
      select: 'name thumbnail',
    });

    await this.customersModel
      .findByIdAndUpdate(newReview.customer_id, { reviews: newReview._id })
      .exec();

    await this.productModel
      .findByIdAndUpdate(newReview.product_id, { $push: { reviews: newReview._id } })
      .exec();

    return await newReview.save();
  }

  async findOne(id: string): Promise<Review> {
    const result = await this.reviewModel
      .findById(id)
      .populate({ path: 'product_id', select: 'name thumbnail' })
      .exec();

    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }
    return result;
  }

  async findMany(ids: string[]): Promise<Review[]> {
    const result = await this.reviewModel
      .find({ _id: { $in: ids } })
      .populate({ path: 'product_id', select: 'name thumbnail' })
      .exec();

    if (result === null) {
      throw Error(`Отзывы не найдены`);
    }
    return result;
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel
      .find()
      .populate({ path: 'product_id', select: 'name thumbnail' })
      .exec();
  }

  async update(id: string, review: UpdateReviewDto): Promise<Review> {
    const result = await this.reviewModel
      .findByIdAndUpdate(id, review, { new: true })
      .populate({ path: 'product_id', select: 'name thumbnail' })
      .exec();
    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }
    return result;
  }

  async delete(id: string): Promise<Review> {
    const result = await this.reviewModel
      .findByIdAndDelete(id)
      .populate({ path: 'product_id', select: 'name thumbnail' });

    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }

    await this.customersModel
      .findByIdAndUpdate(result?.customer_id, {
        reviews: '',
      })
      .exec();

    await this.productModel
      .findByIdAndUpdate(result.product_id, {
        $pull: { reviews: result._id },
      })
      .exec();

    return result;
  }
}
