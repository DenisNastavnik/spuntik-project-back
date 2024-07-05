import { Module } from '@nestjs/common';
import { PickupPointsService } from './pickup_points.service';
import { PickupPointsController } from './pickup_points.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PickupPointSchema } from './pickup_points.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'PickupPoint', schema: PickupPointSchema }])],
  providers: [PickupPointsService],
  controllers: [PickupPointsController],
})
export class PickupPointsModule {}
