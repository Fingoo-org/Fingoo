import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadUserIndicatorBoardMetadataPort {
  loadUserIndicatorBoardMetadataPort(memberId: number): Promise<IndicatorBoardMetadata[]>;
}
