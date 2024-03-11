import { IndicatorBoardMetadataDto } from '../../../query/get-indicator-board-metadata/indicator-board-metadata.dto';

export interface LoadIndicatorBoardMetadataListPort {
  loadIndicatorBoardMetadataList(memberId: number): Promise<IndicatorBoardMetadataDto[]>;
}
