import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndicatorBoardMetadataDto {
  @ApiProperty({
    example: '메타데이터',
    description: '메타데이터 이름',
  })
  @IsString()
  indicatorBoardMetadataName: string;
}
