import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Customer } from '../customers/customers.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Vendor } from 'src/vendors/vendors.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Аутентификация пользователя по email и password' })
  @Post('/loginByEmail')
  async findByEmailAndPassword(
    @Body('role') role: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Customer | Vendor> {
    return await this.userService.findByEmailAndPassword(role, email, password);
  }

  @ApiOperation({ summary: 'Аутентификация пользователя по phone_number и password' })
  @Post('/loginByPhone')
  async findByPhoneNumberAndPassword(
    @Body('role') role: string,
    @Body('phone_number') phone_number: string,
    @Body('password') password: string,
  ): Promise<Customer | Vendor> {
    return await this.userService.findByPhoneNumberAndPassword(role, phone_number, password);
  }

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @Post('/registration')
  async createUser(@Body('role') role: string, @Body() userData: CreateUserDto) {
    const user = plainToClass(CreateUserDto, userData);
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Ошибка валидации данных', errors: errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!role || (role !== 'customer' && role !== 'vendor')) {
      throw new HttpException(
        { message: 'Некорректное значение роли пользователя' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userService.createUser(role, userData);
  }
}
