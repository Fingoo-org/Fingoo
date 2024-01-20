import { ArrayNotEmpty, IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FluctuatingIndicatorInfo {
  @IsString()
  readonly ticker: string;

  @IsString()
  readonly market: string;
}

export class GetFluctuatingIndicatorsDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  readonly dataCount: number;

  @IsString()
  readonly type: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FluctuatingIndicatorInfo)
  readonly fluctuatingIndicatorInfos: FluctuatingIndicatorInfo[];
}
