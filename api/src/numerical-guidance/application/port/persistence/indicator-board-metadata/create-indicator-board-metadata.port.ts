import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface CreateIndicatorBoardMetadataPort {
  createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetadata, memberId: number): Promise<string>;
}
