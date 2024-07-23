import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './reviews.schema';
import { CustomerSchema } from '../customers/customers.schema';
import { ProductSchema } from '../products/products.schema';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    CustomersModule,
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
