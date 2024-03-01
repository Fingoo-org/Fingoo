import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetHistoryIndicatorQuery } from './get-history-indicator.query';
import { LoadHistoryIndicatorPort } from '../../port/persistence/indicator/load-history-indicator.port';
import { CursorPageDto } from '../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from './history-indicator.dto';

@Injectable()
@QueryHandler(GetHistoryIndicatorQuery)
export class GetHistoryIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadHistoryIndicatorPort')
    private readonly loadHistoryIndicatorPort: LoadHistoryIndicatorPort,
  ) {}

  async execute(query: GetHistoryIndicatorQuery): Promise<CursorPageDto<HistoryIndicatorDto>> {
    const { indicatorId, interval, startDate, endDate } = query;

    return this.loadHistoryIndicatorPort.loadHistoryIndicator(indicatorId, interval, startDate, endDate);
  }
}
