import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Product } from '../products/products.schema';
import { AuthGuard, RolesGuard } from '../users';
import { Role, Roles } from '../decorators';
import { AddToCartDto } from './dto/add-to-cart';
import { UserRequest } from './cart.types';
import { UpdateProductCartDto } from './dto/update-product-cart';
import { PaginationQueryDto } from './dto/pagination-query';
import { OrderProduct } from './cart.schema';
import { GetResponseDto, ResponseDto } from './dto/response';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Получение корзины покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: GetResponseDto })
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
  @Get('cart')
  async getCartProducts(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Req() req: UserRequest,
  ): Promise<{ products: OrderProduct[]; pagination: PaginationQueryDto }> {
    try {
      const cartProducts = await this.cartService.getCartProducts(req.user.sub, page, pageSize);
      if (!cartProducts) {
        throw new HttpException(
          'Не удалось найти товары в корзине',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return cartProducts;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Ошибка при поиске товаров в корзине',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Добавление товара в корзину покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Post('cart')
  async addToCart(
    @Body(new ValidationPipe({ transform: true })) body: AddToCartDto,
    @Req() req: UserRequest,
  ): Promise<{ product: Product; quantity: number }> {
    try {
      const product = await this.cartService.addToCart(body, req.user.sub);
      if (!product) {
        throw new HttpException(
          'Не удалось добавить в корзину покупателя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return product;
    } catch (error) {
      throw new HttpException(
        'Ошибка при добавлении в корзину покупателя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Изменение количество товара в корзине покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put('cart/:id')
  async updateProductCart(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) body: UpdateProductCartDto,
    @Req() req: UserRequest,
  ): Promise<{ product: Product; quantity: number }> {
    try {
      const updatedQuantityProduct = await this.cartService.updateProductCart(
        id,
        req.user.sub,
        body.quantity,
      );
      if (!updatedQuantityProduct) {
        throw new HttpException(
          'Не удалось изменить количество товара в корзине покупателя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updatedQuantityProduct;
    } catch (error) {
      throw new HttpException(
        'Ошибка при изменении количества товара в корзине покупателя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Удаление товара из корзины покупателя' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Delete('cart/:id')
  async removeFromCart(@Param('id') id: string, @Req() req: UserRequest): Promise<Product> {
    try {
      const deletedProduct = await this.cartService.removeFromCart(id, req.user.sub);
      if (!deletedProduct) {
        throw new HttpException(
          'Не удалось удалить товар из корзины покупателя',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return deletedProduct;
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении товара из корзины покупателя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
