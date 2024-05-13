import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export interface CreateIndicatorBoardMetadataPort {
  createIndicatorBoardMetadata(indicatorBoardMetaData: IndicatorBoardMetadata, memberId: string): Promise<string>;
}
