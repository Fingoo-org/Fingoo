import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCustomForecastIndicatorNameDto {
  @ApiProperty({
    example: '예측지표',
    description: '예측지표 이름',
  })
  @IsString()
  name: string;
}
