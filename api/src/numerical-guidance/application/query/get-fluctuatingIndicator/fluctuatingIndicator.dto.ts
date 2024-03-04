import { IndicatorType, Market } from 'src/utils/type/type-definition';
import { ApiProperty } from '@nestjs/swagger';

export type IndicatorValue = {
  date: string;
  value: string;
};

export class FluctuatingIndicatorDto {
  @ApiProperty({
    example: 'k-stock',
    description: '지표 종류',
  })
  type: IndicatorType;

  @ApiProperty({
    example: '005930',
    description: 'krx 고유 티커번호',
  })
  ticker: string;

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
    example: 67,
    description: 'cursor metadata',
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
    description: 'cursor metadata',
  })
  values: IndicatorValue[];

  private constructor(
    type: IndicatorType,
    ticker: string,
    name: string,
    market: Market,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.type = type;
    this.ticker = ticker;
    this.name = name;
    this.market = market;
    this.totalCount = totalCount;
    this.values = values;
  }

  static create({ type, ticker, name, market, totalCount, values }): FluctuatingIndicatorDto {
    return new FluctuatingIndicatorDto(type, ticker, name, market, totalCount, values);
  }
}
export { IndicatorType };

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
