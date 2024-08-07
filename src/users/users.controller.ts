import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SignInUserDto } from './dto/signin-user.dto';
import { Role } from '../decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Аутентификация пользователя по email и password' })
  @Post('/loginByEmail')
  async findByEmailAndPassword(
    @Body('role') role: Role,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ user: SignInUserDto; access_token: string }> {
    return await this.userService.findUserByEmailAndPassword(role, email, password);
  }

  @ApiOperation({ summary: 'Аутентификация пользователя по phone_number и password' })
  @Post('/loginByPhone')
  async findByPhoneNumberAndPassword(
    @Body('role') role: Role,
    @Body('phone_number') phone_number: string,
    @Body('password') password: string,
  ): Promise<{ user: SignInUserDto; access_token: string }> {
    return await this.userService.findUserByPhoneNumberAndPassword(role, phone_number, password);
  }

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @Post('/registration')
  async createUser(@Body('role') role: Role, @Body() userData: CreateUserDto) {
    const user = plainToClass(CreateUserDto, userData);
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Ошибка валидации данных', errors: errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!role || (role !== Role.Customer && role !== Role.Vendor)) {
      throw new HttpException(
        { message: 'Некорректное значение роли пользователя' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userService.createUser(role, userData);
  }
}
