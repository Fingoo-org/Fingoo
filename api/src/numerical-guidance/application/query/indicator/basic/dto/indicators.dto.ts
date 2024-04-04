import { Indicator } from './indicator.dto';
import { ApiProperty } from '@nestjs/swagger';

export class IndicatorsDto {
  @ApiProperty({
    example: [
      {
        id: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
        market: 'KOSPI',
        name: '삼성전자',
        ticker: '005930',
        type: 'stocks',
      },
      {
        id: 'ffd70fe4-d422-47f8-977e-69b9ea83cb8a',
        market: 'KOSDAQ',
        name: '이스트아시아',
        ticker: '900110',
        type: 'stocks',
      },
    ],
    description: '지표 정보',
  })
  indicators: Indicator[];

  private constructor(indicators: Indicator[]) {
    this.indicators = indicators;
  }

  static create(indicators: Indicator[]): IndicatorsDto {
    const resultIndicators: Indicator[] = indicators.map((indicator) => ({
      id: indicator.id,
      market: indicator.market,
      name: indicator.name,
      ticker: indicator.ticker,
      type: indicator.type,
    }));
    return new IndicatorsDto(resultIndicators);
  }
}
