import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadIndicatorBoardMetadataPort {
  loadIndicatorBoardMetaData(id: string): Promise<IndicatorBoardMetadata>;
}
