import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ProductSchema } from '../products/products.schema';
import { CustomerSchema } from '../customers/customers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
