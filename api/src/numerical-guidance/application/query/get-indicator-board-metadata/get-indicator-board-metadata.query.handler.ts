import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetIndicatorBoardMetadataQuery } from './get-indicator-board-metadata.query';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataQuery)
export class GetIndicatorBoardMetadataQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  async execute(getIndicatorBoardMetaDataQuery: GetIndicatorBoardMetadataQuery): Promise<IndicatorBoardMetadata> {
    const id = getIndicatorBoardMetaDataQuery.id;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(id);
    return indicatorBoardMetaData;
  }
}
