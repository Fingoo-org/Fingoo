import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { IndicatorType } from '../../../../utils/type/type-definition';
import { Type } from 'class-transformer';

export class InsertIndicatorDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  @IsString()
  @IsUUID()
  readonly indicatorId: string;

  @ApiProperty({
    example: 'stocks',
    description:
      '지표 타입(stocks ,forex_pairs, cryptocurrencies, etf, indices, customForecastIndicator, funds, bonds)',
  })
  @Type(() => String)
  @IsString()
  readonly indicatorType: IndicatorType;
}
