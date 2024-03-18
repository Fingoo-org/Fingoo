import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class InsertIndicatorDto {
  @ApiProperty({
    example: '160e5499-4925-4e38-bb00-8ea6d8056484',
    description: '지표 PK (UUID)',
  })
  @IsString()
  @IsUUID()
  readonly indicatorId: string;
}
