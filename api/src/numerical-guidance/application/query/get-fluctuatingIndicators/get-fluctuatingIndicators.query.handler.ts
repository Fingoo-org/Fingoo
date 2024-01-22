import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetFluctuatingIndicatorsQuery } from './get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from './fluctuatingIndicators.dto';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../port/cache/load-cached-fluctuatingIndicator.port';
import { CachingFluctuatingIndicatorPort } from '../../port/cache/caching-fluctuatingIndicator.port';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsQuery)
export class GetFluctuatingIndicatorsQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
    @Inject('LoadCachedFluctuatingIndicatorPort')
    private readonly loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort,
    @Inject('CachingFluctuatingIndicatorPort')
    private readonly cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort,
  ) {}

  async execute(getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery): Promise<FluctuatingIndicatorsDto[]> {
    const { dataCount, tickers, type, market } = getFluctuatingIndicatorsQuery;
    const fluctuatingIndicatorsDtos: FluctuatingIndicatorsDto[] = [];

    for (const ticker of tickers) {
      let fluctuatingIndicatorsDto: FluctuatingIndicatorsDto =
        await this.loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator(ticker);

      if (this.isNotCached(fluctuatingIndicatorsDto)) {
        fluctuatingIndicatorsDto = await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(
          dataCount,
          ticker,
          type,
          market,
        );
        await this.cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator(ticker, fluctuatingIndicatorsDto);
      }
      fluctuatingIndicatorsDtos.push(fluctuatingIndicatorsDto);
    }
    return fluctuatingIndicatorsDtos;
  }

  private isNotCached(fluctuatingIndicatorsDto: FluctuatingIndicatorsDto): boolean {
    return fluctuatingIndicatorsDto != null;
  }
}
