import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { VendorSchema } from './vendors.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema}])],
  providers: [VendorsService],
  controllers: [VendorsController]
})
export class VendorsModule {}