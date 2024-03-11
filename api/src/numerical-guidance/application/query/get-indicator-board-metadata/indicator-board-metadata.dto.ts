import { ApiProperty } from '@nestjs/swagger';

export class IndicatorBoardMetadataDto {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '지표 보드 메티데이터 id',
  })
  readonly id: string;

  @ApiProperty({
    example: 'name',
    description: '지표 보드 메티데이터 name',
  })
  indicatorBoardMetadataName: string;

  @ApiProperty({
    example: ['c6a99067-27d0-4358-b3d5-e63a64b604c0', 'c6a99067-27d0-4358-b3d5-e63a64b604c3'],
    description: '지표 id 모음',
  })
  indicatorIds: string[];

  @ApiProperty({
    example: '2024-03-04T05:17:33.756Z',
    description: '지표 보드 메티데이터 생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-04T05:17:33.756Z',
    description: '지표 보드 메티데이터 수정일',
  })
  updatedAt: Date;

  constructor(
    id: string,
    indicatorBoardMetadataName: string,
    indicatorIds: string[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.indicatorIds = indicatorIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ id, indicatorBoardMetadataName, indicatorIds, createdAt, updatedAt }) {
    if (indicatorIds.length == 1 && indicatorIds[0] == '') {
      indicatorIds = [];
    }
    return new IndicatorBoardMetadataDto(id, indicatorBoardMetadataName, indicatorIds, createdAt, updatedAt);
  }
}
