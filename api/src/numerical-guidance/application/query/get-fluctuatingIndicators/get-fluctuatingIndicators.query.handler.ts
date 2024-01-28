import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetFluctuatingIndicatorsQuery } from './get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from './fluctuatingIndicators.dto';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../port/cache/load-cached-fluctuatingIndicator.port';
import { CachingFluctuatingIndicatorPort } from '../../port/cache/caching-fluctuatingIndicator.port';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsQuery)
export class GetFluctuatingIndicatorsQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetFluctuatingIndicatorsQueryHandler.name);
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
    @Inject('LoadCachedFluctuatingIndicatorPort')
    private readonly loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort,
    @Inject('CachingFluctuatingIndicatorPort')
    private readonly cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort,
  ) {}

  async execute(getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery): Promise<FluctuatingIndicatorsDto[]> {
    const { dataCount, fluctuatingIndicatorInfos, interval, endDate } = getFluctuatingIndicatorsQuery;
    const fluctuatingIndicatorsDtos: FluctuatingIndicatorsDto[] = [];

    for (const fluctuatingIndicatorInfo of fluctuatingIndicatorInfos) {
      const { ticker, market } = fluctuatingIndicatorInfo;
      const key = this.createFluctuatingIndicatorKey(ticker, interval);

      let fluctuatingIndicatorsDto: FluctuatingIndicatorsDto =
        await this.loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator(key);

      if (this.isNotCached(fluctuatingIndicatorsDto)) {
        fluctuatingIndicatorsDto = await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(
          dataCount,
          ticker,
          interval,
          market,
          endDate,
        );
        await this.cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator(key, fluctuatingIndicatorsDto);
        this.logger.log('KRX 호출');
      }
      fluctuatingIndicatorsDtos.push(fluctuatingIndicatorsDto);
    }
    return fluctuatingIndicatorsDtos;
  }

  private isNotCached(fluctuatingIndicatorsDto: FluctuatingIndicatorsDto): boolean {
    return fluctuatingIndicatorsDto == null;
  }

  private createFluctuatingIndicatorKey(ticker: string, interval: string) {
    const today: Date = new Date();
    const date = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    return `${ticker}${interval}${date}`;
  }
}
