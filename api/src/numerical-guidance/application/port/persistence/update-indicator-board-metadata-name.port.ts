import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

export interface UpdateIndicatorBoardMetadataNamePort {
  updateIndicatorBoardMetadataName(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void>;
}
