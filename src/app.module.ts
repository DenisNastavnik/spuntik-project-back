import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { PickupPointsModule } from './pickup_points/pickup_points.module';
import { UsersModule } from './users/users.module';
import 'dotenv/config';
import { JwtModule } from '@nestjs/jwt';
import { FavoritesModule } from './favorites/favorites.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.5roqj5k.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    ProductsModule,
    CustomersModule,
    VendorsModule,
    ReviewsModule,
    OrdersModule,
    PickupPointsModule,
    FavoritesModule,
    UsersModule,
    CartModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '24h' },
    }),
    MinioClientModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
