import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateIndicatorBoardMetadataNameDto {
  @ApiProperty({
    example: 'metadata',
    description: '메타데이터 이름',
  })
  @IsString()
  name: string;
}
