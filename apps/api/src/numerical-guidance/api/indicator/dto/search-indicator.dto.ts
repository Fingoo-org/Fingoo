import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { IndicatorType } from '../../../../utils/type/type-definition';

export type DEFAULT_INDICATOR_TYPE = 'none';

export class SearchIndicatorDto {
  @ApiProperty({
    example: 'AA',
    description: '검색하려는 Symbol',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly symbol: string;

  @ApiProperty({
    example:
      'none | stocks | forex_pairs | cryptocurrencies | etf | indices | customForecastIndicator | funds | bonds | economy',
    description: '지표 type',
    required: false,
  })
  @IsString()
  @Type(() => String)
  readonly type: IndicatorType | DEFAULT_INDICATOR_TYPE = 'none';
}
