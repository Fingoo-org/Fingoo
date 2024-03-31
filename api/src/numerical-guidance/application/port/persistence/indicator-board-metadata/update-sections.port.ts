import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface UpdateSectionsPort {
  updateSections(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void>;
}
