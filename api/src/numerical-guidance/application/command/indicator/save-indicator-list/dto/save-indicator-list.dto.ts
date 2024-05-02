import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveIndicatorListDto {
  @ApiProperty({
    example: 1000,
    description: '저장할 지표 수',
  })
  @IsString()
  readonly count: number;

  @ApiProperty({
    example: 'South Korea | United States | ...',
    description: '저장할 지표의 국가',
  })
  @IsString()
  readonly country: string;
}
