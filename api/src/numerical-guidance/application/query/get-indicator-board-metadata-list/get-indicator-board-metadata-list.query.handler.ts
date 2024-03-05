import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataListPort } from '../../port/persistence/indicator-board-metadata/load-indicator-board-metadata-list.port';
import { GetIndicatorBoardMetadataListQuery } from './get-indicator-board-metadata-list.query';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataListQuery)
export class GetIndicatorBoardMetadataListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetadataListPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataListPort,
  ) {}
  async execute(query: GetIndicatorBoardMetadataListQuery): Promise<IndicatorBoardMetadata[]> {
    const memberId = query.memberId;
    const indicatorBoardMetadataList: IndicatorBoardMetadata[] =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadataList(memberId);
    return indicatorBoardMetadataList;
  }
}
