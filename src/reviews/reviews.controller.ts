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
import { ReviewsService } from './reviews.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../users';
import { Role, Roles } from '../decorators';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './reviews.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Создание нового отзыва' })
  @ApiResponse({ status: HttpStatus.OK, type: Review })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post('/create')
  async create(
    @Body(new ValidationPipe({ transform: true })) product: CreateReviewDto,
  ): Promise<Review> {
    try {
      return await this.reviewsService.create(product);
    } catch (error) {
      throw new HttpException('Ошибка при создании отзыва', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Получение всех отзывов' })
  @ApiResponse({ status: HttpStatus.OK, type: [Review] })
  @Get('/')
  async findAll(): Promise<Review[]> {
    try {
      const reviews = await this.reviewsService.findAll();
      if (!reviews) {
        throw new HttpException('Отзывы не найдены', HttpStatus.NOT_FOUND);
      }
      return reviews;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении всех заказов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Получение отзыва по id' })
  @ApiResponse({ status: HttpStatus.OK, type: Review })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    try {
      const review = await this.reviewsService.findOne(id);
      if (!review) {
        throw new HttpException('Отзыв не найден', HttpStatus.NOT_FOUND);
      }
      return review;
    } catch (error) {
      throw new HttpException('Ошибка при получении отзыва', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Получение отзывов по id' })
  @ApiResponse({ status: HttpStatus.OK, type: [Review] })
  @ApiBody({
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  @Post('/')
  async findMany(@Body('data') body: string[]): Promise<Review[]> {
    try {
      const reviews = await this.reviewsService.findMany(body);
      if (!reviews) {
        throw new HttpException('Отзывы не найдены', HttpStatus.NOT_FOUND);
      }
      return reviews;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении всех заказов',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Изменение отзыва' })
  @ApiResponse({ status: HttpStatus.OK, type: Review })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Review): Promise<Review> {
    try {
      const updatedReview = await this.reviewsService.update(id, product);

      if (!updatedReview) {
        throw new HttpException(
          'Не удалось обновить данные заказа',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return updatedReview;
    } catch (error) {
      throw new HttpException('Ошибка при изменении отзыва', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Удаление отзыва' })
  @ApiResponse({ status: HttpStatus.OK, type: Review })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Review> {
    try {
      return await this.reviewsService.delete(id);
    } catch (error) {
      throw new HttpException('Ошибка при удалении отзыва', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
