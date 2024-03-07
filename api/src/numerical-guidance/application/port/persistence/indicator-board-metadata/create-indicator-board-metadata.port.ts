import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface CreateIndicatorBoardMetadataPort {
  createIndicatorBoardMetadata(indicatorBoardMetaData: IndicatorBoardMetadata, memberId: number): Promise<string>;
}
