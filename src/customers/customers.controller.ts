import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from './customers.schema';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [Customer] })
  @Get()
  async findAll(): Promise<Customer[]> {
    try {
      return await this.customersService.findAll();
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении данных пользователей',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @ApiResponse({ status: 200, type: Customer })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer | null> {
    try {
      const customer = await this.customersService.findOne(id);
      if (!customer) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return customer;
    } catch (error) {
      throw new HttpException('Ошибка при поиске пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Изменение пользователя по id' })
  @ApiResponse({ status: 200, type: Customer })
  @Put(':id')
  async update(@Param('id') id: string, @Body() customer: Customer): Promise<Customer> {
    try {
      const updatedCustomer = await this.customersService.update(id, customer);
      if (!updatedCustomer) {
        throw new HttpException(
          'Не удалось обновить данные пользователя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updatedCustomer;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении данных пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Удаление пользователя по id' })
  @ApiResponse({ status: 200, type: Customer })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Customer> {
    try {
      const deletedCustomer = await this.customersService.delete(id);
      if (!deletedCustomer) {
        throw new HttpException(
          'Не удалось удалить пользователя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return deletedCustomer;
    } catch (error) {
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
