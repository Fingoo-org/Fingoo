import { IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInterval } from '../../../utils/validation/is.interval.validation';
import { Interval, Market } from 'src/utils/type/types';
import { IsMarket } from 'src/utils/validation/is.market.validation';

export class GetFluctuatingIndicatorWithoutCacheDto {
  @ApiProperty({
    example: '100',
    description: '변동지표 주가 정보 한 페이지 결과 수',
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  readonly dataCount: number;

  @ApiProperty({
    example: '005930',
    description: 'KRX 주가 단축코드',
  })
  @IsString()
  readonly ticker: string;

  @ApiProperty({
    example: 'day',
    description: '변동지표 주가 정보의 간격(day, week, month, year)',
  })
  @IsString()
  @IsInterval()
  readonly interval: Interval;

  @ApiProperty({
    example: 'KOSPI',
    description: '시장구분',
  })
  @IsString()
  @IsMarket()
  readonly market: Market;

  @ApiProperty({
    example: '20240129',
    description: '기준일자가 검색값보다 작은 데이터를 검색할 때 사용하는 기준일자',
  })
  @IsString()
  readonly endDate: string;
}
