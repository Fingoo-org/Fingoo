import { IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';
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
    description: '지표의 식별값',
  })
  @IsObject()
  @IsNotEmpty()
  readonly indicatorIds: Record<string, string[]>;

  @IsInt()
  readonly memberId: number;
}
