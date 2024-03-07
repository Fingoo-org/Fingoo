import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadIndicatorBoardMetadataPort {
  loadIndicatorBoardMetadata(id: string): Promise<IndicatorBoardMetadata>;
}
