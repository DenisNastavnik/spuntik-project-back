import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ description: 'Номер текущей страница' })
  page: number;

  @ApiProperty({ description: 'Размер страницы' })
  pageSize: number;

  @ApiProperty({ description: 'Общее количество страниц с продуктами' })
  pageCount: number;

  @ApiProperty({ description: 'Количество продуктов' })
  total: number;
}
