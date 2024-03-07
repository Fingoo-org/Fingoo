import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomForecatIndicatorDto {
  @ApiProperty({ example: '예측지표, ', description: '예측지표 이름' })
  @IsString()
  customForecastIndicatorName: string;

  @ApiProperty({ example: '0d73cea1-35a5-432f-bcd1-27ae3541ba60', description: '목표 지표 id' })
  @IsString()
  @IsUUID()
  targetIndicatorId: string;
}
