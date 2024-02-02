import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { GetFluctuatingIndicatorWithoutCacheQuery } from './get-fluctuatingIndicator-without-cache.query';
import { FluctuatingIndicatorDto } from '../get-fluctuatingIndicator/fluctuatingIndicator.dto';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorWithoutCacheQuery)
export class GetFluctuatingIndicatorWithoutCacheQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
  ) {}

  async execute(
    getFluctuatingIndicatorWithoutCacheQuery: GetFluctuatingIndicatorWithoutCacheQuery,
  ): Promise<FluctuatingIndicatorDto> {
    const { dataCount, ticker, interval, market, endDate } = getFluctuatingIndicatorWithoutCacheQuery;

    return await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(
      dataCount,
      ticker,
      interval,
      market,
      endDate,
    );
  }
}
