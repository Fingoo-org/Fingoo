import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetIndicatorInformation } from 'src/utils/type/type-definition';

export class CreateCustomForecatIndicatorDto {
  @ApiProperty({ example: '예측지표', description: '예측지표 이름' })
  @IsString()
  customForecastIndicatorName: string;

  @ApiProperty({
    example: {
      targetIndicatorId: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
      name: '예측지표',
      exchange: 'KOSPI',
      symbol: 'PPAL',
    },
    description: 'target indicator information',
  })
  targetIndicatorInformation: TargetIndicatorInformation;
}
