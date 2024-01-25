import { IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFluctuatingIndicatorWithoutCacheDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  readonly dataCount: number;

  @IsString()
  readonly ticker: string;

  @IsString()
  readonly interval: string;

  @IsString()
  readonly market: string;
}
