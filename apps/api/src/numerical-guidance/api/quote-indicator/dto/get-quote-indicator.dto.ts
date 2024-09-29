import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '../../../../utils/type/type-definition';
import { IsIndicatorType } from '../../../../utils/validation/is.indicator-type.validation';
import { QuoteIndicatorIntervalEnum } from '../../../../utils/enum/enum-definition';

export class GetQuoteIndicatorDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  @IsString()
  @IsUUID()
  readonly indicatorId: string;

  @ApiProperty({
    example: 'AAPL',
    description: '금융 상품의 심볼 티커 (예: AAPL, EUR/USD, ETH/BTC 등)',
  })
  @IsString()
  readonly symbol: string;

  @ApiProperty({
    example: 'stocks',
    description:
      '지표 타입 (예: stocks ,forex_pairs, cryptocurrencies, etf, indices, customForecastIndicator, funds, bonds)',
  })
  @IsString()
  @IsIndicatorType()
  readonly indicatorType: IndicatorType;

  @ApiProperty({
    example: '9',
    description: '평균 거래량을 위한 기간 수 (기본값 9)',
    required: false,
  })
  @IsOptional()
  @IsString()
  volume_time_period?: string = '9';

  @ApiProperty({
    example: 'XNYX',
    description: 'ISO 10383 표준에 따른 시장 식별 코드',
    required: false,
  })
  @IsOptional()
  @IsString()
  mic_code?: string = '';

  @ApiProperty({
    example: 'true',
    description: 'true일 경우, 마감일 데이터를 반환 (단 interval이 1day여야 함)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  eod?: boolean = false;

  @ApiProperty({
    example: '1day',
    description: '견적 간격 (지원: 1min, 5min, 15min, 30min, 1day 등; 기본값 1day)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['1min', '5min', '15min', '30min', '1day'])
  interval?: QuoteIndicatorIntervalEnum = QuoteIndicatorIntervalEnum.DAY1;

  @ApiProperty({
    example: 'Asia/Seoul',
    description: '기준 timezone',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string = 'Asia/Seoul';
}
