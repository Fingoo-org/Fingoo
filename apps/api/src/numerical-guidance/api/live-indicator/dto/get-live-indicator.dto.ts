import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IsInterval } from '../../../../utils/validation/is.interval.validation';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType, Interval } from 'src/utils/type/type-definition';
import { Type } from 'class-transformer';

export class GetLiveIndicatorDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  @IsString()
  @IsUUID()
  readonly indicatorId: string;

  @ApiProperty({
    example: 'day',
    description: '변동지표 주가 정보의 간격(day, week, month, year)',
  })
  @IsString()
  @IsInterval()
  readonly interval: Interval;

  @ApiProperty({
    example: 'stocks',
    description:
      '지표 타입(stocks ,forex_pairs, cryptocurrencies, etf, indices, customForecastIndicator, funds, bonds)',
  })
  @IsString()
  readonly indicatorType: IndicatorType;

  @ApiProperty({
    example: '2024-02-27',
    description: '지표를 불러오는 기준이 되는 Date.',
  })
  @Type(() => String)
  @IsOptional()
  readonly startDate?: string = '' as any;
}
