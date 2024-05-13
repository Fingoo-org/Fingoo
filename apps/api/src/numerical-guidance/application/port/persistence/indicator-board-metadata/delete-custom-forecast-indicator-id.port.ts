import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface DeleteCustomForecastIndicatorIdPort {
  deleteCustomForecastIndicatorId(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void>;
}
