import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadFluctuatingIndicatorWithoutCachePort } from '../../port/external/load-fluctuatingIndicator-without-cache.port';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from './get-fluctuatingIndicators-without-cache.query';
import { FluctuatingIndicatorsDto } from '../get-fluctuatingIndicators/fluctuatingIndicators.dto';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsWithoutCacheQuery)
export class GetFluctuatingIndicatorsWithoutCacheQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorWithoutCachePort')
    private readonly loadFluctuatingIndicatorWithoutCachePort: LoadFluctuatingIndicatorWithoutCachePort,
  ) {}

  async execute(
    getFluctuatingIndicatorsWithoutCacheQuery: GetFluctuatingIndicatorsWithoutCacheQuery,
  ): Promise<FluctuatingIndicatorsDto> {
    const { dataCount, ticker, market } = getFluctuatingIndicatorsWithoutCacheQuery;

    const fluctuatingIndicatorsWithoutCacheDto: FluctuatingIndicatorsDto =
      await this.loadFluctuatingIndicatorWithoutCachePort.loadFluctuatingIndicatorWithoutCache(
        dataCount,
        ticker,
        market,
      );

    return fluctuatingIndicatorsWithoutCacheDto;
  }
}
