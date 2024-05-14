import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface InsertIndicatorIdPort {
  addIndicatorId(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
