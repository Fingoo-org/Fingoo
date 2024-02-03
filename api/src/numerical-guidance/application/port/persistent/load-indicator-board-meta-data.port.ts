import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';

export interface LoadIndicatorBoardMetaDataPort {
  loadIndicatorBoardMetaDataPort(id: number): Promise<IndicatorBoardMetaData>;
}
