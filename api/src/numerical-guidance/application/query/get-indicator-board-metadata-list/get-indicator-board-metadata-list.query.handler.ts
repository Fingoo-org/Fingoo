import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadIndicatorBoardMetadataListPort } from '../../port/persistence/indicator-board-metadata/load-indicator-board-metadata-list.port';
import { GetIndicatorBoardMetadataListQuery } from './get-indicator-board-metadata-list.query';
import { IndicatorBoardMetadataDto } from '../get-indicator-board-metadata/indicator-board-metadata.dto';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataListQuery)
export class GetIndicatorBoardMetadataListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetadataListPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataListPort,
  ) {}
  async execute(query: GetIndicatorBoardMetadataListQuery): Promise<IndicatorBoardMetadataDto[]> {
    const memberId = query.memberId;
    return await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadataList(memberId);
  }
}
