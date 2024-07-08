import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './orders.service';
import { Order } from './orders.schema';
import { Roles } from 'src/decorators';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard, RolesGuard } from 'src/users';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Получение всех заказов' })
  @ApiResponse({ status: 200, type: [Order] })
  @Get()
  async findAll(): Promise<Order[]> {
    try {
      return await this.orderService.findAll();
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении всех заказов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Получение заказа по id' })
  @ApiResponse({ status: 200, type: Order })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order | null> {
    try {
      const order = await this.orderService.findOne(id);
      if (!order) {
        throw new HttpException('Заказ не найден', HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new HttpException('Ошибка при получении заказа', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Customer')
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiResponse({ status: 201, type: Order })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) order: CreateOrderDto,
  ): Promise<Order> {
    try {
      const newOrder = await this.orderService.create(order);
      return newOrder;
    } catch (error) {
      throw new HttpException('Ошибка при создании заказа', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Customer')
  @ApiOperation({ summary: 'Изменение заказа по id' })
  @ApiResponse({ status: 200, type: Order })
  @Put(':id')
  async update(@Param('id') id: string, @Body() order: Order): Promise<Order> {
    try {
      const updatedOrder = await this.orderService.update(id, order);
      if (!updatedOrder) {
        throw new HttpException(
          'Не удалось обновить данные заказа',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updatedOrder;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении данных заказа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Customer')
  @ApiOperation({ summary: 'Удаление заказа по id' })
  @ApiResponse({ status: 200, type: Order })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Order> {
    try {
      const deletedOrder = await this.orderService.delete(id);
      if (!deletedOrder) {
        throw new HttpException('Не удалось удалить заказ', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return deletedOrder;
    } catch (error) {
      throw new HttpException('Ошибка при удалении заказа', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
