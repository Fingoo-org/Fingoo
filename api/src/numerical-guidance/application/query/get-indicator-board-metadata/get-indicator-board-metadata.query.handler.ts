import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetIndicatorBoardMetadataQuery } from './get-indicator-board-metadata.query';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadataDto } from './indicator-board-metadata.dto';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataQuery)
export class GetIndicatorBoardMetadataQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  async execute(query: GetIndicatorBoardMetadataQuery): Promise<IndicatorBoardMetadataDto> {
    const id = query.id;
    return await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(id);
  }
}
