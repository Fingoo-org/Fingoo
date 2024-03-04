import { IsArray } from 'class-validator';
import { CursorPageMetaDto } from './cursor-page.meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CursorPageDto<T> {
  @ApiProperty({
    example: {
      indicator: {
        id: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
        name: '삼성전자',
        ticker: '005930',
        type: 'k-stock',
        market: 'KOSPI',
      },
      values: [
        {
          date: '20240226',
          value: '72.8',
        },
        {
          date: '20240223',
          value: '72.9',
        },
      ],
    },
    description: 'cursor data',
  })
  @IsArray()
  readonly data: T;

  @ApiProperty({
    example: {
      total: 2,
      hasNextData: true,
      cursor: '20240222',
    },
    description: 'cursor metadata',
  })
  readonly meta: CursorPageMetaDto;

  constructor(data: T, meta: CursorPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
