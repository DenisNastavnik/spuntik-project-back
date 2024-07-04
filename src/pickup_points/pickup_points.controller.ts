import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PickupPointsService } from './pickup_points.service';
import { PickupPoint } from './pickup_points.schema';

@Controller('pickup-points')
export class PickupPointsController {
  constructor(private readonly pickupPointsService: PickupPointsService) {}

  @ApiOperation({ summary: 'Получение списка всех точек выдачи' })
  @ApiResponse({ status: 200, type: [PickupPoint] })
  @Get()
  async findAll(): Promise<PickupPoint[]> {
    try {
      return await this.pickupPointsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении точек выдачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
