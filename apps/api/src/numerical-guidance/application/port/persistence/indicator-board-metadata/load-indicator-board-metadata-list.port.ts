import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadIndicatorBoardMetadataListPort {
  loadIndicatorBoardMetadataList(memberId: number): Promise<IndicatorBoardMetadata[]>;
}
