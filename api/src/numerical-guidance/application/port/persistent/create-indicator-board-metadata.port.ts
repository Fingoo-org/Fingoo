import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

export interface CreateIndicatorBoardMetadataPort {
  createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<number>;
}
