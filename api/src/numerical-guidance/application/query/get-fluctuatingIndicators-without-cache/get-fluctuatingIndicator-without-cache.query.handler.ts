import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadFluctuatingIndicatorWithoutCachePort } from '../../port/external/load-fluctuatingIndicator-without-cache.port';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from './get-fluctuatingIndicators-without-cache.query';
import { FluctuatingIndicatorsWithoutCacheDto } from './fluctuatingIndicators-without-cache.dto';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsWithoutCacheQuery)
export class GetFluctuatingIndicatorsWithoutCacheQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorWithoutCachePort')
    private readonly loadFluctuatingIndicatorWithoutCachePort: LoadFluctuatingIndicatorWithoutCachePort,
  ) {}

  async execute(
    getFluctuatingIndicatorsWithoutCacheQuery: GetFluctuatingIndicatorsWithoutCacheQuery,
  ): Promise<FluctuatingIndicatorsWithoutCacheDto> {
    const { dataCount, ticker, market } = getFluctuatingIndicatorsWithoutCacheQuery;

    const fluctuatingIndicatorsWithoutCacheDto: FluctuatingIndicatorsWithoutCacheDto =
      await this.loadFluctuatingIndicatorWithoutCachePort.loadFluctuatingIndicatorWithoutCache(
        dataCount,
        ticker,
        market,
      );

    return fluctuatingIndicatorsWithoutCacheDto;
  }
}
