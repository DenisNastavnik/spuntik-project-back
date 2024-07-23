import { IsString, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

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

  readonly featured?: [mongoose.Schema.Types.ObjectId];

  readonly cart?: [mongoose.Schema.Types.ObjectId];

  readonly orders?: [mongoose.Schema.Types.ObjectId];

  readonly reviews?: mongoose.Types.ObjectId;

  readonly company_name?: string;

  readonly catalogue?: [mongoose.Schema.Types.ObjectId];
}
