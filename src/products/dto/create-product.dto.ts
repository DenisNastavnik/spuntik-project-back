import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Видеокарта GeForce', description: 'Name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example:
      'Видеокарта Colorful iGame GeForce RTX 4070 Ultra W OC создана для компьютерных энтузиастов.',
    description: 'Description',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: '5000', description: 'Price' })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ example: 'Видеокарты', description: 'Category' })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Электроника',
    'Одежда',
    'Обувь',
    'Дом и сад',
    'Детские товары',
    'Красота и здоровье',
    'Бытовая техника',
    'Спорт и отдых',
    'Книги',
    'Товары для животных',
  ])
  readonly category: string;

  @ApiProperty({ example: 'https://picsum.photos/HttpStatus.OK', description: 'Thumbnail' })
  @IsString()
  @IsNotEmpty()
  readonly thumbnail: string;

  @ApiProperty({
    example:
      '["https://picsum.photos/id/4/HttpStatus.OK/300", "https://picsum.photos/id/1/HttpStatus.OK/300", "https://picsum.photos/id/8/HttpStatus.OK/300"]',
    description: 'Images',
  })
  @IsNotEmpty()
  readonly images: string[];

  @ApiProperty({ example: '666fe22053ea02ab64d03359', description: 'Vendor id' })
  @IsString()
  @IsNotEmpty()
  readonly vendor_id: string;

  @ApiProperty({ example: 10, description: 'Остаток товара' })
  @IsNotEmpty()
  @IsNumber()
  remaining: number;
}
