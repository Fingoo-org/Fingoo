import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType, IndicatorValue } from '../../../../../utils/type/type-definition';

export class LiveCryptoCurrenciesDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  readonly indicatorId: string;

  @ApiProperty({
    example: 'BTC/USD',
    description: '지표 symbol',
  })
  symbol: string;

  @ApiProperty({
    example: 'cryptocurrencies',
    description: '지표 종류',
  })
  type: IndicatorType;

  @ApiProperty({
    example: 'Bitcoin',
    description: '기초통화',
  })
  currency_base: string;

  @ApiProperty({
    example: 2,
    description: '지표 값들의 수',
  })
  totalCount: number;

  @ApiProperty({
    example: [
      {
        date: '20240126',
        value: '73400',
      },
      {
        date: '20240125',
        value: '74100',
      },
    ],
    description: '지표 값들',
  })
  values: IndicatorValue[];

  private constructor(
    indicatorId: string,
    symbol: string,
    type: IndicatorType,
    currency_base: string,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.indicatorId = indicatorId;
    this.symbol = symbol;
    this.type = type;
    this.currency_base = currency_base;
    this.totalCount = totalCount;
    this.values = values;
  }

  public static create({ id, symbol, type, currency_base, totalCount, values }): LiveCryptoCurrenciesDto {
    return new LiveCryptoCurrenciesDto(id, symbol, type, currency_base, totalCount, values);
  }
}
