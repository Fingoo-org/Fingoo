import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface DeleteIndicatorIdPort {
  deleteIndicatorId(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
