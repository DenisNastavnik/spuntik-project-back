import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PickupPointsService } from './pickup_points.service';
import { PickupPoint } from './pickup_points.schema';

@Controller('pickup-points')
export class PickupPointsController {
  constructor(private readonly pickupPointsService: PickupPointsService) {}

  @ApiOperation({ summary: 'Получение списка всех точек выдачи' })
  @ApiResponse({ status: HttpStatus.OK, type: [PickupPoint] })
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

  @ApiOperation({ summary: 'Получение точки выдачи по ID' })
  @ApiResponse({ status: HttpStatus.OK, type: PickupPoint })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PickupPoint> {
    try {
      return await this.pickupPointsService.findPickupPointById(id);
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении точки выдачи',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
