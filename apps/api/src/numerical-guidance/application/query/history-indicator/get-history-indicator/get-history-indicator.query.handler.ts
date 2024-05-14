import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetHistoryIndicatorQuery } from './get-history-indicator.query';
import { LoadHistoryIndicatorPort } from '../../../port/persistence/indicator/load-history-indicator.port';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from './dto/history-indicator.dto';

@Injectable()
@QueryHandler(GetHistoryIndicatorQuery)
export class GetHistoryIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadHistoryIndicatorPort')
    private readonly loadHistoryIndicatorPort: LoadHistoryIndicatorPort,
  ) {}

  async execute(query: GetHistoryIndicatorQuery): Promise<CursorPageDto<HistoryIndicatorDto>> {
    const { indicatorId, interval, dataCount, endDate } = query;

    return this.loadHistoryIndicatorPort.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
  }
}
