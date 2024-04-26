import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType, IndicatorValue } from '../../../../../../utils/type/type-definition';

export class LiveForexPairDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  readonly indicatorId: string;

  @ApiProperty({
    example: '005930',
    description: '지표 symbol',
  })
  symbol: string;

  @ApiProperty({
    example: 'stocks',
    description: '지표 종류',
  })
  type: IndicatorType;

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
    currency_group: string,
    currency_base: string,
    currency_quote: string,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.indicatorId = indicatorId;
    this.symbol = symbol;
    this.type = type;
    this.currency_group = currency_group;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
    this.totalCount = totalCount;
    this.values = values;
  }

  public static create({
    id,
    symbol,
    type,
    currency_group,
    currency_base,
    currency_quote,
    totalCount,
    values,
  }): LiveForexPairDto {
    return new LiveForexPairDto(id, symbol, type, currency_group, currency_base, currency_quote, totalCount, values);
  }
}
