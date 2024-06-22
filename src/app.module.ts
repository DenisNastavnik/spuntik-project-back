import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { PickupPointsModule } from './pickup_points/pickup_points.module';
import { UsersModule } from './users/users.module';
import 'dotenv/config'

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.5roqj5k.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0`),
    ProductsModule,
    CustomersModule,
    VendorsModule,
    ReviewsModule,
    OrdersModule,
    PickupPointsModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
