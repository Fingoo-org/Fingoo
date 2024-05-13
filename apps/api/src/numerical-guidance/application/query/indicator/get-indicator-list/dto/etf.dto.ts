import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '../../../../../../utils/type/type-definition';

export class ETFDto {
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
    example: 'etf',
    description: '지표 타입',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: 'SPY',
    description: '지표 심볼',
  })
  symbol: string;

  @ApiProperty({
    example: 'SPDR S&P 500 ETF Trust',
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
    example: 'NYSE',
    description: '거래소 종류',
  })
  exchange: string;

  @ApiProperty({
    example: 'XNYS',
    description: '증권 거래소 식별 코드',
  })
  mic_code: string;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    mic_code: string,
  ) {
    this.id = id;
    this.index = index;
    this.indicatorType = indicatorType;
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
    this.mic_code = mic_code;
  }

  public static create({ id, index, indicatorType, symbol, name, country, currency, exchange, mic_code }) {
    return new ETFDto(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code);
  }
}
