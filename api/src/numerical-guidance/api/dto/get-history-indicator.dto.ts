import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsInterval } from '../../../utils/validation/is.interval.validation';
import { Interval } from '../../../utils/type/type-definition';

export class GetHistoryIndicatorDto {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
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
    example: 35,
    description: '요청 Data의 개수',
  })
  @IsString()
  readonly dataCount: number;

  @ApiProperty({
    example: '20240227',
    description: '데이터를 불러오는 기준이 되는 Date를 cursorId로 합니다.',
  })
  @Type(() => String)
  @IsOptional()
  readonly endDate?: string = '' as any;
}
