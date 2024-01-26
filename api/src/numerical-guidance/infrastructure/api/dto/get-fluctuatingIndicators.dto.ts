import { ArrayNotEmpty, IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsInterval } from '../../../../validation/is.interval.validation';

export class FluctuatingIndicatorInfo {
  @IsString()
  readonly ticker: string;

  @IsString()
  readonly market: string;
}

type Interval = 'day' | 'week' | 'month' | 'year';

export class GetFluctuatingIndicatorsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  readonly dataCount: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FluctuatingIndicatorInfo)
  readonly fluctuatingIndicatorInfos: FluctuatingIndicatorInfo[];

  @IsString()
  @IsInterval()
  readonly interval: Interval;
}
