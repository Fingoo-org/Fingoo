import { IndicatorType } from '../../../../../../utils/type/type-definition';
import { ApiProperty } from '@nestjs/swagger';

export class BondsDto {
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
    example: 'bonds',
    description: '지표 타입',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: '0P00000AMG',
    description: '지표 심볼',
  })
  symbol: string;

  @ApiProperty({
    example: 'Morgan Stanley Investment Funds - Sustainable Asia Equity Fund B',
    description: '지표명',
  })
  name: string;

  @ApiProperty({
    example: 'United States',
    description: '해당 지표의 국가',
  })
  country: string;

  @ApiProperty({
    example: 'USD',
    description: '통화',
  })
  currency: string;

  @ApiProperty({
    example: 'OTC',
    description: '거래소 종류',
  })
  exchange: string;

  @ApiProperty({
    example: 'Mutual Fund',
    description: '채권 타입',
  })
  type: string;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    type: string,
  ) {
    this.id = id;
    this.index = index;
    this.indicatorType = indicatorType;
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
    this.type = type;
  }

  public static create({ id, index, indicatorType, symbol, name, country, currency, exchange, type }) {
    return new BondsDto(id, index, indicatorType, symbol, name, country, currency, exchange, type);
  }
}
