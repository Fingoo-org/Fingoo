import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GetIndicatorBoardMetadataQuery } from './get-indicator-board-metadata.query';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/load-indiactor-board-metadata.port';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataQuery)
export class GetIndicatorBoardMetaDataQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  async execute(getIndicatorBoardMetaDataQuery: GetIndicatorBoardMetadataQuery): Promise<IndicatorBoardMetadata> {
    try {
      const id = getIndicatorBoardMetaDataQuery.id;
      const indicatorBoardMetaData: IndicatorBoardMetadata =
        await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(id);
      return indicatorBoardMetaData;
    } catch (error) {
      throw new HttpException(
        {
          message: 'invalid id',
          error: error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
