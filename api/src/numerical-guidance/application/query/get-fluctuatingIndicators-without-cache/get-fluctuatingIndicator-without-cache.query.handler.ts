import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from './get-fluctuatingIndicators-without-cache.query';
import { FluctuatingIndicatorsDto } from '../get-fluctuatingIndicators/fluctuatingIndicators.dto';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsWithoutCacheQuery)
export class GetFluctuatingIndicatorsWithoutCacheQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
  ) {}

  async execute(
    getFluctuatingIndicatorsWithoutCacheQuery: GetFluctuatingIndicatorsWithoutCacheQuery,
  ): Promise<FluctuatingIndicatorsDto> {
    const { dataCount, ticker, market } = getFluctuatingIndicatorsWithoutCacheQuery;

    const fluctuatingIndicatorsDto: FluctuatingIndicatorsDto =
      await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(dataCount, ticker, market);

    return fluctuatingIndicatorsDto;
  }
}
