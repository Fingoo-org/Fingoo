import { IndicatorType } from '../../../../../../utils/type/type-definition';
import { ApiProperty } from '@nestjs/swagger';

export type Indicator = {
  id: string;
  name: string;
  ticker: string;
  type: IndicatorType;
  exchange: string;
};

export class IndicatorDto {
  @ApiProperty({
    example: {
      id: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
      exchange: 'KOSPI',
      name: '삼성전자',
      ticker: '005930',
      type: 'stocks',
    },
    description: '지표 정보',
  })
  indicator: Indicator;

  private constructor(indicator: Indicator) {
    this.indicator = indicator;
  }

  static create(indicator: Indicator): IndicatorDto {
    return new IndicatorDto(indicator);
  }
}

export class IndicatorSwaggerSchema {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '지표 id',
  })
  id: string;

  @ApiProperty({
    example: '삼성전자',
    description: '지표 이름',
  })
  name: string;

  @ApiProperty({
    example: '005930',
    description: '지표 티커',
  })
  ticker: string;

  @ApiProperty({
    example: 'stocks',
    description: '지표 타입',
  })
  type: IndicatorType;

  @ApiProperty({
    example: 'KOSPI',
    description: '지표 시장',
  })
  exchange: string;
}
