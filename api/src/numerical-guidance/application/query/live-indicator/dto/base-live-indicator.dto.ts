import { IndicatorType, IndicatorValue, Market } from 'src/utils/type/type-definition';
import { ApiProperty } from '@nestjs/swagger';

export class BaseLiveIndicatorDto {
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
    example: '삼성전자',
    description: '지표명',
  })
  name: string;

  @ApiProperty({
    example: 'KOSPI',
    description: '주식 시장',
  })
  market: Market;

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

  constructor(
    indicatorId: string,
    type: IndicatorType,
    symbol: string,
    name: string,
    market: Market,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.indicatorId = indicatorId;
    this.type = type;
    this.symbol = symbol;
    this.name = name;
    this.market = market;
    this.totalCount = totalCount;
    this.values = values;
  }

  static create({ indicatorId, type, symbol, name, market, totalCount, values }): BaseLiveIndicatorDto {
    return new BaseLiveIndicatorDto(indicatorId, type, symbol, name, market, totalCount, values);
  }
}

export class IndicatorValueSwaggerSchema {
  @ApiProperty({
    example: '20240126',
    description: '지표값 날짜',
  })
  date: string;

  @ApiProperty({
    example: '73400',
    description: '지표값',
  })
  value: string;
}
