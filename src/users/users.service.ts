import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../customers/customers.schema';
import { Vendor } from 'src/vendors/vendors.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const UserRole = {
  Customer: 'Customer',
  Vendor: 'Vendor',
} as const;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserRole.Customer) private readonly customerModel: Model<Customer>,
    @InjectModel(UserRole.Vendor) private readonly vendorModel: Model<Vendor>,
    private jwtService: JwtService,
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

  public async findUserByEmailAndPassword(role: string, email: string, pass: string) {
    const model = this.getModelByRole(role);
    const user = await model.findOne({ email }).exec();
    if (!user) {
      throw new Error('Пользователь с такими данными не найден');
    }
    this.checkPasword(pass, user.password);
    const payload = { sub: user._id, email: user.email, roles: role };
    const { password, ...result } = user.toObject();
    return { user: result, access_token: await this.jwtService.signAsync(payload) };
  }

  public async findUserByPhoneNumberAndPassword(role: string, phone_number: string, pass: string) {
    const model = this.getModelByRole(role);
    const user = await model.findOne({ phone_number }).exec();
    if (!user) {
      throw new Error('Пользователь с такими данными не найден');
    }
    this.checkPasword(pass, user.password);
    const payload = { sub: user._id, phone_number: user.phone_number, roles: role };
    const { password, ...result } = user.toObject();
    return { user: result, access_token: await this.jwtService.signAsync(payload) };
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
    const { password, ...result } = newUser.toObject();
    const payload = { sub: newUser._id, phone_number: newUser.phone_number, roles: role };

    return { user: result, access_token: await this.jwtService.signAsync(payload) };
  }
}
