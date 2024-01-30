import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';

export interface CreateIndicatorBoardMetaDataPort {
  createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetaData): Promise<void>;
}
