import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../customers/customers.schema';
import { Vendor } from 'src/vendors/vendors.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

enum UserRole {
  CUSTOMER = 'Customer',
  VENDOR = 'Vendor',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRole.CUSTOMER) private readonly customerModel: Model<Customer>,
    @InjectModel(UserRole.VENDOR) private readonly vendorModel: Model<Vendor>,
  ) {}

  private isModel(role: string) {
    let model;
    switch (role) {
      case UserRole.CUSTOMER:
        if (!this.customerModel) {
          throw new Error(`Модель для роли ${UserRole.CUSTOMER} не найдена`);
        }
        model = this.customerModel;
        break;
      case UserRole.VENDOR:
        if (!this.vendorModel) {
          throw new Error(`Модель для роли ${UserRole.VENDOR} не найдена`);
        }
        model = this.vendorModel;
        break;
      default:
        throw new Error(`Неподдерживаемый тип пользователя: ${role}`);
    }
    return model;
  }

  async findByEmailAndPassword(role: string, email: string, password: string) {
    const model: Model<Customer | Vendor> = this.isModel(role);
    const result = await model.findOne({ email }).exec();
    if (!result) {
      throw Error(`Пользователь с таким email не найден`);
    }
    const passwordMatch = await bcrypt.compare(password, result.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }
    return result;
  }

  async findByPhoneNumberAndPassword(role: string, phone_number: string, password: string) {
    const model: Model<Customer | Vendor> = this.isModel(role);
    const result = await model.findOne({ phone_number }).exec();
    if (!result) {
      throw Error(`Пользователь с таким номером телефона не найден`);
    }
    const passwordMatch = await bcrypt.compare(password, result.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }
    return result;
  }

  async findUserByEmailOrPhoneNumber(role: string, email?: string, phone_number?: string) {
    const model: Model<Customer | Vendor> = this.isModel(role);
    const result = email
      ? await model.findOne({ email }).exec()
      : phone_number
        ? model.findOne({ phone_number }).exec()
        : null;
    return result;
  }

  async createUser(role: string, userData: CreateUserDto) {
    const existingUser = await this.findUserByEmailOrPhoneNumber(
      role,
      userData.email,
      userData.phone_number,
    );
    if (existingUser) {
      throw new Error(`Пользователь с таким email или номером телефона уже существует`);
    }
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const model: Model<Customer | Vendor> = this.isModel(role);
    const newUser = await new model({
      ...userData,
      password: passwordHash,
    }).save();
    if (!newUser) {
      throw new Error('Произошла ошибка при регистрации пользователя');
    }
    return newUser;
  }
}
