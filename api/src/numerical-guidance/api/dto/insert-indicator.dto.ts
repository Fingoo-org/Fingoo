import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IndicatorType } from '../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

export class InsertIndicatorDto {
  @ApiProperty({
    example: '005930',
    description: '지표 식별값',
  })
  @IsString()
  readonly ticker: string;

  @ApiProperty({
    example: 'k-stock | exchange',
    description: '지표의 타입',
  })
  @IsString()
  readonly type: IndicatorType;
}
