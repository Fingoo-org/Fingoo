import { IsInt, IsString } from 'class-validator';

export class GetFluctuatingIndicatorsDto {
  @IsInt()
  readonly dataCount: number;

  @IsString()
  readonly ticker: string[];

  @IsString()
  readonly type: string;
}
