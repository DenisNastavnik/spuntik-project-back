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
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard, RolesGuard } from '../users';
import { Role, Roles } from '../decorators';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Получение всех товаров' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get('/')
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Получение категорий' })
  @Get('/categories')
  async findAllCategories(): Promise<string[]> {
    return await this.productsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Получение продуктов по категории' })
  @Post()
  async findProductsByCategory(@Body('category') category: string): Promise<Product[]> {
    return this.productsService.findProductsByCategory(category);
  }

  @ApiOperation({ summary: 'Получение товара по id' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return await this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Создание нового товара' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post('/create')
  async create(
    @Body(new ValidationPipe({ transform: true })) product: CreateProductDto,
  ): Promise<Product> {
    return await this.productsService.create(product);
  }

  @ApiOperation({ summary: 'Изменение товара' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Product): Promise<Product> {
    return await this.productsService.update(id, product);
  }

  @ApiOperation({ summary: 'Удаление товара' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product> {
    return await this.productsService.delete(id);
  }
}
