import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

export interface DeleteIndicatorTickerPort {
  deleteIndicatorTicker(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
