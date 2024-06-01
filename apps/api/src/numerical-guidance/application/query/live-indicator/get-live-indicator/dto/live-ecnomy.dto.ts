import { ApiProperty } from '@nestjs/swagger';
import { FredFrequency, IndicatorType, IndicatorValue } from '../../../../../../utils/type/type-definition';

export class LiveEconomyDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  readonly indicatorId: string;

  @ApiProperty({
    example: 'GNPCA',
    description: '지표 symbol',
  })
  readonly symbol: string;

  @ApiProperty({
    example: 'day',
    description: 'fred frequency | Daily, Weekly, Biweekly, Monthly, Quarterly, Semiannual, Annual',
  })
  readonly interval: FredFrequency;

  @ApiProperty({
    example: 'economy',
    description: '지표 종류',
  })
  readonly type: IndicatorType;

  @ApiProperty({
    example: 'Gross Domestic Product',
    description: '지표명',
  })
  readonly name: string;

  @ApiProperty({
    example: 2,
    description: '지표 값들의 수',
  })
  readonly totalCount: number;

  private constructor(
    indicatorId: string,
    symbol: string,
    interval: FredFrequency,
    type: IndicatorType,
    name: string,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.indicatorId = indicatorId;
    this.symbol = symbol;
    this.interval = interval;
    this.type = type;
    this.name = name;
    this.totalCount = totalCount;
    this.values = values;
  }

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

  public static create({ indicatorId, symbol, interval, type, name, totalCount, values }): LiveEconomyDto {
    return new LiveEconomyDto(indicatorId, symbol, interval, type, name, totalCount, values);
  }
}
