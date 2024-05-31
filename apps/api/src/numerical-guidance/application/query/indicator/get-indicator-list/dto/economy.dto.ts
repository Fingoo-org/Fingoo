import { ApiProperty } from '@nestjs/swagger';
import { FredFrequency, IndicatorType } from '../../../../../../utils/type/type-definition';

export class EconomyDto {
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
    example: 'economy',
    description: '지표 타입',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: 'BOPBCA',
    description: '지표 심볼',
  })
  symbol: string;

  @ApiProperty({
    example: 'Gross Domestic Product',
    description: '지표명',
  })
  name: string;

  @ApiProperty({
    example: 'Quarterly',
    description: '빈도',
  })
  frequency: FredFrequency;

  @ApiProperty({
    example: 'Q',
    description: '빈도 약어',
  })
  frequency_short: string;

  @ApiProperty({
    example: 'Billions of Dollars',
    description: '단위',
  })
  units: string;

  @ApiProperty({
    example: 'Bil. $',
    description: '단위 약어',
  })
  units_short: string;

  @ApiProperty({
    example: 'Seasonally Adjusted Annual Rate',
    description: '계절 조정',
  })
  seasonal_adjustment: string;

  @ApiProperty({
    example: 'SAAR',
    description: '계절 조정 약어',
  })
  seasonal_adjustment_short: string;

  @ApiProperty({
    example: 'GDP is the total value of goods produced and services provided in a country during one year.',
    description: '비고',
  })
  notes: string;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    frequency: FredFrequency,
    frequency_short: string,
    units: string,
    units_short: string,
    seasonal_adjustment: string,
    seasonal_adjustment_short: string,
    notes: string,
  ) {
    this.id = id;
    this.index = index;
    this.indicatorType = indicatorType;
    this.symbol = symbol;
    this.name = name;
    this.frequency = frequency;
    this.frequency_short = frequency_short;
    this.units = units;
    this.units_short = units_short;
    this.seasonal_adjustment = seasonal_adjustment;
    this.seasonal_adjustment_short = seasonal_adjustment_short;
    this.notes = notes;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    frequency,
    frequency_short,
    units,
    units_short,
    seasonal_adjustment,
    seasonal_adjustment_short,
    notes,
  }) {
    return new EconomyDto(
      id,
      index,
      indicatorType,
      symbol,
      name,
      frequency,
      frequency_short,
      units,
      units_short,
      seasonal_adjustment,
      seasonal_adjustment_short,
      notes,
    );
  }
}
