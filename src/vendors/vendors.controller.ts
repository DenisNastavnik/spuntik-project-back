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
import { VendorsService } from './vendors.service';
import { Vendor } from './vendors.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [Vendor] })
  @Get()
  async findAll(): Promise<Vendor[]> {
    try {
      return await this.vendorsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении данных пользователей',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @ApiResponse({ status: 200, type: Vendor })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vendor | null> {
    try {
      const vendor = await this.vendorsService.findOne(id);
      if (!vendor) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      return vendor;
    } catch (error) {
      throw new HttpException('Ошибка при поиске пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Изменение пользователя по id' })
  @ApiResponse({ status: 200, type: Vendor })
  @Put(':id')
  async update(@Param('id') id: string, @Body() vendor: Vendor): Promise<Vendor> {
    try {
      const updatedVendor = await this.vendorsService.update(id, vendor);
      if (!updatedVendor) {
        throw new HttpException(
          'Не удалось обновить данные пользователя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updatedVendor;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении данных пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Удаление пользователя по id' })
  @ApiResponse({ status: 200, type: Vendor })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Vendor> {
    try {
      const deletedVendor = await this.vendorsService.delete(id);
      if (!deletedVendor) {
        throw new HttpException(
          'Не удалось удалить пользователя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return deletedVendor;
    } catch (error) {
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
