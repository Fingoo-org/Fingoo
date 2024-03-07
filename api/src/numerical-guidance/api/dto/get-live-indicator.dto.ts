import { IsString, IsUUID } from 'class-validator';
import { IsInterval } from '../../../utils/validation/is.interval.validation';
import { ApiProperty } from '@nestjs/swagger';
import { Interval } from 'src/utils/type/type-definition';

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
}
