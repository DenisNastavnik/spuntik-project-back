import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './reviews.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel('Review') private readonly reviewModel: Model<Review>) {}

  async create(product: CreateReviewDto): Promise<Review> {
    const newReview = new this.reviewModel(product);
    return await newReview.save();
  }

  async findOne(id: string): Promise<Review> {
    const result = await this.reviewModel.findById(id).exec();
    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }
    return result;
  }

  async findMany(body: string[]): Promise<Review[]> {
    const result = await this.reviewModel.find({ _id: { $in: body } }).exec();
    if (result === null) {
      throw Error(`Отзывы не найдены`);
    }
    return result;
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async update(id: string, review: Review): Promise<Review> {
    const result = await this.reviewModel.findByIdAndUpdate(id, review, { new: true });
    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }
    return result;
  }

  async delete(id: string): Promise<Review> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (result === null) {
      throw Error(`Отзыв с ${id} не найден`);
    }
    return result;
  }
}
