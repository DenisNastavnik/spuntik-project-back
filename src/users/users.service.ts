import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../customers/customers.schema';
import { Vendor } from 'src/vendors/vendors.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';

const UserRole = {
  Customer: 'Customer',
  Vendor: 'Vendor',
} as const;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRole.Customer) private readonly customerModel: Model<Customer>,
    @InjectModel(UserRole.Vendor) private readonly vendorModel: Model<Vendor>,
  ) {}

  private getModelByRole(role: string): Model<Customer | Vendor> {
    switch (role) {
      case UserRole.Customer: {
        if (!this.customerModel) {
          throw new Error(`Модель для роли ${UserRole.Customer} не найдена`);
        }
        return this.customerModel;
      }
      case UserRole.Vendor: {
        if (!this.vendorModel) {
          throw new Error(`Модель для роли ${UserRole.Vendor} не найдена`);
        }
        return this.vendorModel;
      }
      default: {
        throw new Error(`Неподдерживаемый тип пользователя: ${role}`);
      }
    }
  }

  private async checkPasword(password: string, resultPassword: string) {
    const passwordMatch = await compare(password, resultPassword);
    if (!passwordMatch) {
      throw new Error('Ошибка при попытке входа');
    }
  }

  public async findUserByEmailAndPassword(role: string, email: string, password: string) {
    const model = this.getModelByRole(role);
    const result = await model.findOne({ email }).exec();
    if (!result) {
      throw new Error('Пользователь с такими данными не найден');
    }
    this.checkPasword(password, result.password);
    return result;
  }

  public async findUserByPhoneNumberAndPassword(
    role: string,
    phone_number: string,
    password: string,
  ) {
    const model = this.getModelByRole(role);
    const result = await model.findOne({ phone_number }).exec();
    if (!result) {
      throw new Error('Пользователь с такими данными не найден');
    }
    this.checkPasword(password, result.password);
    return result;
  }

  private async findUserByEmailOrPhoneNumber(role: string, email?: string, phoneNumber?: string) {
    const model = this.getModelByRole(role);
    if (email) {
      return await model.exists({ email }).exec();
    }
    if (phoneNumber) {
      return await model.exists({ phoneNumber }).exec();
    }
    return false;
  }

  public async createUser(role: string, userData: CreateUserDto) {
    const existingUser = await this.findUserByEmailOrPhoneNumber(
      role,
      userData.email,
      userData.phone_number,
    );
    if (existingUser) {
      throw new Error('Пользователь с таким данными уже существует');
    }
    const passwordHash = await hash(userData.password, 10);
    const model = this.getModelByRole(role);
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
