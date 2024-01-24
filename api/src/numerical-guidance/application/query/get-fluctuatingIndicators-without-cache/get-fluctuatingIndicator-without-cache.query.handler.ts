import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { GetFluctuatingIndicatorWithoutCacheQuery } from './get-fluctuatingIndicator-without-cache.query';
import { FluctuatingIndicatorsDto } from '../get-fluctuatingIndicators/fluctuatingIndicators.dto';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorWithoutCacheQuery)
export class GetFluctuatingIndicatorWithoutCacheQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
  ) {}

  async execute(
    getFluctuatingIndicatorWithoutCacheQuery: GetFluctuatingIndicatorWithoutCacheQuery,
  ): Promise<FluctuatingIndicatorsDto> {
    const { dataCount, ticker, market } = getFluctuatingIndicatorWithoutCacheQuery;

    const fluctuatingIndicatorsDto: FluctuatingIndicatorsDto =
      await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(dataCount, ticker, market);

    return fluctuatingIndicatorsDto;
  }
}
