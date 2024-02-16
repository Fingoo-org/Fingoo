import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndicatorBoardMetadataDto {
  @ApiProperty({
    example: '메타데이터',
    description: '메타데이터 이름',
  })
  @IsString()
  indicatorBoardMetaDataName: string;

  @ApiProperty({
    example: '1',
    description: '요청 유저의 pk',
  })
  @IsInt()
  readonly memberId: number;
}
