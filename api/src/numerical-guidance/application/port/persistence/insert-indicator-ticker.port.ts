import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

export interface InsertIndicatorTickerPort {
  addIndicatorTicker(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
