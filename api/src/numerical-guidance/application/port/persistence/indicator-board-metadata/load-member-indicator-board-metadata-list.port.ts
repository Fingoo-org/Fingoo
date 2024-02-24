import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadMemberIndicatorBoardMetadataListPort {
  loadMemberIndicatorBoardMetadataList(memberId: number): Promise<IndicatorBoardMetadata[]>;
}
