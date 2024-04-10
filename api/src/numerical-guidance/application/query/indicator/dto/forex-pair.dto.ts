import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '../../../../../utils/type/type-definition';

export class ForexPairDto {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '지표 id',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: '지표 인덱스(페이지네이션 id)',
  })
  index: number;

  @ApiProperty({
    example: 'currency_group',
    description: '지표 타입',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: 'EUR/USD',
    description: '지표 심볼',
  })
  symbol: string;

  @ApiProperty({
    example: 'Major',
    description: '통화 그룹',
  })
  currency_group: string;

  @ApiProperty({
    example: 'Euro',
    description: '기초통화',
  })
  currency_base: string;

  @ApiProperty({
    example: 'US Dollar',
    description: '인용통화',
  })
  currency_quote: string;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    currency_group: string,
    currency_base: string,
    currency_quote: string,
  ) {
    this.id = id;
    this.index = index;
    this.indicatorType = indicatorType;
    this.symbol = symbol;
    this.currency_group = currency_group;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
  }

  public static create({ id, index, indicatorType, symbol, currency_group, currency_base, currency_quote }) {
    return new ForexPairDto(id, index, indicatorType, symbol, currency_group, currency_base, currency_quote);
  }
}
