import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Product } from '../products/products.schema';
import { Role, Roles } from '../decorators';
import { AddToFavoriteDto } from './dto/add-to-favorite';
import { PaginationQueryDto } from './dto/pagination-query';
import { AuthGuard, RolesGuard } from '../users';
import { UserRequest } from './favorites.types';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Получение избранных товаров по id покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Page size (default: 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get('favorites')
  async getFavorites(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Req() req: UserRequest,
  ): Promise<{ products: Product[]; pagination: PaginationQueryDto }> {
    try {
      const favoriteProducts = await this.favoritesService.getFavorites(
        req.user.sub,
        page,
        pageSize,
      );
      if (!favoriteProducts) {
        throw new HttpException(
          'Не удалось найти избранные товары',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return favoriteProducts;
    } catch (error) {
      throw new HttpException(
        'Ошибка при поиске избранных товаров',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Добавление в избранные товары покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post('favorites')
  async addToFavorites(
    @Body(new ValidationPipe({ transform: true })) body: AddToFavoriteDto,
    @Req() req: UserRequest,
  ): Promise<Product> {
    try {
      const favoriteProduct = await this.favoritesService.addToFavorites(body, req.user.sub);
      if (!favoriteProduct) {
        throw new HttpException(
          'Не удалось добавить в избранные товары',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return favoriteProduct;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Ошибка при добавлении в избранные товары',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Удаление из избранных товаров покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete('favorites/:id')
  async removeFromFavorites(@Param('id') id: string, @Req() req: UserRequest): Promise<Product> {
    try {
      const deletedFavorite = await this.favoritesService.removeFromFavorites(id, req.user.sub);
      if (!deletedFavorite) {
        throw new HttpException(
          'Не удалось удалить избранный товар',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return deletedFavorite;
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении избранного товара',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
