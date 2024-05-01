import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomForecatIndicatorDto {
  @ApiProperty({ example: '예측지표', description: '예측지표 이름' })
  @IsString()
  customForecastIndicatorName: string;

  @ApiProperty({ example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0', description: '목표지표 id' })
  @IsString()
  @IsUUID()
  targetIndicatorId: string;

  @ApiProperty({ example: 'stock', description: '목표지표 type' })
  @IsString()
  targetIndicatorType: string;
}
