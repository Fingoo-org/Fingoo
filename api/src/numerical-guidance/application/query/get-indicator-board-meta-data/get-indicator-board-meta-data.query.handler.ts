import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetIndicatorBoardMetaDataQuery } from './get-indicator-board-meta-data.query';
import { IndicatorBoardMetaData } from 'src/numerical-guidance/domain/indicator-board-meta-data';
import { LoadIndicatorBoardMetaDataPort } from '../../port/persistent/load-indicator-board-meta-data.port';

@Injectable()
@QueryHandler(GetIndicatorBoardMetaDataQuery)
export class GetIndicatorBoardMetaDataQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorBoardMetaDataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetaDataPort,
  ) {}

  async execute(getIndicatorBoardMetaDataQuery: GetIndicatorBoardMetaDataQuery): Promise<IndicatorBoardMetaData> {
    const id = getIndicatorBoardMetaDataQuery.id;

    const indicatorBoardMetaData: IndicatorBoardMetaData =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(id);

    return indicatorBoardMetaData;
  }
}
