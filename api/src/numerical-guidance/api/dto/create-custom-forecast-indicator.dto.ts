import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomForecatIndicatorDto {
  @ApiProperty({ example: '예측지표, ', description: '예측지표 이름' })
  @IsString()
  customForecastIndicatorName: string;

  @ApiProperty({ example: 'uuid example', description: '목표 지표 id' })
  @IsString()
  targetIndicatorId: string;
}
