import { IsString, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { OrderProduct } from '../../cart/cart.schema';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  readonly phone_number: string;

  readonly featured?: mongoose.Types.ObjectId[];

  readonly cart?: OrderProduct[];

  readonly orders?: [mongoose.Schema.Types.ObjectId];

  readonly reviews?: mongoose.Types.ObjectId[];

  readonly company_name?: string;

  readonly catalogue?: [mongoose.Schema.Types.ObjectId];
}
