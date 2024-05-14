import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface InsertCustomForecastIndicatorIdPort {
  addCustomForecastIndicatorId(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
