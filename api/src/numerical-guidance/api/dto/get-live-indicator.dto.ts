import { IsString } from 'class-validator';
import { IsInterval } from '../../../utils/validation/is.interval.validation';
import { ApiProperty } from '@nestjs/swagger';
import { Interval, Market } from 'src/utils/type/type-definition';
import { IsMarket } from 'src/utils/validation/is.market.validation';

export class GetLiveIndicatorDto {
  @ApiProperty({
    example: '005930',
    description: 'KRX 주가 단축코드',
  })
  @IsString()
  readonly ticker: string;

  @ApiProperty({
    example: 'KOSPI',
    description: '시장구분',
  })
  @IsString()
  @IsMarket()
  readonly market: Market;

  @ApiProperty({
    example: 'day',
    description: '변동지표 주가 정보의 간격(day, week, month, year)',
  })
  @IsString()
  @IsInterval()
  readonly interval: Interval;
}
