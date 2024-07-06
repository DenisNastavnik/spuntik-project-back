import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../users/users.guard';
import { Roles } from '../decorators/roles.decorators';
import { RolesGuard } from '../users/roles.guard';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Получение всех товаров' })
  @ApiResponse({ status: 200, type: [Product] })
  @Get('/')
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Получение категорий' })
  @Get('/categories')
  async findAllCategories(): Promise<string[]> {
    return await this.productsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Получение товара по id' })
  @ApiResponse({ status: 200, type: Product })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Создание нового товара' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Vendor')
  @Post('/create')
  async create(
    @Body(new ValidationPipe({ transform: true })) product: CreateProductDto,
  ): Promise<Product> {
    return await this.productsService.create(product);
  }

  @ApiOperation({ summary: 'Изменение товара' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Vendor')
  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Product): Promise<Product> {
    return await this.productsService.update(id, product);
  }

  @ApiOperation({ summary: 'Удаление товара' })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Vendor')
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product> {
    return await this.productsService.delete(id);
  }
}
