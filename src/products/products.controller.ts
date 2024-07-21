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
  Query,
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
  async findProductsByCategory(
    @Body('category') category: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<Product[]> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.productsService.findProductsByCategory(category, pageNum, limitNum);
  }

  @ApiOperation({ summary: 'Получение характеристик для фильтра' })
  @Get('/characteristic')
  async findCharacteristic(): Promise<string[]> {
    return this.productsService.findCharacteristic();
  }

  @ApiOperation({
    summary: 'Получение продуктов по фильтру',
  })
  @Post('/processed')
  async findProductsFilteredAndSorted(
    @Body('category') category: string,
    @Body('characteristics') characteristics: string[][] = [],
    @Body('rating') rating?: number,
    @Body('min') min?: number,
    @Body('max') max?: number,
    @Body('sortBy') sortBy: string = 'createdAt',
    @Body('order') order: 'asc' | 'desc' = 'desc',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<{ products: Product[]; totalPages: number }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filters = {
      characteristics: characteristics.map(([characteristic, value]) => ({
        characteristic,
        value,
      })),
      rating,
      min,
      max,
    };

    return this.productsService.findProductsFilteredAndSorted(
      category,
      filters,
      sortBy,
      order,
      pageNum,
      limitNum,
    );
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
