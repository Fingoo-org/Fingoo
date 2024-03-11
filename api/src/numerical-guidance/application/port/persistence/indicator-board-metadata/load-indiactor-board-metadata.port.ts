import { IndicatorBoardMetadataDto } from '../../../query/get-indicator-board-metadata/indicator-board-metadata.dto';

export interface LoadIndicatorBoardMetadataPort {
  loadIndicatorBoardMetadata(id: string): Promise<IndicatorBoardMetadataDto>;
}
