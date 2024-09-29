import { IndicatorQuoteData } from '../interface/quote-indicator-data.interface';
import { QuoteIndicatorFiftyTwoWeekDto } from './quote-indicator.fify-two-week.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from 'src/utils/type/type-definition';

export class BaseQuoteIndicatorDto implements IndicatorQuoteData {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  readonly indicatorId: string;

  @ApiProperty({
    example: 'AAPL',
    description: '금융 상품 symbol',
  })
  symbol: string;

  @ApiProperty({
    example: 'stocks',
    description: '지표 종류',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: 'Apple Inc',
    description: '금융 상품 이름',
  })
  name: string;

  @ApiProperty({
    example: 'NASDAQ',
    description: '거래소',
  })
  exchange: string;

  @ApiProperty({
    example: '2024-08-30',
    description: '날짜 및 시간',
  })
  datetime: string;

  @ApiProperty({
    example: 1725024600,
    description: '타임스탬프 (Unix 시간 형식)',
  })
  timestamp: number;

  @ApiProperty({
    example: '230.19000',
    description: '시작가',
  })
  open: string;

  @ApiProperty({
    example: '230.39999',
    description: '최고가',
  })
  high: string;

  @ApiProperty({
    example: '227.48000',
    description: '최저가',
  })
  low: string;

  @ApiProperty({
    example: '229.00000',
    description: '종가',
  })
  close: string;

  @ApiProperty({
    example: '229.78999',
    description: '전일 종가',
  })
  previous_close: string;

  @ApiProperty({
    example: '-0.78999',
    description: '변화 금액(오늘 종가와 이전 종가의 차이)',
  })
  change: string;

  @ApiProperty({
    example: '-0.34379',
    description: '변화 비율(오늘 종가와 이전 종가의 차이 비율)',
  })
  percent_change: string;

  @ApiProperty({
    example: false,
    description: '시장 개장 여부',
  })
  is_market_open: boolean;

  @ApiProperty({
    example: new QuoteIndicatorFiftyTwoWeekDto({
      low: '164.08000',
      high: '237.23000',
      low_change: '64.92000',
      high_change: '-8.23000',
      low_change_percent: '39.56606',
      high_change_percent: '-3.46921',
      range: '164.080002 - 237.229996',
    }),
    description: '52주 지표 데이터',
  })
  fifty_two_week: QuoteIndicatorFiftyTwoWeekDto;
}
